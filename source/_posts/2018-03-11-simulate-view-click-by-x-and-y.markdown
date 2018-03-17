---
layout: post
title: "Android基于坐标对View进行模拟点击事件"
date: 2018-03-11 20:30
comments: true
categories: Android View 模拟 
---

在Android中，我们对于View进行模拟点击事件，很容易，比如调用`View.performClick`即可。

但是有些时候，我们想要更加精细的点击，比如View的某一区域或者某一点进行点击。比如下面的例子。

<!--more-->

![https://asset.droidyue.com/image/simulate_view_click.png](https://asset.droidyue.com/image/simulate_view_click.png)

上面是一个WebView加载了一个视频，我们必须手动点一下播放按钮才能让视频播放，当然我们想要的最好是如下的自动播放效果（进入界面后，自动播放视频）

![https://asset.droidyue.com/image/simulate_view_click_by_x.y.gif](https://asset.droidyue.com/image/simulate_view_click_by_x.y.gif)

当然方法有很多，比如通过javascript调用视频元素的click事件。在这里我们暂不对该方法进行细究。本文旨在提供一种解决问题的可行方法。

其实我们可以通过View.dispatchTouchEvent就能解决，因为一个click事件可以理解成一个Action_down和一个Action_up MotionEvent的组合，所以实现起来如下即可。

```java
private fun simulateTouchEvent(view: View, x: Float, y: Float) {
   val downTime = SystemClock.uptimeMillis()
   val eventTime = SystemClock.uptimeMillis() + 100
   val metaState = 0
   val motionEvent = MotionEvent.obtain(downTime, eventTime,
           MotionEvent.ACTION_DOWN, x, y, metaState)

   view.dispatchTouchEvent(motionEvent)

   val upEvent = MotionEvent.obtain(downTime + 1000, eventTime + 1000,
           MotionEvent.ACTION_UP, x,y, metaState)
   view.dispatchTouchEvent(upEvent)
}
```

关于坐标位置的选择，仔细分析你会发现，上面的视频的播放按钮其实是有特点的，播放按钮始终处于WebView的中心，即模拟的点击可以是WebView.getWidth/2和WebView.height/2这个点。

为了便于测试和验证模拟事件的成功，我们可以增加OnTouchListener进行验证，如下代码
```java
webview?.setOnTouchListener { v, event ->
   debugMessage("onTouchListener x=${event.x};y=${event.y}")
   false
}

```

对于例子中的何时出发模拟事件，我们可以在WebView网页加载完成的时候实现，即
```java
webview?.webViewClient = object : WebViewClient() {
   override fun onPageFinished(view: WebView?, url: String?) {
       super.onPageFinished(view, url)
       webview?.post {
           webview?.let {
               simulateTouchEvent(it, it.width / 2f, it.height / 2f)
           }
       }
   }
}
```

基于坐标对View进行模拟点击的代码示例完整版，请访问  [https://github.com/androidyue/SimulateViewClickByXandY](https://github.com/androidyue/SimulateViewClickByXandY)


