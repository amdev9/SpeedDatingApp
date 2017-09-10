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
import android.text.InputFilter;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.yandex.money.api.model.ExternalCard;

import ru.yandex.money.android.R;
import ru.yandex.money.android.formatters.MoneySourceFormatter;
import ru.yandex.money.android.parcelables.ExternalCardParcelable;
import ru.yandex.money.android.utils.CardType;
import ru.yandex.money.android.utils.Views;

/**
 * Shows form allowing user to enter card security code (CSC, a.k.a. CVV or CVC) to proceed with payment.
 */
public final class CscFragment extends PaymentFragment {

    private ExternalCard moneySource;

    @Nullable
    private String csc;

    private LinearLayout error;
    private TextView errorTitle;
    private TextView errorMessage;
    private EditText cscEditText;
    private Button pay;

    /**
     * Creates an instance of {@link CscFragment}.
     *
     * @param card saved card
     * @return instance of {@link CscFragment}
     */
    @NonNull
    public static CscFragment newInstance(@NonNull ExternalCard card) {
        Bundle args = new Bundle();
        args.putParcelable(KEY_MONEY_SOURCE, new ExternalCardParcelable(card));

        CscFragment fragment = new CscFragment();
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        Bundle args = getArguments();
        assert args != null : "provide correct arguments for CscFragment";

        ExternalCardParcelable externalCardParcelable = args.getParcelable(KEY_MONEY_SOURCE);
        assert externalCardParcelable != null : "provide money source for CscFragment";

        moneySource = (ExternalCard) externalCardParcelable.value;
        CardType cardType = CardType.get(moneySource.type);

        View view = inflater.inflate(R.layout.ym_csc_fragment, container, false);
        assert view != null : "unable to inflate view in CscFragment";

        error = (LinearLayout) view.findViewById(R.id.ym_error);
        errorTitle = (TextView) view.findViewById(R.id.ym_error_title);
        errorMessage = (TextView) view.findViewById(R.id.ym_error_message);

        cscEditText = (EditText) view.findViewById(R.id.ym_csc);
        cscEditText.setHint(getString(R.string.ym_csc_code, moneySource.type.cscAbbr));
        cscEditText.setFilters(new InputFilter[]{new InputFilter.LengthFilter(moneySource.type.cscLength)});

        Views.setText(view, R.id.ym_csc_hint, getString(R.string.ym_csc_hint,
                getString(MoneySourceFormatter.getCscNumberType(cardType)),
                getString(MoneySourceFormatter.getCscNumberLocation(cardType))));

        view.findViewById(R.id.ym_cancel).setOnClickListener(v -> onCancelClicked());

        pay = (Button) view.findViewById(R.id.ym_pay);
        pay.setOnClickListener(v -> onPayClicked());

        return view;
    }

    /**
     * Gets CSC.
     *
     * @return CSC
     */
    @Nullable
    public String getCsc() {
        return csc;
    }

    private void setErrorGone() {
        setError(View.GONE, null, null);
    }

    private void setErrorVisible(String title, String message) {
        setError(View.VISIBLE, title, message);
    }

    private void setError(int visibility, String title, String message) {
        error.setVisibility(visibility);
        errorTitle.setText(title);
        errorMessage.setText(message);
    }

    private void onCancelClicked() {
        startActionSafely(activity -> {
            activity.cancel();
            activity.showCards();
        });
    }

    private void onPayClicked() {
        if (valid()) {
            setErrorGone();
            pay.setEnabled(false);
            cscEditText.setEnabled(false);
            proceed();
        } else {
            setErrorVisible(getString(R.string.ym_error_oops_title),
                    getString(R.string.ym_error_csc_invalid));
        }
    }

    private boolean valid() {
        csc = Views.getTextSafely(cscEditText);
        return csc != null && csc.length() == moneySource.type.cscLength;
    }
}
