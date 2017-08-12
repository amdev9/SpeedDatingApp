//
// Created by Alexander Mertvetsov on 20.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMABaseSession.h"

static NSString *const kValueHeaderAuthorizationFormat = @"Bearer %@";
static NSString *const kHeaderAuthorization = @"Authorization";
static NSString *const kHeaderWWWAuthenticate = @"WWW-Authenticate";
static NSString *const kValueContentTypeImage = @"image/png";
static NSString *const kHeaderAcceptEncoding = @"Accept-Encoding";
static NSString *const kValueAcceptEncoding = @"gzip";
static NSString *const kHeaderAcceptLanguage = @"Accept-Language";
static NSString *const kValueAcceptLanguageDefault = @"ru";
static NSString *const kValueContentTypePNG = @"image/png";

NSString *const YMAValueUserAgentDefault = @"Yandex.Money.SDK/iOS";
NSString *const YMAHeaderUserAgent = @"User-Agent";
NSString *const YMAMethodPost = @"POST";
NSString *const YMAValueContentTypeDefault = @"application/x-www-form-urlencoded;charset=UTF-8";

@interface YMABaseSession () <NSURLSessionDelegate, NSURLSessionTaskDelegate>

@property (nonatomic, strong) NSDictionary *defaultHeaders;

@property (nonatomic, strong) NSURLSession *urlSession;

@property (nonatomic, strong) NSMutableDictionary<NSNumber *, YMAConnection *> *taskDelegatesByIdentifier;
@property (nonatomic, strong) NSLock *taskDelegateLock;

@property (nonatomic, copy) YMASessionDidReceiveAuthenticationChallengeHandler sessionDidReceiveAuthenticationChallengeHandler;
@property (nonatomic, copy) YMASessionTaskDidReceiveAuthenticationChallengeHandler taskDidReceiveAuthenticationChallengeHandler;

@end

@implementation YMABaseSession

#pragma mark - Object Lifecycle

- (instancetype)init
{
    self = [super init];

    if (self != nil) {
        _requestQueue     = [[NSOperationQueue alloc] init];
        _responseQueue    = [[NSOperationQueue alloc] init];
        _userAgent        = YMAValueUserAgentDefault;
        _language         = kValueAcceptLanguageDefault;
        _taskDelegateLock = [[NSLock alloc] init];
        _taskDelegatesByIdentifier = [[NSMutableDictionary alloc] init];
    }

    return self;
}

- (instancetype)initWithUserAgent:(NSString *)userAgent
{
    self = [self init];

    if (self != nil) {
        _userAgent = [userAgent copy];
    }

    return self;
}

#pragma mark - Public methods

- (void)performRequestWithMethod:(YMARequestMethod)requestMethod
                           token:(NSString *)token
                      parameters:(NSDictionary *)parameters
                   customHeaders:(NSDictionary *)customHeaders
                             url:(NSURL *)url
                      completion:(YMAConnectionHandler)block
{
    [self performRequestWithMethod:requestMethod
                             token:token
                        parameters:parameters
                     customHeaders:customHeaders
                               url:url
                   redirectHandler:NULL
                        completion:block];
}

- (void)performRequestWithMethod:(YMARequestMethod)requestMethod
                           token:(NSString *)token
                      parameters:(NSDictionary *)parameters
                   customHeaders:(NSDictionary *)customHeaders
                             url:(NSURL *)url
                 redirectHandler:(YMAConnectionRedirectHandler)redirectHandler
                      completion:(YMAConnectionHandler)block
{
    YMAConnection *connection = (requestMethod == YMARequestMethodGet) ?
    [YMAConnection connectionForGetRequestWithUrl:url parameters:parameters] :
    [YMAConnection connectionForPostRequestWithUrl:url postParameters:parameters];

    [self sendAsynchronousConnection:connection
                               token:token
                       customHeaders:customHeaders
                     redirectHandler:redirectHandler
                          completion:block];
}

- (void)performAndProcessRequestWithMethod:(YMARequestMethod)requestMethod
                                     token:(NSString *)token
                                parameters:(NSDictionary *)parameters
                             customHeaders:(NSDictionary *)customHeaders
                                       url:(NSURL *)url
                                completion:(YMAConnectionHandler)block
{
    [self performAndProcessRequestWithMethod:requestMethod
                                       token:token
                                  parameters:parameters
                               customHeaders:customHeaders
                                         url:url
                             redirectHandler:NULL
                                  completion:block];
}

