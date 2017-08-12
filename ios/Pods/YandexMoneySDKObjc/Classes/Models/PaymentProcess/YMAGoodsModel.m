//
// Created by Alexander Mertvetsov on 22.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAGoodsModel.h"


@implementation YMAGoodsModel

#pragma mark - Object Lifecycle

- (instancetype)initWithId:(NSString *)merchantArticleId serial:(NSString *)serial secret:(NSString *)secret
{
    self = [super init];

    if (self != nil) {
        _merchantArticleId = [merchantArticleId copy];
        _secret = [secret copy];
        _serial = [serial copy];
    }

    return self;
}

+ (instancetype)goodsWithId:(NSString *)merchantArticleId serial:(NSString *)serial secret:(NSString *)secret
{
    return [[YMAGoodsModel alloc] initWithId:merchantArticleId serial:serial secret:secret];
}

@end