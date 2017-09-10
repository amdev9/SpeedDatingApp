package ru.yandex.money.android;

import android.os.Bundle;
import android.support.annotation.NonNull;

import com.yandex.money.api.methods.payment.params.PaymentParams;
import com.yandex.money.api.methods.payment.params.ShopParams;

import java.util.Map;

import ru.yandex.money.android.utils.Bundles;

/**
 * Convenience class to help working with payment parameters.
 */
final class PaymentExtras {

    private static final String EXTRA_PATTERN_ID = "ru.yandex.money.android.extra.PATTERN_ID";
    private static final String EXTRA_PARAMS = "ru.yandex.money.android.extra.PARAMS";

    private PaymentExtras() {
    }

    /**
     * Create bundle from payment parameters.
     *
     * @param params instance of {@link PaymentParams}
     * @return instance of {@link Bundle}
     */
    @NonNull
    static Bundle toBundle(@NonNull PaymentParams params) {
        Bundle bundle = new Bundle();
        bundle.putString(EXTRA_PATTERN_ID, params.patternId);
        bundle.putBundle(EXTRA_PARAMS, Bundles.writeStringMapToBundle(params.paymentParams));
        return bundle;
    }

    /**
     * Creates payment parameters from bundle.
     *
     * @param bundle instance of {@link Bundle}
     * @return instance of {@link PaymentParams}
     */
    @NonNull
    static PaymentParams fromBundle(@NonNull Bundle bundle) {
        String patternId = bundle.getString(EXTRA_PATTERN_ID);
        if (patternId == null) throw new NullPointerException(EXTRA_PATTERN_ID);

        Bundle params = bundle.getBundle(EXTRA_PARAMS);
        if (params == null) throw new NullPointerException(EXTRA_PARAMS);

        Map<String, String> paymentParams = Bundles.readStringMapFromBundle(params);
        return new ShopParams(patternId, paymentParams);
    }
}