- (void)performAndProcessRequestWithMethod:(YMARequestMethod)requestMethod
                                     token:(NSString *)token
                                parameters:(NSDictionary *)parameters
                             customHeaders:(NSDictionary *)customHeaders
                                       url:(NSURL *)url
                            redirectHandler:(YMAConnectionRedirectHandler)redirectHandler
                                completion:(YMAConnectionHandler)block
{
    [self performRequestWithMethod:requestMethod token:token
                        parameters:parameters
                     customHeaders:customHeaders
                               url:url
                   redirectHandler:redirectHandler
                        completion:^(NSURLRequest *urlRequest, NSURLResponse *urlResponse, NSData *responseData, NSError *error) {
                            [self processRequest:urlRequest
                                        response:urlResponse
                                    responseData:responseData
                                           error:error
                                      completion:block];
                        }];
}

- (void)performAndProcessRequestWithToken:(NSString *)token
                                     data:(NSData *)data
                            customHeaders:(NSDictionary *)customHeaders
                                      url:(NSURL *)url
                               completion:(YMAConnectionHandler)block
{
    [self performRequestWithToken:token
                             data:data
                    customHeaders:customHeaders
                              url:url
                       completion:^(NSURLRequest *urlRequest, NSURLResponse *urlResponse, NSData *responseData, NSError *error) {
                           [self processRequest:urlRequest
                                       response:urlResponse
                                   responseData:responseData
                                          error:error
                                     completion:block];
                       }];
}

- (void)cancelActiveConnections
{
    [self.taskDelegateLock lock];
    NSArray *connections = self.taskDelegatesByIdentifier.allValues;
    [self.taskDelegatesByIdentifier removeAllObjects];
    [connections enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        if ([obj respondsToSelector:@selector(cancel)]) {
            [obj cancel];
        }
    }];
    [self.taskDelegateLock unlock];
}

- (void)setSessionAuthenticationChallengeHandler:(YMASessionDidReceiveAuthenticationChallengeHandler)handler
{
    self.sessionDidReceiveAuthenticationChallengeHandler = handler;
}

- (void)setSessionTaskAuthenticationChallengeHandler:(YMASessionTaskDidReceiveAuthenticationChallengeHandler)handler
{
    self.taskDidReceiveAuthenticationChallengeHandler = handler;
}


#pragma mark - Private methods

- (void)sendAsynchronousConnection:(YMAConnection *)connection
                             token:(NSString *)token
                     customHeaders:(NSDictionary *)customHeaders
                   redirectHandler:(YMAConnectionRedirectHandler)redirectHandler
                        completion:(YMAConnectionHandler)block
{
    BOOL result = [self addHeaders:customHeaders token:token forConnection:&connection];
    if (result) {
        NSURLSessionDataTask *dataTask = [connection dataTaskWithQueue:self.requestQueue
                                                               session:self.urlSession
                                                       redirectHandler:redirectHandler
                                                            completion:^(NSURLRequest *request, NSURLResponse *response, NSData *responseData, NSError *error) {
                                                                if (block != NULL) {
                                                                    block(request, response, responseData, error);
                                                                }
                                                            }];
        [self setConnection:connection forTask:dataTask];
        [dataTask resume];
    }
    else if (block != NULL) {
        NSError *technicalError = [NSError errorWithDomain:YMAErrorDomainUnknown
                                                      code:0
                                                  userInfo:nil];
        block(nil, nil, nil, technicalError);
    }
}

- (void)performRequestWithToken:(NSString *)token
                           data:(NSData *)data
                  customHeaders:(NSDictionary *)customHeaders
                            url:(NSURL *)url
                     completion:(YMAConnectionHandler)block
{
    YMAConnection *connection = [YMAConnection connectionForPostRequestWithUrl:url bodyData:data];
    [self sendAsynchronousConnection:connection
                               token:token
                       customHeaders:customHeaders
                     redirectHandler:NULL
                          completion:block];
}

