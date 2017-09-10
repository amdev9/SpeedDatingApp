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

import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import com.yandex.money.api.model.Error;

import ru.yandex.money.android.R;
import ru.yandex.money.android.utils.Views;

/**
 * Shows error of payment operation.
 */
public final class ErrorFragment extends PaymentFragment {

    private static final String TAG = ErrorFragment.class.getName();

    private static final String KEY_ERROR = "error";
    private static final String KEY_STATUS = "status";

    /**
     * Creates new instance of {@link ErrorFragment} for unknown error.
     *
     * @return instance of {@link ErrorFragment}
     */
    @NonNull
    public static ErrorFragment newInstance() {
        return newInstance(null, null);
    }

    /**
     * Creates new instance of {@link ErrorFragment}.
     *
     * @param error error
     * @param status operation status
     * @return instance of {@link ErrorFragment}
     */
    @NonNull
    public static ErrorFragment newInstance(@Nullable Error error, @Nullable String status) {
        Bundle args = new Bundle();
        args.putSerializable(KEY_ERROR, error);
        args.putString(KEY_STATUS, status);

        ErrorFragment frg = new ErrorFragment();
        frg.setArguments(args);
        return frg;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.ym_error_fragment, container, false);
        assert view != null : "view is null";

        Bundle args = getArguments();
        assert args != null : "you did not pass mandatory arguments for ErrorFragment";

        showError(view, (Error) args.getSerializable(KEY_ERROR), args.getString(KEY_STATUS));
        return view;
    }

    private void showError(@NonNull View view, @Nullable Error error, @Nullable String status) {
        Log.e(TAG, String.format("error=%1$s,status=%2$s", error, status));

        final int notSpecified = -1;

        final int titleResId;
        final int messageResId;
        final int actionResId;

        if (Error.ILLEGAL_PARAM_CLIENT_ID == error) {
            titleResId = R.string.ym_error_illegal_param_client_id_title;
            messageResId = R.string.ym_error_illegal_param_client_id;
            actionResId = notSpecified;
        } else if (Error.ILLEGAL_PARAM_CSC == error) {
            titleResId = R.string.ym_error_oops_title;
            messageResId = R.string.ym_error_illegal_param_csc;
            actionResId = R.string.ym_error_action_try_again;
        } else if (Error.AUTHORIZATION_REJECT == error) {
            titleResId = R.string.ym_error_something_wrong_title;
            messageResId = R.string.ym_error_authorization_reject;
            actionResId = R.string.ym_error_action_try_another_card;
        } else if (Error.PAYEE_NOT_FOUND == error) {
            titleResId = R.string.ym_error_oops_title;
            messageResId = R.string.ym_error_payee_not_found;
            actionResId = notSpecified;
        } else if (Error.PAYMENT_REFUSED == error) {
            titleResId = R.string.ym_error_something_wrong_title;
            messageResId = R.string.ym_error_payment_refused;
            actionResId = R.string.ym_error_action_try_again;
        } else if ("REFUSED".equals(status)) {
            titleResId = R.string.ym_error_illegal_param_client_id_title;
            messageResId = R.string.ym_error_illegal_param_client_id;
            actionResId = notSpecified;
        } else {
            titleResId = R.string.ym_error_oops_title;
            messageResId = R.string.ym_error_unknown;
            actionResId = notSpecified;
        }

        Views.setText(view, R.id.ym_error_title, getString(titleResId));
        Views.setText(view, R.id.ym_error_message, getString(messageResId));

        final Button action = (Button) view.findViewById(R.id.ym_error_action);
        if (actionResId == notSpecified) {
            action.setVisibility(View.GONE);
            action.setOnClickListener(null);
        } else {
            action.setText(getString(actionResId));
            action.setVisibility(View.VISIBLE);
            action.setOnClickListener(v -> startActionSafely(activity -> {
                action.setEnabled(false);
                activity.reset();
            }));
        }
    }
}
