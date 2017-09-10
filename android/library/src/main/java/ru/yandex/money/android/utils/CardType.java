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

package ru.yandex.money.android.utils;

import android.support.annotation.DrawableRes;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

import com.yandex.money.api.model.CardBrand;

import ru.yandex.money.android.R;

/**
 * Extends {@link CardBrand}.
 */
public enum CardType {

    VISA(R.drawable.ym_visa, R.drawable.ym_visa_card),
    MASTER_CARD(R.drawable.ym_mc, R.drawable.ym_mc_card),
    AMERICAN_EXPRESS(R.drawable.ym_ae, R.drawable.ym_ae_card),
    JCB(R.drawable.ym_default_card, R.drawable.ym_default_card),
    UNKNOWN(R.drawable.ym_default_card, R.drawable.ym_default_card);

    /**
     * icon for cards
     */
    @DrawableRes
    public final int icoResId;
    /**
     * icon for lists
     */
    @DrawableRes
    public final int cardResId;

    CardType(@DrawableRes int icoResId, @DrawableRes int cardResId) {
        this.icoResId = icoResId;
        this.cardResId = cardResId;
    }

    /**
     * Gets {@link CardType} instance from {@link CardBrand}
     *
     * @param type type
     * @return card type
     */
    @NonNull
    public static CardType get(@Nullable CardBrand type) {
        if (type == null) {
            return UNKNOWN;
        }
        switch (type) {
            case VISA:
                return VISA;
            case MASTER_CARD:
                return MASTER_CARD;
            case AMERICAN_EXPRESS:
                return AMERICAN_EXPRESS;
            case JCB:
                return JCB;
            default:
                return UNKNOWN;
        }
    }
}
