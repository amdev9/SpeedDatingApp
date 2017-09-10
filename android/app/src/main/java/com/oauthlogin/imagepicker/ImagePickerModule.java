package com.oauthlogin.imagepicker;


import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;


import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.yandex.money.api.methods.payment.params.P2pTransferParams;
import com.yandex.money.api.methods.payment.params.PaymentParams;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.Properties;

import ru.yandex.money.android.PaymentActivity;

public class ImagePickerModule extends ReactContextBaseJavaModule  implements ActivityEventListener  {

    public ImagePickerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener( this);
    }

    /////////////// YANDEX PAYMENT MODULE START //////////////////////////////////////////////


    private static final int REQUEST_CODE = 1;//101;

    private static final String EXTRA_PAYMENT = "ru.yandex.money.android.sample.extra.PAYMENT";

//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        setContentView(R.layout.activity_main);
//
//        findButton(R.id.send_p2p).setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                pay(); /* PayActivity.startP2P(MainActivity.this); */
//            }
//        });
//
//    }

//    private Button findButton(int id) {
//        return (Button) findViewById(id);
//    }

    private Callback pickerSuccessCallback;
    private Callback pickerCancelCallback;


    @ReactMethod
    public void pay(Callback successCallback, Callback cancelCallback) {

        pickerSuccessCallback = successCallback;
        pickerCancelCallback = cancelCallback;

//        pickerSuccessCallback.invoke("empty test response");

        startPaymentActivityForResult(new P2pTransferParams.Builder("410015438403969") // getPaymentTo()
                .setAmount(new BigDecimal("1.02")) // getAmount()
                .setMessage("Тестовая оплата за услуги проведения мероприятия")
                .setComment("Тестовая оплата за услуги проведения мероприятия")
                .create());
    }



    private void startPaymentActivityForResult(PaymentParams paymentParams) {
        Activity currentActivity = getCurrentActivity();
        ApiData apiData = ApiData.getFromProperties(currentActivity);  // this

        // pass callback to PaymentActivity
        // how to pass params to data in on result
        Intent intent = PaymentActivity.getBuilder(currentActivity) //this)
                .setPaymentParams(paymentParams)
                .setClientId(apiData.clientId)
                .setHost(apiData.host)
                .build();
        currentActivity.startActivityForResult(intent, REQUEST_CODE);
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

        if (pickerSuccessCallback != null) {
            if (resultCode == activity.RESULT_CANCELED) {
                pickerCancelCallback.invoke("RESULT_CANCELED");
            } else if (resultCode == activity.RESULT_OK) {
                String returned = data.getStringExtra("returnString1");

                pickerSuccessCallback.invoke("RESULT_OK: ".concat(returned));


//                Uri uri = data.getData();
//
//                if (uri == null) {
//                    pickerCancelCallback.invoke("No image data found");
//                } else {
//                    try {
//                        pickerSuccessCallback.invoke(uri);
//                    } catch (Exception e) {
//                        pickerCancelCallback.invoke("No image data found");
//                    }
//                }
            }
        }

    }

    @Override
    public void onNewIntent(Intent intent) {

    }


    // onActivityResult - check statuses return

    private static class ApiData {

        final String clientId;
        final String host;

        private ApiData(String clientId, String host) {
            this.clientId = clientId;
            this.host = host;
        }

        static ImagePickerModule.ApiData getFromProperties(Context context) { // MainActivity
            Properties prop = loadProperties(context);
            return new ImagePickerModule.ApiData(prop.getProperty("client_id"), prop.getProperty("host")); // MainActivity
        }

        private static Properties loadProperties(Context context) {
            InputStream is = null;
            try {
                is = context.getAssets().open("app.properties");
                Properties prop = new Properties();
                prop.load(is);
                return prop;
            } catch (IOException e) {
                throw new IllegalStateException("no properties file found", e);
            } finally {
                if (is != null) {
                    try {
                        is.close();
                    } catch (IOException e) {
                        // does nothing
                    }
                }
            }
        }
    }

    /////////////// YANDEX PAYMENT MODULE END ////////////////////////////////////////////////
//    private static final int PICK_IMAGE = 1;
//
//    private Callback pickerSuccessCallback;
//    private Callback pickerCancelCallback;
//
//    @ReactMethod
//    public void openSelectDialog(ReadableMap config, Callback successCallback, Callback cancelCallback) {
//        Activity currentActivity = getCurrentActivity();
//
//        if (currentActivity == null) {
//            cancelCallback.invoke("Activity doesn't exist");
//            return;
//        }
//
//        pickerSuccessCallback = successCallback;
//        pickerCancelCallback = cancelCallback;
//
//        try {
//            final Intent galleryIntent = new Intent();
//
//            galleryIntent.setType("image/*");
//            galleryIntent.setAction(Intent.ACTION_GET_CONTENT);
//
//            final Intent chooserIntent = Intent.createChooser(galleryIntent, "Pick an image");
//
//            currentActivity.startActivityForResult(chooserIntent, PICK_IMAGE);
//        } catch (Exception e) {
//            cancelCallback.invoke(e);
//        }
//    }
//
//
//
//    @Override
//    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
//        if (pickerSuccessCallback != null) {
//            if (resultCode == activity.RESULT_CANCELED) {
//                pickerCancelCallback.invoke("ImagePicker was cancelled");
//            } else if (resultCode == activity.RESULT_OK) {
//                Uri uri = data.getData();
//
//                if (uri == null) {
//                    pickerCancelCallback.invoke("No image data found");
//                } else {
//                    try {
//                        pickerSuccessCallback.invoke(uri);
//                    } catch (Exception e) {
//                        pickerCancelCallback.invoke("No image data found");
//                    }
//                }
//            }
//        }
//    }
//
//
//    @Override
//    public void onNewIntent(Intent intent) {
//
//    }

    @Override
    public String getName() {
        return "ImagePicker";
    }

}

