//
// Created by Alexander Mertvetsov on 21.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YMABaseRequest.h"
#import "YMAPaymentResponse.h"

@interface YMAPaymentRequest : YMABaseRequest<YMAParametersPosting>

+ (instancetype)paymentWithPatternId:(NSString *)patternId paymentParameters:(NSDictionary *)paymentParams;

@end