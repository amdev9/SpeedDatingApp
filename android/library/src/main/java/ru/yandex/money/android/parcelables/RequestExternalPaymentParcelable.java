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
import android.support.annotation.NonNull;

import com.yandex.money.api.methods.payment.RequestExternalPayment;

@SuppressWarnings("WeakerAccess")
public final class RequestExternalPaymentParcelable extends BaseRequestPaymentParcelable {

    public RequestExternalPaymentParcelable(@NonNull RequestExternalPayment value) {
        super(value);
    }

    RequestExternalPaymentParcelable(@NonNull Parcel parcel) {
        super(parcel, new RequestExternalPayment.Builder());
    }

    public static final Creator<RequestExternalPaymentParcelable> CREATOR =
            new Creator<RequestExternalPaymentParcelable>() {
                @Override
                public RequestExternalPaymentParcelable createFromParcel(Parcel source) {
                    return new RequestExternalPaymentParcelable(source);
                }

                @Override
                public RequestExternalPaymentParcelable[] newArray(int size) {
                    return new RequestExternalPaymentParcelable[size];
                }
            };
}
