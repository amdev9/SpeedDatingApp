//
// Created by Alexander Mertvetsov on 28.01.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YMABaseRequest.h"
#import "YMAExternalPaymentResponse.h"

///
/// Payment request. First phase of payment is required to obtain payment info (YMAExternalPaymentInfoModel)
/// using patternId and paymentParams.
///
@interface YMAExternalPaymentRequest : YMABaseRequest<YMAParametersPosting>

/// Constructor. Returns a YMAExternalPaymentRequest with the specified patternId and paymentParams.
/// @param patternId - ID of showcase on which payment is made.
/// @param paymentParams - payment parameters.
+ (instancetype)externalPaymentWithPatternId:(NSString *)patternId paymentParameters:(NSDictionary *)paymentParams;

@end