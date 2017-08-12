//
// Created by Alexander Mertvetsov on 22.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAProcessPaymentRequest.h"
#import "YMAMoneySourceModel.h"
#import "YMAHostsProvider.h"

NS_ASSUME_NONNULL_BEGIN

static NSString *const kParameterRequestId = @"request_id";
static NSString *const kParameterMoneySource = @"money_source";
static NSString *const kParameterCsc = @"csc";
static NSString *const kParameterExtAuthSuccessUri = @"ext_auth_success_uri";
static NSString *const kParameterExtAuthFailUri = @"ext_auth_fail_uri";

static NSString *const kUrlProcessPayment = @"api/process-payment";

@interface YMAProcessPaymentRequest ()

@property (nonatomic, copy) NSString *requestId;
@property (nonatomic, strong, nullable) YMAMoneySourceModel *moneySource;
@property (nonatomic, copy, nullable) NSString *csc;
@property (nonatomic, copy, nullable) NSString *successUri;
@property (nonatomic, copy, nullable) NSString *failUri;

@end

@implementation YMAProcessPaymentRequest

#pragma mark - Object Lifecycle

- (instancetype)initWithRequestId:(NSString *)requestId
                      moneySource:(YMAMoneySourceModel *__nullable)moneySource
                              csc:(NSString *__nullable)csc
                       successUri:(NSString *__nullable)successUri
                          failUri:(NSString *__nullable)failUri
{
    self = [super init];

    if (self != nil) {
        _requestId = [requestId copy];
        _moneySource = moneySource;
        _csc = [csc copy];
        _successUri = [successUri copy];
        _failUri = [failUri copy];
    }

    return self;
}

+ (instancetype)processPaymentRequestId:(NSString *)requestId
                            moneySource:(YMAMoneySourceModel *__nullable)moneySource
                                    csc:(NSString *__nullable)csc
                             successUri:(NSString *__nullable)successUri
                                failUri:(NSString *__nullable)failUri
{
    return [[YMAProcessPaymentRequest alloc] initWithRequestId:requestId
                                                   moneySource:moneySource
                                                           csc:csc
                                                    successUri:successUri
                                                       failUri:failUri];
}

#pragma mark - Overridden methods

- (NSURL *)requestUrl
{
    NSString *urlString =
        [NSString stringWithFormat:@"https://%@/%@", [YMAHostsProvider sharedManager].moneyUrl, kUrlProcessPayment];
    return [NSURL URLWithString:urlString];
}

- (nullable NSDictionary *)parameters
{
    NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];

    if (self.requestId != nil) {
        dictionary[kParameterRequestId] = self.requestId;
    }
    if (self.csc != nil) {
        dictionary[kParameterCsc] = self.csc;
    }
    if (self.successUri != nil) {
        dictionary[kParameterExtAuthSuccessUri] = self.successUri;
    }
    if (self.failUri != nil) {
        dictionary[kParameterExtAuthFailUri] = self.failUri;
    }

    if (self.moneySource.type == YMAMoneySourceWallet) {
        dictionary[kParameterMoneySource] = @"wallet";
    }
    else if (self.moneySource.type == YMAMoneySourcePaymentCard) {
        dictionary[kParameterMoneySource] = [NSString stringWithFormat:@"%@", self.moneySource.moneySourceToken];
    }
    
    return dictionary;
}

- (NSOperation *)buildResponseOperationWithData:(NSData *)data
                                        headers:(NSDictionary *__nullable)headers
                                     completion:(YMAResponseHandler __nullable)handler
{
    return [[YMAProcessPaymentResponse alloc] initWithData:data headers:headers completion:handler];
}

@end

NS_ASSUME_NONNULL_END
