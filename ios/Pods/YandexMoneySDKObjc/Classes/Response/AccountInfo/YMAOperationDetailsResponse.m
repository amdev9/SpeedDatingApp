//
// Created by Alexander Mertvetsov on 23.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAOperationDetailsResponse.h"
#import "YMAConstants.h"
#import "YMAHistoryOperationsResponse.h"
#import "YMAProcessPaymentResponse.h"
#import "YMABaseResponse+Protected.h"


static NSString *const kParameterAmountDue = @"amount_due";
static NSString *const kParameterFee = @"fee";
static NSString *const kParameterSender = @"sender";
static NSString *const kParameterRecipient = @"recipient";
static NSString *const kParameterRecipientType = @"recipient_type";
static NSString *const kParameterMessage = @"message";
static NSString *const kParameterComment = @"comment";
static NSString *const kParameterCodePro = @"codepro";
static NSString *const kParameterProtectionCode = @"protection_code";
static NSString *const kParameterExpires = @"expires";
static NSString *const kParameterAnswerDatetime = @"answer_datetime";
static NSString *const kParameterDetails = @"details";
static NSString *const kParameterRepeatable = @"repeatable";
static NSString *const kParameterPaymentParameters = @"payment_parameters";
static NSString *const kParameterDigitalGoods = @"digital_goods";

@implementation YMAOperationDetailsResponse

#pragma mark - Overridden methods

- (BOOL)parseJSONModel:(id)responseModel headers:(NSDictionary *)headers error:(NSError * __autoreleasing *)error
{
    NSString *errorKey = responseModel[YMAErrorParameter];
    if (errorKey != nil) {
        if (error == nil) return NO;

        NSError *unknownError = [NSError errorWithDomain:YMAErrorDomainUnknown code:0 userInfo:@{ YMAErrorKeyResponse : self }];
        *error = errorKey ? [NSError errorWithDomain:YMAErrorDomainYaMoneyAPI code:0 userInfo:@{YMAErrorKey : errorKey, YMAErrorKeyResponse : self }] : unknownError;

        return NO;
    }

    YMAHistoryOperationModel *historyOperation = [YMAHistoryOperationsResponse historyOperationByModel:responseModel];

    NSString *amountDue = [responseModel[kParameterAmountDue] stringValue];
    NSString *fee = [responseModel[kParameterFee] stringValue];
    NSString *sender = responseModel[kParameterSender];
    NSString *recipient = responseModel[kParameterRecipient];

    NSString *recipientTypeString = responseModel[kParameterRecipientType];
    YMARecipientType recipientType = [YMAOperationDetailsModel recipientTypeByString:recipientTypeString];

    NSString *message = responseModel[kParameterMessage];
    NSString *comment = responseModel[kParameterComment];
    BOOL codePro = [responseModel[kParameterCodePro] boolValue];
    NSString *protectionCode = responseModel[kParameterProtectionCode];

    NSString *expiresString = responseModel[kParameterExpires];
    NSDate *expires = [[self class] dateFromIsoTimeStamp:expiresString];

    NSString *answerDatetimeString = responseModel[kParameterAnswerDatetime];
    NSDate *answerDatetime = [[self class] dateFromIsoTimeStamp:answerDatetimeString];

    NSString *details = responseModel[kParameterDetails];
    BOOL repeatable = [responseModel[kParameterRepeatable] boolValue];

    NSDictionary *paymentParameters = responseModel[kParameterPaymentParameters];

    id digitalGoodsModel = responseModel[kParameterDigitalGoods];
    YMADigitalGoodsModel *digitalGoods = [YMAProcessPaymentResponse digitalGoodsByModel:digitalGoodsModel];

    _operationDetails = [YMAOperationDetailsModel operationDetailsWithOperation:historyOperation
                                                                      amountDue:amountDue
                                                                            fee:fee
                                                                         sender:sender
                                                                      recipient:recipient
                                                                  recipientType:recipientType
                                                                        message:message
                                                                        comment:comment
                                                                        codepro:codePro
                                                                 protectionCode:protectionCode
                                                                        expires:expires
                                                                 answerDatetime:answerDatetime
                                                                        details:details
                                                                     repeatable:repeatable
                                                              paymentParameters:paymentParameters
                                                                   digitalGoods:digitalGoods];

    return YES;
}

@end