//
// Created by Alexander Mertvetsov on 22.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YMABaseRequest.h"
#import "YMAProcessPaymentResponse.h"

NS_ASSUME_NONNULL_BEGIN

@class YMAMoneySourceModel;

@interface YMAProcessPaymentRequest : YMABaseRequest<YMAParametersPosting>

+ (instancetype)processPaymentRequestId:(NSString *)requestId
                            moneySource:(YMAMoneySourceModel *__nullable)moneySource
                                    csc:(NSString *__nullable)csc
                             successUri:(NSString *__nullable)successUri
                                failUri:(NSString *__nullable)failUri;

@end

NS_ASSUME_NONNULL_END
