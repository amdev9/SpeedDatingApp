//
//  YMAConnection.m
//
//  Created by Alexander Mertvetsov on 31.10.13.
//  Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAConnection.h"
#import <Foundation/NSObjCRuntime.h>

#ifndef NSFoundationVersionNumber_iOS_8_4
#define iOS_VersionNumber_8_4 1144.17
#else
#define iOS_VersionNumber_8_4 NSFoundationVersionNumber_iOS_8_4
#endif

static NSString *const kRequestMethodPost = @"POST";
static NSString *const kRequestMethodGet = @"GET";

static NSInteger const kRequestTimeoutIntervalDefault = 60;
static NSString *const kHeaderContentLength = @"Content-Length";

@interface YMAConnection ()

@property (nonatomic, strong) NSMutableURLRequest *request;

@property (nonatomic, copy) YMAConnectionRedirectHandler redirectHandler;
@property (nonatomic, copy) YMAConnectionHandler completionHandler;

@property (nonatomic, strong) NSMutableData *responseData;
@property (nonatomic, strong) NSURLResponse *response;

@property (nonatomic, strong) NSURLSessionDataTask *task;

@end

@implementation YMAConnection

#pragma mark - Object Lifecycle

- (instancetype)initWithUrl:(NSURL *)url parameters:(NSDictionary *)params requestMethod:(NSString *)requestMethod
{
    self = [super init];
    
    if (self != nil) {
        NSURL *requestUrl = url;
        NSString *paramString = [YMAConnection bodyStringWithParams:params];
        
        if ([requestMethod isEqualToString:kRequestMethodGet]) {
            NSString *urlWithQuery = [NSString stringWithFormat:@"%@?%@", [url absoluteString], paramString];
            requestUrl = [NSURL URLWithString:urlWithQuery];
        }
        
        _request = [[NSMutableURLRequest alloc] initWithURL:requestUrl
                                                cachePolicy:NSURLRequestUseProtocolCachePolicy
                                            timeoutInterval:kRequestTimeoutIntervalDefault];
        _request.HTTPMethod = requestMethod;
        
        if ([requestMethod isEqualToString:kRequestMethodPost])
            _request.HTTPBody = [paramString dataUsingEncoding:NSUTF8StringEncoding];
    }
    
    return self;
}

- (instancetype)initWithUrl:(NSURL *)url bodyData:(NSData *)bodyData
{
    self = [super init];
    
    if (self != nil) {
        NSURL *requestUrl = url;
        _request = [[NSMutableURLRequest alloc] initWithURL:requestUrl
                                                cachePolicy:NSURLRequestUseProtocolCachePolicy
                                            timeoutInterval:kRequestTimeoutIntervalDefault];
        _request.HTTPMethod = kRequestMethodPost;
        _request.HTTPBody = bodyData;
    }
    
    return self;
}

+ (instancetype)connectionForPostRequestWithUrl:(NSURL *)url
                                 postParameters:(NSDictionary *)postParams
{
    return [[YMAConnection alloc] initWithUrl:url parameters:postParams requestMethod:kRequestMethodPost];
}

+ (instancetype)connectionForPostRequestWithUrl:(NSURL *)url
                                       bodyData:(NSData *)bodyData
{
    return [[YMAConnection alloc] initWithUrl:url bodyData:bodyData];
}

+ (instancetype)connectionForGetRequestWithUrl:(NSURL *)url
                                    parameters:(NSDictionary *)postParams
{
    return [[YMAConnection alloc] initWithUrl:url parameters:postParams requestMethod:kRequestMethodGet];
}

#pragma mark - Public methods

+ (NSString *)addPercentEscapesForString:(NSString *)string
{
    #if !TARGET_OS_WATCH
    if (NSFoundationVersionNumber <= iOS_VersionNumber_8_4) {
    return (NSString *)CFBridgingRelease(CFURLCreateStringByAddingPercentEscapes(NULL,
                                                                                 (__bridge CFStringRef)string,
                                                                                 NULL,
                                                                                 (CFStringRef)@";/?:@&=+$,",
                                                                                 kCFStringEncodingUTF8));
    }
    #endif
    return [string stringByAddingPercentEncodingWithAllowedCharacters:[[NSCharacterSet alloc] init]];
}

- (NSURLSessionDataTask *)dataTaskWithQueue:(NSOperationQueue *)queue
                                    session:(NSURLSession *)session
                                 completion:(YMAConnectionHandler)completionHandler
{
    return [self dataTaskWithQueue:queue session:session redirectHandler:NULL completion:completionHandler];
}

