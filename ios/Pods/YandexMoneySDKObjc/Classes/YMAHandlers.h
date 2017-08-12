/*!
 @class YMAHandlers
 @version 4.3
 @author Dmitry Shakolo
 @creation_date 09.12.2015
 @copyright Copyright (c) 2015 NBCO Yandex.Money LLC. All rights reserved.
 @discussion SDK handlers
 */

@import Foundation;

NS_ASSUME_NONNULL_BEGIN

/// Completion of block is used to get the ID of an installed copy of the application.
/// @param instanceId - ID of an installed copy of the application.
typedef void (^YMAIdHandler)(NSString *__nullable instanceId, NSError *__nullable error);

/// Completion block used by several methods of YMAExternalPaymentSession.
/// @param error - Error information or nil.
typedef void (^YMAHandler)(NSError *__nullable error);

/// Completion block used by handle challenge in NSURLSessionDelegate method
typedef NSURLSessionAuthChallengeDisposition (^YMASessionDidReceiveAuthenticationChallengeHandler)(NSURLSession *session, NSURLAuthenticationChallenge *challenge, NSURLCredential *__nullable __autoreleasing *__nullable credential);

/// Completion block used by handle challenge in NSURLSessionTaskDelegate method
typedef NSURLSessionAuthChallengeDisposition (^YMASessionTaskDidReceiveAuthenticationChallengeHandler)(NSURLSession *session, NSURLSessionTask *task, NSURLAuthenticationChallenge *challenge, NSURLCredential *__nullable __autoreleasing *__nullable credential);

NS_ASSUME_NONNULL_END
