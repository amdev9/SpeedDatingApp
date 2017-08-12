//
// Created by Alexander Mertvetsov on 29.01.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAProcessExternalPaymentResponse.h"

static NSString *const kParameterAcsUrl = @"acs_uri";
static NSString *const kParameterAcsParams = @"acs_params";
static NSString *const kParameterMoneySource = @"money_source";
static NSString *const kParameterType = @"type";
static NSString *const kParameterPaymentCardType = @"payment_card_type";
static NSString *const kParameterPanFragment = @"pan_fragment";
static NSString *const kParameterMoneySourceToken = @"money_source_token";
static NSString *const kParameterInvoiceId = @"invoice_id";

static NSString *const kMoneySourceTypePaymentCard = @"payment-card";

@implementation YMAProcessExternalPaymentResponse

#pragma mark - Overridden methods

- (BOOL)parseJSONModel:(id)responseModel headers:(NSDictionary *)headers error:(NSError * __autoreleasing *)error
{
    BOOL result = [super parseJSONModel:responseModel headers:headers error:error];

    NSString *acsUrl = responseModel[kParameterAcsUrl];

    if (acsUrl != nil) {
        NSDictionary *acsParams = responseModel[kParameterAcsParams];
        _asc = [YMAAscModel ascWithUrl:[NSURL URLWithString:acsUrl] parameters:acsParams];
    }

    NSDictionary *moneySource = responseModel[kParameterMoneySource];

    if (moneySource != nil) {
        NSString *type = moneySource[kParameterType];

        if ([type isEqualToString:kMoneySourceTypePaymentCard]) {
            NSString *paymentCardTypeString = moneySource[kParameterPaymentCardType];
            YMAPaymentCardType paymentCardType = [YMAMoneySourceModel paymentCardTypeByString:paymentCardTypeString];

            NSString *panFragment = moneySource[kParameterPanFragment];
            NSString *moneySourceToken = moneySource[kParameterMoneySourceToken];

            _moneySource = [YMAMoneySourceModel moneySourceWithType:YMAMoneySourcePaymentCard
                                                           cardType:paymentCardType
                                                        panFragment:panFragment
                                                   moneySourceToken:moneySourceToken
                                                           external:YES];

        }
        else
            _moneySource = [YMAMoneySourceModel moneySourceWithType:YMAMoneySourceUnknown
                                                           cardType:YMAPaymentCardUnknown
                                                        panFragment:nil
                                                   moneySourceToken:nil
                                                           external:YES];
    }

    NSString *invoiceId = responseModel[kParameterInvoiceId];
    if ([invoiceId isKindOfClass:[NSNumber class]]) {
        invoiceId = [((NSNumber *)invoiceId) stringValue];
    }
    _invoiceId = [invoiceId copy];

    return result;
}

@end