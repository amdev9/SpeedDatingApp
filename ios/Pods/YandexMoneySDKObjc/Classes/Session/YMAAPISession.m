//
// Created by Alexander Mertvetsov on 20.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAAPISession.h"
#import "YMAHostsProvider.h"

NS_ASSUME_NONNULL_BEGIN

static NSString *const kHttpsScheme = @"https";

static NSString *const kUrlAuthorize = @"oauth/authorize";
static NSString *const kUrlToken = @"oauth/token";
static NSString *const kUrlRevoke = @"api/revoke";
static NSString *const kParameterClientId = @"client_id";


NSString *const YMAParameterResponseType = @"response_type";
NSString *const YMAValueParameterResponseType = @"code";

@implementation YMAAPISession

- (NSURLRequest *)authorizationRequestWithClientId:(NSString *)clientId
                              additionalParameters:(NSDictionary<NSString *, NSString *> *)params
{
    return [self authorizationRequestWithUrl:kUrlAuthorize clientId:clientId additionalParameters:params];
}

- (NSURLRequest *)authorizationRequestWithUrl:(NSString *)relativeUrlString
                                     clientId:(NSString *)clientId
                         additionalParameters:(NSDictionary<NSString *, NSString *> *)params
{
    NSMutableString *post = [NSMutableString stringWithCapacity:0];

    NSString *clientIdParamKey = [YMAConnection addPercentEscapesForString:kParameterClientId];
    NSString *clientIdParamValue = [YMAConnection addPercentEscapesForString:clientId];

    [post appendString:[NSString stringWithFormat:@"%@=%@&", clientIdParamKey, clientIdParamValue]];

    for (NSString *key in params.allKeys) {

        NSString *paramKey = [YMAConnection addPercentEscapesForString:key];
        NSString *paramValue = [YMAConnection addPercentEscapesForString:params[key]];

        [post appendString:[NSString stringWithFormat:@"%@=%@&", paramKey, paramValue]];
    }

    NSString *urlString =
        [NSString stringWithFormat:@"https://%@/%@", [YMAHostsProvider sharedManager].moneyUrl, relativeUrlString];
    NSURL *url = [NSURL URLWithString:urlString];

    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    NSData *postData = [post dataUsingEncoding:NSUTF8StringEncoding allowLossyConversion:NO];
    [request setHTTPMethod:YMAMethodPost];
    [request setValue:[NSString stringWithFormat:@"%lu", (unsigned long)[postData length]]
   forHTTPHeaderField:@"Content-Length"];
    [request setValue:YMAValueContentTypeDefault forHTTPHeaderField:YMAHeaderContentType];
    [request setValue:_userAgent forHTTPHeaderField:YMAHeaderUserAgent];
    [request setHTTPBody:postData];

    return request;
}

- (BOOL)isRequest:(NSURLRequest *)request
    toRedirectUrl:(NSString *)redirectUrl
authorizationInfo:(NSMutableDictionary<NSString *, NSString *>  *__nullable __autoreleasing *__nonnull)authInfo
            error:(NSError * __autoreleasing *)error
{
    NSURL *requestUrl = request.URL;

    if (requestUrl == nil) {
        return NO;
    }

    NSString *strippedURL         = [self strippedURL:requestUrl];
    NSString *strippedRedirectURL = [self strippedURL:[NSURL URLWithString:redirectUrl]];

    if ([strippedURL isEqualToString:strippedRedirectURL]) {

        NSString *query = requestUrl.query;

        if (query == nil || query.length == 0) {
            if (error)
                *error = [NSError errorWithDomain:YMAErrorDomainUnknown code:0 userInfo:@{ @"requestUrl" : request.URL }];
        }
        else if (authInfo != nil) {

            *authInfo = [NSMutableDictionary dictionary];

            NSArray *queryComponents = [query componentsSeparatedByString:@"&"];

            for (NSString *keyValuePair in queryComponents) {
                NSArray *pairComponents = [keyValuePair componentsSeparatedByString:@"="];
                if (pairComponents.count > 1) {
                    NSString *key = pairComponents[0];
                    NSString *value = pairComponents[1];

                    (*authInfo)[key] = value;
                }
            }
        }

        return YES;
    }
    else
        return NO;
}

- (void)receiveTokenWithCode:(NSString *)code
                    clientId:(NSString *)clientId
        additionalParameters:(NSDictionary<NSString *, NSString *> *)params
                  completion:(YMAIdHandler)block
{
    [self receiveTokenWithUrl:kUrlToken code:code clientId:clientId additionalParameters:params completion:block];
}

