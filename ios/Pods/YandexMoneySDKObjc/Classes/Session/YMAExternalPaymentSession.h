//
// Created by Alexander Mertvetsov on 27.01.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMABaseRequest.h"
#import "YMABaseSession.h"

///
/// Session object to access Yandex.Money (for external payments).
///
@interface YMAExternalPaymentSession : YMABaseSession

/// ID of an installed copy of the application. Used when you perform requests as parameter.
@property (nonatomic, copy) NSString *instanceId;

/// Register your application using clientId and obtaining instanceId.
/// @param clientId - application Identifier.
/// @param block - completion of block is used to get the ID of an installed copy of the application.
- (void)instanceWithClientId:(NSString *)clientId token:(NSString *)token completion:(YMAIdHandler)block;

/// Perform some request and obtaining response in block.
/// @param request - request inherited from YMABaseRequest.
/// @param block - completion of block is used to get the response.
- (void)performRequest:(YMABaseRequest *)request token:(NSString *)token completion:(YMARequestHandler)block;

- (void)performRequest:(YMABaseRequest *)request
                 token:(NSString *)token
       redirectHandler:(YMARedirectHandler)redirectHandler
            completion:(YMARequestHandler)block;

@end