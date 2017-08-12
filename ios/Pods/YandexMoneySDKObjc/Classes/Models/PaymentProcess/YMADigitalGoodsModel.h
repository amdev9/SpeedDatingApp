//
// Created by Alexander Mertvetsov on 22.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YMAGoodsModel.h"

@interface YMADigitalGoodsModel : NSObject

+ (instancetype)digitalGoodsWithArticle:(NSArray *)article bonus:(NSArray *)bonus;

@property (nonatomic, strong, readonly) NSArray *article;
@property (nonatomic, strong, readonly) NSArray *bonus;

@end