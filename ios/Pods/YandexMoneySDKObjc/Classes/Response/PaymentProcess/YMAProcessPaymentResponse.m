//
// Created by Alexander Mertvetsov on 22.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAProcessPaymentResponse.h"

static NSString *const kParameterPaymentId = @"payment_id";
static NSString *const kParameterBalance = @"balance";
static NSString *const kParameterInvoiceId = @"invoice_id";
static NSString *const kParameterPayer = @"payer";
static NSString *const kParameterPayee = @"payee";
static NSString *const kParameterCreditAmount = @"credit_amount";
static NSString *const kParameterPayeeUid = @"payee_uid";
static NSString *const kParameterHoldForPickupLink = @"hold_for_pickup_link";
static NSString *const kParameterAcsUri = @"acs_uri";
static NSString *const kParameterAcsParams = @"acs_params";

static NSString *const kParameterDigitalGoods = @"digital_goods";
static NSString *const kParameterDigitalGoodsArticle = @"article";
static NSString *const kParameterDigitalGoodsBonus = @"bonus";
static NSString *const kParameterDigitalGoodsMerchantArticleId = @"merchantArticleId";
static NSString *const kParameterDigitalGoodsSerial = @"serial";
static NSString *const kParameterDigitalGoodsSecret = @"secret";

@implementation YMAProcessPaymentResponse

#pragma mark - Public methods

+ (NSArray *)goodsByModel:(id)goodsModel
{
    if (goodsModel == nil)
        return nil;

    NSMutableArray *goods = [NSMutableArray array];

    for (id article in goodsModel) {
        NSString *merchantArticleId = article[kParameterDigitalGoodsMerchantArticleId];
        NSString *serial = article[kParameterDigitalGoodsSerial];
        NSString *secret = article[kParameterDigitalGoodsSecret];
        [goods addObject:[YMAGoodsModel goodsWithId:merchantArticleId serial:serial secret:secret]];
    }

    return goods;
}

+ (YMADigitalGoodsModel *)digitalGoodsByModel:(id)digitalGoodsModel
{
    if (digitalGoodsModel == nil)
        return nil;

    NSArray *articleModel = digitalGoodsModel[kParameterDigitalGoodsArticle];
    NSArray *article = [YMAProcessPaymentResponse goodsByModel:articleModel];

    NSArray *bonusModel = digitalGoodsModel[kParameterDigitalGoodsBonus];
    NSArray *bonus = [YMAProcessPaymentResponse goodsByModel:bonusModel];

    return [YMADigitalGoodsModel digitalGoodsWithArticle:article bonus:bonus];
}

#pragma mark - Overridden methods

- (BOOL)parseJSONModel:(id)responseModel headers:(NSDictionary *)headers error:(NSError * __autoreleasing *)error
{
    BOOL result = [super parseJSONModel:responseModel headers:headers error:error];

    NSString *paymentId = responseModel[kParameterPaymentId];
    NSString *balance = [responseModel[kParameterBalance] stringValue];
    NSString *invoiceId = responseModel[kParameterInvoiceId];
    NSString *payer = responseModel[kParameterPayer];
    NSString *creditAmount = [responseModel[kParameterCreditAmount] stringValue];
    NSString *payeeUid = responseModel[kParameterPayeeUid];
    NSString *payee = responseModel[kParameterPayee];
    NSString *holdForPickupLinkString = responseModel[kParameterHoldForPickupLink];
    NSURL *holdForPickupLink = [NSURL URLWithString:holdForPickupLinkString];

    NSString *acsUrl = responseModel[kParameterAcsUri];
    YMAAscModel *asc = nil;

    if (acsUrl != nil) {
        NSDictionary *acsParams = responseModel[kParameterAcsParams];
        asc = [YMAAscModel ascWithUrl:[NSURL URLWithString:acsUrl] parameters:acsParams];
    }

    id digitalGoodsModel = responseModel[kParameterDigitalGoods];
    YMADigitalGoodsModel *digitalGoods = [YMAProcessPaymentResponse digitalGoodsByModel:digitalGoodsModel];

    _paymentResultInfo = [YMAPaymentResultModel paymentResultWithPaymentId:paymentId
                                                                   balance:balance
                                                                 invoiceId:invoiceId
                                                                     payer:payer
                                                                     payee:payee
                                                              creditAmount:creditAmount
                                                                  payeeUid:payeeUid
                                                         holdForPickupLink:holdForPickupLink
                                                                       asc:asc
                                                              digitalGoods:digitalGoods];

    return result;
}

@end