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

package ru.yandex.money.android.database;

/**
 * Represent a structure of {@code MoneySource} table. This table is used to store
 * {@link com.yandex.money.api.model.ExternalCard} data.
 */
final class MoneySourceTable {

    static final String NAME = "MoneySources";

    static final String FUNDING_SOURCE_TYPE = "funding_source_type";
    static final String TYPE = "type";
    static final String PAN_FRAGMENT = "pan_fragment";
    static final String TOKEN = "token";

    static final String COMMAND_CREATE =
            "CREATE TABLE " + NAME + " (\n" +
                    TOKEN + " TEXT PRIMARY KEY,\n" +
                    FUNDING_SOURCE_TYPE + " TEXT NOT NULL,\n" +
                    TYPE + " TEXT NOT NULL,\n" +
                    PAN_FRAGMENT + " TEXT NOT NULL);";

    private MoneySourceTable() {
        // forbid instance creation
    }
}
