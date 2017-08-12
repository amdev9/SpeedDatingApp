//
// Created by Alexander Mertvetsov on 21.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YMABaseProcessResponse.h"
#import "YMAPaymentInfoModel.h"

@interface YMAPaymentResponse : YMABaseProcessResponse

@property (nonatomic, strong, readonly) YMAPaymentInfoModel *paymentInfo;

@end