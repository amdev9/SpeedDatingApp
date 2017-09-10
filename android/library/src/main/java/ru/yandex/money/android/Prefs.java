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

package ru.yandex.money.android;

import android.content.Context;
import android.content.SharedPreferences;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

/**
 * Holds library preferences.
 */
public final class Prefs {

    private static final String PREFS_NAME = "ru.yandex.money.android.preferences";
    private static final String PREF_INSTANCE_ID = "ru.yandex.money.android.instanceId";

    @NonNull
    private final SharedPreferences prefs;

    /**
     * Creates an instance of {@link Prefs}.
     *
     * @param context current context
     */
    public Prefs(@NonNull Context context) {
        prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    /**
     * Stores instance id to preferences.
     *
     * @param instanceId instance id
     */
    public void storeInstanceId(@Nullable String instanceId) {
        prefs.edit()
                .putString(PREF_INSTANCE_ID, instanceId)
                .apply();
    }

    /**
     * Gets instance id from preferences.
     *
     * @return instance id or {@code null} if preferences do not contain this parameter
     */
    @Nullable
    String restoreInstanceId() {
        return prefs.getString(PREF_INSTANCE_ID, null);
    }
}
