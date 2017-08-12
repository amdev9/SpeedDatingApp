//
// Created by Alexander Mertvetsov on 23.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAHistoryOperationModel.h"

NS_ASSUME_NONNULL_BEGIN

static NSString *const kKeyHistoryOperationStatusSuccess = @"success";
static NSString *const kKeyHistoryOperationStatusRefused = @"refused";
static NSString *const kKeyHistoryOperationStatusInProgress = @"in_progress";

static NSString *const kKeyHistoryOperationDirectionIn = @"in";
static NSString *const kKeyHistoryOperationDirectionOut = @"out";

static NSString *const kKeyHistoryOperationTypePaymentShop = @"payment-shop";
static NSString *const kKeyHistoryOperationTypeOutgoingTransfer = @"outgoing-transfer";
static NSString *const kKeyHistoryOperationTypeDeposition = @"deposition";
static NSString *const kKeyHistoryOperationTypeIncomingTransfer = @"incoming-transfer";
static NSString *const kKeyHistoryOperationTypeIncomingTransferProtected = @"incoming-transfer-protected";

@implementation YMAHistoryOperationModel

#pragma mark - Object Lifecycle

- (instancetype)initWithOperationId:(NSString *_Nullable)operationId
                             status:(YMAHistoryOperationStatus)status
                           datetime:(NSDate *_Nullable)datetime
                              title:(NSString *_Nullable)title
                          patternId:(NSString *_Nullable)patternId
                          direction:(YMAHistoryOperationDirection)direction
                             amount:(NSString *_Nullable)amount
                              label:(NSString *_Nullable)label
                           favorite:(BOOL)favorite
                               type:(YMAHistoryOperationType)type
{
    self = [super init];

    if (self != nil) {
        _operationId = [operationId copy];
        _status = status;
        _datetime = datetime;
        _title = [title copy];
        _patternId = [patternId copy];
        _direction = direction;
        _amount = [amount copy];
        _label = [label copy];
        _isFavorite = favorite;
        _type = type;
    }

    return self;
}

+ (instancetype)historyOperationWithOperationId:(NSString *_Nullable)operationId
                                         status:(YMAHistoryOperationStatus)status
                                       datetime:(NSDate *_Nullable)datetime
                                          title:(NSString *_Nullable)title
                                      patternId:(NSString *_Nullable)patternId
                                      direction:(YMAHistoryOperationDirection)direction
                                         amount:(NSString *_Nullable)amount
                                          label:(NSString *_Nullable)label
                                       favorite:(BOOL)favorite
                                           type:(YMAHistoryOperationType)type
{
    return [[YMAHistoryOperationModel alloc] initWithOperationId:operationId
                                                          status:status
                                                        datetime:datetime
                                                           title:title
                                                       patternId:patternId
                                                       direction:direction
                                                          amount:amount
                                                           label:label
                                                        favorite:favorite
                                                            type:type];
}


#pragma mark - NSCopying

- (id)copyWithZone:(NSZone *_Nullable)zone
{
    id copy = [[YMAHistoryOperationModel alloc] initWithOperationId:self.operationId
                                                             status:self.status
                                                           datetime:self.datetime
                                                              title:self.title
                                                          patternId:self.patternId
                                                          direction:self.direction
                                                             amount:self.amount
                                                              label:self.label
                                                           favorite:self.isFavorite
                                                               type:self.type];
    return copy;
}


#pragma mark - Equality

- (BOOL)isEqualToHistoryOperation:(YMAHistoryOperationModel *_Nullable)historyOperation
{
    if (historyOperation == nil) {
        return NO;
    }
    return [self.operationId isEqualToString:historyOperation.operationId];
}

- (BOOL)isEqual:(id)object
{
    if (self == object) {
        return YES;
    }

    if ([object isKindOfClass:[self class]] == NO) {
        return NO;
    }

    return [self isEqualToHistoryOperation:object];
}

