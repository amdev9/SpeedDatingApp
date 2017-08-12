//
// Created by Alexander Mertvetsov on 20.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAHostsProvider.h"

static NSString *const kDefaultMoneyUrl = @"money.yandex.ru";

@implementation YMAHostsProvider

#pragma mark - Object Lifecycle

+ (instancetype)sharedManager
{
    static id sharedMyManager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedMyManager = [[self alloc] init];
    });

    return sharedMyManager;
}

- (instancetype)init
{
    self = [super init];

    if (self != nil) {
        _moneyUrl = kDefaultMoneyUrl;
    }

    return self;
}

- (void)resetToDefaults {
    self.moneyUrl = kDefaultMoneyUrl;
}

@end
