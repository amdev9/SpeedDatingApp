//
// Created by Alexander Mertvetsov on 29.01.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAAscModel.h"


@implementation YMAAscModel

#pragma mark - Object Lifecycle

- (instancetype)initWithUrl:(NSURL *)url parameters:(NSDictionary *)params
{
    self = [super init];

    if (self != nil) {
        _url = url;
        _params = params;
    }

    return self;
}

+ (instancetype)ascWithUrl:(NSURL *)url parameters:(NSDictionary *)params
{
    return [[YMAAscModel alloc] initWithUrl:url parameters:params];
}

@end