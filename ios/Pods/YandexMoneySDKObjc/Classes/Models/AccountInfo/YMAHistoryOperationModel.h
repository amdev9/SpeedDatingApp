//
// Created by Alexander Mertvetsov on 23.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

@import Foundation;

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, YMAHistoryOperationStatus) {
    YMAHistoryOperationStatusUnknown,
    YMAHistoryOperationStatusSuccess,
    YMAHistoryOperationStatusRefused,
    YMAHistoryOperationStatusInProgress
};

typedef NS_ENUM(NSInteger, YMAHistoryOperationDirection) {
    YMAHistoryOperationDirectionUnknown,
    YMAHistoryOperationDirectionIn,
    YMAHistoryOperationDirectionOut
};

typedef NS_ENUM(NSInteger, YMAHistoryOperationType) {
    YMAHistoryOperationTypeUnknown,
    YMAHistoryOperationTypePaymentShop,
    YMAHistoryOperationTypeOutgoingTransfer,
    YMAHistoryOperationTypeDeposition,
    YMAHistoryOperationTypeIncomingTransfer,
    YMAHistoryOperationTypeIncomingTransferProtected
};

@interface YMAHistoryOperationModel : NSObject <NSCopying>

- (instancetype)init NS_UNAVAILABLE;

- (instancetype)initWithOperationId:(NSString *_Nullable)operationId
                             status:(YMAHistoryOperationStatus)status
                           datetime:(NSDate *_Nullable)datetime
                              title:(NSString *_Nullable)title
                          patternId:(NSString *_Nullable)patternId
                          direction:(YMAHistoryOperationDirection)direction
                             amount:(NSString *_Nullable)amount
                              label:(NSString *_Nullable)label
                           favorite:(BOOL)favorite
                               type:(YMAHistoryOperationType)type NS_DESIGNATED_INITIALIZER;

+ (instancetype)historyOperationWithOperationId:(NSString *_Nullable)operationId
                                         status:(YMAHistoryOperationStatus)status
                                       datetime:(NSDate *_Nullable)datetime
                                          title:(NSString *_Nullable)title
                                      patternId:(NSString *_Nullable)patternId
                                      direction:(YMAHistoryOperationDirection)direction
                                         amount:(NSString *_Nullable)amount
                                          label:(NSString *_Nullable)label
                                       favorite:(BOOL)favorite
                                           type:(YMAHistoryOperationType)type;

+ (YMAHistoryOperationStatus)historyOperationStatusByString:(NSString *)historyOperationStatusString;

+ (NSString *)historyOperationStatusStringByStatus:(YMAHistoryOperationStatus)status;

+ (YMAHistoryOperationDirection)historyOperationDirectionByString:(NSString *)historyOperationDirectionString;

+ (YMAHistoryOperationType)historyOperationTypeByString:(NSString *)historyOperationTypeString;

+ (NSString *)historyOperationTypeStringByType:(YMAHistoryOperationType)type;

- (NSComparisonResult)compare:(YMAHistoryOperationModel *)otherObject;

- (BOOL)isEqualToHistoryOperation:(YMAHistoryOperationModel *_Nullable)historyOperation;

@property (nonatomic, copy, readonly, nullable) NSString *operationId;
@property (nonatomic, assign, readonly) YMAHistoryOperationStatus status;
@property (nonatomic, strong, readonly, nullable) NSDate *datetime;
@property (nonatomic, copy, readonly, nullable) NSString *title;
@property (nonatomic, copy, readonly, nullable) NSString *patternId;
@property (nonatomic, assign, readonly) YMAHistoryOperationDirection direction;
@property (nonatomic, copy, readonly, nullable) NSString *amount;
@property (nonatomic, copy, readonly, nullable) NSString *label;
@property (nonatomic, assign, readonly) BOOL isFavorite;
@property (nonatomic, assign, readonly) YMAHistoryOperationType type;

@end

NS_ASSUME_NONNULL_END
