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

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.Log;

import com.yandex.money.api.model.CardBrand;
import com.yandex.money.api.model.ExternalCard;
import com.yandex.money.api.util.Enums;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents database and convenience methods to retrieve data from it. Normally only one instance of this class should
 * exist at any time.
 */
public final class DatabaseStorage {

    private static final String TAG = "DatabaseStorage";

    @NonNull
    private final DatabaseHelper helper;

    /**
     * Creates an instance of {@link DatabaseStorage}.
     *
     * @param context current context
     */
    public DatabaseStorage(@NonNull Context context) {
        helper = new DatabaseHelper(context);
    }

    /**
     * Selects all stored money sources.
     *
     * @return a list of {@link ExternalCard} objects
     */
    @NonNull
    public List<ExternalCard> selectExternalCards() {
        SQLiteDatabase database = getReadableDatabase();

        Cursor cursor = database.rawQuery("SELECT * FROM " + MoneySourceTable.NAME, null);
        final int fundingSourceTypeIndex = cursor.getColumnIndex(MoneySourceTable.FUNDING_SOURCE_TYPE);
        final int typeIndex = cursor.getColumnIndex(MoneySourceTable.TYPE);
        final int panFragmentIndex = cursor.getColumnIndex(MoneySourceTable.PAN_FRAGMENT);
        final int tokenIndex = cursor.getColumnIndex(MoneySourceTable.TOKEN);

        List<ExternalCard> moneySources = new ArrayList<>(cursor.getCount());
        while (cursor.moveToNext()) {
            moneySources.add(new ExternalCard.Builder()
                    .setFundingSourceType(cursor.getString(fundingSourceTypeIndex))
                    .setMoneySourceToken(cursor.getString(tokenIndex))
                    .setPanFragment(cursor.getString(panFragmentIndex))
                    .setType(Enums.parse(CardBrand.VISA, CardBrand.UNKNOWN, cursor.getString(typeIndex)))
                    .create());
        }

        cursor.close();
        database.close();
        return moneySources;
    }

    /**
     * Inserts new external card to the database.
     *
     * @param card card to insert
     */
    public void insertExternalCard(@Nullable ExternalCard card) {
        if (card == null) {
            Log.w(TAG, "trying to insert null money source");
            return;
        }

        ContentValues values = new ContentValues();
        values.put(MoneySourceTable.FUNDING_SOURCE_TYPE, card.fundingSourceType);
        values.put(MoneySourceTable.TYPE, card.type.name);
        values.put(MoneySourceTable.PAN_FRAGMENT, card.panFragment);
        values.put(MoneySourceTable.TOKEN, card.moneySourceToken);

        if (values.size() != 0) {
            SQLiteDatabase database = getWritableDatabase();
            database.insertOrThrow(MoneySourceTable.NAME, null, values);
            database.close();
        }
    }

    /**
     * Deletes {@link ExternalCard} from database if it was previously stored
     *
     * @param card {@link ExternalCard} to delete
     */
    public void deleteExternalCard(@Nullable ExternalCard card) {
        if (card == null) {
            Log.w(TAG, "trying to delete null money source");
            return;
        }

        SQLiteDatabase database = getWritableDatabase();
        database.execSQL("DELETE FROM " + MoneySourceTable.NAME +
                " WHERE " + MoneySourceTable.TOKEN + " = \"" +
                card.moneySourceToken + "\"");
        database.close();
    }

    @NonNull
    private SQLiteDatabase getReadableDatabase() {
        return helper.getReadableDatabase();
    }

    @NonNull
    private SQLiteDatabase getWritableDatabase() {
        return helper.getWritableDatabase();
    }
}
