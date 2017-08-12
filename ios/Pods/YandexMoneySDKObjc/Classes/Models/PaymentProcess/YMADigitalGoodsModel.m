//
// Created by Alexander Mertvetsov on 22.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMADigitalGoodsModel.h"


@implementation YMADigitalGoodsModel

#pragma mark - Object Lifecycle

- (instancetype)initWithArticle:(NSArray *)article bonus:(NSArray *)bonus
{
    self = [super init];

    if (self != nil) {
        _article = article;
        _bonus = bonus;
    }

    return self;
}

+ (instancetype)digitalGoodsWithArticle:(NSArray *)article bonus:(NSArray *)bonus
{
    return [[YMADigitalGoodsModel alloc] initWithArticle:article bonus:bonus];
}

@end