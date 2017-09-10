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

import android.os.Bundle;
import android.os.Parcel;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Map;

/**
 * Convenience methods to work with parcelables.
 */
public final class Parcelables {

    private Parcelables() {
    }

    /**
     * Writes boolean value to a parcel.
     *
     * @param parcel parcel
     * @param value boolean value
     */
    @SuppressWarnings("WeakerAccess")
    public static void writeBoolean(@NonNull Parcel parcel, boolean value) {
        parcel.writeByte(Booleans.toByte(value));
    }

    /**
     * Writes nullable long to a parcel.
     *
     * @param parcel parcel
     * @param value long value
     * @deprecated use {@link Parcel#writeSerializable(Serializable)} instead
     */
    @Deprecated
    public static void writeNullableLong(@NonNull Parcel parcel, Long value) {
        boolean hasValue = writeNullableValue(parcel, value);
        if (hasValue) {
            parcel.writeLong(value);
        }
    }

    /**
     * Writes {@link BigDecimal} value to a parcel.
     *
     * @param parcel parcel
     * @param value {@link BigDecimal} value
     * @deprecated use {@link Parcel#writeSerializable(Serializable)} instead
     */
    @Deprecated
    public static void writeBigDecimal(@NonNull Parcel parcel, BigDecimal value) {
        boolean hasValue = writeNullableValue(parcel, value);
        if (hasValue) {
            parcel.writeString(value.toPlainString());
        }
    }

    /**
     * Writes string map to a parcel.
     *
     * @param parcel parcel
     * @param map string map
     */
    public static void writeStringMap(@NonNull Parcel parcel, Map<String, String> map) {
        boolean hasValue = writeNullableValue(parcel, map);
        if (hasValue) {
            parcel.writeBundle(Bundles.writeStringMapToBundle(map));
        }
    }

    /**
     * Reads boolean value from a parcel
     *
     * @param parcel parcel
     * @return boolean value
     */
    @SuppressWarnings("WeakerAccess")
    public static boolean readBoolean(@NonNull Parcel parcel) {
        return Booleans.toBoolean(parcel.readByte());
    }

    /**
     * Reads nullable long from a parcel.
     *
     * @param parcel parcel
     * @return nullable long
     * @deprecated use {@link Parcel#readSerializable()} instead
     */
    @Deprecated
    @Nullable
    public static Long readNullableLong(@NonNull Parcel parcel) {
        return hasNullableValue(parcel) ? parcel.readLong() : null;
    }

    /**
     * Reads {@link BigDecimal} from a parcel.
     *
     * @param parcel parcel
     * @return {@link BigDecimal} value
     * @deprecated use {@link Parcel#readSerializable()} instead
     */
    @Deprecated
    @Nullable
    public static BigDecimal readBigDecimal(@NonNull Parcel parcel) {
        return hasNullableValue(parcel) ? new BigDecimal(parcel.readString()) : null;
    }

    /**
     * Reads string map from a parcel.
     *
     * @param parcel parcel
     * @return string map
     */
    @Nullable
    public static Map<String, String> readStringMap(@NonNull Parcel parcel) {
        return hasNullableValue(parcel) ?
                Bundles.readStringMapFromBundle(parcel.readBundle(Bundle.class.getClassLoader())) :
                null;
    }

    private static boolean writeNullableValue(@NonNull Parcel parcel, @Nullable Object value) {
        boolean hasValue = value != null;
        writeBoolean(parcel, hasValue);
        return hasValue;
    }

    private static boolean hasNullableValue(@NonNull Parcel parcel) {
        return readBoolean(parcel);
    }
}
