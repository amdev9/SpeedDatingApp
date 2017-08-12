//
// Created by Alexander Mertvetsov on 22.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAAccountInfoModel.h"

NS_ASSUME_NONNULL_BEGIN

static NSString *const kKeyAccountStatusAnonymous = @"anonymous";
static NSString *const kKeyAccountStatusNamed = @"named";
static NSString *const kKeyAccountStatusIdentified = @"identified";

static NSString *const kKeyAccountTypePersonal = @"personal";
static NSString *const kKeyAccountTypeProfessional = @"professional";

@implementation YMAAccountInfoModel

#pragma mark - Object Lifecycle

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
                            virtualCards:(NSArray *_Nullable)virtualCards
{
    self = [super init];
    if (self != nil) {
        if (account == nil || balance == nil || currency == nil) {
            return nil;
        }
        _account = [account copy];
        _balance = [balance copy];
        _currency = [currency copy];
        _accountStatus = accountStatus;
        _accountType = accountType;
        _avatar = avatar;
        _balanceDetails = balanceDetails;
        _cardsLinked = [cardsLinked copy];
        _servicesAdditional = [servicesAdditional copy];
        _yamoneyCards = [yamoneyCards copy];
        _virtualCards = [virtualCards copy];
    }
    return self;
}

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
                                   virtualCards:(NSArray *_Nullable)virtualCards
{
    return [[YMAAccountInfoModel alloc] initWithAccount:account
                                                balance:balance
                                               currency:currency
                                          accountStatus:accountStatus
                                            accountType:accountType
                                                 avatar:avatar
                                         balanceDetails:balanceDetails
                                            cardsLinked:cardsLinked
                                     servicesAdditional:servicesAdditional
                                           yamoneyCards:yamoneyCards
                                           virtualCards:virtualCards];
}

#pragma mark - Public methods

+ (YMAAccountStatus)accountStatusByString:(NSString *)accountStatusString
{
    if ([accountStatusString isEqualToString:kKeyAccountStatusAnonymous])
        return YMAAccountStatusAnonymous;
    else if ([accountStatusString isEqualToString:kKeyAccountStatusIdentified])
        return YMAAccountStatusIdentified;
    else if ([accountStatusString isEqualToString:kKeyAccountStatusNamed])
        return YMAAccountStatusNamed;

    return YMAAccountStatusUnknown;
}

+ (YMAAccountType)accountTypeByString:(NSString *)accountTypeString
{
    if ([accountTypeString isEqualToString:kKeyAccountTypePersonal])
        return YMAAccountTypePersonal;
    else if ([accountTypeString isEqualToString:kKeyAccountTypeProfessional])
        return YMAAccountTypeProfessional;
    
    return YMAAccountTypeUnknown;
}

@end

NS_ASSUME_NONNULL_END
