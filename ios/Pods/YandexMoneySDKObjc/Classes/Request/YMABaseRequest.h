//
//  YMABaseRequest.h
//
//  Created by Alexander Mertvetsov on 01.11.13.
//  Copyright (c) 2013 Yandex.Money. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YMAConstants.h"
#import "YMABaseSession.h"

NS_ASSUME_NONNULL_BEGIN

@class YMABaseRequest;
@class YMABaseResponse;

@protocol YMADataPosting<NSObject>

/// Request data
@property (nonatomic, strong, readonly, nullable) NSData *data;

@end

@protocol YMAParametersPosting<NSObject>

/// Request parameters.
@property (nonatomic, strong, readonly, nullable) NSDictionary *parameters;

@end

/// Completion of block is used to get the response.
/// @param request - request inherited from abstract class YMABaseRequest.
/// @param response - response inherited from abstract class YMABaseResponse.
/// @param error - Error information or nil.
typedef void (^YMARequestHandler)( YMABaseRequest * _Nullable request, YMABaseResponse * _Nullable response, NSError * _Nullable error);

typedef BOOL (^YMARedirectHandler)(NSURLRequest * _Nullable request, NSURLResponse * _Nullable response);

///
/// Abstract class of request. This class contains common info about the request (requestUrl, parameters).
///
@interface YMABaseRequest : NSObject

/// Request url
@property (nonatomic, strong, readonly, nonnull) NSURL *requestUrl;
@property (nonatomic, strong, nullable) id context;

@property (nonatomic, assign, readonly) YMARequestMethod requestMethod;
/// Used for define custom headers of request.
@property (nonatomic, strong, readonly, nullable) NSDictionary *customHeaders;

/// Method is used for parse response data.
/// @param data - response data.
/// @param headers - response headers.
/// @param httpStatusCode - response http status ceode.
/// @param queue - operation queue.
/// @param block - completion of block is used to get the response.
- (void)buildResponseWithData:(NSData * _Nullable)data
                      headers:(NSDictionary * _Nullable)headers
               httpStatusCode:(YMAConnectHTTPStatusCodes)statusCode
                        queue:(NSOperationQueue * _Nonnull)queue
                   completion:(YMARequestHandler _Nullable)block;

@end

NS_ASSUME_NONNULL_END
