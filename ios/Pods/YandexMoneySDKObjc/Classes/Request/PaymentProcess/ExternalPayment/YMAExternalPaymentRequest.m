//
// Created by Alexander Mertvetsov on 28.01.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAExternalPaymentRequest.h"
#import "YMAHostsProvider.h"
#import "YMAConstants.h"

static NSString *const kUrlExternalPayment = @"api/request-external-payment";


@interface YMAExternalPaymentRequest ()

@property (nonatomic, copy) NSString *patternId;
@property (nonatomic, strong) NSDictionary *paymentParams;

@end

@implementation YMAExternalPaymentRequest

#pragma mark - Object Lifecycle

- (instancetype)initWithPatternId:(NSString *)patternId paymentParameters:(NSDictionary *)paymentParams
{
    self = [super init];

    if (self != nil) {
        _patternId = [patternId copy];
        _paymentParams = paymentParams;
    }

    return self;
}

+ (instancetype)externalPaymentWithPatternId:(NSString *)patternId paymentParameters:(NSDictionary *)paymentParams
{
    return [[YMAExternalPaymentRequest alloc] initWithPatternId:patternId paymentParameters:paymentParams];
}

#pragma mark - Overridden methods

- (NSURL *)requestUrl
{
    NSString *urlString =
        [NSString stringWithFormat:@"https://%@/%@", [YMAHostsProvider sharedManager].moneyUrl, kUrlExternalPayment];
    return [NSURL URLWithString:urlString];
}

- (NSDictionary *)parameters
{
    NSMutableDictionary *dictionary = [NSMutableDictionary dictionaryWithDictionary:self.paymentParams];
    if (self.patternId != nil) {
        dictionary[YMAPaymentParameterPatternId] = self.patternId;
    }
    return dictionary;
}

- (NSOperation *)buildResponseOperationWithData:(NSData *)data
                                        headers:(NSDictionary *)headers
                                     completion:(YMAResponseHandler)handler
{
    return [[YMAExternalPaymentResponse alloc] initWithData:data headers:headers completion:handler];
}

@end