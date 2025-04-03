#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RCTBridge.h"

@interface CheckoutViewManager : RCTViewManager
@end

@implementation CheckoutViewManager

RCT_EXPORT_MODULE(CheckoutView)

- (UIView *)view
{
  return [[UIView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(color, NSString)

@end
