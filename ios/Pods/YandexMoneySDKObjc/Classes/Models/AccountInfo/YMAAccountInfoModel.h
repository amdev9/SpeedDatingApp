//
// Created by Alexander Mertvetsov on 22.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YMAAvatarModel.h"
#import "YMABalanceDetailsModel.h"

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, YMAAccountStatus) {
    YMAAccountStatusUnknown,
    YMAAccountStatusAnonymous,
    YMAAccountStatusNamed,
    YMAAccountStatusIdentified
};

typedef NS_ENUM(NSInteger, YMAAccountType) {
    YMAAccountTypeUnknown,
    YMAAccountTypePersonal,
    YMAAccountTypeProfessional
};

@interface YMAAccountInfoModel : NSObject

- (nullable instancetype)initWithAccount:(NSString *_Nullable)account
                                 balance:(NSString *_Nullable)balance
                                currency:(NSString *_Nullable)currency
                           accountStatus:(YMAAccountStatus)accountStatus
                             accountType:(YMAAccountType)accountType
                                  avatar:(YMAAvatarModel *_Nullable)avatar
                          balanceDetails:(YMABalanceDetailsModel *_Nullable)balanceDetails
                             cardsLinked:(NSArray *_Nullable)cardsLinked
                      servicesAdditional:(NSArray *_Nullable)servicesAdditional
                            yamoneyCards:(NSArray *_Nullable)yamoneyCards
                            virtualCards:(NSArray *_Nullable)virtualCards;

+ (nullable instancetype)accountInfoWithAccount:(NSString *_Nullable)account
                                        balance:(NSString *_Nullable)balance
                                       currency:(NSString *_Nullable)currency
                                  accountStatus:(YMAAccountStatus)accountStatus
                                    accountType:(YMAAccountType)accountType
                                         avatar:(YMAAvatarModel *_Nullable)avatar
                                 balanceDetails:(YMABalanceDetailsModel *_Nullable)balanceDetails
                                    cardsLinked:(NSArray *_Nullable)cardsLinked
                             servicesAdditional:(NSArray *_Nullable)servicesAdditional
                                   yamoneyCards:(NSArray *_Nullable)yamoneyCards
                                   virtualCards:(NSArray *_Nullable)virtualCards;

+ (YMAAccountStatus)accountStatusByString:(NSString *)accountStatusString;

+ (YMAAccountType)accountTypeByString:(NSString *)accountTypeString;

@property (nonatomic, copy, readonly) NSString *account;
@property (nonatomic, copy, readonly) NSString *balance;
@property (nonatomic, copy, readonly) NSString *currency;
@property (nonatomic, assign, readonly) YMAAccountStatus accountStatus;
@property (nonatomic, assign, readonly) YMAAccountType accountType;
@property (nonatomic, strong, readonly, nullable) YMAAvatarModel *avatar;
@property (nonatomic, strong, readonly, nullable) YMABalanceDetailsModel *balanceDetails;
@property (nonatomic, copy, readonly, nullable) NSArray *cardsLinked;
@property (nonatomic, copy, readonly, nullable) NSArray *servicesAdditional;
@property (nonatomic, copy, readonly, nullable) NSArray *yamoneyCards;
@property (nonatomic, copy, readonly, nullable) NSArray *virtualCards;

@end

NS_ASSUME_NONNULL_END
