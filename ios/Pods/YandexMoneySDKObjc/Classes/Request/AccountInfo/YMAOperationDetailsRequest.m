//
// Created by Alexander Mertvetsov on 23.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAOperationDetailsRequest.h"
#import "YMAHostsProvider.h"

static NSString *const kParameterOperationId = @"operation_id";
static NSString *const kParameterFavoriteId = @"favourite_id";
static NSString *const kParameterRequestRepeatInfo = @"request_repeat_info";

static NSString *const kUrlOperationDetails = @"api/operation-details";

@interface YMAOperationDetailsRequest ()

@property (nonatomic, copy) NSString *operationId;
@property (nonatomic, copy) NSString *favoriteId;
@property (nonatomic, assign) BOOL requestRepeatInfo;

@end

@implementation YMAOperationDetailsRequest

#pragma mark - Object Lifecycle

- (instancetype)initWithOperationId:(NSString *)operationId
                        favoriteId:(NSString *)favoriteId
                  requestRepeatInfo:(BOOL)requestRepeatInfo
{
    self = [super init];

    if (self != nil) {
        _operationId = [operationId copy];
        _favoriteId = [favoriteId copy];
        _requestRepeatInfo = requestRepeatInfo;
    }

    return self;
}

+ (instancetype)operationDetailsWithRepeatInfoByOperationId:(NSString *)operationId
{
    return [[self alloc] initWithOperationId:operationId favoriteId:nil requestRepeatInfo:YES];
}

+ (instancetype)operationDetailsWithOperationId:(NSString *)operationId
{
    return [[self alloc] initWithOperationId:operationId favoriteId:nil requestRepeatInfo:NO];
}

+ (instancetype)operationDetailsWithFavoriteId:(NSString *)favoriteId
{
    return [[self alloc] initWithOperationId:nil favoriteId:favoriteId requestRepeatInfo:YES];
}

#pragma mark - Overridden methods

- (NSURL *)requestUrl
{
    NSString *urlString =
        [NSString stringWithFormat:@"https://%@/%@", [YMAHostsProvider sharedManager].moneyUrl, kUrlOperationDetails];
    return [NSURL URLWithString:urlString];
}

- (NSDictionary *)parameters
{
    NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];

    if (self.operationId != nil) {
        dictionary[kParameterOperationId] = self.operationId;
    }
    if (self.favoriteId != nil) {
        dictionary[kParameterFavoriteId] = self.favoriteId;
    }
    dictionary[kParameterRequestRepeatInfo] = self.requestRepeatInfo ? @"true" : @"false";

    return dictionary;
}

- (NSOperation *)buildResponseOperationWithData:(NSData *)data headers:(NSDictionary *)headers completion:(YMAResponseHandler)handler
{
    return [[YMAOperationDetailsResponse alloc] initWithData:data headers:headers completion:handler];
}

@end
