//
// Created by Alexander Mertvetsov on 22.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAPaymentResultModel.h"

@implementation YMAPaymentResultModel

#pragma mark - Object Lifecycle

- (instancetype)initWithPaymentId:(NSString *)paymentId
                balance:(NSString *)balance
              invoiceId:(NSString *)invoiceId
                  payer:(NSString *)payer
                  payee:(NSString *)payee
           creditAmount:(NSString *)creditAmount
               payeeUid:(NSString *)payeeUid
      holdForPickupLink:(NSURL *)holdForPickupLink
                    asc:(YMAAscModel *)asc
           digitalGoods:(YMADigitalGoodsModel *)digitalGoods
{
    self = [super init];

    if (self != nil) {
        _paymentId = [paymentId copy];
        _balance = [balance copy];
        _invoiceId = [invoiceId copy];
        _payer = [payer copy];
        _payee = [payee copy];
        _creditAmount = [creditAmount copy];
        _payeeUid = [payeeUid copy];
        _holdForPickupLink = holdForPickupLink;
        _asc = asc;
        _digitalGoods = digitalGoods;
    }

    return self;
}

+ (instancetype)paymentResultWithPaymentId:(NSString *)paymentId
                                   balance:(NSString *)balance
                                 invoiceId:(NSString *)invoiceId
                                     payer:(NSString *)payer
                                     payee:(NSString *)payee
                              creditAmount:(NSString *)creditAmount
                                  payeeUid:(NSString *)payeeUid
                         holdForPickupLink:(NSURL *)holdForPickupLink
                                       asc:(YMAAscModel *)asc
                              digitalGoods:(YMADigitalGoodsModel *)digitalGoods
{
    return [[YMAPaymentResultModel alloc] initWithPaymentId:paymentId
                                                    balance:balance
                                                  invoiceId:invoiceId
                                                      payer:payer
                                                      payee:payee
                                               creditAmount:creditAmount
                                                   payeeUid:payeeUid
                                          holdForPickupLink:holdForPickupLink
                                                        asc:asc
                                               digitalGoods:digitalGoods];
}

@end