- (void)processRequest:(NSURLRequest *)urlRequest
              response:(NSURLResponse *)urlResponse
          responseData:(NSData *)responseData
                 error:(NSError *)error
            completion:(YMAConnectionHandler)block
{
    NSInteger statusCode = ((NSHTTPURLResponse *)urlResponse).statusCode;

#if defined(DEBUG) || defined(ADHOC)
    NSMutableString *debugString = [NSMutableString stringWithFormat:@"Response URL: %@\nStatus code:%ld\nData: %@",
                                    urlRequest.URL.absoluteString,
                                    (long)statusCode,
                                    [[NSString alloc] initWithData:responseData encoding:NSUTF8StringEncoding]];
    
    if (error != nil) {
        [debugString appendFormat:@"\nError:%@", error.localizedDescription];
    }
    NSLog(@"%@", debugString);
#endif
    
    NSError *responseError = nil;
    if (error != nil) {
        responseError = error;
    }
    else {
        switch (statusCode) {
            case YMAStatusCodeOkHTTP:
            case YMAStatusCodeMultipleChoicesHTTP:
            case YMAStatusCodeMovedPermanentlyHTTP:
            case YMAStatusCodeNotModifiedHTTP:
                responseError = nil;
                break;
                
            case YMAStatusCodeInsufficientScopeHTTP:
            case YMAStatusCodeInvalidTokenHTTP: {
                responseError = [NSError errorWithDomain:YMAErrorDomainOAuth
                                                    code:statusCode
                                                userInfo:@{ YMAErrorKeyRequest : urlRequest, YMAErrorKeyResponse : urlResponse }];
                
            }
                break;
                
            default: {
                responseError = [NSError errorWithDomain:YMAErrorDomainUnknown
                                                    code:statusCode
                                                userInfo:@{ YMAErrorKeyRequest : urlRequest, YMAErrorKeyResponse : urlResponse }];
                
            }
                break;
        }
    }

    if (block != NULL) {
        block(urlRequest, urlResponse, responseData, responseError);
    }
}

- (BOOL)addHeaders:(NSDictionary *)customHeaders token:(NSString *)token forConnection:(YMAConnection * __autoreleasing *)connection {
    if (connection == nil || *connection == nil)
        return NO;
    
    NSMutableDictionary *headers = [self.defaultHeaders mutableCopy];

    if (_userAgent != nil) {
        headers[YMAHeaderUserAgent] = _userAgent;
    }
    if (self.language != nil) {
        headers[kHeaderAcceptLanguage] = self.language;
    }

    if (token != nil) {
        headers[kHeaderAuthorization] = [NSString stringWithFormat:kValueHeaderAuthorizationFormat, token];
    }
    
    for (NSString *key in customHeaders.allKeys) {
        headers[key] = customHeaders[key];
    }
    
    for (NSString *key in headers.allKeys) {
        [*connection addValue:headers[key] forHeader:key];
    }
    
    return YES;
}

- (NSString *)valueOfHeader:(NSString *)headerName forResponse:(NSURLResponse *)response
{
    NSDictionary *headers = [((NSHTTPURLResponse *)response) allHeaderFields];

    for (NSString *header in headers.allKeys) {
        if ([header caseInsensitiveCompare:headerName] == NSOrderedSame)
            return headers[header];
    }

    return nil;
}

- (void)setConnection:(YMAConnection *)connection
              forTask:(NSURLSessionTask *)task
{
    NSParameterAssert(task);

    [self.taskDelegateLock lock];
    self.taskDelegatesByIdentifier[@(task.taskIdentifier)] = connection;
    [self.taskDelegateLock unlock];
}

- (YMAConnection *)connectionForTask:(NSURLSessionTask *)task
{
    NSParameterAssert(task);

    [self.taskDelegateLock lock];
    YMAConnection *connection = self.taskDelegatesByIdentifier[@(task.taskIdentifier)];
    [self.taskDelegateLock unlock];
    return connection;
}


#pragma mark - NSURLSessionDelegate

