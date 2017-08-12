//
// Created by Alexander Mertvetsov on 21.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAPaymentRequest.h"
#import "YMAHostsProvider.h"
#import "YMAConstants.h"

static NSString *const kUrlPayment = @"api/request-payment";


@interface YMAPaymentRequest ()

@property (nonatomic, copy) NSString *patternId;
@property (nonatomic, strong) NSDictionary *paymentParams;

@end

@implementation YMAPaymentRequest

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

+ (instancetype)paymentWithPatternId:(NSString *)patternId paymentParameters:(NSDictionary *)paymentParams
{
    return [[YMAPaymentRequest alloc] initWithPatternId:patternId paymentParameters:paymentParams];
}

#pragma mark - Overridden methods

- (NSURL *)requestUrl
{
    NSString *urlString =
        [NSString stringWithFormat:@"https://%@/%@", [YMAHostsProvider sharedManager].moneyUrl, kUrlPayment];
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

- (NSOperation *)buildResponseOperationWithData:(NSData *)data headers:(NSDictionary *)headers completion:(YMAResponseHandler)handler
{
    return [[YMAPaymentResponse alloc] initWithData:data headers:headers completion:handler];
}

@end