//
// Created by Alexander Mertvetsov on 23.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YMABaseRequest.h"
#import "YMAHistoryOperationsResponse.h"

typedef NS_OPTIONS(NSUInteger, YMAHistoryOperationFilter) {
    YMAHistoryOperationFilterUnknown = 0,
    YMAHistoryOperationFilterDeposition = 1 << 0,
    YMAHistoryOperationFilterPayment = 1 << 1,
    YMAHistoryOperationFilterIncomingTransfersUnaccepted = 1 << 2
};

@interface YMAHistoryOperationsRequest : YMABaseRequest<YMAParametersPosting>

+ (instancetype)operationHistoryWithFilter:(YMAHistoryOperationFilter)filter
                                     label:(NSString *)label
                                      from:(NSDate *)from
                                      till:(NSDate *)till
                               startRecord:(NSString *)startRecord
                                   records:(NSString *)records;

@end