//
//  YMABaseRequest.m
//
//  Created by Alexander Mertvetsov on 01.11.13.
//  Copyright (c) 2013 Yandex.Money. All rights reserved.
//

#import "YMABaseRequest.h"
#import "YMABaseResponse.h"

@implementation YMABaseRequest

- (void)buildResponseWithData:(NSData *)data
                      headers:(NSDictionary *)headers
               httpStatusCode:(YMAConnectHTTPStatusCodes)statusCode
                        queue:(NSOperationQueue *)queue
                   completion:(YMARequestHandler)block
{
    NSOperation *operation =
    [self buildResponseOperationWithData:data
                                 headers:headers
                          httpStatusCode:statusCode
                              completion:^(YMABaseResponse *response, NSError *error) {
                                  block(self, response, error);
                              }];

    if (operation == nil) {
        block(self, nil, [NSError errorWithDomain:YMAErrorDomainUnknown code:0 userInfo:nil]);
        return;
    }

    [queue addOperation:operation];
}

- (NSOperation *)buildResponseOperationWithData:(NSData *)data
                                        headers:(NSDictionary *)headers
                                 httpStatusCode:(YMAConnectHTTPStatusCodes)statusCode
                                     completion:(YMAResponseHandler)handler
{
    return [self buildResponseOperationWithData:data headers:headers completion:handler];
}

- (NSOperation *)buildResponseOperationWithData:(NSData *)data
                                        headers:(NSDictionary *)headers
                                     completion:(YMAResponseHandler)handler
{
    NSString *reason = [NSString stringWithFormat:@"%@ must be overridden", NSStringFromSelector(_cmd)];
    @throw [NSException exceptionWithName:NSInternalInconsistencyException reason:reason userInfo:nil];
}

- (YMARequestMethod)requestMethod
{
    return YMARequestMethodPost;
}

@end
