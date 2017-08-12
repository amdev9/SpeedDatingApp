//
// Created by Alexander Mertvetsov on 23.05.14.
// Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import "YMAHistoryOperationsRequest.h"
#import "YMAHostsProvider.h"

static NSString *const kParameterType = @"type";
static NSString *const kKeyTypePayment = @"payment";
static NSString *const kKeyTypeDeposition = @"deposition";
static NSString *const kKeyTypeIncomingTransfersUnaccepted = @"incoming-transfers-unaccepted";
static NSString *const kParameterLabel = @"label";
static NSString *const kParameterFrom = @"from";
static NSString *const kParameterTill = @"till";
static NSString *const kParameterStartRecord = @"start_record";
static NSString *const kParameterRecords = @"records";
static NSString *const kParameterDetails = @"details";

static NSString *const kUrlHistoryOperation = @"api/operation-history";

@interface YMAHistoryOperationsRequest ()

@property (nonatomic, assign) YMAHistoryOperationFilter filter;
@property (nonatomic, copy) NSString *label;
@property (nonatomic, strong) NSDate *from;
@property (nonatomic, strong) NSDate *till;
@property (nonatomic, copy) NSString *startRecord;
@property (nonatomic, copy) NSString *records;

@end

@implementation YMAHistoryOperationsRequest

#pragma mark - Object Lifecycle

- (instancetype)initWithFilter:(YMAHistoryOperationFilter)filter
                         label:(NSString *)label
                          from:(NSDate *)from
                          till:(NSDate *)till
                   startRecord:(NSString *)startRecord
                       records:(NSString *)records
{
    self = [super self];

    if (self != nil) {
        _filter = filter;
        _label = [label copy];
        _from = from;
        _till = till;
        _records = [records copy];
        _startRecord = [startRecord copy];
    }

    return self;
}

+ (instancetype)operationHistoryWithFilter:(YMAHistoryOperationFilter)filter
                                     label:(NSString *)label
                                      from:(NSDate *)from
                                      till:(NSDate *)till
                               startRecord:(NSString *)startRecord
                                   records:(NSString *)records
{
    return [[YMAHistoryOperationsRequest alloc] initWithFilter:filter
                                                         label:label
                                                          from:from
                                                          till:till
                                                   startRecord:startRecord
                                                       records:records];
}

- (NSString *)parameterValue:(NSString *)value addString:(NSString *)string
{
    if (string == nil) {
        return value;
    }

    return value.length > 0 ? [NSString stringWithFormat:@"%@ %@", value, string] : string;
}


#pragma mark - Overridden methods

- (NSURL *)requestUrl
{
    NSString *urlString =
        [NSString stringWithFormat:@"https://%@/%@", [YMAHostsProvider sharedManager].moneyUrl, kUrlHistoryOperation];
    return [NSURL URLWithString:urlString];
}

- (NSDictionary *)parameters
{
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat:@"yyyy-MM-dd'T'HH:mm:ss.SSSZZZZZ"];
    NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];

    NSString *typeString = nil;

    if (self.filter & YMAHistoryOperationFilterPayment) {
        typeString = [self parameterValue:typeString addString:kKeyTypePayment];
    }
    if (self.filter & YMAHistoryOperationFilterDeposition) {
        typeString = [self parameterValue:typeString addString:kKeyTypeDeposition];
    }
    if (self.filter & YMAHistoryOperationFilterIncomingTransfersUnaccepted) {
        typeString = [self parameterValue:typeString addString:kKeyTypeIncomingTransfersUnaccepted];
    }

    if (typeString != nil) {
        dictionary[kParameterType] = typeString;
    }
    if (self.label != nil) {
        dictionary[kParameterLabel] = self.label;
    }
    NSString *fromString = [formatter stringFromDate:self.from];
    NSString *tillString = [formatter stringFromDate:self.till];

    if (fromString != nil) {
        dictionary[kParameterFrom] = fromString;
    }
    if (tillString != nil) {
        dictionary[kParameterTill] = tillString;
    }
    if (self.startRecord != nil) {
        dictionary[kParameterStartRecord] = self.startRecord;
    }
    if (self.records != nil) {
        dictionary[kParameterRecords] = self.records;
    }

    return dictionary;
}

- (NSOperation *)buildResponseOperationWithData:(NSData *)data headers:(NSDictionary *)headers completion:(YMAResponseHandler)handler
{
    return [[YMAHistoryOperationsResponse alloc] initWithData:data headers:headers completion:handler];
}

@end