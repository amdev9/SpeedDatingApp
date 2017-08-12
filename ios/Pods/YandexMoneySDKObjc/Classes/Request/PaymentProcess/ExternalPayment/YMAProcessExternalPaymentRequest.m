//
// Created by Alexander Mertvetsov on 28.01.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAProcessExternalPaymentRequest.h"
#import "YMAHostsProvider.h"

static NSString *const kUrlProcessExternalPayment = @"api/process-external-payment";

static NSString *const kParameterRequestId = @"request_id";
static NSString *const kParameterSuccessUri = @"ext_auth_success_uri";
static NSString *const kParameterFailUri = @"ext_auth_fail_uri";
static NSString *const kParameterRequestToken = @"request_token";
static NSString *const kParameterMoneySourceToken = @"money_source_token";
static NSString *const kParameterCsc = @"csc";

@interface YMAProcessExternalPaymentRequest ()

@property (nonatomic, copy) NSString *requestId;
@property (nonatomic, copy) NSString *successUri;
@property (nonatomic, copy) NSString *failUri;
@property (nonatomic, assign) BOOL requestToken;
@property (nonatomic, copy) NSString *moneySourceToken;
@property (nonatomic, copy) NSString *csc;

@end

@implementation YMAProcessExternalPaymentRequest

#pragma mark - Object Lifecycle

- (instancetype)initWithRequestId:(NSString *)requestId
             successUri:(NSString *)successUri
                failUri:(NSString *)failUri
           requestToken:(BOOL)requestToken
       moneySourceToken:(NSString *)moneySourceToken
                 csc:(NSString *)csc
{
    self = [super init];

    if (self != nil) {
        _requestId = [requestId copy];
        _successUri = [successUri copy];
        _failUri = [failUri copy];
        _requestToken = requestToken;
        _moneySourceToken = [moneySourceToken copy];
        _csc = [csc copy];
    }

    return self;
}

+ (instancetype)processExternalPaymentWithRequestId:(NSString *)requestId
                                         successUri:(NSString *)successUri
                                            failUri:(NSString *)failUri
                                       requestToken:(BOOL)requestToken
{
    return [[self alloc] initWithRequestId:requestId
                                                            successUri:successUri
                                                               failUri:failUri
                                                          requestToken:requestToken
                                                      moneySourceToken:nil
                                                                   csc:nil];
}

+ (instancetype)processExternalPaymentWithRequestId:(NSString *)requestId
                                         successUri:(NSString *)successUri
                                            failUri:(NSString *)failUri
                                   moneySourceToken:(NSString *)moneySourceToken
                                                csc:(NSString *)csc
{
    return [[self alloc] initWithRequestId:requestId
                                                            successUri:successUri
                                                               failUri:failUri
                                                          requestToken:NO
                                                      moneySourceToken:moneySourceToken
                                                                csc:csc];
}

+ (instancetype)processExternalPaymentWithRequestId:(NSString *)requestId
                                         successUri:(NSString *)successUri
                                            failUri:(NSString *)failUri
                                       requestToken:(BOOL)requestToken
                                   moneySourceToken:(NSString *)moneySourceToken
                                                csc:(NSString *)csc
{
    return [[self alloc] initWithRequestId:requestId
                                successUri:successUri
                                   failUri:failUri
                              requestToken:requestToken
                          moneySourceToken:moneySourceToken
                                       csc:csc];
}

#pragma mark - Overridden methods

- (NSURL *)requestUrl
{
    NSString *urlString = [NSString stringWithFormat:@"https://%@/%@",
                                                     [YMAHostsProvider sharedManager].moneyUrl,
                                                     kUrlProcessExternalPayment];
    return [NSURL URLWithString:urlString];
}

- (NSDictionary *)parameters
{
    NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
    if (self.requestId != nil) {
        dictionary[kParameterRequestId] = self.requestId;
    }
    if (self.successUri != nil) {
        dictionary[kParameterSuccessUri] = self.successUri;
    }
    if (self.failUri != nil) {
        dictionary[kParameterFailUri] = self.failUri;
    }

    if (self.moneySourceToken == nil) {
        if (self.requestToken) {
            dictionary[kParameterRequestToken] = @"true";
        }
        
        return dictionary;
    }

    if (self.moneySourceToken != nil) {
        dictionary[kParameterMoneySourceToken] = self.moneySourceToken;
    }
    if (self.csc != nil) {
        dictionary[kParameterCsc] = self.csc;
    }

    return dictionary;
}

- (NSOperation *)buildResponseOperationWithData:(NSData *)data headers:(NSDictionary *)headers completion:(YMAResponseHandler)handler
{
    return [[YMAProcessExternalPaymentResponse alloc] initWithData:data headers:headers completion:handler];
}

@end