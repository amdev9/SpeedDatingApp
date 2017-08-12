//
// Created by Alexander Mertvetsov on 21.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YMAWalletSourceGroupModel.h"
#import "YMAMoneySourceModel.h"
#import "YMACardsSourceGroupModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface YMAMoneySourcesModel : NSObject

+ (nullable instancetype)moneySourcesWithWallet:(YMAWalletSourceGroupModel *_Nullable)walletSource
                                    cardsSource:(YMACardsSourceGroupModel *_Nullable)cards;

@property (nonatomic, strong, readonly, nullable) YMAWalletSourceGroupModel *wallet;
@property (nonatomic, strong, readonly, nullable) YMACardsSourceGroupModel *cards;

@end

NS_ASSUME_NONNULL_END
