//
//  YandexPay.m
//  YandexWrapper
//
//  Created by Alex Matveev on 25/07/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "YandexPay.h"
#import "React/RCTLog.h"

#import "YMAExternalPaymentInfoModel.h"
#import "YMAExternalPaymentSession.h"
#import "YMAExternalPaymentRequest.h"
#import "YMAAscModel.h"
#import "YMAProcessExternalPaymentRequest.h"

static NSString *const kHttpsScheme = @"https";

static NSString *const kKeychainIdInstance = @"instanceKeychainId";
static NSString *const kSuccessUrl = @"yandexmoneyapp://oauth/authorize/success";
static NSString *const kFailUrl = @"yandexmoneyapp://oauth/authorize/fail";

// You must register your application and receive unique "client_id".
// More information: http://api.yandex.com/money/doc/dg/tasks/register-client.xml
static NSString *const kClientId = @"B28C202D8C46BBA015EA17CED2D08A02E103F4A4DD6C40F43BB7BA10A32CBCBC";

@interface YandexPay () {
  NSMutableDictionary *_instanceIdQuery;
  YMAExternalPaymentSession *_session;
}

@property(nonatomic, strong) YMAExternalPaymentInfoModel *paymentRequestInfo;
@property(nonatomic, strong, readonly) NSDictionary *instanceIdQuery;
@property(nonatomic, copy) NSString *instanceId;-
@property(nonatomic, strong, readonly) YMAExternalPaymentSession *session;

@end


@implementation YandexPay

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(doTestPayment:(RCTResponseSenderBlock) callback) {

  NSMutableDictionary *dict = [NSMutableDictionary dictionary];
  dict[(id) kSecClass] = (id) kSecClassGenericPassword;
  SecItemDelete((CFDictionaryRef) dict);
  
  NSDictionary *paymentParams = @{
                                  @"to" : @"410015438403969",
                                  @"amount" : @10,
                                  @"comment" : @"Оплата за услуги проведения мероприятия",
                                  @"message": @"Оплата за услуги проведения мероприятия"
                                  };
  
  // Register your application using clientId and obtaining instanceId (if needed).
  [self updateInstanceWithCompletion:^(NSError *error) {
    if (error)
      dispatch_async(dispatch_get_main_queue(), ^{
        //  [self showError:error];
        RCTLogInfo(@"[self showError:error] %@", error);
      });
    else {
      // Payment request. First phase of payment is required to obtain payment info (YMAPaymentRequestInfo)
      
      [self startPaymentWithPatternId:@"p2p" andPaymentParams:paymentParams completion:^(YMAExternalPaymentInfoModel *requestInfo, NSError *paymentRequestError) {
        if (!paymentRequestError) {
          self.paymentRequestInfo = requestInfo;
          // Process payment request. Second phase of payment.
          [self finishPayment: callback];
        } else {
          dispatch_async(dispatch_get_main_queue(), ^{
            //  [self showError:paymentRequestError];
            
            RCTLogInfo(@"[self showError:paymentRequestError] %@", paymentRequestError);
          });
        }
      }];
    }
  }];
}

#pragma mark -
#pragma mark *** Payment process  ***
#pragma mark -

- (YMAExternalPaymentSession *)session {
  if (!_session) {
    _session = [[YMAExternalPaymentSession alloc] init];
  }
  
  return _session;
}

- (void)updateInstanceWithCompletion:(YMAHandler)block {
  NSString *currentInstanceId = self.instanceId;
  
  if (!currentInstanceId || [currentInstanceId isEqual:@""]) {
    [self.session instanceWithClientId:kClientId
                                 token:nil
                            completion:^(NSString *instanceId, NSError *error) {
                              if (error)
                                block(error);
                              else {
                                self.instanceId = instanceId;
                                self.session.instanceId = instanceId;
                                block(nil);
                              }
                            }];
    
    return;
  }
  
  self.session.instanceId = currentInstanceId;
  block(nil);
}

- (void)startPaymentWithPatternId:(NSString *)patternId andPaymentParams:(NSDictionary *)paymentParams completion:(void (^)(YMAExternalPaymentInfoModel *requestInfo, NSError *error))block {
  YMABaseRequest *externalPaymentRequest = [YMAExternalPaymentRequest externalPaymentWithPatternId:patternId paymentParameters:paymentParams];
  
  [self.session performRequest:externalPaymentRequest
                         token:nil
                    completion:^(YMABaseRequest *request, YMABaseResponse *response, NSError *error) {
                      if (error) {
                        block(nil, error);
                        return;
                      }
                      
                      YMAExternalPaymentResponse *externalPaymentResponse = (YMAExternalPaymentResponse *) response;
                      block(externalPaymentResponse.paymentRequestInfo, nil);
                    }];
}

