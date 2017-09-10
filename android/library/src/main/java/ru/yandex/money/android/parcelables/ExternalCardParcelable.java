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

package ru.yandex.money.android.parcelables;

import android.os.Parcel;
import android.os.Parcelable;
import android.support.annotation.NonNull;

import com.yandex.money.api.model.CardBrand;
import com.yandex.money.api.model.ExternalCard;

public final class ExternalCardParcelable implements Parcelable {

    @NonNull
    public final ExternalCard value;

    public ExternalCardParcelable(@NonNull ExternalCard value) {
        this.value = value;
    }

    @SuppressWarnings("WeakerAccess")
    ExternalCardParcelable(@NonNull Parcel parcel) {
        value = new ExternalCard.Builder()
                .setType((CardBrand) parcel.readSerializable())
                .setPanFragment(parcel.readString())
                .setFundingSourceType(parcel.readString())
                .setMoneySourceToken(parcel.readString())
                .create();
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeSerializable(value.type);
        dest.writeString(value.panFragment);
        dest.writeString(value.fundingSourceType);
        dest.writeString(value.moneySourceToken);
    }

    public static final Creator<ExternalCardParcelable> CREATOR = new Creator<ExternalCardParcelable>() {
        @Override
        public ExternalCardParcelable createFromParcel(Parcel source) {
            return new ExternalCardParcelable(source);
        }

        @Override
        public ExternalCardParcelable[] newArray(int size) {
            return new ExternalCardParcelable[size];
        }
    };
}
