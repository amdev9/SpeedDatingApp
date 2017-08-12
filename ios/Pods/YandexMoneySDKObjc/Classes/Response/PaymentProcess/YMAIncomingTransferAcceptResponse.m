//
// Created by Alexander Mertvetsov on 27.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAIncomingTransferAcceptResponse.h"

static NSString *const kParameterProtectionCodeAttemptsAvailable = @"protection_code_attempts_available";
static NSString *const kParameterExtActionUri = @"ext_action_uri";

@implementation YMAIncomingTransferAcceptResponse

#pragma mark - Overridden methods

- (BOOL)parseJSONModel:(id)responseModel headers:(NSDictionary *)headers error:(NSError * __autoreleasing *)error
{
    BOOL result = [super parseJSONModel:responseModel headers:headers error:error];
    _protectionCodeAttemptsAvailable = [responseModel[kParameterProtectionCodeAttemptsAvailable] integerValue];
    NSString *extActionUriString = responseModel[kParameterExtActionUri];
    _extActionUri = [NSURL URLWithString:extActionUriString];
    return result;
}

@end