- (void)URLSession:(NSURLSession *)session
didReceiveChallenge:(NSURLAuthenticationChallenge *)challenge
 completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition disposition, NSURLCredential * __nullable credential))completionHandler
{
    NSURLSessionAuthChallengeDisposition disposition = NSURLSessionAuthChallengePerformDefaultHandling;
    __block NSURLCredential *credential = nil;

    if (self.sessionDidReceiveAuthenticationChallengeHandler != NULL) {
        disposition = self.sessionDidReceiveAuthenticationChallengeHandler(session, challenge, &credential);
    } else {
        if ([challenge.protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust]) {
            credential = [NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust];
            if (credential != nil) {
                disposition = NSURLSessionAuthChallengeUseCredential;
            }
        }
    }

    if (completionHandler != NULL) {
        completionHandler(disposition, credential);
    }
}


#pragma mark - NSURLSessionTaskDelegate

- (void)URLSession:(NSURLSession *)session
              task:(NSURLSessionTask *)task
willPerformHTTPRedirection:(NSHTTPURLResponse *)response
        newRequest:(NSURLRequest *)request
 completionHandler:(void (^)(NSURLRequest * __nullable))completionHandler
{
    YMAConnection *connection = [self connectionForTask:task];
    if ([connection respondsToSelector:@selector(URLSession:task:willPerformHTTPRedirection:newRequest:completionHandler:)]) {
        [connection URLSession:session
                          task:task
    willPerformHTTPRedirection:response
                    newRequest:request
             completionHandler:completionHandler];
    } else if (completionHandler != NULL) {
        completionHandler(request);
    }
}

- (void)URLSession:(NSURLSession *)session
              task:(NSURLSessionTask *)task
didCompleteWithError:(nullable NSError *)error
{
    YMAConnection *connection = [self connectionForTask:task];
    if ([connection respondsToSelector:@selector(URLSession:task:didCompleteWithError:)]) {
        [connection URLSession:session task:task didCompleteWithError:error];
    }
    [self setConnection:nil forTask:task];
}

- (void)URLSession:(NSURLSession *)session
              task:(NSURLSessionTask *)task
didReceiveChallenge:(NSURLAuthenticationChallenge *)challenge
 completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition disposition, NSURLCredential * __nullable credential))completionHandler
{
    NSURLSessionAuthChallengeDisposition disposition = NSURLSessionAuthChallengePerformDefaultHandling;
    __block NSURLCredential *credential = nil;

    if (self.taskDidReceiveAuthenticationChallengeHandler != NULL) {
        disposition = self.taskDidReceiveAuthenticationChallengeHandler(session, task, challenge, &credential);
    } else {
        if ([challenge.protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust]) {
            credential = [NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust];
            if (credential != nil) {
                disposition = NSURLSessionAuthChallengeUseCredential;
            }
        }
    }

    if (completionHandler != NULL) {
        completionHandler(disposition, credential);
    }
}


#pragma mark - NSURLSessionDataDelegate

- (void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask
didReceiveResponse:(NSURLResponse *)response
 completionHandler:(void (^)(NSURLSessionResponseDisposition disposition))completionHandler
{
    YMAConnection *connection = [self connectionForTask:dataTask];
    if ([connection respondsToSelector:@selector(URLSession:dataTask:didReceiveResponse:completionHandler:)]) {
        [connection URLSession:session dataTask:dataTask didReceiveResponse:response completionHandler:completionHandler];
    } else if (completionHandler != NULL) {
        completionHandler(NSURLSessionResponseAllow);
    }
}

- (void)URLSession:(NSURLSession *)session
          dataTask:(NSURLSessionDataTask *)dataTask
    didReceiveData:(NSData *)data
{
    YMAConnection *connection = [self connectionForTask:dataTask];
    if ([connection respondsToSelector:@selector(URLSession:dataTask:didReceiveData:)]) {
        [connection URLSession:session dataTask:dataTask didReceiveData:data];
    }
}


#pragma mark - Getters and setters

- (NSDictionary *)defaultHeaders
{
    if (_defaultHeaders == nil) {
        _defaultHeaders =
            @{ YMAHeaderContentType : YMAValueContentTypeDefault, kHeaderAcceptEncoding : kValueAcceptEncoding };
    }
    return _defaultHeaders;
}

- (NSURLSession *)urlSession
{
    if (_urlSession == nil) {
        NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
        _urlSession = [NSURLSession sessionWithConfiguration:configuration delegate:self delegateQueue:self.requestQueue];
    }
    return _urlSession;
}

@end