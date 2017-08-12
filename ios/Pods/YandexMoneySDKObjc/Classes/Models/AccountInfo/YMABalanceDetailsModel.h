//
// Created by Alexander Mertvetsov on 22.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface YMABalanceDetailsModel : NSObject

+ (nullable instancetype)balanceDetailsWithTotal:(NSString *_Nullable)total
                                       available:(NSString *_Nullable)available
                               depositionPending:(NSString *_Nullable)depositionPending
                                         blocked:(NSString *_Nullable)blocked
                                            debt:(NSString *_Nullable)debt
                                            hold:(NSString *_Nullable)hold;

@property (nonatomic, copy, readonly) NSString *total;
@property (nonatomic, copy, readonly) NSString *available;
@property (nonatomic, copy, readonly, nullable) NSString *depositionPending;
@property (nonatomic, copy, readonly, nullable) NSString *blocked;
@property (nonatomic, copy, readonly, nullable) NSString *debt;
@property (nonatomic, copy, readonly, nullable) NSString *hold;

@end

NS_ASSUME_NONNULL_END
