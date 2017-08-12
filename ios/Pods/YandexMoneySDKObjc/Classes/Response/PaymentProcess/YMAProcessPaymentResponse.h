//
// Created by Alexander Mertvetsov on 22.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YMABaseProcessResponse.h"
#import "YMAPaymentResultModel.h"

@interface YMAProcessPaymentResponse : YMABaseProcessResponse

+ (YMADigitalGoodsModel *)digitalGoodsByModel:(id)digitalGoodsModel;

@property (nonatomic, strong, readonly) YMAPaymentResultModel *paymentResultInfo;

@end