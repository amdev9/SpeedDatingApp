//
// Created by Alexander Mertvetsov on 27.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAIncomingTransferRejectRequest.h"
#import "YMAHostsProvider.h"

static NSString *const kUrlIncomingTransferReject = @"api/incoming-transfer-reject";
static NSString *const kParameterOperationId = @"operation_id";

@interface YMAIncomingTransferRejectRequest ()

@property (nonatomic, copy) NSString *operationId;

@end

@implementation YMAIncomingTransferRejectRequest

#pragma mark - Object Lifecycle

- (instancetype)initWithOperationId:(NSString *)operationId
{
    self = [super init];

    if (self != nil) {
        _operationId = [operationId copy];
    }

    return self;
}

+ (instancetype)rejectIncomingTransferWithOperationId:(NSString *)operationId
{
    return [[YMAIncomingTransferRejectRequest alloc] initWithOperationId:operationId];
}

#pragma mark - Overridden methods

- (NSURL *)requestUrl
{
    NSString *urlString = [NSString stringWithFormat:@"https://%@/%@",
                                                     [YMAHostsProvider sharedManager].moneyUrl,
                                                     kUrlIncomingTransferReject];
    return [NSURL URLWithString:urlString];
}

- (NSDictionary *)parameters
{
    NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
    if (self.operationId != nil) {
        dictionary[kParameterOperationId] = self.operationId;
    }
    return dictionary;
}

- (NSOperation *)buildResponseOperationWithData:(NSData *)data
                                        headers:(NSDictionary *)headers
                                     completion:(YMAResponseHandler)handler
{
    return [[YMABaseProcessResponse alloc] initWithData:data headers:headers completion:handler];
}

@end