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
import android.support.annotation.IdRes;
import android.support.annotation.IntDef;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.text.Editable;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

/**
 * Helper class to work with {@link View}s safely.
 */
public final class Views {

    private Views() {
    }

    /**
     * Sets text to a view that contained in container.
     *
     * @param container container view
     * @param viewId child view id
     * @param text text to set
     */
    public static void setText(@NonNull View container, @IdRes int viewId, @Nullable String text) {
        TextView textView = (TextView) container.findViewById(viewId);
        if (textView != null) {
            textView.setText(text);
        }
    }

    /**
     * Tries safely to get text from an instance of {@link EditText}.
     *
     * @param editText instance of {@link EditText}
     * @return text
     */
    @Nullable
    public static String getTextSafely(@NonNull EditText editText) {
        Editable text = editText.getText();
        return text == null ? null : text.toString();
    }

    /**
     * Sets image to a view that contained in container.
     *
     * @param container container view
     * @param viewId child view id
     * @param resId drawable resource id
     */
    public static void setImageResource(@NonNull View container, @IdRes int viewId, @DrawableRes int resId) {
        ImageView imageView = (ImageView) container.findViewById(viewId);
        if (imageView != null) {
            imageView.setImageResource(resId);
        }
    }

    /**
     * Sets visibility to a view that contained in container.
     *
     * @param container container view
     * @param viewId child view id
     * @param visibility visibility constant
     */
    public static void setVisibility(@NonNull View container, @IdRes int viewId, @Visibility int visibility) {
        View view = container.findViewById(viewId);
        if (view != null) {
            view.setVisibility(visibility);
        }
    }

    @IntDef({ View.GONE, View.INVISIBLE, View.VISIBLE })
    @Retention(RetentionPolicy.SOURCE)
    private @interface Visibility {
    }
}
