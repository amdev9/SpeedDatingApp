//
//  Created by Alexander Mertvetsov on 01.11.13.
//  Copyright (c) 2013 Yandex.Money. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YMABaseResponse.h"

///
/// Abstract class of response. This class contains common info about the response (status, nextRetry).
///
@interface YMABaseProcessResponse : YMABaseResponse

/// Status of process payment.
@property (nonatomic, assign, readonly) YMAResponseStatus status;
/// Recommended time later that you should repeat the request in milliseconds.
/// The property is not equal to zero for status = YMAResponseStatusInProgress.
@property (nonatomic, assign, readonly) NSUInteger nextRetry;

@property (nonatomic, copy, readonly) NSString *accountUnblockUri;

- (YMAResponseStatus)statusFromString:(NSString *)statusString;
- (NSError *)errorWithApiErrorCode:(NSString *)errorCode;

@end
