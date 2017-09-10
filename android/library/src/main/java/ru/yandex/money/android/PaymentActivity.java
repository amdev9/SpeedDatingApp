/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 NBCO Yandex.Money LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

package ru.yandex.money.android;

import android.annotation.SuppressLint;
import android.app.ActionBar;
import android.app.Activity;
import android.app.Fragment;
import android.app.FragmentManager;
import android.app.FragmentTransaction;
import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.view.MenuItem;
import android.view.Window;

import com.yandex.money.api.methods.InstanceId;
import com.yandex.money.api.methods.payment.BaseProcessPayment;
import com.yandex.money.api.methods.payment.BaseRequestPayment;
import com.yandex.money.api.methods.payment.ProcessExternalPayment;
import com.yandex.money.api.methods.payment.RequestExternalPayment;
import com.yandex.money.api.methods.payment.params.PaymentParams;
import com.yandex.money.api.methods.payment.params.ShopParams;
import com.yandex.money.api.model.Error;
import com.yandex.money.api.model.ExternalCard;
import com.yandex.money.api.model.MoneySource;
import com.yandex.money.api.net.clients.ApiClient;
import com.yandex.money.api.net.clients.DefaultApiClient;
import com.yandex.money.api.net.providers.DefaultApiV1HostsProvider;
import com.yandex.money.api.processes.ExternalPaymentProcess;

import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


import ru.yandex.money.android.database.DatabaseStorage;
import ru.yandex.money.android.fragments.CardsFragment;
import ru.yandex.money.android.fragments.CscFragment;
import ru.yandex.money.android.fragments.ErrorFragment;
import ru.yandex.money.android.fragments.SuccessFragment;
import ru.yandex.money.android.fragments.WebFragment;
import ru.yandex.money.android.parcelables.ExternalCardParcelable;
import ru.yandex.money.android.parcelables.ExternalPaymentProcessSavedStateParcelable;
import ru.yandex.money.android.utils.Keyboards;

// new
import android.util.Log;

/**
 * <p>Main activity for a payment process. It guides a user through all payment steps and returns information whether
 * payment was successful or not.</p>
 *
 * <p>To explicitly start this activity you may want to use {@link #getBuilder(Context)} method to create an
 * {@link Intent} object, that can be passed to {@link #startActivity(Intent)} or
 * {@link #startActivityForResult(Intent, int)} methods. See the description of allowed parameters in
 * {@link PaymentParamsBuilder} and {@link Builder} interfaces.</p>
 *
 * <p>If the activity was started using {@link #startActivityForResult(Intent, int)} method, then it will return result
 * of a payment to a calling activity. If payment was successful, then result code will be {@link #RESULT_OK} and
 * {@link #EXTRA_INVOICE_ID} will be present in returned {@code data} object. If payment was canceled by a user or
 * rejected by payment system, then result code {@link #RESULT_CANCELED} will be returned.</p>
 */
public final class PaymentActivity extends Activity implements ExternalPaymentProcess.ParameterProvider {

    /**
     * An instance of {@link String} representing instance id.
     */
    public static final String EXTRA_INVOICE_ID = "ru.yandex.money.android.extra.INVOICE_ID";

    private static final String EXTRA_ARGUMENTS = "ru.yandex.money.android.extra.ARGUMENTS";
    private static final String EXTRA_HOST = "ru.yandex.money.android.extra.HOST";
    private static final String EXTRA_CLIENT_ID = "ru.yandex.money.android.extra.CLIENT_ID";

    private static final String KEY_PROCESS_SAVED_STATE = "processSavedState";
    private static final String KEY_SELECTED_CARD = "selectedCard";

    private static final String PRODUCTION_HOST = "https://money.yandex.ru";

    private final ExecutorService backgroundService = Executors.newSingleThreadExecutor();

    private ExternalPaymentProcess process;

    private PaymentParams arguments;

    private DatabaseStorage databaseStorage;
    private List<ExternalCard> cards;

    private boolean immediateProceed = true;

    @Nullable
    private ExternalCard selectedCard;
    @Nullable
    private AsyncTask<Void, Void, ?> task;

    /**
     * Returns intent builder used for launch this activity.
     *
     * @param context current context
     * @return intent builder
     */
    @NonNull
    public static PaymentParamsBuilder getBuilder(@NonNull Context context) {
        return new IntentBuilder(context);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_INDETERMINATE_PROGRESS); // todo show ongoing progress some other way
        setContentView(R.layout.ym_payment_activity);

        ActionBar actionBar = getActionBar();
        if (actionBar != null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
        }

        // we hide progress bar because on some devices we have it shown right from the start
        hideProgressBar();

        arguments = PaymentExtras.fromBundle(getIntent().getBundleExtra(EXTRA_ARGUMENTS));

