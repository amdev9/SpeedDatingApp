//
//  NSDictionary+YMATools.h
//  YandexMoney
//
//  Created by Александр О. Кургин on 02.04.15.
//  Copyright (c) 2015 NBCO Yandex.Money LLC. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSDictionary (YMATools)

- (nullable id)yma_objectForKey:(id)aKey;

- (nullable id)yma_objectForKey:(id)aKey defaultValue:(nullable id)defaultValue;

@end

NS_ASSUME_NONNULL_END