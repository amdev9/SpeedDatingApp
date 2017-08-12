//
// Created by Alexander Mertvetsov on 29.01.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAMoneySourceModel.h"

NS_ASSUME_NONNULL_BEGIN

static NSString *const kPaymentCardTypeVISA = @"VISA";
static NSString *const kPaymentCardTypeMasterCard = @"MasterCard";
static NSString *const kPaymentCardTypeAmericanExpress = @"AmericanExpress";
static NSString *const kPaymentCardTypeJCB = @"JCB";

static NSString *const kTypeKey             = @"type";
static NSString *const kCardTypeKey         = @"cardType";
static NSString *const kPanFragmentKey      = @"panFragment";
static NSString *const kMoneySourceTokenKey = @"moneySourceToken";
static NSString *const kExternalKey         = @"external";

@implementation YMAMoneySourceModel

#pragma mark - Object Lifecycle

- (instancetype)initWithType:(YMAMoneySourceType)type
                    cardType:(YMAPaymentCardType)cardType
                 panFragment:(NSString *_Nullable)panFragment
            moneySourceToken:(NSString *_Nullable)moneySourceToken
                    external:(BOOL)external
{
    self = [super init];
    if (self != nil) {
        _type = type;
        _cardType = cardType;
        _panFragment = [panFragment copy];
        _moneySourceToken = [moneySourceToken copy];
        _external = external;
    }

    return self;
}

+ (instancetype)moneySourceWithType:(YMAMoneySourceType)type
                           cardType:(YMAPaymentCardType)cardType
                        panFragment:(NSString *_Nullable)panFragment
                   moneySourceToken:(NSString *_Nullable)moneySourceToken
{
    return [self moneySourceWithType:type
                            cardType:cardType
                         panFragment:panFragment
                    moneySourceToken:moneySourceToken
                            external:NO];
}

+ (instancetype)moneySourceWithType:(YMAMoneySourceType)type
                           cardType:(YMAPaymentCardType)cardType
                        panFragment:(NSString *_Nullable)panFragment
                   moneySourceToken:(NSString *_Nullable)moneySourceToken
                           external:(BOOL)external
{
    return [[YMAMoneySourceModel alloc] initWithType:type
                                            cardType:cardType
                                         panFragment:panFragment
                                    moneySourceToken:moneySourceToken
                                            external:external];
}


#pragma mark - NSCoding

- (nullable instancetype)initWithCoder:(NSCoder *)decoder
{
    self = [super init];
    if (self != nil) {
        _type             = (YMAMoneySourceType)[decoder decodeIntegerForKey:kTypeKey];
        _cardType         = (YMAPaymentCardType)[decoder decodeIntegerForKey:kCardTypeKey];
        _panFragment      = [decoder decodeObjectForKey:kPanFragmentKey];
        _moneySourceToken = [decoder decodeObjectForKey:kMoneySourceTokenKey];
        _external         = [decoder decodeBoolForKey:kExternalKey];
    }
    return self;
}

- (void)encodeWithCoder:(NSCoder *)encoder
{
    [encoder encodeInteger:(NSInteger)self.type     forKey:kTypeKey];
    [encoder encodeInteger:(NSInteger)self.cardType forKey:kCardTypeKey];
    [encoder encodeObject:self.panFragment          forKey:kPanFragmentKey];
    [encoder encodeObject:self.moneySourceToken     forKey:kMoneySourceTokenKey];
    [encoder encodeBool:self.isExternal             forKey:kExternalKey];
}

#pragma mark - Public methods

+ (YMAPaymentCardType)paymentCardTypeByString:(NSString *)string
{
    if ([string isEqualToString:kPaymentCardTypeVISA])
        return YMAPaymentCardTypeVISA;

    if ([string isEqualToString:kPaymentCardTypeMasterCard])
        return YMAPaymentCardTypeMasterCard;

    if ([string isEqualToString:kPaymentCardTypeAmericanExpress])
        return YMAPaymentCardTypeAmericanExpress;

    if ([string isEqualToString:kPaymentCardTypeJCB])
        return YMAPaymentCardTypeJCB;

    return YMAPaymentCardUnknown;
}

@end

NS_ASSUME_NONNULL_END
