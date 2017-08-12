//
// Created by Alexander Mertvetsov on 22.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAAccountInfoRequest.h"
#import "YMAHostsProvider.h"

static NSString *const kUrlAccountInfo = @"api/account-info";

@implementation YMAAccountInfoRequest

@synthesize parameters;

#pragma mark - Object Lifecycle

+ (instancetype)accountInfoRequest
{
    return [[self alloc] init];
}

#pragma mark - Overridden methods

- (NSURL *)requestUrl
{
    NSString *urlString =
        [NSString stringWithFormat:@"https://%@/%@", [YMAHostsProvider sharedManager].moneyUrl, kUrlAccountInfo];
    return [NSURL URLWithString:urlString];
}

- (NSOperation *)buildResponseOperationWithData:(NSData *)data headers:(NSDictionary *)headers completion:(YMAResponseHandler)handler
{
    return [[YMAAccountInfoResponse alloc] initWithData:data headers:headers completion:handler];
}

@end
