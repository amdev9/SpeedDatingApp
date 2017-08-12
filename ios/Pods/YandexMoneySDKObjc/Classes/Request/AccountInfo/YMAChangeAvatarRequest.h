//
// Created by Alexander Mertvetsov on 23.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YMABaseRequest.h"
#import "YMABaseProcessResponse.h"

@interface YMAChangeAvatarRequest : YMABaseRequest<YMADataPosting>

/// use only image in PNG format!
+ (instancetype)changeAvatarWithImageData:(NSData *)imageData;

@end