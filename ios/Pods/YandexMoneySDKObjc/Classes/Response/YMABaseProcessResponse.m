//
//  Created by Alexander Mertvetsov on 01.11.13.
//  Copyright (c) 2013 Yandex.Money. All rights reserved.
//

#import "YMABaseProcessResponse.h"
#import "YMAConstants.h"

static NSString *const kKeyResponseStatusRefused         = @"refused";
static NSString *const kKeyResponseStatusInProgress      = @"in_progress";
static NSString *const kKeyResponseStatusExtAuthRequired = @"ext_auth_required";
static NSString *const kKeyResponseStatusHoldForPickup   = @"hold_for_pickup";
static NSString *const kKeyResponseStatusSuccess         = @"success";

static NSString *const kParameterStatus            = @"status";
static NSString *const kParameterError             = @"error";
static NSString *const kParameterNextRetry         = @"next_retry";
static NSString *const kParameterAccountUnblockUri = @"account_unblock_uri";


@interface YMABaseProcessResponse()

@property (nonatomic, assign) YMAResponseStatus status;
@property (nonatomic, assign) NSUInteger nextRetry;
@property (nonatomic, copy) NSString *accountUnblockUri;

@end


@implementation YMABaseProcessResponse


#pragma mark - Object Lifecycle

- (instancetype)init
{
    self = [super init];

    if (self != nil) {
        _nextRetry = 0;
        _status = YMAResponseStatusUnknown;
    }

    return self;
}


#pragma mark - Overridden methods

- (BOOL)parseJSONModel:(id)responseModel headers:(NSDictionary *)headers error:(NSError * __autoreleasing *)error
{
    if ([responseModel isKindOfClass:[NSDictionary class]]) {
        NSString *statusKey = responseModel[kParameterStatus];
        self.status = [self statusFromString:statusKey];
        NSString *accountUnblockUri = responseModel[kParameterAccountUnblockUri];
        self.accountUnblockUri = [accountUnblockUri copy];

        if (self.status == YMAResponseStatusInProgress) {
            NSString *nextRetryString = responseModel[kParameterNextRetry];
            self.nextRetry = (NSUInteger)[nextRetryString integerValue];
        }
        else if (self.status == YMAResponseStatusRefused) {
            NSString *errorCode = responseModel[kParameterError];
            if (error != NULL) {
                *error = [self errorWithApiErrorCode:errorCode];
            }
        }
    }

    return YES;
}


#pragma mark - Public methods

- (YMAResponseStatus)statusFromString:(NSString *)statusString
{
    YMAResponseStatus status = YMAResponseStatusUnknown;

    if ([statusString isEqualToString:kKeyResponseStatusSuccess]) {
        status = YMAResponseStatusSuccess;
    }
    else if ([statusString isEqualToString:kKeyResponseStatusInProgress]) {
        status = YMAResponseStatusInProgress;
    }
    else if ([statusString isEqualToString:kKeyResponseStatusRefused]) {
        status = YMAResponseStatusRefused;
    }
    else if ([statusString isEqualToString:kKeyResponseStatusExtAuthRequired]) {
        status = YMAResponseStatusExtAuthRequired;
    }
    else if ([statusString isEqualToString:kKeyResponseStatusHoldForPickup]) {
        status = YMAResponseStatusHoldForPickup;
    }

    return status;
}

- (NSError *)errorWithApiErrorCode:(NSString *)errorCode
{
    NSError *error = nil;
    if (errorCode != nil) {
        error = [NSError errorWithDomain:YMAErrorDomainYaMoneyAPI
                                     code:0
                                 userInfo:@{YMAErrorKey : errorCode, YMAErrorKeyResponse : self}];
    }
    else  {
        error = [NSError errorWithDomain:YMAErrorDomainUnknown
                                     code:0
                                 userInfo:@{YMAErrorKeyResponse : self}];
    }
    return error;
}

@end
