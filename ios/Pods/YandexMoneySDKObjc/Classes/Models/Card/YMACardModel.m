
#import "YMACardModel.h"
#import "NSDictionary+YMATools.h"

static NSString *const kCardStateUnknownString         = @"unknown";
static NSString *const kCardStateActiveString          = @"active";
static NSString *const kCardStateActiveNoPinString     = @"active_no_pin";
static NSString *const kCardStateAwaitActivationString = @"awaiting_activation";
static NSString *const kCardStateBlockedString         = @"blocked";
static NSString *const kCardStateExpiredString         = @"expired";

NSString *const YMACardIdKey          = @"id";
NSString *const YMACardTypeKey        = @"type";
NSString *const YMACardPanFragmentKey = @"pan_fragment";
NSString *const YMACardStateKey       = @"state";
NSString *const YMACardKindKey        = @"kind";
NSString *const YMACardEmissionKey    = @"emission";


@implementation YMACardModel
@synthesize type = _type;
@synthesize cardType = _cardType;
@synthesize panFragment = _panFragment;

- (instancetype)initWithId:(NSString *)cardId
                      type:(YMAPaymentCardType)cardType
               panFragment:(NSString *)panFragment
                     state:(YMACardState)state
                      kind:(YMACardKind)kind
                  emission:(YMACardEmission)emission
{
    self = [super init];
    
    if (self != nil) {
        _cardId = [cardId copy];
        _type = YMAMoneySourcePaymentCard;
        _cardType = cardType;
        _panFragment = [panFragment copy];
        _state = state;
        _kind = kind;
        _emission = emission;
    }
    
    return self;
}

+ (instancetype)cardWithId:(NSString *)cardId
                      type:(YMAPaymentCardType)cardType
               panFragment:(NSString *)panFragment
                     state:(YMACardState)state
                      kind:(YMACardKind)kind
                  emission:(YMACardEmission)emission
{
    return [[self alloc] initWithId:cardId
                               type:cardType
                        panFragment:panFragment
                              state:state
                               kind:kind
                           emission:emission];
}

+ (instancetype)cardByDictionary:(NSDictionary *)dictionary
{
    return [self cardByDictionary:dictionary
                             kind:[[dictionary yma_objectForKey:YMACardKindKey] integerValue]
                         emission:[[dictionary yma_objectForKey:YMACardEmissionKey] integerValue]];
}

+ (instancetype)cardByDictionary:(NSDictionary *)dictionary
                            kind:(YMACardKind)kind
                        emission:(YMACardEmission)emission
{
    NSString *cardId = [dictionary yma_objectForKey:YMACardIdKey];
    NSString *panFragment = [dictionary yma_objectForKey:YMACardPanFragmentKey];
    
    YMAPaymentCardType cardType = YMAPaymentCardUnknown;
    id cardTypeObject = [dictionary yma_objectForKey:YMACardTypeKey];
    if ([cardTypeObject isKindOfClass:[NSString class]]) {
        NSString *cardTypeString = cardTypeObject;
        cardType = [self paymentCardTypeByString:cardTypeString];
    }
    else if ([cardTypeObject isKindOfClass:[NSNumber class]]) {
        cardType = [cardTypeObject integerValue];
    }
    
    YMACardState state = YMACardStateUnknown;
    id stateObject = [dictionary yma_objectForKey:YMACardStateKey];
    if ([stateObject isKindOfClass:[NSString class]]) {
        NSString *stateString = stateObject;
        state = [self cardStateByString:stateString];
    }
    else if ([stateObject isKindOfClass:[NSNumber class]]) {
        state = [stateObject integerValue];
    }
    
    return [[self alloc] initWithId:cardId
                               type:cardType
                        panFragment:panFragment
                              state:state
                               kind:kind
                           emission:emission];
}

+ (YMACardState)cardStateByString:(NSString *)stateString
{
    if ([stateString isEqualToString:kCardStateActiveString]) {
        return YMACardStateActive;
    }
    
    if ([stateString isEqualToString:kCardStateActiveNoPinString]) {
        return YMACardStateActiveNoPin;
    }
    
    if ([stateString isEqualToString:kCardStateAwaitActivationString]) {
        return YMACardStateAwaitActivation;
    }
    
    if ([stateString isEqualToString:kCardStateBlockedString]) {
        return YMACardStateBlocked;
    }
    
    if ([stateString isEqualToString:kCardStateExpiredString]) {
        return YMACardStateExpired;
    }
    
    return YMACardStateUnknown;
}

@end