- (void)finishPaymentWithRequestId:(NSString *)requestId completion:(void (^)(YMAAscModel *asc, NSError *error))block {
  YMABaseRequest *processExternalPaymentRequest = [YMAProcessExternalPaymentRequest processExternalPaymentWithRequestId:requestId successUri:kSuccessUrl failUri:kFailUrl requestToken:NO];
  
  [self processPaymentRequest:processExternalPaymentRequest completion:^(YMABaseRequest *request, YMABaseResponse *response, NSError *error) {
    if (error) {
      block(nil, error);
      return;
    }
    
    NSError *unknownError = [NSError errorWithDomain:YMAErrorDomainUnknown code:0 userInfo:@{@"request" : request, @"response" : response}];
    
    YMABaseProcessResponse *processResponse = (YMABaseProcessResponse *)response;
    
    if (processResponse.status == YMAResponseStatusSuccess)
      block(nil, nil);
    else if (processResponse.status == YMAResponseStatusExtAuthRequired) {
      YMAProcessExternalPaymentResponse *processExternalPaymentResponse = (YMAProcessExternalPaymentResponse *) response;
      YMAAscModel *asc = processExternalPaymentResponse.asc;
      
      block(asc, asc ? nil : unknownError);
    } else
      block(nil, unknownError);
  }];
}

- (void)processPaymentRequest:(YMABaseRequest *)paymentRequest completion:(YMARequestHandler)block {
  
  [self.session performRequest:paymentRequest
                         token:nil
                    completion:^(YMABaseRequest *request, YMABaseResponse *response, NSError *error) {
                      YMABaseProcessResponse *processResponse = (YMABaseProcessResponse *)response;
                      
                      if (processResponse.status == YMAResponseStatusInProgress) {
                        dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, processResponse.nextRetry);
                        dispatch_after(popTime, dispatch_get_main_queue(), ^(void) {
                          [self processPaymentRequest:request completion:block];
                        });
                      } else
                        block(request, response, error);
                    }];
}

- (void)finishPayment: (RCTResponseSenderBlock) callback {
  [self finishPaymentWithRequestId:self.paymentRequestInfo.requestId completion:^(YMAAscModel *asc, NSError *error) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [self processPaymentRequestWithAsc:asc andError:error callback: callback];
    });
  }];
}

- (void)processPaymentRequestWithAsc:(YMAAscModel *)asc andError:(NSError *)error callback: (RCTResponseSenderBlock)callback {
  if (error) {
    // [self showError:error];
    RCTLogInfo(@"[self showError:error] %@", error);
    
  } else if (asc) {
    
    // Process info about redirect to authorization page.
  
      NSMutableString *post = [NSMutableString string];
      
      for (NSString *key in asc.params.allKeys) {
        NSString *paramValue = [self addPercentEscapesToString:(asc.params)[key]];
        NSString *paramKey = [self addPercentEscapesToString:key];
        
        [post appendString:[NSString stringWithFormat:@"%@=%@&", paramKey, paramValue]];
      }
      if (post.length)
        [post deleteCharactersInRange:NSMakeRange(post.length - 1, 1)];
    
    
    
    NSData *postData = [post dataUsingEncoding:NSUTF8StringEncoding allowLossyConversion:NO];
    NSDictionary *headers = @{
                              @"Content-Length": [NSString stringWithFormat:@"%lu", (unsigned long) postData.length]
                              };
    NSDictionary *req = @{
                          @"uri" : asc.url.absoluteString,
                          @"method" : @"POST",
                          @"body": post,
                          @"headers": headers
                          };
    callback(@[[NSNull null], req]);
    
    
    // req :
    // {
    //   uri: 'https://m.money.yandex.ru/internal/public-api/to-payment-type',
    //   method: 'POST',
    //   headers: {
    //     'Content-Length': '132'
    //   },
    //   body: post,
    // }
    
    
  } else {
    
    // Success payment
    RCTLogInfo(@"Success payment");
    
    //    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Success!" message:@"" delegate:nil cancelButtonTitle:@"Close" otherButtonTitles:nil];
    //    [alert show];
  }
}

- (NSString *)addPercentEscapesToString:(NSString *)string {
  return (NSString *) CFBridgingRelease(CFURLCreateStringByAddingPercentEscapes(NULL,
                                                                                (__bridge CFStringRef)string,
                                                                                NULL,
                                                                                (CFStringRef)@";/?:@&=+$,",
                                                                                kCFStringEncodingUTF8));
}

