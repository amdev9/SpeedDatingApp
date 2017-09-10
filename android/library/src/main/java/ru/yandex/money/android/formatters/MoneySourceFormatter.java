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

package ru.yandex.money.android.formatters;

import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.annotation.StringRes;

import com.yandex.money.api.model.BankCardInfo;
import com.yandex.money.api.util.Strings;

import ru.yandex.money.android.R;
import ru.yandex.money.android.utils.CardType;

/**
 * Prepares money sources to user readable formats.
 */
public final class MoneySourceFormatter {

    private MoneySourceFormatter() {
    }

    /**
     * Formats card's pan fragment to 4-digits groups.
     *
     * @param card card to format
     * @return formatted string
     */
    @NonNull
    public static String formatPanFragment(@NonNull BankCardInfo card) {
        return formatPanFragment(card.getCardNumber());
    }

    /**
     * Formats pan fragment to 4-digits groups.
     *
     * @param panFragment pan fragment
     * @return formatted string
     */
    @SuppressWarnings("WeakerAccess")
    @NonNull
    public static String formatPanFragment(@NonNull String panFragment) {
        String[] fragments = panFragment.split("\\s");
        panFragment = Strings.concatenate(fragments, "");
        fragments = Strings.split(panFragment, 4);
        return Strings.concatenate(fragments, " ");
    }

    @StringRes
    public static int getCscNumberType(@Nullable CardType cardType) {
        return cardType == CardType.AMERICAN_EXPRESS ? R.string.ym_csc_four : R.string.ym_csc_three;
    }

    @StringRes
    public static int getCscNumberLocation(@Nullable CardType cardType) {
        return cardType == CardType.AMERICAN_EXPRESS ? R.string.ym_csc_front : R.string.ym_csc_back;
    }
}
