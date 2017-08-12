//
// Created by Alexander Mertvetsov on 23.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAHistoryOperationsResponse.h"
#import "YMAConstants.h"
#import "YMABaseResponse+Protected.h"

static NSString *const kParameterNextRecord = @"next_record";
static NSString *const kParameterOperations = @"operations";

static NSString *const kParameterOperationOperationId = @"operation_id";
static NSString *const kParameterOperationStatus = @"status";
static NSString *const kParameterOperationDatetime = @"datetime";
static NSString *const kParameterOperationTitle = @"title";
static NSString *const kParameterOperationDirection = @"direction";
static NSString *const kParameterOperationAmount = @"amount";
static NSString *const kParameterOperationLabel = @"label";
static NSString *const kParameterOperationFavorite = @"favourite";
static NSString *const kParameterOperationType = @"type";

@implementation YMAHistoryOperationsResponse

#pragma mark - Public methods

+ (YMAHistoryOperationModel *)historyOperationByModel:(id)historyOperationModel
{
    NSString *operationId = historyOperationModel[kParameterOperationOperationId];
    NSString *statusString = historyOperationModel[kParameterOperationStatus];
    YMAHistoryOperationStatus status = [YMAHistoryOperationModel historyOperationStatusByString:statusString];

    NSDate *dateTime = [self dateFromIsoTimeStamp:historyOperationModel[kParameterOperationDatetime]];

    NSString *title = historyOperationModel[kParameterOperationTitle];
    NSString *patternId = historyOperationModel[YMAPaymentParameterPatternId];

    NSString *directionString = historyOperationModel[kParameterOperationDirection];
    YMAHistoryOperationDirection
        direction = [YMAHistoryOperationModel historyOperationDirectionByString:directionString];

    NSString *amount = [historyOperationModel[kParameterOperationAmount] stringValue];
    NSString *label = historyOperationModel[kParameterOperationLabel];

    BOOL favorite = [historyOperationModel[kParameterOperationFavorite] boolValue];

    NSString *typeString = historyOperationModel[kParameterOperationType];
    YMAHistoryOperationType type = [YMAHistoryOperationModel historyOperationTypeByString:typeString];

    return [YMAHistoryOperationModel historyOperationWithOperationId:operationId
                                                              status:status
                                                            datetime:dateTime
                                                               title:title
                                                           patternId:patternId
                                                           direction:direction
                                                              amount:amount
                                                               label:label
                                                            favorite:favorite
                                                                type:type];
}

#pragma mark - Overridden methods

- (BOOL)parseJSONModel:(id)responseModel headers:(NSDictionary *)headers error:(NSError * __autoreleasing *)error
{
    NSString *errorKey = responseModel[YMAErrorParameter];
    if (errorKey != nil) {
        if (error == nil) return NO;

        NSError *unknownError = [NSError errorWithDomain:YMAErrorDomainUnknown code:0 userInfo:@{ YMAErrorKeyResponse : self }];
        *error = errorKey ? [NSError errorWithDomain:YMAErrorDomainYaMoneyAPI code:0 userInfo:@{YMAErrorKey : errorKey, YMAErrorKeyResponse : self }] : unknownError;

        return NO;
    }

    NSString *nextRecord = responseModel[kParameterNextRecord];
    _nextRecord = [nextRecord copy];

    id operationsModel = responseModel[kParameterOperations];

    if (!operationsModel)
        return YES;

    NSMutableArray *historyOperations = [NSMutableArray array];

    for (id historyOperationModel in operationsModel) {
        YMAHistoryOperationModel
            *operation = [YMAHistoryOperationsResponse historyOperationByModel:historyOperationModel];
        [historyOperations addObject:operation];
    }

    _operations = historyOperations;

    return YES;
}

@end
