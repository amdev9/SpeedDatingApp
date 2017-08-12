//
// Created by Alexander Mertvetsov on 21.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAPaymentResponse.h"

static NSString *const kParameterRequestId = @"request_id";
static NSString *const kParameterMoneySource = @"money_source";
static NSString *const kParameterContractAmount = @"contract_amount";
static NSString *const kParameterBalance = @"balance";
static NSString *const kParameterRecipientAccountStatus = @"recipient_account_status";
static NSString *const kParameterRecipientAccountType = @"recipient_account_type";
static NSString *const kParameterProtectionCode = @"protection_code";
static NSString *const kParameterExtActionUri = @"ext_action_uri";
static NSString *const kParameterTitle = @"title";
static NSString *const kParameterMoneySourceWallet = @"wallet";
//static NSString *const kParameterMoneySourceCard = @"card";
static NSString *const kParameterMoneySourceCards = @"cards";
static NSString *const kParameterMoneySourceItems = @"items";
static NSString *const kParameterMoneySourceId = @"id";
static NSString *const kParameterMoneySourcePanFragment = @"pan_fragment";
static NSString *const kParameterMoneySourceType = @"type";
static NSString *const kParameterMoneySourceAllowed = @"allowed";
static NSString *const kParameterMoneySourceCscRequired = @"csc_required";

@implementation YMAPaymentResponse

#pragma mark - Public methods

+ (YMAMoneySourcesModel *)moneySourcesFromModel:(id)moneySourcesModel
{
    if (moneySourcesModel == nil)
        return nil;

    YMAWalletSourceGroupModel *walletSourceGroup = nil;

    id walletModel = moneySourcesModel[kParameterMoneySourceWallet];

    if (walletModel != nil) {
        BOOL walletAllowed = [walletModel[kParameterMoneySourceAllowed] boolValue];
        walletSourceGroup = [YMAWalletSourceGroupModel walletMoneySourceWithAllowed:walletAllowed];
    }

    YMACardsSourceGroupModel *cardsSourceGroup = nil;

    id cardsModel = moneySourcesModel[kParameterMoneySourceCards];

    if (cardsModel == nil)
        return [YMAMoneySourcesModel moneySourcesWithWallet:walletSourceGroup cardsSource:nil];

    NSMutableArray *cards = nil;
    YMAMoneySourceModel *defaultCard = nil;

    BOOL cardsAllowed = [cardsModel[kParameterMoneySourceAllowed] boolValue];
    BOOL isCscRequired = [cardsModel[kParameterMoneySourceCscRequired] boolValue];

    NSArray *cardsModelItems = cardsModel[kParameterMoneySourceItems];

    if (cardsModelItems != nil) {
        cards = [NSMutableArray array];

        for (id cardModel in cardsModelItems) {
            NSString *cardId = cardModel[kParameterMoneySourceId];
            NSString *panFragment = cardModel[kParameterMoneySourcePanFragment];
            NSString *cardTypeString = cardModel[kParameterMoneySourceType];
            YMAPaymentCardType cardType = [YMAMoneySourceModel paymentCardTypeByString:cardTypeString];
            cardsAllowed = [cardModel[kParameterMoneySourceAllowed] boolValue];
            isCscRequired = [cardModel[kParameterMoneySourceCscRequired] boolValue];
            YMAMoneySourceModel *card = [YMAMoneySourceModel moneySourceWithType:YMAMoneySourcePaymentCard
                                                                        cardType:cardType
                                                                     panFragment:panFragment
                                                                moneySourceToken:cardId];
            [cards addObject:card];
        }

        defaultCard = cards.count ? cards[0] : nil;
    }

    cardsSourceGroup = [YMACardsSourceGroupModel cardsSourceWithCards:cards
                                                          defaultCard:defaultCard
                                                          cscRequired:isCscRequired
                                                              allowed:cardsAllowed];

    return [YMAMoneySourcesModel moneySourcesWithWallet:walletSourceGroup cardsSource:cardsSourceGroup];
}


#pragma mark - Overridden methods

- (BOOL)parseJSONModel:(id)responseModel headers:(NSDictionary *)headers error:(NSError * __autoreleasing *)error
{
    BOOL result = [super parseJSONModel:responseModel headers:headers error:error];

    NSString *requestId = responseModel[kParameterRequestId];
    NSString *contractAmount = [responseModel[kParameterContractAmount] stringValue];
    NSString *balance = [responseModel[kParameterBalance] stringValue];

    NSString *accountStatusString = responseModel[kParameterRecipientAccountStatus];
    YMAAccountStatus accountStatus = [YMAAccountInfoModel accountStatusByString:accountStatusString];

    NSString *accountTypeString = responseModel[kParameterRecipientAccountType];
    YMAAccountType accountType = [YMAAccountInfoModel accountTypeByString:accountTypeString];

    NSString *protectionCode = responseModel[kParameterProtectionCode];
    NSString *extActionUriString = responseModel[kParameterExtActionUri];
    NSURL *extActionUri = [NSURL URLWithString:extActionUriString];
    NSString *title = responseModel[kParameterTitle];

    id moneySourcesModel = responseModel[kParameterMoneySource];
    YMAMoneySourcesModel *moneySources = [YMAPaymentResponse moneySourcesFromModel:moneySourcesModel];

    _paymentInfo = [YMAPaymentInfoModel paymentInfoWithMoneySources:moneySources
                                                          requestId:requestId
                                                     contractAmount:contractAmount
                                                            balance:balance
                                             recipientAccountStatus:accountStatus
                                               recipientAccountType:accountType
                                                     protectionCode:protectionCode
                                                       extActionUri:extActionUri
                                                              title:title];

    return result;
}

@end