- (NSString *)strippedURL:(NSURL *)url
{
  NSString *scheme = [url.scheme lowercaseString];
  NSString *path   = [url.path stringByTrimmingCharactersInSet:[NSCharacterSet punctuationCharacterSet]];
  NSString *host   = url.host;
  NSInteger port   = [url.port integerValue];
  if (port == 0) {
    if ([scheme isEqualToString:kHttpsScheme]) {
      port = 443;
    }
    else {
      port = 80;
    }
  }
  NSString *strippedURL = [[NSString stringWithFormat:@"%@://%@:%ld/%@", scheme, host, port ,  path] lowercaseString];
  return strippedURL;
}

#pragma mark -
#pragma mark *** Key Chain  ***
#pragma mark -

- (NSString *)instanceId {
  CFTypeRef outDictionaryRef = [self performQuery:self.instanceIdQuery];
  
  if (outDictionaryRef != NULL) {
    NSMutableDictionary *outDictionary = (__bridge NSMutableDictionary *) outDictionaryRef;
    NSDictionary *queryResult = [self secItemFormatToDictionary:outDictionary];
    
    return queryResult[(id) kSecValueData];
  }
  
  return nil;
}

- (void)setInstanceId:(NSString *)instanceId {
  CFTypeRef outDictionaryRef = [self performQuery:self.instanceIdQuery];
  NSMutableDictionary *secItem;
  
  if (outDictionaryRef != NULL) {
    NSMutableDictionary *outDictionary = (__bridge NSMutableDictionary *) outDictionaryRef;
    NSMutableDictionary *queryResult = [self secItemFormatToDictionary:outDictionary];
    
    if (![queryResult[(id) kSecValueData] isEqual:instanceId]) {
      secItem = [self dictionaryToSecItemFormat:@{(id) kSecValueData : instanceId}];
      SecItemUpdate((CFDictionaryRef) self.instanceIdQuery, (CFDictionaryRef) secItem);
    }
    
    return;
  }
  
  secItem = [self dictionaryToSecItemFormat:@{(id) kSecValueData : instanceId}];
  secItem[(id) kSecAttrGeneric] = kKeychainIdInstance;
  SecItemAdd((CFDictionaryRef) secItem, NULL);
}

- (NSDictionary *)instanceIdQuery {
  if (!_instanceIdQuery) {
    _instanceIdQuery = [[NSMutableDictionary alloc] init];
    _instanceIdQuery[(id) kSecClass] = (id) kSecClassGenericPassword;
    _instanceIdQuery[(id) kSecAttrGeneric] = kKeychainIdInstance;
    _instanceIdQuery[(id) kSecMatchLimit] = (id) kSecMatchLimitOne;
    _instanceIdQuery[(id) kSecReturnAttributes] = (id) kCFBooleanTrue;
  }
  
  return _instanceIdQuery;
}

- (NSMutableDictionary *)secItemFormatToDictionary:(NSDictionary *)dictionaryToConvert {
  NSMutableDictionary *returnDictionary = [NSMutableDictionary dictionaryWithDictionary:dictionaryToConvert];
  returnDictionary[(id) kSecReturnData] = (id) kCFBooleanTrue;
  returnDictionary[(id) kSecClass] = (id) kSecClassGenericPassword;
  
  CFTypeRef itemDataRef = nil;
  
  if (!SecItemCopyMatching((CFDictionaryRef) returnDictionary, &itemDataRef)) {
    NSData *data = (__bridge NSData *) itemDataRef;
    
    [returnDictionary removeObjectForKey:(id) kSecReturnData];
    NSString *itemData = [[NSString alloc] initWithBytes:[data bytes] length:[data length] encoding:NSUTF8StringEncoding];
    returnDictionary[(id) kSecValueData] = itemData;
  }
  
  return returnDictionary;
}

- (NSMutableDictionary *)dictionaryToSecItemFormat:(NSDictionary *)dictionaryToConvert {
  NSMutableDictionary *returnDictionary = [NSMutableDictionary dictionaryWithDictionary:dictionaryToConvert];
  returnDictionary[(id) kSecClass] = (id) kSecClassGenericPassword;
  NSString *secDataString = dictionaryToConvert[(id) kSecValueData];
  returnDictionary[(id) kSecValueData] = [secDataString dataUsingEncoding:NSUTF8StringEncoding];
  
  return returnDictionary;
}

- (CFTypeRef)performQuery:(NSDictionary *)query {
  CFTypeRef outDictionaryRef = NULL;
  
  if (SecItemCopyMatching((CFDictionaryRef) query, &outDictionaryRef) == errSecSuccess)
    return outDictionaryRef;
  
  return NULL;
}



@end

