//
//  Created by Alexander Mertvetsov on 10.02.14.
//  Copyright (c) 2014 Yandex.Money. All rights reserved.
//

#import <Foundation/Foundation.h>

///
/// This class contains info about the payment request (requestId, amount, title).
///
@interface YMAExternalPaymentInfoModel : NSObject

/// Constructor. Returns a YMAExternalPaymentInfoModel with the specified requestId, amount, and payment title.
/// @param requestId - ID of the current payment request.
/// @param amount - The amount of the payment.
/// @param title - A title of the payment.
+ (instancetype)paymentRequestInfoWithId:(NSString *)requestId amount:(NSString *)amount title:(NSString *)title;

@property (nonatomic, copy, readonly) NSString *requestId;
@property (nonatomic, copy, readonly) NSString *amount;
@property (nonatomic, copy, readonly) NSString *title;

@end
