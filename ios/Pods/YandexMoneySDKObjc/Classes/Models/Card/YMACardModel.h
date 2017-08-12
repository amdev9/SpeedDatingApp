/*!
 @class YMACardModel
 @version 4.1
 @author Dmitry Shakolo
 @creation_date 18.09.15
 @copyright Copyright (c) 2015 NBCO Yandex.Money LLC. All rights reserved.
 @discussion Card model.
 */

#import "YMAMoneySourceModel.h"

typedef NS_ENUM(NSUInteger, YMACardState) {
    YMACardStateUnknown,
    YMACardStateActive,
    YMACardStateActiveNoPin,
    YMACardStateAwaitActivation,
    YMACardStateBlocked,
    YMACardStateExpired
};

typedef NS_ENUM(NSUInteger, YMACardKind) {
    YMACardKindPlastic,
    YMACardKindVirtual
};

typedef NS_ENUM(NSUInteger, YMACardEmission) {
    YMACardEmissionUnknown,
    YMACardEmissionYacard
};

NS_ASSUME_NONNULL_BEGIN

extern NSString *const YMACardIdKey;
extern NSString *const YMACardTypeKey;
extern NSString *const YMACardPanFragmentKey;
extern NSString *const YMACardStateKey;
extern NSString *const YMACardKindKey;
extern NSString *const YMACardEmissionKey;

@interface YMACardModel : YMAMoneySourceModel

@property (nonatomic, copy, readonly) NSString *cardId;
@property (nonatomic, assign, readonly) YMACardState state;
@property (nonatomic, assign, readonly) YMACardKind kind;
@property (nonatomic, assign, readonly) YMACardEmission emission;

+ (instancetype)cardWithId:(NSString *)cardId
                      type:(YMAPaymentCardType)cardType
               panFragment:(NSString *)panFragment
                     state:(YMACardState)state
                      kind:(YMACardKind)kind
                  emission:(YMACardEmission)emission;

+ (instancetype)cardByDictionary:(NSDictionary *)dictionary;

+ (instancetype)cardByDictionary:(NSDictionary *)dictionary
                            kind:(YMACardKind)kind
                        emission:(YMACardEmission)emission;

+ (YMACardState)cardStateByString:(NSString *)stateString;

NS_ASSUME_NONNULL_END

@end
