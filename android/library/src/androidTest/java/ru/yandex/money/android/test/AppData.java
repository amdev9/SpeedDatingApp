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

package ru.yandex.money.android.test;

import android.content.Context;
import android.text.TextUtils;

import com.yandex.money.api.model.CardBrand;
import com.yandex.money.api.model.ExternalCard;
import com.yandex.money.api.util.Enums;

import ru.yandex.money.android.Prefs;
import ru.yandex.money.android.database.DatabaseStorage;
import ru.yandex.money.android.test.properties.LocalProperties;

/**
 * @author Slava Yasevich (vyasevich@yamoney.ru)
 */
final class AppData {

    private AppData() {
    }

    static void clean(Context context) {
        checkContext(context);

        Prefs prefs = new Prefs(context);
        prefs.storeInstanceId("");

        DatabaseStorage storage = new DatabaseStorage(context);
        for (ExternalCard card : storage.selectExternalCards()) {
            storage.deleteExternalCard(card);
        }
    }

    static void addSavedCard(Context context, String instanceId, LocalProperties.Card card) {
        checkContext(context);
        if (TextUtils.isEmpty(instanceId)) {
            throw new IllegalArgumentException("instanceId is null or empty");
        }
        if (card == null) {
            throw new NullPointerException("card is null");
        }

        Prefs prefs = new Prefs(context);
        prefs.storeInstanceId(instanceId);

        DatabaseStorage storage = new DatabaseStorage(context);
        storage.insertExternalCard(new ExternalCard.Builder()
                .setFundingSourceType("payment-card")
                .setMoneySourceToken(card.token)
                .setPanFragment(card.number)
                .setType(Enums.parse(CardBrand.VISA, CardBrand.UNKNOWN, card.type))
                .create());
    }

    private static void checkContext(Context context) {
        if (context == null) {
            throw new NullPointerException("context is null");
        }
    }
}
