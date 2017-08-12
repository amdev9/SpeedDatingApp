//
// Created by Alexander Mertvetsov on 26.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAOperationDetailsModel.h"
#import "YMADigitalGoodsModel.h"

NS_ASSUME_NONNULL_BEGIN

static NSString *const kKeyRecipientTypeAccount = @"account";
static NSString *const kKeyRecipientTypePhone = @"phone";
static NSString *const kKeyRecipientTypeEmail = @"email";

@implementation YMAOperationDetailsModel

#pragma mark - Object Lifecycle

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
                     digitalGoods:(YMADigitalGoodsModel *_Nullable)digitalGoods
{
    self = [super initWithOperationId:operation.operationId
                               status:operation.status
                             datetime:operation.datetime
                                title:operation.title
                            patternId:operation.patternId
                            direction:operation.direction
                               amount:operation.amount
                                label:operation.label
                             favorite:operation.isFavorite
                                 type:operation.type];

    if (self != nil) {
        _amountDue = [amountDue copy];
        _fee = [fee copy];
        _sender = [sender copy];
        _recipient = [recipient copy];
        _recipientType = recipientType;
        _message = [message copy];
        _comment = [comment copy];
        _codePro = codePro;
        _protectionCode = [protectionCode copy];
        _expires = expires;
        _answerDatetime = answerDatetime;
        _details = [details copy];
        _repeatable = repeatable;
        _paymentParameters = paymentParameters;
        _digitalGoods = digitalGoods;
    }

    return self;
}

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
                            paymentParameters:(NSDictionary *_Nullable)paymentParameters
                                 digitalGoods:(YMADigitalGoodsModel *_Nullable)digitalGoods
{
    return [[self alloc] initWithOperation:operation
                                 amountDue:amountDue
                                       fee:fee
                                    sender:sender
                                 recipient:recipient
                             recipientType:recipientType
                                   message:message
                                   comment:comment
                                   codepro:codePro
                            protectionCode:protectionCode
                                   expires:expires
                            answerDatetime:answerDatetime
                                   details:details
                                repeatable:repeatable
                         paymentParameters:paymentParameters
                              digitalGoods:digitalGoods];
}

#pragma mark - Public methods

+ (YMARecipientType)recipientTypeByString:(NSString *)recipientTypeString
{
    if ([recipientTypeString isEqualToString:kKeyRecipientTypeAccount])
        return YMARecipientTypeAccount;
    else if ([recipientTypeString isEqualToString:kKeyRecipientTypePhone])
        return YMARecipientTypePhone;
    else if ([recipientTypeString isEqualToString:kKeyRecipientTypeEmail])
        return YMARecipientTypeEmail;
    
    return YMARecipientTypeUnknown;
}

@end

NS_ASSUME_NONNULL_END
