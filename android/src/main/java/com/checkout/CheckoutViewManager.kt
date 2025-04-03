package com.checkout

import android.graphics.Color
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.CheckoutViewManagerInterface
import com.facebook.react.viewmanagers.CheckoutViewManagerDelegate

@ReactModule(name = CheckoutViewManager.NAME)
class CheckoutViewManager : SimpleViewManager<CheckoutView>(),
  CheckoutViewManagerInterface<CheckoutView> {
  private val mDelegate: ViewManagerDelegate<CheckoutView>

  init {
    mDelegate = CheckoutViewManagerDelegate(this)
  }

  override fun getDelegate(): ViewManagerDelegate<CheckoutView>? {
    return mDelegate
  }

  override fun getName(): String {
    return NAME
  }

  public override fun createViewInstance(context: ThemedReactContext): CheckoutView {
    return CheckoutView(context)
  }

  @ReactProp(name = "color")
  override fun setColor(view: CheckoutView?, color: String?) {
    view?.setBackgroundColor(Color.parseColor(color))
  }

  companion object {
    const val NAME = "CheckoutView"
  }
}
