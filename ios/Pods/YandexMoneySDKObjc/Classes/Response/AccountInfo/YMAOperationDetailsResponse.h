//
// Created by Alexander Mertvetsov on 23.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YMABaseResponse.h"
#import "YMAOperationDetailsModel.h"

@interface YMAOperationDetailsResponse : YMABaseResponse

@property (nonatomic, strong, readonly) YMAOperationDetailsModel *operationDetails;

@end