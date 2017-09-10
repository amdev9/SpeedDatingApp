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

package ru.yandex.money.android.fragments;

import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;

import com.yandex.money.api.model.Error;
import com.yandex.money.api.net.ParametersBuffer;

import java.util.Map;

import ru.yandex.money.android.Constants;
import ru.yandex.money.android.R;
import ru.yandex.money.android.utils.Bundles;
import ru.yandex.money.android.utils.Views;

/**
 * Provides {@link WebView} functionality for payment processes.
 */
public final class WebFragment extends PaymentFragment {

    private static final String KEY_URL = "uri";
    private static final String KEY_POST_DATA = "postData";

    WebView webView;

    private View errorView;

    /**
     * Creates an instance of {@link WebFragment}.
     *
     * @param url url to open
     * @param postData data to POST
     * @return instance of {@link WebFragment}
     */
    @NonNull
    public static WebFragment newInstance(@NonNull String url, @NonNull Map<String, String> postData) {
        Bundle args = new Bundle();
        args.putString(KEY_URL, url);
        args.putBundle(KEY_POST_DATA, Bundles.writeStringMapToBundle(postData));

        WebFragment fragment = new WebFragment();
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View layout = inflater.inflate(R.layout.ym_web_fragment, container, false);
        setUpWebView(layout);
        setUpMessageView(layout);
        return layout;
    }

    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        loadPage();
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setUpWebView(@NonNull View layout) {
        webView = (WebView) layout.findViewById(R.id.web_view);
        webView.setVisibility(View.VISIBLE);
        webView.setWebViewClient(new Client());
        webView.setWebChromeClient(new Chrome());
        webView.getSettings().setJavaScriptEnabled(true);
    }

    private void setUpMessageView(@NonNull View layout) {
        errorView = layout.findViewById(R.id.error_view);

        final int titleResId = R.string.ym_error_something_wrong_title;
        final int messageResId = R.string.ym_error_unknown;
        final int actionResId = R.string.ym_error_action_try_again;
        final Button action = (Button) errorView.findViewById(R.id.ym_error_action);

        Views.setText(errorView, R.id.ym_error_title, getString(titleResId));
        Views.setText(errorView, R.id.ym_error_message, getString(messageResId));
        action.setText(getString(actionResId));
        action.setOnClickListener(v -> webView.reload());
    }

    private void loadPage(@NonNull String url, @NonNull Map<String, String> postParams) {
        hideError();
        webView.postUrl(url, buildPostData(postParams));
    }

    private void loadPage() {
        Bundle args = getArguments();

        String url = args.getString(KEY_URL);
        Bundle postData = args.getBundle(KEY_POST_DATA);
        if (url == null || postData == null) {
            showError();
            return;
        }

        loadPage(url, Bundles.readStringMapFromBundle(postData));
    }

    void showError() {
        webView.setVisibility(View.GONE);
        errorView.setVisibility(View.VISIBLE);
    }

    private void hideError() {
        errorView.setVisibility(View.GONE);
        webView.setVisibility(View.VISIBLE);
    }

    @NonNull
    private byte[] buildPostData(@NonNull Map<String, String> postParams) {
        return new ParametersBuffer()
                .setParameters(postParams)
                .prepareBytes();
    }

    private class Client extends WebViewClient {

        Client() {
        }

        @SuppressWarnings("deprecation") // to support operating systems with integrated API < 24
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            return shouldOverrideUrlLoading(url) || super.shouldOverrideUrlLoading(view, url);
        }

        @TargetApi(Build.VERSION_CODES.LOLLIPOP)
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            return shouldOverrideUrlLoading(request.getUrl().toString()) ||
                    super.shouldOverrideUrlLoading(view, request);
        }

        @SuppressWarnings("deprecation") // to support operating systems with integrated API < 23
        @Override
        public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
            onReceivedError(view, null, null);
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            hideProgressBar();
            showError();
        }

        private boolean shouldOverrideUrlLoading(@NonNull String url) {
            Log.i("URL: ", url);
//            Log.d("WebViewClient", "loading " + url);  // js webView shouldOverrideUrlLoading
            boolean completed = false;
            if (url.contains(Constants.EXT_AUTH_SUCCESS_URI)) {
                completed = true;
                webView.setVisibility(View.GONE);
                proceed();
            } else if (url.contains(Constants.EXT_AUTH_FAIL_URI)) {
                completed = true;
                showError(Error.AUTHORIZATION_REJECT, null);
            }
            if (completed) {
                hideProgressBar();
            }
            return completed;
        }
    }

    private class Chrome extends WebChromeClient {

        Chrome() {
        }

        @Override
        public void onProgressChanged(WebView view, int newProgress) {
            Log.d("WebChromeClient", "progress = " + newProgress);
            if (newProgress == 100) {
                hideProgressBar();
            } else {
                showProgressBar();
            }
        }
    }
}