- (NSUInteger)hash
{
    return [self.operationId hash];
}


#pragma mark - Public methods

+ (YMAHistoryOperationStatus)historyOperationStatusByString:(NSString *)historyOperationStatusString
{
    if ([historyOperationStatusString isEqualToString:kKeyHistoryOperationStatusSuccess])
        return YMAHistoryOperationStatusSuccess;
    else if ([historyOperationStatusString isEqualToString:kKeyHistoryOperationStatusRefused])
        return YMAHistoryOperationStatusRefused;
    else if ([historyOperationStatusString isEqualToString:kKeyHistoryOperationStatusInProgress])
        return YMAHistoryOperationStatusInProgress;

    return YMAHistoryOperationStatusUnknown;
}

+ (NSString *)historyOperationStatusStringByStatus:(YMAHistoryOperationStatus)status
{
    NSString *result = @"";
    switch (status) {
        case YMAHistoryOperationStatusSuccess:
            result = kKeyHistoryOperationStatusSuccess;
            break;

        case YMAHistoryOperationStatusInProgress:
            result = kKeyHistoryOperationStatusInProgress;
            break;

        case YMAHistoryOperationStatusRefused:
            result = kKeyHistoryOperationStatusRefused;
            break;

        default:
            break;
    }
    return result;
}

+ (YMAHistoryOperationDirection)historyOperationDirectionByString:(NSString *)historyOperationDirectionString
{
    if ([historyOperationDirectionString isEqualToString:kKeyHistoryOperationDirectionIn])
        return YMAHistoryOperationDirectionIn;
    else if ([historyOperationDirectionString isEqualToString:kKeyHistoryOperationDirectionOut])
        return YMAHistoryOperationDirectionOut;

    return YMAHistoryOperationDirectionUnknown;
}

+ (YMAHistoryOperationType)historyOperationTypeByString:(NSString *)historyOperationTypeString
{
    if ([historyOperationTypeString isEqualToString:kKeyHistoryOperationTypePaymentShop])
        return YMAHistoryOperationTypePaymentShop;
    else if ([historyOperationTypeString isEqualToString:kKeyHistoryOperationTypeOutgoingTransfer])
        return YMAHistoryOperationTypeOutgoingTransfer;
    else if ([historyOperationTypeString isEqualToString:kKeyHistoryOperationTypeDeposition])
        return YMAHistoryOperationTypeDeposition;
    else if ([historyOperationTypeString isEqualToString:kKeyHistoryOperationTypeIncomingTransfer])
        return YMAHistoryOperationTypeIncomingTransfer;
    else if ([historyOperationTypeString isEqualToString:kKeyHistoryOperationTypeIncomingTransferProtected])
        return YMAHistoryOperationTypeIncomingTransferProtected;

    return YMAHistoryOperationTypeUnknown;
}

+ (NSString *)historyOperationTypeStringByType:(YMAHistoryOperationType)type
{
    NSString *result = @"";
    switch (type) {
        case YMAHistoryOperationTypeUnknown:
            break;
        case YMAHistoryOperationTypePaymentShop:
            result = kKeyHistoryOperationTypePaymentShop;
            break;
        case YMAHistoryOperationTypeOutgoingTransfer:
            result = kKeyHistoryOperationTypeOutgoingTransfer;
            break;
        case YMAHistoryOperationTypeDeposition:
            result = kKeyHistoryOperationTypeDeposition;
            break;
        case YMAHistoryOperationTypeIncomingTransfer:
            result = kKeyHistoryOperationTypeIncomingTransfer;
            break;
        case YMAHistoryOperationTypeIncomingTransferProtected:
            result = kKeyHistoryOperationTypeIncomingTransferProtected;
            break;
    }
    return result;
}

- (NSComparisonResult)compare:(YMAHistoryOperationModel *)otherObject
{
    return -[self.datetime compare:otherObject.datetime];
}

@end

NS_ASSUME_NONNULL_END
