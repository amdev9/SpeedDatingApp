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
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import com.yandex.money.api.model.ExternalCard;

import java.math.BigDecimal;

import ru.yandex.money.android.R;
import ru.yandex.money.android.database.DatabaseStorage;
import ru.yandex.money.android.formatters.MoneySourceFormatter;
import ru.yandex.money.android.parcelables.ExternalCardParcelable;
import ru.yandex.money.android.utils.CardType;
import ru.yandex.money.android.utils.Views;

/**
 * Show success of payment operation.
 */
public final class SuccessFragment extends PaymentFragment {

    private static final String KEY_CONTRACT_AMOUNT = "contractAmount";

    @Nullable
    private ExternalCard moneySource;

    private View card;
    private Button saveCard;
    private View successMarker;
    private TextView description;

    /**
     * Creates an instance of {@link SuccessFragment}.
     *
     * @param contractAmount contract amount
     * @param card saved card
     * @return instance of {@link SuccessFragment}
     */
    @NonNull
    public static SuccessFragment newInstance(@NonNull BigDecimal contractAmount, @Nullable ExternalCard card) {
        Bundle args = new Bundle();
        args.putString(KEY_CONTRACT_AMOUNT, contractAmount.toPlainString());
        if (card != null) {
            args.putParcelable(KEY_MONEY_SOURCE, new ExternalCardParcelable(card));
        }

        SuccessFragment frg = new SuccessFragment();
        frg.setArguments(args);
        return frg;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.ym_success_fragment, container, false);
        Views.setText(view, R.id.ym_comment, getString(R.string.ym_success_comment,
                new BigDecimal(getArguments().getString(KEY_CONTRACT_AMOUNT))));

        card = view.findViewById(R.id.ym_card);
        description = (TextView) view.findViewById(R.id.ym_description);
        successMarker = view.findViewById(R.id.ym_success_marker);
        saveCard = (Button) view.findViewById(R.id.ym_save_card);
        saveCard.setOnClickListener(v -> onSaveCardClicked());

        return view;
    }

    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        moneySource = getMoneySourceFromBundle(savedInstanceState == null ? getArguments() : savedInstanceState);
        if (moneySource != null) {
            onCardExists();
        }
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (moneySource != null) {
            outState.putParcelable(KEY_MONEY_SOURCE, new ExternalCardParcelable(moneySource));
        }
    }

    /**
     * Saves card to database.
     *
     * @param card card to save
     */
    public void saveCard(@Nullable ExternalCard card) {
        DatabaseStorage storage = getDatabaseStorage();
        if (storage == null) return;

        this.moneySource = card;
        storage.insertExternalCard(card);
        onCardSaved();
    }

    private void onSaveCardClicked() {
        card.setBackgroundResource(R.drawable.ym_card_process);
        saveCard.setEnabled(false);
        saveCard.setText(R.string.ym_success_saving_card);
        saveCard.setOnClickListener(null);
        description.setText(R.string.ym_success_saving_card_description);
        repeat();
    }

    private void onCardSaved() {
        if (moneySource != null) {
            description.setText(getString(R.string.ym_success_card_saved_description, moneySource.type.cscAbbr));

            View view = getView();
            if (view != null) {
                Views.setImageResource(view, R.id.ym_payment_card_type, CardType.get(moneySource.type).icoResId);
                Views.setText(view, R.id.ym_pan_fragment, MoneySourceFormatter.formatPanFragment(moneySource));
            }
        }

        card.setBackgroundResource(R.drawable.ym_card_saved);
        saveCard.setVisibility(View.GONE);
        successMarker.setVisibility(View.VISIBLE);
    }

    private void onCardExists() {
        card.setVisibility(View.GONE);
        saveCard.setVisibility(View.GONE);
        successMarker.setVisibility(View.GONE);
        description.setVisibility(View.GONE);

        View view = getView();
        if (view != null) {
            Views.setVisibility(view, R.id.ym_success, View.VISIBLE);
        }
    }

    @Nullable
    private ExternalCard getMoneySourceFromBundle(@NonNull Bundle bundle) {
        ExternalCardParcelable parcelable = bundle.getParcelable(KEY_MONEY_SOURCE);
        return parcelable == null ? null : (ExternalCard) parcelable.value;
    }
}