- (void)receiveTokenWithUrl:(NSString *)relativeUrlString
                       code:(NSString *)code
                   clientId:(NSString *)clientId
       additionalParameters:(NSDictionary<NSString *, NSString *> *)params
                 completion:(YMAIdHandler)block
{
    NSMutableDictionary *parameters = [[NSMutableDictionary alloc] init];
    if (code != nil) {
        parameters[YMAValueParameterResponseType] = code;
    }
    if (clientId != nil) {
        parameters[kParameterClientId] = clientId;
    }
    [parameters addEntriesFromDictionary:params];

    NSString *urlString =
        [NSString stringWithFormat:@"https://%@/%@", [YMAHostsProvider sharedManager].moneyUrl, relativeUrlString];
    NSURL *url = [NSURL URLWithString:urlString];

    [self performRequestWithMethod:YMARequestMethodPost
                             token:nil
                        parameters:parameters
                     customHeaders:nil
                               url:url
                        completion:^(NSURLRequest *request, NSURLResponse *response, NSData *responseData, NSError *error) {

                           if (error != nil) {
                               block(nil, error);
                               return;
                           }

                           NSInteger statusCode = ((NSHTTPURLResponse *)response).statusCode;

                           id responseModel =
                               [NSJSONSerialization JSONObjectWithData:responseData
                                                               options:(NSJSONReadingOptions)kNilOptions
                                                                 error:&error];

                           NSError *unknownError = [NSError errorWithDomain:YMAErrorDomainUnknown
                                                                       code:statusCode
                                                                   userInfo:@{
                                                                       YMAErrorKeyResponse : response,
                                                                       YMAErrorKeyRequest : request
                                                                   }];

                           if (error != nil || responseModel == nil) {
                               block(nil, (error) ? error : unknownError);
                               return;
                           }

                           if (statusCode == YMAStatusCodeOkHTTP) {

                               NSString *accessToken = responseModel[@"access_token"];

                               if (accessToken == nil)
                                   block(nil, unknownError);
                               else
                                   block(accessToken, nil);

                               return;
                           }

                           NSString *errorKey = responseModel[YMAErrorParameter];

                           if (errorKey == nil)
                               block(nil, unknownError);
                           else
                               block(nil, [NSError errorWithDomain:YMAErrorDomainYaMoneyAPI
                                                              code:statusCode
                                                          userInfo:@{YMAErrorKey : errorKey, YMAErrorKeyResponse : response}]);
                       }];
}

- (void)revokeToken:(NSString *)token completion:(YMAHandler)block
{
    NSString *urlString =
        [NSString stringWithFormat:@"https://%@/%@", [YMAHostsProvider sharedManager].moneyUrl, kUrlRevoke];
    NSURL *url = [NSURL URLWithString:urlString];

    [self performAndProcessRequestWithMethod:YMARequestMethodPost
                                       token:token
                                  parameters:nil
                               customHeaders:nil
                                         url:url
                                  completion:^(NSURLRequest *urlRequest, NSURLResponse *urlResponse, NSData *responseData, NSError *error) {
                                     if (error != nil) {
                                         block(error);
                                         return;
                                     }

                                     block(nil);
                                 }];
}

- (void)performRequest:(nullable YMABaseRequest *)request token:(nullable NSString *)token completion:(YMARequestHandler)block
{
    NSError *unknownError = [NSError errorWithDomain:YMAErrorDomainUnknown code:0 userInfo:@{ YMAErrorKeyRequest : request }];

    if (request == nil) {
        block(request, nil, unknownError);
        return;
    }

    if ([request conformsToProtocol:@protocol(YMAParametersPosting)]) {
        YMABaseRequest<YMAParametersPosting> *paramsRequest = (YMABaseRequest<YMAParametersPosting> *)request;

        [self performAndProcessRequestWithMethod:paramsRequest.requestMethod
                                           token:token
                                      parameters:paramsRequest.parameters
                                   customHeaders:paramsRequest.customHeaders
                                             url:request.requestUrl
                                      completion:^(NSURLRequest *urlRequest, NSURLResponse *urlResponse, NSData *responseData, NSError *error) {

                                          if (error != nil) {
                                              block(request, nil, error);
                                              return;
                                          }

                                          NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)urlResponse;
                                          NSDictionary *headers = httpResponse.allHeaderFields;

                                          [request buildResponseWithData:responseData
                                                                 headers:headers
                                                          httpStatusCode:httpResponse.statusCode
                                                                   queue:self.responseQueue
                                                              completion:block];
                                      }];
    }
    else if ([request conformsToProtocol:@protocol(YMADataPosting)]) {
        YMABaseRequest<YMADataPosting> *dataRequest = (YMABaseRequest<YMADataPosting> *)request;

        [self performAndProcessRequestWithToken:token
                                           data:dataRequest.data
                                  customHeaders:dataRequest.customHeaders
                                            url:dataRequest.requestUrl
                                     completion:^(NSURLRequest *urlRequest, NSURLResponse *urlResponse, NSData *responseData, NSError *error) {
                                         if (error != nil) {
                                             block(request, nil, error);
                                             return;
                                         }

                                         NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)urlResponse;
                                         NSDictionary *headers =  httpResponse.allHeaderFields;

                                         [request buildResponseWithData:responseData
                                                                headers:headers
                                                         httpStatusCode:httpResponse.statusCode
                                                                  queue:self.responseQueue
                                                             completion:block];
                                     }];
    }
}


#pragma mark - Private methods

- (NSString *)strippedURL:(NSURL *)url
{
    NSString *scheme = [url.scheme lowercaseString];
    NSString *path   = [url.path stringByTrimmingCharactersInSet:[NSCharacterSet punctuationCharacterSet]];
    NSString *host   = url.host;
    NSInteger port   = [url.port integerValue];
    if (port == 0) {
        if ([scheme isEqualToString:kHttpsScheme]) {
            port = 443;
        }
        else {
            port = 80;
        }
    }
    NSString *strippedURL = [[NSString stringWithFormat:@"%@://%@:%ld/%@", scheme, host, (long)port ,  path] lowercaseString];
    return strippedURL;
}

@end

NS_ASSUME_NONNULL_END
