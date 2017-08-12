//
// Created by Alexander Mertvetsov on 21.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMACardsSourceGroupModel.h"


@implementation YMACardsSourceGroupModel

#pragma mark - Object Lifecycle

- (instancetype)initWithCards:(NSArray *)cards
                  defaultCard:(YMAMoneySourceModel *)defaultCard
                  cscRequired:(BOOL)cscRequired
                      allowed:(BOOL)allowed
{
    self = [self init];

    if (self != nil) {
        _cards = [cards copy];
        _defaultCard = defaultCard;
        _isAllowed = allowed;
        _isCscRequired = cscRequired;
    }

    return self;
}

+ (instancetype)cardsSourceWithCards:(NSArray *)cards
                         defaultCard:(YMAMoneySourceModel *)defaultCard
                         cscRequired:(BOOL)cscRequired
                             allowed:(BOOL)allowed
{
    return [[YMACardsSourceGroupModel alloc] initWithCards:cards
                                               defaultCard:defaultCard
                                               cscRequired:cscRequired
                                                   allowed:allowed];
}

@end