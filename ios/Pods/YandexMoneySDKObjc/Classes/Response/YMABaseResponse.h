//
// Created by Alexander Mertvetsov on 20.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YMABaseSession.h"

NS_ASSUME_NONNULL_BEGIN

/// Values for YMAResponseStatus
/// Status of process payment
typedef NS_ENUM(NSInteger, YMAResponseStatus) {
    YMAResponseStatusUnknown,

    /// Payment processing completed successfully
        YMAResponseStatusSuccess,
    /// The refusal of the payment.
    /// The reason of failure is returned in the error.
    /// This is the end state of the payment.
        YMAResponseStatusRefused,
    /// Payment processing is not yet complete.
    /// The application should retry the request with the same parameters
    /// later time specified in the nextRetry property.
        YMAResponseStatusInProgress,
    /// To complete the processing of payment requires additional authorization
    /// (you should open the WebView and send the client to uri + params specified in YMAAscModel)
        YMAResponseStatusExtAuthRequired,

        YMAResponseStatusHoldForPickup
};

@class YMABaseResponse;


typedef void (^YMAResponseHandler)(YMABaseResponse * _Nullable response, NSError * _Nullable error);

///
/// Abstract class of response. This class contains common info about the response (status, nextRetry).
///
@interface YMABaseResponse : NSOperation

@property (nonatomic, assign, readonly) YMAConnectHTTPStatusCodes statusCode;

/// Constructor. Returns a YMABaseResponse with the specified data and completion of block.
/// @param data - response data.
/// @param headers - response headers.
/// @param httpStatusCode - response htttp status code.
/// @param block - completion of block is used to get the response.
- (instancetype)initWithData:(NSData * _Nullable)data
                     headers:(NSDictionary * _Nullable)headers
              httpStatusCode:(YMAConnectHTTPStatusCodes)statusCode
                  completion:(YMAResponseHandler _Nullable)block;

- (instancetype)initWithData:(NSData * _Nullable)data
                     headers:(NSDictionary * _Nullable)headers
                  completion:(YMAResponseHandler _Nullable)block;

- (BOOL)parseJSONModel:(id _Nullable)responseModel
               headers:(NSDictionary * _Nullable)headers
                 error:(NSError * __autoreleasing * _Nullable)error;

@end

NS_ASSUME_NONNULL_END