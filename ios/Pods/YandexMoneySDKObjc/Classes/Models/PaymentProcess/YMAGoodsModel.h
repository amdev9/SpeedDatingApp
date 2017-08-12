//
// Created by Alexander Mertvetsov on 22.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface YMAGoodsModel : NSObject

+ (instancetype)goodsWithId:(NSString *)merchantArticleId serial:(NSString *)serial secret:(NSString *)secret;

@property (nonatomic, copy, readonly) NSString *merchantArticleId;
@property (nonatomic, copy, readonly) NSString *serial;
@property (nonatomic, copy, readonly) NSString *secret;

@end