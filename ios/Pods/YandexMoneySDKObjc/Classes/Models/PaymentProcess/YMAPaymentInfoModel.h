//
// Created by Alexander Mertvetsov on 21.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YMAAccountInfoModel.h"
#import "YMAMoneySourcesModel.h"

@interface YMAPaymentInfoModel : NSObject

+ (instancetype)paymentInfoWithMoneySources:(YMAMoneySourcesModel *)moneySources
                                  requestId:(NSString *)requestId
                             contractAmount:(NSString *)contractAmount
                                    balance:(NSString *)balance
                     recipientAccountStatus:(YMAAccountStatus)recipientAccountStatus
                       recipientAccountType:(YMAAccountType)recipientAccountType
                             protectionCode:(NSString *)protectionCode
                               extActionUri:(NSURL *)extActionUri
                                      title:(NSString *)title;

@property (nonatomic, copy, readonly) NSString *requestId;
@property (nonatomic, strong, readonly) YMAMoneySourcesModel *moneySources;
@property (nonatomic, copy, readonly) NSString *contractAmount;
@property (nonatomic, copy, readonly) NSString *balance;
@property (nonatomic, assign, readonly) YMAAccountStatus recipientAccountStatus;
@property (nonatomic, assign, readonly) YMAAccountType recipientAccountType;
@property (nonatomic, copy, readonly) NSString *protectionCode;
@property (nonatomic, strong, readonly) NSURL *extActionUri;
@property (nonatomic, copy, readonly) NSString *title;

@end