//
// Created by Alexander Mertvetsov on 21.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAPaymentInfoModel.h"


@implementation YMAPaymentInfoModel

#pragma mark - Object Lifecycle

- (instancetype)initWithMoneySources:(YMAMoneySourcesModel *)moneySources
                           requestId:(NSString *)requestId
                      contractAmount:(NSString *)contractAmount
                             balance:(NSString *)balance
              recipientAccountStatus:(YMAAccountStatus)recipientAccountStatus
                recipientAccountType:(YMAAccountType)recipientAccountType
                      protectionCode:(NSString *)protectionCode
                        extActionUri:(NSURL *)extActionUri
                               title:(NSString *)title
{
    self = [super init];

    if (self != nil) {
        _moneySources = moneySources;
        _requestId = [requestId copy];
        _contractAmount = [contractAmount copy];
        _balance = [balance copy];
        _recipientAccountStatus = recipientAccountStatus;
        _recipientAccountType = recipientAccountType;
        _protectionCode = [protectionCode copy];
        _extActionUri = extActionUri;
        _title = [title copy];
    }

    return self;
}

+ (instancetype)paymentInfoWithMoneySources:(YMAMoneySourcesModel *)moneySources
                                  requestId:(NSString *)requestId
                             contractAmount:(NSString *)contractAmount
                                    balance:(NSString *)balance
                     recipientAccountStatus:(YMAAccountStatus)recipientAccountStatus
                       recipientAccountType:(YMAAccountType)recipientAccountType
                             protectionCode:(NSString *)protectionCode
                               extActionUri:(NSURL *)extActionUri
                                      title:(NSString *)title
{
    return [[YMAPaymentInfoModel alloc] initWithMoneySources:moneySources
                                                   requestId:requestId
                                              contractAmount:contractAmount
                                                     balance:balance
                                      recipientAccountStatus:recipientAccountStatus
                                        recipientAccountType:recipientAccountType
                                              protectionCode:protectionCode
                                                extActionUri:extActionUri
                                                       title:title];
}

@end