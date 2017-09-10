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

import android.content.res.Configuration;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.PopupMenu;
import android.widget.TextView;

import com.yandex.money.api.model.ExternalCard;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import ru.yandex.money.android.PaymentActivity;
import ru.yandex.money.android.R;
import ru.yandex.money.android.database.DatabaseStorage;
import ru.yandex.money.android.formatters.MoneySourceFormatter;
import ru.yandex.money.android.utils.CardType;
import ru.yandex.money.android.utils.Views;

/**
 * Fragment that shows a list of saved bank allowing a user to pay with a new card. Also shows payment details, such as
 * contract amount and shop's title.
 */
public final class CardsFragment extends PaymentFragment {

    private static final String KEY_TITLE = "title";
    private static final String KEY_CONTRACT_AMOUNT = "contractAmount";

    @Nullable
    PopupMenu menu;

    private int orientation;
    private ViewGroup bankCards;

    /**
     * Creates new instance of {@link CardsFragment}.
     *
     * @param title shop's title
     * @param contractAmount contract amount
     * @return instance of {@link CardsFragment}
     */
    @NonNull
    public static CardsFragment newInstance(@NonNull String title, @NonNull BigDecimal contractAmount) {
        Bundle args = new Bundle();
        args.putString(KEY_TITLE, title);
        args.putSerializable(KEY_CONTRACT_AMOUNT, contractAmount.toPlainString());

        CardsFragment fragment = new CardsFragment();
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.ym_cards_fragment, container, false);
        assert view != null : "view is null";

        Bundle args = getArguments();
        assert args != null : "specify proper arguments for CardsFragment";

        Views.setText(view, R.id.ym_payment_name, args.getString(KEY_TITLE));
        Views.setText(view, R.id.ym_payment_sum, getString(R.string.ym_cards_payment_sum_value,
                new BigDecimal(args.getString(KEY_CONTRACT_AMOUNT))));

        bankCards = (ViewGroup) view.findViewById(android.R.id.list);

        for (int i = 0; i < getCards().size(); i++) {
            final ExternalCard externalCard = getCards().get(i);
            final View card = inflater.inflate(R.layout.ym_card_item, bankCards, false);
            bankCards.addView(card);
            card.setOnClickListener(v -> showCsc(externalCard));

            final TextView panFragment = (TextView) card.findViewById(R.id.ym_pan_fragment);
            panFragment.setText(MoneySourceFormatter.formatPanFragment(externalCard));
            panFragment.setCompoundDrawablesWithIntrinsicBounds(CardType.get(externalCard.type).cardResId, 0, 0, 0);

            final ImageButton button = (ImageButton) view.findViewById(R.id.ym_actions);
            final int iFinal = i;
            button.setOnClickListener(v -> showPopup(v, iFinal, externalCard));
        }

        View cardsFooter = inflater.inflate(R.layout.ym_cards_footer, bankCards, false);
        bankCards.addView(cardsFooter);
        cardsFooter.setOnClickListener(v -> proceed());

        orientation = getResources()
                .getConfiguration()
                .orientation;
        return view;
    }

    @NonNull
    private List<ExternalCard> getCards() {
        PaymentActivity activity = getPaymentActivity();
        return activity == null ? Collections.emptyList() : activity.getCards();
    }

    private void showPopup(@NonNull View v, int position, @Nullable ExternalCard card) {
        menu = new PopupMenu(getPaymentActivity(), v);
        MenuInflater inflater = menu.getMenuInflater();
        inflater.inflate(R.menu.ym_card_actions, menu.getMenu());
        menu.setOnMenuItemClickListener(new MenuItemClickListener(card, position));
        menu.show();
    }

    void deleteCard(@Nullable ExternalCard card, int position) {
        DatabaseStorage storage = getDatabaseStorage();
        if (storage == null) return;

        storage.deleteExternalCard(card);
        bankCards.removeViewAt(position);
        getCards().remove(card);
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        if (orientation != newConfig.orientation && menu != null) {
            menu.dismiss();
        }
        orientation = newConfig.orientation;
    }

    private class MenuItemClickListener implements PopupMenu.OnMenuItemClickListener {

        @Nullable
        private final ExternalCard card;
        private final int position;

        MenuItemClickListener(@Nullable ExternalCard card, int position) {
            this.card = card;
            this.position = position;
        }

        @Override
        public boolean onMenuItemClick(MenuItem item) {
            if (item.getItemId() == R.id.ym_delete) {
                deleteCard(card, position);
                menu = null;
                return true;
            }
            return false;
        }
    }
}
