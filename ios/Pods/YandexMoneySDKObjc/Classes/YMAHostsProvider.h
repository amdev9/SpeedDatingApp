//
// Created by Alexander Mertvetsov on 20.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface YMAHostsProvider : NSObject

@property (nonatomic, copy, nonnull) NSString *moneyUrl;


+ (instancetype _Nonnull)sharedManager;

- (void)resetToDefaults;

@end
