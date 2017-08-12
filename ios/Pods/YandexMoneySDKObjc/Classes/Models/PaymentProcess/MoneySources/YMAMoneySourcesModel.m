//
// Created by Alexander Mertvetsov on 21.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAMoneySourcesModel.h"

NS_ASSUME_NONNULL_BEGIN

@implementation YMAMoneySourcesModel

#pragma mark - Object Lifecycle

- (nullable instancetype)initWithWallet:(YMAWalletSourceGroupModel *_Nullable)walletSource cardsSource:(YMACardsSourceGroupModel *_Nullable)cards
{
    self = [super init];
    if (self != nil) {
        if (walletSource == nil && cards == nil) {
            return nil;
        }
        _wallet = walletSource;
        _cards = cards;
    }
    return self;
}

+ (nullable instancetype)moneySourcesWithWallet:(YMAWalletSourceGroupModel *_Nullable)walletSource
                           cardsSource:(YMACardsSourceGroupModel *_Nullable)cards
{
    return [[YMAMoneySourcesModel alloc] initWithWallet:walletSource cardsSource:cards];
}

@end

NS_ASSUME_NONNULL_END