        databaseStorage = new DatabaseStorage(this);
        cards = databaseStorage.selectExternalCards();

        if (!initPaymentProcess()) return;

        if (savedInstanceState == null) {
            proceed();
        } else {
            ExternalPaymentProcessSavedStateParcelable savedStateParcelable =
                    savedInstanceState.getParcelable(KEY_PROCESS_SAVED_STATE);
            if (savedStateParcelable != null) {
                process.restoreSavedState(savedStateParcelable.value);
            }

            ExternalCardParcelable externalCardParcelable = savedInstanceState.getParcelable(KEY_SELECTED_CARD);
            if (externalCardParcelable != null) {
                selectedCard = externalCardParcelable.value;
            }
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putParcelable(KEY_PROCESS_SAVED_STATE,
                new ExternalPaymentProcessSavedStateParcelable(process.getSavedState()));
        if (selectedCard != null) {
            outState.putParcelable(KEY_SELECTED_CARD, new ExternalCardParcelable(selectedCard));
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                hideKeyboard();
                onBackPressed();
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void onBackPressed() {
        cancel();
        applyResult();

        Fragment fragment = getCurrentFragment();
        super.onBackPressed();

        Fragment currentFragment = getCurrentFragment();
        if (currentFragment instanceof CscFragment) {
            super.onBackPressed();
            currentFragment = getCurrentFragment();
        }
        if (fragment instanceof WebFragment && currentFragment instanceof CardsFragment) {
            if (cards.size() == 0) {
                immediateProceed = false;
            }
            getFragmentManager()
                    .beginTransaction()
                    .remove(currentFragment)
                    .commit();
            reset();
        }
    }

    @Override
    public String getPatternId() {
        return arguments.patternId;
    }

    @Override
    public Map<String, String> getPaymentParameters() {
        return arguments.paymentParams;
    }

    @Override
    public MoneySource getMoneySource() {
        return selectedCard;
    }

    @Override
    public String getCsc() {
        Fragment fragment = getCurrentFragment();
        return fragment instanceof CscFragment ? ((CscFragment) fragment).getCsc() : null;
    }

    @Override
    public String getExtAuthSuccessUri() {
        return Constants.EXT_AUTH_SUCCESS_URI;
    }

    @Override
    public String getExtAuthFailUri() {
        return Constants.EXT_AUTH_FAIL_URI;
    }

    @Override
    public boolean isRequestToken() {
        Fragment fragment = getCurrentFragment();
        return fragment instanceof SuccessFragment;
    }

    /**
     * Gets an instance of {@link DatabaseStorage}.
     *
     * @return instance of {@link DatabaseStorage}
     */
    @NonNull
    public DatabaseStorage getDatabaseStorage() {
        return databaseStorage;
    }

    /**
     * Gets list of saved cards.
     *
     * @return list of saved card
     */
    @NonNull
    public List<ExternalCard> getCards() {
        return cards;
    }

    /**
     * Shows {@link WebFragment} clearing back stack if needed.
     *
     * @param url url to open
     * @param postData data to post
     */
    public void showWeb(@NonNull String url, @NonNull Map<String, String> postData) {
        Fragment fragment = getCurrentFragment();
        boolean clearBackStack = !(fragment instanceof CardsFragment || fragment instanceof CscFragment);

        replaceFragment(WebFragment.newInstance(url, postData), clearBackStack);
    }

    /**
     * Shows {@link CardsFragment}.
     */
    public void showCards() {
        BaseRequestPayment rep = process.getRequestPayment();
        replaceFragment(CardsFragment.newInstance(rep.title, rep.contractAmount), true);
    }

    /**
     * Shows {@link ErrorFragment}.
     *
     * @param error known error
     * @param status known status
     */
    public void showError(@Nullable Error error, @Nullable String status) {

        replaceFragment(ErrorFragment.newInstance(error, status), true);
    }

    /**
     * Shows {@link ErrorFragment} for unknown error or status.
     */
    public void showUnknownError() {
        replaceFragment(ErrorFragment.newInstance(), true);
    }

    /**
     * Shows {@link SuccessFragment}.
     *
     * @param moneySource saved card that was used to do a payment or {@code null}
     */
    public void showSuccess(@Nullable ExternalCard moneySource) {
        replaceFragment(SuccessFragment.newInstance(process.getRequestPayment().contractAmount, moneySource), true);
    }

    /**
     * Shows {@link CscFragment}.
     *
     * @param externalCard selected card
     */
    public void showCsc(@NonNull ExternalCard externalCard) {
        selectedCard = externalCard;
        replaceFragment(CscFragment.newInstance(externalCard), false);
    }

    /**
     * Shows progress bar.
     */
    public void showProgressBar() {
        setProgressBarIndeterminateVisibility(true);
    }

    /**
     * Hides progress bar.
     */
    public void hideProgressBar() {
        setProgressBarIndeterminateVisibility(false);
    }

    /**
     * Proceeds to the next step of a payment.
     */
    public void proceed() {
        task = performPaymentOperation(process::proceed);
    }

    /**
     * Repeats current step of a payment.
     */
    public void repeat() {
        task = performPaymentOperation(process::repeat);
    }

    /**
     * Resets current payment process.
     */
    public void reset() {
        selectedCard = null;
        process.reset();
        proceed();
    }

    /**
     * Cancels payment process.
     */
    public void cancel() {
        selectedCard = null;
        if (task != null && task.getStatus() == AsyncTask.Status.RUNNING) {
            task.cancel(true);
            task = null;
        }
    }

    @NonNull
    private AsyncTask<Void, Void, OperationResult<Boolean>> performPaymentOperation(
            @NonNull Callable<Boolean> operation) {
        return perform(operation, aBoolean -> handleProcess());
    }

    @NonNull
    private <T> AsyncTask<Void, Void, OperationResult<T>> perform(
            @NonNull Callable<T> operation, @NonNull Consumer<T> consumer) {

        showProgressBar();
        return new AsyncTask<Void, Void, OperationResult<T>>() {
            @Override
            protected OperationResult<T> doInBackground(Void... params) {
                try {
                    return new OperationResult<>(operation.call());
                } catch (Exception e) {
                    return new OperationResult<>(e);
                }
            }

            @Override
            protected void onPostExecute(OperationResult<T> result) {
                if (isCancelled()) return;
                if (result.operation != null) {
                    consumer.consume(result.operation);
                    hideProgressBar();
                } else {
                    onOperationFailed();
                }
            }
        }.executeOnExecutor(backgroundService);
    }

    private void handleProcess() {

        BaseProcessPayment processPayment = process.getProcessPayment();
        if (processPayment != null) {
            Log.i("PARAMS0: ", processPayment.toString());
            onExternalPaymentProcessed((ProcessExternalPayment) processPayment);
            return;
        }

        BaseRequestPayment requestPayment = process.getRequestPayment();
        if (requestPayment != null) {
            onExternalPaymentReceived((RequestExternalPayment) requestPayment);
        }
    }

    private boolean initPaymentProcess() {
        final Intent intent = getIntent();
        final String clientId = intent.getStringExtra(EXTRA_CLIENT_ID);

        final String host = intent.getStringExtra(EXTRA_HOST);
        final ApiClient client = new DefaultApiClient.Builder()
                .setClientId(clientId)
                .setHostsProvider(new DefaultApiV1HostsProvider(true) {
                    @Override
                    public String getMoney() {
                        return host;
                    }
                })
                .setDebugMode(!PRODUCTION_HOST.equals(host))
                .create();


        process = new ExternalPaymentProcess(client, this);

        final Prefs prefs = new Prefs(this);
        String instanceId = prefs.restoreInstanceId();
        if (TextUtils.isEmpty(instanceId)) {
            perform(() -> client.execute(new InstanceId.Request(clientId)), response -> {
                if (response.isSuccessful()) {
                    prefs.storeInstanceId(response.instanceId);
                    process.setInstanceId(response.instanceId);
                    proceed();
                } else {
                    Log.i("Uri: ",  "showError 459");
                    showError(response.error, response.status.toString());
                }
            });
            return false;
        }

        process.setInstanceId(instanceId);
        return true;
    }

    private void onExternalPaymentReceived(@NonNull RequestExternalPayment rep) {
        if (rep.status == BaseRequestPayment.Status.SUCCESS) {
            if (immediateProceed && cards.size() == 0) {
                proceed();
            } else {
                showCards();
            }
        } else {
            Log.i("Uri: ",  "showError 477");
            showError(rep.error, rep.status.toString());
        }
    }

    private void onExternalPaymentProcessed(@NonNull ProcessExternalPayment pep) {
        switch (pep.status) {
            case SUCCESS:
                Fragment fragment = getCurrentFragment();
                if (!(fragment instanceof SuccessFragment)) {
                    Log.i("Uri: ",  "showSuccess");
                    showSuccess((ExternalCard) getMoneySource());
                    finish(true);
                } else if (pep.externalCard != null) {
                    ((SuccessFragment) fragment).saveCard(pep.externalCard);
                }
                break;
            case EXT_AUTH_REQUIRED:
                Log.i("PARAMS acsUri: ",  pep.acsUri);
                Log.i("PARAMS acsParams: ",  pep.acsParams.toString());
                showWeb(pep.acsUri, pep.acsParams);
                break;
            default:
                Log.i("Uri: ",  "showError 499");
                showError(pep.error, pep.status.toString());
        }
    }

    public void finish(boolean status) {
        Intent data = new Intent();
        if(status) {
            data.putExtra("returnString1", "SUCCESS");
        } else {
            data.putExtra("returnString1", "ERROR");
        }
        setResult(RESULT_OK, data);
        super.finish();
    }

    void onOperationFailed() {
        Log.i("Uri: ",  "showError 518");
        showUnknownError();
        hideProgressBar();
    }

    private void replaceFragment(@Nullable Fragment fragment, boolean clearBackStack) {
        if (fragment == null) {
            return;
        }

        Fragment currentFragment = getCurrentFragment();
        FragmentManager manager = getFragmentManager();
        if (clearBackStack) {
            manager.popBackStack(null, FragmentManager.POP_BACK_STACK_INCLUSIVE);
        }

        @SuppressLint("CommitTransaction")
        FragmentTransaction transaction = manager.beginTransaction()
                .replace(R.id.ym_container, fragment);
        if (!clearBackStack && currentFragment != null) {
            transaction.addToBackStack(fragment.getTag());
        }
        transaction.commit();
        hideKeyboard();
    }

    @Nullable
    private Fragment getCurrentFragment() {
        return getFragmentManager().findFragmentById(R.id.ym_container);
    }

    private void hideKeyboard() {
        Keyboards.hideKeyboard(this);
    }

    private void applyResult() {
        BaseProcessPayment pp = process.getProcessPayment();
        if (pp != null && pp.status == BaseProcessPayment.Status.SUCCESS) {
            Intent intent = new Intent();
            intent.putExtra(EXTRA_INVOICE_ID, pp.invoiceId);
            setResult(RESULT_OK, intent);
        } else {
            setResult(RESULT_CANCELED);
        }
    }

    /**
     * Implementations of this interface sets payment parameters.
     */
    @SuppressWarnings("WeakerAccess")
    public interface PaymentParamsBuilder extends Builder {

        /**
         * Sets raw payment parameters.
         *
         * @param patternId pattern id
         * @param paymentParams payment parameters
         * @return {@link Builder}
         */
        @NonNull
        Builder setPaymentParams(@NonNull String patternId, @NonNull Map<String, String> paymentParams);

        /**
         * Sets payment parameters.
         *
         * @param paymentParams instance of {@link PaymentParams}
         * @return {@link Builder}
         */
        @NonNull
        Builder setPaymentParams(@Nullable PaymentParams paymentParams);
    }

    /**
     * Implementation of this interface add additional info
     */
    public interface Builder {

        /**
         * Sets client id.
         *
         * @param clientId client id
         * @return itself
         */
        @NonNull
        Builder setClientId(@Nullable String clientId);

        /**
         * Sets desired host for testing purposes.
         *
         * @param host host to use
         * @return itself
         */
        @NonNull
        Builder setHost(@Nullable String host);

        /**
         * Creates an intent that can be used to start payment process.
         *
         * @return {@link Intent} object
         */
        @NonNull
        Intent build();
    }

    private final static class IntentBuilder implements PaymentParamsBuilder {

        @NonNull
        private final Context context;

        private PaymentParams params;

        private String host = PRODUCTION_HOST;
        private String clientId;

        IntentBuilder(@NonNull Context context) {
            this.context = context;
        }

        @NonNull
        @Override
        public Builder setPaymentParams(@NonNull String patternId,
                                                   @NonNull Map<String, String> paymentParams) {
            this.params = new ShopParams(patternId, paymentParams);
            return this;
        }

        @NonNull
        @Override
        public Builder setPaymentParams(@Nullable PaymentParams paymentParams) {
            this.params = paymentParams;
            return this;
        }

        @NonNull
        @Override
        public Builder setClientId(@Nullable String clientId) {
            this.clientId = clientId;
            return this;
        }

        @NonNull
        @Override
        public Builder setHost(@Nullable String host) {
            this.host = host;
            return this;
        }

        @NonNull
        @Override
        public Intent build() {
            return createIntent()
                    .putExtra(EXTRA_ARGUMENTS, PaymentExtras.toBundle(params))
                    .putExtra(EXTRA_HOST, host)
                    .putExtra(EXTRA_CLIENT_ID, clientId);
        }

        @NonNull
        private Intent createIntent() {
            return new Intent(context, PaymentActivity.class);
        }
    }

    private interface Consumer<T> {
        void consume(T value);
    }

    private static final class OperationResult<T> {

        @Nullable
        final T operation;
        @Nullable
        final Exception exception;

        OperationResult(@Nullable T operation) {
            this.operation = operation;
            this.exception = null;
        }

        OperationResult(@Nullable Exception exception) {
            this.operation = null;
            this.exception = exception;
        }
    }
}
