//
// Created by Alexander Mertvetsov on 27.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAIncomingTransferAcceptRequest.h"
#import "YMAHostsProvider.h"

static NSString *const kUrlIncomingTransferAccept = @"api/incoming-transfer-accept";
static NSString *const kParameterOperationId = @"operation_id";
static NSString *const kParameterProtectionCode = @"protection_code";

@interface YMAIncomingTransferAcceptRequest ()

@property (nonatomic, copy) NSString *operationId;
@property (nonatomic, copy) NSString *protectionCode;

@end

@implementation YMAIncomingTransferAcceptRequest

#pragma mark - Object Lifecycle

- (instancetype)initWithOperationId:(NSString *)operationId protectionCode:(NSString *)protectionCode
{
    self = [super init];

    if (self != nil) {
        _operationId = [operationId copy];
        _protectionCode = [protectionCode copy];
    }

    return self;
}

+ (instancetype)acceptIncomingTransferWithOperationId:(NSString *)operationId protectionCode:(NSString *)protectionCode
{
    return [[YMAIncomingTransferAcceptRequest alloc] initWithOperationId:operationId protectionCode:protectionCode];
}

#pragma mark - Overridden methods

- (NSURL *)requestUrl
{
    NSString *urlString = [NSString stringWithFormat:@"https://%@/%@",
                                                     [YMAHostsProvider sharedManager].moneyUrl,
                                                     kUrlIncomingTransferAccept];
    return [NSURL URLWithString:urlString];
}

- (NSDictionary *)parameters
{
    NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
    if (self.operationId != nil) {
        dictionary[kParameterOperationId] = self.operationId;
    }
    if (self.protectionCode != nil) {
        dictionary[kParameterProtectionCode] = self.protectionCode;
    }
    return dictionary;
}

- (NSOperation *)buildResponseOperationWithData:(NSData *)data headers:(NSDictionary *)headers completion:(YMAResponseHandler)handler
{
    return [[YMAIncomingTransferAcceptResponse alloc] initWithData:data headers:headers completion:handler];
}

@end