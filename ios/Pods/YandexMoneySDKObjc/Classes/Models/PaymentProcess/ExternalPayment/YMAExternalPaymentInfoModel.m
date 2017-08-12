//
//  Created by Alexander Mertvetsov on 10.02.14.
//  Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAExternalPaymentInfoModel.h"

@implementation YMAExternalPaymentInfoModel

#pragma mark - Object Lifecycle

- (instancetype)initPaymentRequestInfoWithId:(NSString *)requestId amount:(NSString *)amount title:(NSString *)title
{
    self = [super init];

    if (self != nil) {
        _requestId = [requestId copy];
        _amount = [amount copy];
        _title = [title copy];
    }

    return self;
}

+ (instancetype)paymentRequestInfoWithId:(NSString *)requestId amount:(NSString *)amount title:(NSString *)title
{
    return [[YMAExternalPaymentInfoModel alloc] initPaymentRequestInfoWithId:requestId amount:amount title:title];
}

@end