- (NSURLSessionDataTask *)dataTaskWithQueue:(NSOperationQueue *)queue
                                    session:(NSURLSession *)session
                            redirectHandler:(YMAConnectionRedirectHandler)redirectHandler
                                 completion:(YMAConnectionHandler)completionHandler
{
    NSString *value = [NSString stringWithFormat:@"%lu", (unsigned long)self.request.HTTPBody.length];
    [self.request addValue:value forHTTPHeaderField:kHeaderContentLength];

#if defined(DEBUG) || defined(ADHOC)
    NSMutableString *debugString = [NSMutableString stringWithFormat:@"Request to URL: %@\nHeaders:%@",
                                    self.request.URL.absoluteString,
                                    self.request.allHTTPHeaderFields];

    if (self.request.HTTPBody.length > 0) {
        [debugString appendFormat:@"\nHTTP body:%@", [[NSString alloc] initWithData:self.request.HTTPBody
                                                                           encoding:NSUTF8StringEncoding]];
    }
    NSLog(@"%@", debugString);
#endif

    self.redirectHandler   = redirectHandler;
    self.completionHandler = completionHandler;

    self.response = nil;
    self.responseData = nil;

    self.task = [session dataTaskWithRequest:self.request];

    return self.task;
}

- (void)addValue:(NSString *)value forHeader:(NSString *)header
{
    [self.request addValue:value forHTTPHeaderField:header];
}

+ (NSString *)bodyStringWithParams:(NSDictionary *)postParams
{
    if (postParams == nil) {
        return [NSString string];
    }

    NSMutableArray *bodyParams = [NSMutableArray array];

    for (NSString *key in postParams.allKeys) {
        id value = postParams[key];
        NSString *stringValue = [self formatToStringValue:value];
        if (stringValue != nil) {
            NSString *encodedValue = [YMAConnection addPercentEscapesForString:stringValue];
            NSString *encodedKey = [YMAConnection addPercentEscapesForString:key];

            [bodyParams addObject:[NSString stringWithFormat:@"%@=%@", encodedKey, encodedValue]];
        }
    }

    return [bodyParams componentsJoinedByString:@"&"];
}

+ (NSString *)formatToStringValue:(id)value
{
    if (value == nil || [value isKindOfClass:[NSNull class]]) {
        return nil;
    }

    NSString *stringValue = nil;
    if ([value isKindOfClass:[NSString class]]) {
        stringValue = value;
    }
    else if ([value isKindOfClass:[NSNumber class]]) {
        stringValue = [value stringValue];
    }
    else if ([value isKindOfClass:[NSArray class]]) {

        NSMutableString *mutableString = [NSMutableString string];
        NSArray *array = value;

        [mutableString appendString:@"["];
        [array enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
            if (idx > 0) {
                [mutableString appendString:@","];
            }
            [mutableString appendString:[self formatToStringValue:obj]];
        }];
        [mutableString appendString:@"]"];

        stringValue = [mutableString copy];
    }
    else if ([value isKindOfClass:[NSDictionary class]]) {

        NSMutableString *mutableString = [NSMutableString string];
        NSDictionary *dictionary = value;

        [mutableString appendString:@"{"];
        __block BOOL dictionaryHasValues = NO;
        [dictionary enumerateKeysAndObjectsUsingBlock:^(id key, id obj, BOOL *stop) {
            if (dictionaryHasValues) {
                [mutableString appendString:@","];
            }
            [mutableString appendString:[NSString stringWithFormat:@"%@:%@", key, [self formatToStringValue:obj]]];
            dictionaryHasValues = YES;
        }];
        [mutableString appendString:@"}"];

        stringValue = [mutableString copy];
    }

    return stringValue;
}

- (void)cancel
{
    [self.task cancel];
}


#pragma mark - NSURLSessionTaskDelegate

- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task
willPerformHTTPRedirection:(NSHTTPURLResponse *)response
        newRequest:(NSURLRequest *)request
 completionHandler:(void (^)(NSURLRequest * __nullable))completionHandler
{
    NSURLRequest *resultRequest = request;
    if (self.redirectHandler != NULL) {
        resultRequest = self.redirectHandler(request, response);
        if (resultRequest == nil) {
            self.completionHandler = NULL;
            [task cancel];
        }
    }
    if (completionHandler != NULL) {
        completionHandler(resultRequest);
    }
}

- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task
didCompleteWithError:(nullable NSError *)error
{
    if (self.completionHandler != NULL) {
        self.completionHandler(self.request, self.response, self.responseData, error);
    }
}


#pragma mark - NSURLSessionDataDelegate

- (void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask
didReceiveResponse:(NSURLResponse *)response
 completionHandler:(void (^)(NSURLSessionResponseDisposition disposition))completionHandler
{
    self.response = response;
    if (completionHandler != NULL) {
        completionHandler(NSURLSessionResponseAllow);
    }
}

- (void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask didReceiveData:(NSData *)data
{
    [self.responseData appendData:data];
}


#pragma mark - Getters and setters

- (NSMutableData *)responseData
{
    if (_responseData == nil) {
        _responseData = [NSMutableData data];
    }
    return _responseData;
}

@end
