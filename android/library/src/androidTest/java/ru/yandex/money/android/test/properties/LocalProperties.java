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

package ru.yandex.money.android.test.properties;

import com.yandex.money.api.methods.payment.params.PhoneParams;

import java.math.BigDecimal;

public final class LocalProperties extends BaseProperties {

    public LocalProperties() {
        super("/local.properties");
    }

    public String getHostUrl() {
        return get("host.url");
    }

    public String getClientId() {
        return get("client.id");
    }

    public String getInstanceId() {
        return get("instance.id");
    }

    public Card getCard() {
        return new Card(get("card.type"), get("card.number"), get("card.month"), get("card.year"),
                get("card.csc"), get("card.token"));
    }

    public PhoneParams getPhoneParams() {
        return PhoneParams.newInstance(get("params.phone"), getAmount());
    }

    public BigDecimal getAmount() {
        return new BigDecimal(get("params.amount"));
    }

    public static final class Card {

        public final String type;
        public final String number;
        public final String month;
        public final String year;
        public final String csc;
        public final String token;

        Card(String type, String number, String month, String year, String csc, String token) {
            this.type = type;
            this.number = number;
            this.month = month;
            this.year = year;
            this.csc = csc;
            this.token = token;
        }
    }
}
