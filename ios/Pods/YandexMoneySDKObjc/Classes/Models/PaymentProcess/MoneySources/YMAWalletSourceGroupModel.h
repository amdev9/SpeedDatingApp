//
// Created by Alexander Mertvetsov on 21.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YMAMoneySourceModel.h"

@interface YMAWalletSourceGroupModel : NSObject

+ (instancetype)walletMoneySourceWithAllowed:(BOOL)allowed;

@property (nonatomic, assign, readonly) BOOL isAllowed;
@property (nonatomic, strong, readonly) YMAMoneySourceModel *moneySource;

@end