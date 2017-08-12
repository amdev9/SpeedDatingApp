//
// Created by Alexander Mertvetsov on 26.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YMAHistoryOperationModel.h"

NS_ASSUME_NONNULL_BEGIN

@class YMADigitalGoodsModel;

typedef NS_ENUM(NSInteger, YMARecipientType) {
    YMARecipientTypeUnknown,
    YMARecipientTypeAccount,
    YMARecipientTypePhone,
    YMARecipientTypeEmail
};

@interface YMAOperationDetailsModel : YMAHistoryOperationModel

- (instancetype)initWithOperationId:(NSString *_Nullable)operationId
                             status:(YMAHistoryOperationStatus)status
                           datetime:(NSDate *_Nullable)datetime
                              title:(NSString *_Nullable)title
                          patternId:(NSString *_Nullable)patternId
                          direction:(YMAHistoryOperationDirection)direction
                             amount:(NSString *_Nullable)amount
                              label:(NSString *_Nullable)label
                           favorite:(BOOL)favorite
                               type:(YMAHistoryOperationType)type NS_UNAVAILABLE;

- (instancetype)initWithOperation:(YMAHistoryOperationModel *)operation
                        amountDue:(NSString *_Nullable)amountDue
                              fee:(NSString *_Nullable)fee
                           sender:(NSString *_Nullable)sender
                        recipient:(NSString *_Nullable)recipient
                    recipientType:(YMARecipientType)recipientType
                          message:(NSString *_Nullable)message
                          comment:(NSString *_Nullable)comment
                          codepro:(BOOL)codePro
                   protectionCode:(NSString *_Nullable)protectionCode
                          expires:(NSDate *_Nullable)expires
                   answerDatetime:(NSDate *_Nullable)answerDatetime
                          details:(NSString *_Nullable)details
                       repeatable:(BOOL)repeatable
                paymentParameters:(NSDictionary<NSString *, id> *_Nullable)paymentParameters
                     digitalGoods:(YMADigitalGoodsModel *_Nullable)digitalGoods NS_DESIGNATED_INITIALIZER;

+ (instancetype)operationDetailsWithOperation:(YMAHistoryOperationModel *)operation
                                    amountDue:(NSString *_Nullable)amountDue
                                          fee:(NSString *_Nullable)fee
                                       sender:(NSString *_Nullable)sender
                                    recipient:(NSString *_Nullable)recipient
                                recipientType:(YMARecipientType)recipientType
                                      message:(NSString *_Nullable)message
                                      comment:(NSString *_Nullable)comment
                                      codepro:(BOOL)codePro
                               protectionCode:(NSString *_Nullable)protectionCode
                                      expires:(NSDate *_Nullable)expires
                               answerDatetime:(NSDate *_Nullable)answerDatetime
                                      details:(NSString *_Nullable)details
                                   repeatable:(BOOL)repeatable
                            paymentParameters:(NSDictionary<NSString *, id> *_Nullable)paymentParameters
                                 digitalGoods:(YMADigitalGoodsModel *_Nullable)digitalGoods;

+ (YMARecipientType)recipientTypeByString:(NSString *)recipientTypeString;

@property (nonatomic, copy, readonly, nullable) NSString *amountDue;
@property (nonatomic, copy, readonly, nullable) NSString *fee;
@property (nonatomic, copy, readonly, nullable) NSString *sender;
@property (nonatomic, copy, readonly, nullable) NSString *recipient;
@property (nonatomic, assign, readonly) YMARecipientType recipientType;
@property (nonatomic, copy, readonly, nullable) NSString *message;
@property (nonatomic, copy, readonly, nullable) NSString *comment;
@property (nonatomic, assign, readonly) BOOL codePro;
@property (nonatomic, copy, readonly, nullable) NSString *protectionCode;
@property (nonatomic, strong, readonly, nullable) NSDate *expires;
@property (nonatomic, strong, readonly, nullable) NSDate *answerDatetime;
@property (nonatomic, copy, readonly, nullable) NSString *details;
@property (nonatomic, assign, readonly) BOOL repeatable;
@property (nonatomic, strong, readonly, nullable) NSDictionary<NSString *, id> *paymentParameters;
@property (nonatomic, strong, readonly, nullable) YMADigitalGoodsModel *digitalGoods;

@end

NS_ASSUME_NONNULL_END
