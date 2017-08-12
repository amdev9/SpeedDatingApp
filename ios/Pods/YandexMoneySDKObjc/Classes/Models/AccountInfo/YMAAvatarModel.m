//
// Created by Alexander Mertvetsov on 22.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAAvatarModel.h"


@implementation YMAAvatarModel

#pragma mark - Object Lifecycle

- (instancetype)initWithUrl:(NSURL *)url timeStamp:(NSDate *)timeStamp
{
    self = [super init];

    if (self != nil) {
        _url = url;
        _timeStamp = timeStamp;
    }

    return self;
}

+ (instancetype)avatarWithUrl:(NSURL *)url timeStamp:(NSDate *)timeStamp
{
    return [[YMAAvatarModel alloc] initWithUrl:url timeStamp:timeStamp];
}

@end