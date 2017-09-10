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

package ru.yandex.money.android.fragments;

import android.app.Fragment;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

import com.yandex.money.api.model.Error;
import com.yandex.money.api.model.ExternalCard;

import ru.yandex.money.android.PaymentActivity;
import ru.yandex.money.android.database.DatabaseStorage;

/**
 * Base class for all fragments that take part in payment process.
 */
abstract class PaymentFragment extends Fragment {

    /**
     * Key for money source.
     */
    static final String KEY_MONEY_SOURCE = "moneySource";

    /**
     * Gets database storage if a fragment is attached to payment activity
     *
     * @return database storage or {@code null}
     */
    @Nullable
    DatabaseStorage getDatabaseStorage() {
        PaymentActivity activity = getPaymentActivity();
        return activity == null ? null : activity.getDatabaseStorage();
    }

    /**
     * Gets attached payment activity or {@code null}. May throw {@link ClassCastException} if a fragment attached to
     * other activity type.
     *
     * @return attached {@link PaymentActivity} or null
     */
    @Nullable
    PaymentActivity getPaymentActivity() {
        return (PaymentActivity) getActivity();
    }

    /**
     * @see PaymentActivity#proceed()
     */
    void proceed() {
        startActionSafely(PaymentActivity::proceed);
    }

    /**
     * @see PaymentActivity#repeat()
     */
    void repeat() {
        startActionSafely(PaymentActivity::repeat);
    }

    /**
     * @see PaymentActivity#showError(Error, String)
     */
    void showError(final Error error, final String status) {
        startActionSafely(activity -> activity.showError(error, status));
    }

    /**
     * @see PaymentActivity#showCsc(ExternalCard)
     */
    void showCsc(final ExternalCard moneySource) {
        startActionSafely(activity -> activity.showCsc(moneySource));
    }

    /**
     * @see PaymentActivity#showProgressBar()
     */
    void showProgressBar() {
        startActionSafely(PaymentActivity::showProgressBar);
    }

    /**
     * @see PaymentActivity#hideProgressBar()
     */
    void hideProgressBar() {
        startActionSafely(PaymentActivity::hideProgressBar);
    }

    /**
     * Starts an action if payment activity is attached.
     *
     * @param action action to start
     */
    void startActionSafely(@NonNull Action action) {
        PaymentActivity activity = getPaymentActivity();
        if (activity != null) {
            action.start(activity);
        }
    }

    /**
     * Implementations do some action using attached activity.
     */
    interface Action {
        /**
         * Starts some action.
         *
         * @param activity payment activity
         */
        void start(@NonNull PaymentActivity activity);
    }
}
