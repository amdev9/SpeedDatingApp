//
// Created by Alexander Mertvetsov on 22.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMABalanceDetailsModel.h"

NS_ASSUME_NONNULL_BEGIN

@implementation YMABalanceDetailsModel

#pragma mark - Object Lifecycle

- (nullable instancetype)initWithTotal:(NSString *_Nullable)total
                             available:(NSString *_Nullable)available
                     depositionPending:(NSString *_Nullable)depositionPending
                               blocked:(NSString *_Nullable)blocked
                                  debt:(NSString *_Nullable)debt
                                  hold:(NSString *_Nullable)hold
{
    self = [super init];
    if (self != nil) {
        if (total == nil || available == nil) {
            return nil;
        }
        _total = [total copy];
        _available = [available copy];
        _depositionPending = [depositionPending copy];
        _blocked = [blocked copy];
        _debt = [debt copy];
        _hold = [hold copy];
    }
    return self;
}

+ (nullable instancetype)balanceDetailsWithTotal:(NSString *_Nullable)total
                                       available:(NSString *_Nullable)available
                               depositionPending:(NSString *_Nullable)depositionPending
                                         blocked:(NSString *_Nullable)blocked
                                            debt:(NSString *_Nullable)debt
                                            hold:(NSString *_Nullable)hold
{
    return [[YMABalanceDetailsModel alloc] initWithTotal:total
                                               available:available
                                       depositionPending:depositionPending
                                                 blocked:blocked
                                                    debt:debt
                                                    hold:hold];
}

@end

NS_ASSUME_NONNULL_END
