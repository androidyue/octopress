---
layout: post
title: "修复WebView资源未找到导致的崩溃问题"
date: 2020-11-06 20:06
comments: true
categories: Android WebView Resources NotFoundException  #0x2040003
---

近期 应用新增了很多的崩溃，分析特征，发现崩溃集中在5.0-5.1.1系统上，崩溃的日志如下


```bash
Caused by: android.content.res.Resources$NotFoundException: String resource ID #0x2040003
at android.content.res.Resources.getText(Resources.java:318)
at android.content.res.VivoResources.getText(VivoResources.java:123)
at android.content.res.Resources.getString(Resources.java:404)
at com.android.org.chromium.content.browser.ContentViewCore.setContainerView(ContentViewCore.java:694)
at com.android.org.chromium.content.browser.ContentViewCore.initialize(ContentViewCore.java:618)
at com.android.org.chromium.android_webview.AwContents.createAndInitializeContentViewCore(AwContents.java:631)
at com.android.org.chromium.android_webview.AwContents.setNewAwContents(AwContents.java:780)
at com.android.org.chromium.android_webview.AwContents.<init>(AwContents.java:619)
at com.android.org.chromium.android_webview.AwContents.<init>(AwContents.java:556)
at com.android.webview.chromium.WebViewChromium.initForReal(WebViewChromium.java:312)
at com.android.webview.chromium.WebViewChromium.access$100(WebViewChromium.java:96)
at com.android.webview.chromium.WebViewChromium$1.run(WebViewChromium.java:264)
at com.android.webview.chromium.WebViewChromium$WebViewChromiumRunQueue.drainQueue(WebViewChromium.java:123)
at com.android.webview.chromium.WebViewChromium$WebViewChromiumRunQueue$1.run(WebViewChromium.java:110)
at com.android.org.chromium.base.ThreadUtils.runOnUiThread(ThreadUtils.java:144)
at com.android.webview.chromium.WebViewChromium$WebViewChromiumRunQueue.addTask(WebViewChromium.java:107)
at com.android.webview.chromium.WebViewChromium.init(WebViewChromium.java:261)
at android.webkit.WebView.<init>(WebView.java:554)
at android.webkit.WebView.<init>(WebView.java:489)
at android.webkit.WebView.<init>(WebView.java:472)
at android.webkit.WebView.<init>(WebView.java:459)
at com.tencent.smtt.sdk.WebView$a.<init>(WebView.java:2968)
at com.tencent.smtt.sdk.WebView.<init>(WebView.java:567)
at com.tencent.smtt.sdk.WebView.<init>(WebView.java:329)
at com.tencent.smtt.sdk.WebView.<init>(WebView.java:323)
at com.tencent.smtt.sdk.WebView.<init>(WebView.java:318)
at com.tencent.smtt.sdk.WebView.<init>(WebView.java:313)
at com.xxxx.webview.X5WebView.<init>(X5WebView.java:36)
at androidx.fragment.app.Fragment.performCreateView(Fragment.java:2600)
at androidx.fragment.app.FragmentManagerImpl.moveToState(FragmentManagerImpl.java:881)
at androidx.fragment.app.FragmentManagerImpl.moveFragmentToExpectedState(FragmentManagerImpl.java:1238)
at androidx.fragment.app.FragmentManagerImpl.moveToState(FragmentManagerImpl.java:1303)
at androidx.fragment.app.BackStackRecord.executeOps(BackStackRecord.java:439)
at androidx.fragment.app.FragmentManagerImpl.executeOps(FragmentManagerImpl.java:2079)
at androidx.fragment.app.FragmentManagerImpl.executeOpsTogether(FragmentManagerImpl.java:1869)
at androidx.fragment.app.FragmentManagerImpl.removeRedundantOperationsAndExecute(FragmentManagerImpl.java:1824)
at androidx.fragment.app.FragmentManagerImpl.execPendingActions(FragmentManagerImpl.java:1727)
at androidx.fragment.app.FragmentManagerImpl.dispatchStateChange(FragmentManagerImpl.java:2663)
at androidx.fragment.app.FragmentManagerImpl.dispatchActivityCreated(FragmentManagerImpl.java:2613)
at androidx.fragment.app.FragmentController.dispatchActivityCreated(FragmentController.java:246)
at androidx.fragment.app.FragmentActivity.onStart(FragmentActivity.java:542)
at androidx.appcompat.app.AppCompatActivity.onStart(AppCompatActivity.java:201)
at android.app.Instrumentation.callActivityOnStart(Instrumentation.java:1245)
at android.app.Activity.performStart(Activity.java:6099)
at android.app.ActivityThread.performLaunchActivity(ActivityThread.java:2367)
at android.app.ActivityThread.handleLaunchActivity(ActivityThread.java:2466)
at android.app.ActivityThread.access$900(ActivityThread.java:175)
at android.app.ActivityThread$H.handleMessage(ActivityThread.java:1369)
at android.os.Handler.dispatchMessage(Handler.java:102)
at android.os.Looper.loop(Looper.java:135)
at android.app.ActivityThread.main(ActivityThread.java:5418)
at java.lang.reflect.Method.invoke(Native Method)
at java.lang.reflect.Method.invoke(Method.java:372)
at com.android.internal.os.ZygoteInit$MethodAndArgsCaller.run(ZygoteInit.java:1037)
at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:832)
```

<!--more-->

貌似感觉没有解决办法，后来在这里https://stackoverflow.com/a/58695635  找到了解决办法

## 解决方法
  * 针对出问题的系统（5.0-5.1.1）使用ApplicationContext 处理


```java
object WebViewWorkaroundAssistant {

    fun getWorkaroundContext(context: Context): Context {
        //修复Caused by: android.content.res.Resources$NotFoundException: String resource ID #0x2040003
        //https://stackoverflow.com/a/58695635
        return if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            context.applicationContext
        } else {
            context
        }
    }
}


 	public X5WebView(Context context) {
        super(WebViewWorkaroundAssistant.INSTANCE.getWorkaroundContext(context));
        initUI();
    }

```

## 注意事项
  * 当再次使用WebView.getContext时，得到的就是Application 上下文，而不是Activity的了。


