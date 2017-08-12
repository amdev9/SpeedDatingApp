//
// Created by Alexander Mertvetsov on 21.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAWalletSourceGroupModel.h"

@implementation YMAWalletSourceGroupModel

- (instancetype)initWithMoneySource:(YMAMoneySourceModel *)moneySource allowed:(BOOL)allowed
{
    self = [super init];

    if (self != nil) {
        _isAllowed = allowed;
        _moneySource = moneySource;
    }

    return self;
}

+ (instancetype)walletMoneySourceWithAllowed:(BOOL)allowed
{
    YMAMoneySourceModel *moneySourceModel = [YMAMoneySourceModel moneySourceWithType:YMAMoneySourceWallet
                                                                            cardType:YMAPaymentCardUnknown
                                                                         panFragment:nil
                                                                    moneySourceToken:nil];

    return [[YMAWalletSourceGroupModel alloc] initWithMoneySource:moneySourceModel allowed:allowed];
}

@end