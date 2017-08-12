//
// Created by Alexander Mertvetsov on 27.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YMABaseProcessResponse.h"

@interface YMAIncomingTransferAcceptResponse : YMABaseProcessResponse

@property (nonatomic, assign, readonly) NSInteger protectionCodeAttemptsAvailable;
@property (nonatomic, strong, readonly) NSURL *extActionUri;

@end