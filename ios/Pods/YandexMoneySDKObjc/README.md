
# Objective-C Yandex.Money SDK  

[![Version](http://cocoapod-badges.herokuapp.com/v/YandexMoneySDKObjc/badge.png)](http://api.yandex.ru/money/)
[![Platform](http://cocoapod-badges.herokuapp.com/p/YandexMoneySDKObjc/badge.png)](http://api.yandex.ru/money/)

## Overview
This open-source library allows you to work with Yandex.Money API. You will learn more about Yandex.Money API on this [page][EN_API_Main] (also available in [Russian][RU_API_Main]).


## Installation

Objective-C Yandex.Money SDK is available through [CocoaPods](http://cocoapods.org).  For install it, simply add the following line to your Podfile:

    pod "YandexMoneySDKObjc"

## Usage
### App Registration
To be able to use the library you: the first thing you need to do is to register your application and get your unique **client_id**. To do that please follow the steps described on [this page][EN_API_Registration] (also available in [Russian][RU_API_Registration]).


### Payments from the Yandex.Money wallet
##### Authorization
Before making the first payment, an application must get authorized and recieved access token using the OAuth2 protocol, which makes authorization secure and convenient. (Learn more about it at this API page: [En][EN_API_Authorization], [Ru][RU_API_Authorization])

First of all, you should create authorization request using YMAAPISession class.  Then, you use UIWebView or OS browser to send this authorization request to the Yandex.Money server (Learn more about it at this API page: [En][EN_API_Authorization_request], [Ru][RU_API_Authorization_request]):


```Objective-C
NSDictionary *additionalParameters = @{
    YMAParameterResponseType    : YMAValueParameterResponseType, //Constant parameter  
    YMAParameterRedirectUri     : @"Your redirect_uri",          //URI that the OAuth server sends the authorization result to.
    YMAParameterScope           : @"payment-p2p"                 //A list of requested permissions.
}; 
// session - instance of YMAAPISession class 
// webView - instance of UIWebView class
NSURLRequest *authorizationRequest =  [session authorizationRequestWithClientId:@"Your client_id"
                                                           additionalParameters:additionalParameters];
[webView loadRequest:authorizationRequest];
```
For the authorization request, the user is redirected to the Yandex.Money authorization page. The user enters his login and password, reviews the list of requested permissions and payment limits, and either approves or rejects the application's authorization request. The authorization result is returned as an "HTTP 302 Redirect" to your **redirect_uri**.<br>

You should intercept a request to your **redirect_uri**, cancel the request and extract the verification code from the request query string:
```Objective-C
- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    BOOL shouldStartLoad = YES;
    NSMutableDictionary *authInfo = nil;
    NSError *error = nil;
    // session - instance of YMAAPISession class 
    if ([self.session isRequest:request 
                  toRedirectUrl:@"Your redirect_uri" 
              authorizationInfo:&authInfo 
                          error:&error]) {
        shouldStartLoad = NO;
        if (error == nil) {
            NSString *authCode = authInfo[@"code"]; 
            //Process temporary authorization code
        }
    }
    return shouldStartLoad;
}
```
If authorization was completed successfully, the application should immediately exchange the temporary authorization code for an access token (Learn more about it at this API page: [En][EN_API_Access_token], [Ru][RU_API_Access_token]):



```Objective-C
NSDictionary *additionalParameters = @{
    @"grant_type"           : @"authorization_code", // Constant parameter
    YMAParameterRedirectUri : @"Your redirect_uri"
};

// session  - instance of YMAAPISession class
// authCode - temporary authorization code
[session receiveTokenWithCode:authCode
                     clientId:@"Your client_id"
         additionalParameters:additionalParameters
                   completion:^(NSString *instanceId, NSError *error) {
                           if (error == nil && instanceId != nil && instanceId.length > 0) {
                               NSString *accessToken = instanceId; // Do NOT request access_token every time, when you need to call API method.
                               // Obtain it once and reuse it.
                               // Process access_token
                           }
                           else {
                               // Process error
                           }
                       }];
```
*The __access_token__ is a symmetric authorization key, so the application developer must secure it - the token should be encrypted for storage, with access allowed only after the user authenticates within the application. For example, the token can be encrypted using the 3DES algorithm, where the encryption key is a 4-digit PIN code.*

#### Payment

For payments from Yandex.Money wallet use YMAAPISession class. There are two API methods you should call when performing a payment: request-payment and process-payment.

To perform a request (call of API method), use `performRequest` method of YMAAPISession class:


```Objective-C
/// Perform some request and obtaining response in block.
/// @param request  - request inherited from YMABaseRequest.
/// @param token    - access token
/// @param block    - completion of block is used to get the response.
- (void)performRequest:(YMABaseRequest *)request token:(NSString *)token completion:(YMARequestHandler)block;
```
For more information about scenario of payment, please see API page: [En][EN_API_Payment_wallet], [Ru][RU_API_Payment_wallet].

#### Request payment

For creating a payment and checking its parameters (Learn more about it at this API page: [En][EN_API_Request_payment], [Ru][RU_API_Request_payment]) use YMAPaymentRequest class:


```Objective-C
NSDictionary *paymentParameters = ... // depends on your implementation
NSString *patternId = ... // depends on your implementation
YMAPaymentRequest *request = [YMAPaymentRequest paymentWithPatternId:patternId paymentParameters:paymentParameters];

// session  - instance of YMAAPISession class 
// token    - access token
[session performRequest:request token:token completion:^(YMABaseRequest *request, YMABaseResponse *response, NSError *error) {

    YMAPaymentResponse *paymentResponse = (YMAPaymentResponse *)response;
    
    switch (paymentResponse.status) {
        case YMAResponseStatusSuccess: {
            // Process payment response
            break;
        }
        case YMAResponseStatusHoldForPickup: {
            // Process payment response
            break;
        }
        default: {
            // Process error
            break;
        }
    }
}];
```

#### Process payment

Making a payment. The application calls the method up until the final payment status is known (status=success/refused).
The recommended retry mode is determined by the "next_retry" response field (by default, 5 seconds). (Learn more about it at this API page: [En][EN_API_Process_payment], [Ru][RU_API_Process_payment])<br>
For making a payment use YMAPaymentRequest class:



```Objective-C
// paymentRequestId - requestId from instance of YMAPaymentInfoModel class
// moneySourceModel - instance of YMAMoneySourceModel class
// csc              - can be nil, if payment from wallet
// successUri       - can be nil, if payment from wallet
// failUri          - can be nil, if payment from wallet
 YMAProcessPaymentRequest *processPaymentRequest = [YMAProcessPaymentRequest   processPaymentRequestId:paymentRequestId 
                                        moneySource:moneySourceModel
                                                csc:csc
                                         successUri:successUri
                                            failUri:failUri];
    
// session - instance of YMAAPISession class 
// token   - access token
[session performRequest:processPaymentRequest 
                  token:token 
             completion:^(YMABaseRequest *request, YMABaseResponse *response, NSError *error) {
             
    YMAProcessPaymentResponse *processResponse = (YMAProcessPaymentResponse *)response;

    switch (processResponse.status) {
        case YMAResponseStatusSuccess: {
            // Process payment response
            break;
        }
        case YMAResponseStatusExtAuthRequired: {
            // Process payment response
            break;
        }
        default: {
            // Process error
            break;
        }
    }
}];

```

### Payments from bank cards without authorization
#### Registering an instance of the application

Before making the first payment, you need to register a copy of the application in Yandex.Money, that is installed on a device and get an identifier for the instance of the application — **instance_id**. To register an instance, call the instance-id method (Learn more about it at this API page: [En][EN_API_Instance_id], [Ru][RU_API_Instance_id]):


```Objective-C

YMAExternalPaymentSession *session = [[YMAExternalPaymentSession alloc] init];

if (currentInstanceId == nil) {
    // token - can be nil
    [session instanceWithClientId:@"You client_id" 
                            token:token 
                       completion:^(NSString *instanceId, NSError *error)     {
        if (error != nil) {
            // Process error 
        } 
        else {
            currentInstanceId = instanceId; // Do NOT request instance id every time you, when you need to call API method. 
                             				// Obtain it once and reuse it.
            session.instanceId = currentInstanceId;
        }
    }];
} else {
    session.instanceId = currentInstanceId;
}

```
#### Payment
For payments from bank cards without authorization use YMAExternalPaymentSession class.
There are two API methods you should call when performing a payment: request-external-payment and  process-external-payment.
To perform a request (call of API method), use `performRequest` method of YMAExternalPaymentSession class:

```Objective-C

/// Perform some request and obtaining response in block.
/// @param request - request inherited from YMABaseRequest.
/// @param block - completion of block is used to get the response.
- (void)performRequest:(YMABaseRequest *)request token:(NSString *)token completion:(YMARequestHandler)block;

```

For more information about scenario of payment, please see API page: [En][EN_API_Payment_bank_card], [Ru][RU_API_Payment_bank_card].


#### Request external payment

For creating a payment and checking its parameters (Learn more about it at this API page: [En][EN_API_Request_external_payment], [Ru][RU_API_Request_external_payment]) use YMAExternalPaymentRequest class:



```Objective-C

YMAExternalPaymentRequest *externalPaymentRequest = [YMAExternalPaymentRequest externalPaymentWithPatternId:patternId andPaymentParams:paymentParams];
    
// session  - instance of YMAExternalPaymentSession class 
// token    - can be nil.
[session performRequest:externalPaymentRequest token:token completion:^(YMABaseRequest *request, 
    YMABaseResponse *response, NSError *error) {
    if (error != nil) {
        // Process error
    } else {
        YMAExternalPaymentResponse *externalPaymentResponse = (YMAExternalPaymentResponse *) response;
        // Process external payment response
    }
}];

```

#### Process external payment

Making a payment. The application calls the method up until the final payment status is known (status=success/refused).
The recommended retry mode is determined by the "next_retry" response field (by default, 5 seconds). (Learn more about it at this API page: [En][EN_API_Process_external_payment], [Ru][RU_API_Process_external_payment]) <br>
For making a payment use YMAExternalPaymentRequest class:


```Objective-C
// paymentRequestId - requestId from instance of YMAExternalPaymentInfoModel class
// successUri       - address of the page to return to when the bank card was successfully authorized
// failUri          - address of the page to return to when the bank card was refused authorization
YMABaseRequest *processExternalPaymentRequest = [YMAProcessExternalPaymentRequest processExternalPaymentWithRequestId:paymentRequestId 
                         successUri:successUri 
                            failUri:failUri 
                       requestToken:NO];
    
// session  - instance of YMAExternalPaymentSession class 
// token    - can be nil.
[session performRequest:paymentRequest token:token completion:^(YMABaseRequest *request, YMABaseResponse *response,
    NSError *error) {
    
    if (error != nil) {
        // Process error
        return;
    }

    YMABaseProcessResponse *processResponse = (YMABaseProcessResponse *)response;
        
    if (processResponse.status == YMAResponseStatusInProgress) {
        // Process InProgress status 
    } 
    else if (processResponse.status == YMAResponseStatusSuccess) {
        // Process Success status
    } 
    else if (processResponse.status == YMAResponseStatusExtAuthRequired) {
        // Process AuthRequired status
    } 
}];

```

### Eshop integration

Every eshop has specific payment parameters. Please feel free to contact us for any details: yamoney_shop@yamoney.ru [Contacts][Kassa_Contacts]


## Links

* Yandex.Money API page: [En][EN_API_Main], [Ru][RU_API_Main]
* [example project](https://github.com/yandex-money/yandex-money-sdk-objc/tree/master/Example)
* [Contacts for eshop integration details][Kassa_Contacts]

## License

Objective-c Yandex.Money SDK is available under the MIT license. See the LICENSE file for more info.



[EN_API_Main]:http://api.yandex.com/money/
[RU_API_Main]:http://api.yandex.ru/money/

[EN_API_Registration]:http://api.yandex.com/money/doc/dg/tasks/register-client.xml
[RU_API_Registration]:https://tech.yandex.ru/money/doc/dg/tasks/register-client-docpage/

[EN_API_Authorization]:http://api.yandex.com/money/doc/dg/concepts/money-oauth-intro.xml
[RU_API_Authorization]:https://tech.yandex.ru/money/doc/dg/concepts/money-oauth-intro-docpage/

[EN_API_Authorization_request]:http://api.yandex.com/money/doc/dg/reference/request-access-token.xml
[RU_API_Authorization_request]:https://tech.yandex.ru/money/doc/dg/reference/request-access-token-docpage/

[EN_API_Access_token]:http://api.yandex.com/money/doc/dg/reference/obtain-access-token.xml
[RU_API_Access_token]:https://tech.yandex.ru/money/doc/dg/reference/obtain-access-token-docpage/

[EN_API_Payment_wallet]:http://api.yandex.com/money/doc/dg/reference/process-payments.xml
[RU_API_Payment_wallet]:https://tech.yandex.ru/money/doc/dg/reference/process-payments-docpage/

[EN_API_Request_payment]:http://api.yandex.com/money/doc/dg/reference/request-payment.xml
[RU_API_Request_payment]:https://tech.yandex.ru/money/doc/dg/reference/request-payment-docpage/

[EN_API_Process_payment]:http://api.yandex.com/money/doc/dg/reference/process-payment.xml
[RU_API_Process_payment]:https://tech.yandex.ru/money/doc/dg/reference/process-payment-docpage/

[EN_API_Instance_id]:http://api.yandex.com/money/doc/dg/reference/instance-id.xml
[RU_API_Instance_id]:http://api.yandex.ru/money/doc/dg/reference/instance-id.xml

[EN_API_Payment_bank_card]:http://api.yandex.com/money/doc/dg/reference/process-external-payments.xml
[RU_API_Payment_bank_card]:https://tech.yandex.ru/money/doc/dg/reference/process-external-payments-docpage/

[EN_API_Request_external_payment]:http://api.yandex.com/money/doc/dg/reference/request-external-payment.xml
[RU_API_Request_external_payment]:http://api.yandex.ru/money/doc/dg/reference/request-external-payment.xml 

[EN_API_Process_external_payment]:http://api.yandex.com/money/doc/dg/reference/process-external-payment.xml
[RU_API_Process_external_payment]:http://api.yandex.ru/money/doc/dg/reference/process-external-payment.xml

[Kassa_Contacts]:https://kassa.yandex.ru/contacts
