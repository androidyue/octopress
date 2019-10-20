---
layout: post
title: "Android WebView 诊断与排查问题的方法和技巧"
date: 2019-10-20 21:13
comments: true
categories: Android WebView Troubleshooting Chrome WebViewClient WebChromeClient Javascript Kotlin Console
---
WebView，是安卓中很重要的一个组件，我们的应用中集成WebView后，可能会遇到各种各样的问题，这里简单介绍一些Android WebView 诊断与排查问题的方法，希望对于大家有这方面的问题的朋友有所帮助。

<!--more-->

## 开启DiagnosableWebViewClient日志输出
```kotlin
package com.droidyue.webview.webviewclient


import android.net.http.SslError
import android.webkit.*
import com.droidyue.common.debugMessage
import com.droidyue.webview.ext.toSimpleString

/**
 * 诊断（错误信息）的WebViewClient,会以日志输出形式输出错误信息，便于发现网页的问题
 */
open class DiagnosableWebViewClient : WebViewClient() {

    override fun onReceivedError(view: WebView?, errorCode: Int, description: String?, failingUrl: String?) {
        super.onReceivedError(view, errorCode, description, failingUrl)
        debugMessage("onReceivedError", "errorCode", errorCode, "description", description,
            "failingUrl", failingUrl, "webview.info", view?.toSimpleString())
    }

    override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
        super.onReceivedError(view, request, error)
        debugMessage("onReceivedError", "request", request?.toSimpleString(), "error", error?.toSimpleString(),
            "webview.info", view?.toSimpleString())
    }

    override fun onSafeBrowsingHit(view: WebView?, request: WebResourceRequest?, threatType: Int, callback: SafeBrowsingResponse?) {
        super.onSafeBrowsingHit(view, request, threatType, callback)
        debugMessage("onSafeBrowsingHit", "request", request?.toSimpleString(), "threatType", threatType,
            "webview.info", view?.toSimpleString())
    }

    override fun onReceivedHttpError(view: WebView?, request: WebResourceRequest?, errorResponse: WebResourceResponse?) {
        super.onReceivedHttpError(view, request, errorResponse)
        debugMessage("onReceivedHttpError", "request", request, "errorResponse", errorResponse?.toSimpleString(),
            "webview.info", view?.toSimpleString())
    }

    override fun onReceivedSslError(view: WebView?, handler: SslErrorHandler?, error: SslError?) {
        super.onReceivedSslError(view, handler, error)
        debugMessage("onReceivedSslError", "error", error, "webview.info", view?.toSimpleString())
    }
}

```

### 举个例子
WebView页面出现了白屏，不展示任何内容，如下图

![https://asset.droidyue.com/image/2019_09/hybrid_app_white_issue.png](https://asset.droidyue.com/image/2019_09/hybrid_app_white_issue.png)

利用上面支持的内容，我们查看错误输出日志
```bash
D debugMessage: ConcreteWebViewClient;onReceivedSslError error primary error: 3 certificate: Issued to: CN=sni.cloudflaressl.com,O=Cloudflare\, Inc.,L=San Francisco,ST=CA,C=US;
D debugMessage: Issued by: C=NZ,ST=Auckland,L=Auckland,O=XK72 Ltd,OU=https://charlesproxy.com/ssl,CN=Charles Proxy CA (4 Sep 2018\, bogon);
D debugMessage:  on URL: https://droidyue.com/ webview.info url=https://droidyue.com/;originalUrl=null
```

通过查找源码(SslError.java)我们了解到

  * errorCode 为 3，代表证书不信任。

这其中的缘由是
  
  * 我们在设备上安装的charles证书，属于用户添加的证书
  * 出于应用安全的目的，Android 7及之后默认不信任用户添加的证书(Android 7 之前是默认信任用户添加的证书)
  * 当我们将App的编译目标提到24及其以上，系统就会激活这一安全限制。

所以，我们按照这篇文章[解决Android手机连接Charles Unknown问题](https://droidyue.com/blog/2019/01/13/resolve-charles-unknow-indicator-on-android-phones/)的方案，允许App在debug版本下信任用户证书就可以解决问题了。


## Console日志查看
比如，我们有这样一段Javascript代码处理console输出。
```javascript
console.debug("console.debug");
console.log("console.log");
console.info("console.info");
console.warn("console.warn");
console.error("console.error")
```
我们使用
```bash
adb logcat | grep "chromium" --line-buffered --color=always | grep CONSOLE --color=always
``` 
可以过滤出WebView CONSOLE的日志输出
```bash
 I chromium: [INFO:CONSOLE(2)] "console.debug", source:  (2)
 I chromium: [INFO:CONSOLE(3)] "console.log", source:  (3)
 I chromium: [INFO:CONSOLE(4)] "console.info", source:  (4)
 I chromium: [INFO:CONSOLE(5)] "console.warn", source:  (5)
 I chromium: [INFO:CONSOLE(6)] "console.error", source:  (6)
```
但是这样也有一个不足，就是没有打印出Console的消息级别(都展示成了INFO:CONSOLE)。

如果想要解决上面的不足或者自定义日志输出关键字的话，可以重写实现WebChromeClient的`onConsoleMessage`方法
```kotlin
package com.droidyue.webview.chromeclient

import android.webkit.ConsoleMessage
import android.webkit.WebChromeClient
import com.droidyue.common.debugMessage
import com.droidyue.webview.ext.toSimpleString

open class DiagnosableChromeClient: WebChromeClient() {
    override fun onConsoleMessage(message: String?, lineNumber: Int, sourceID: String?) {
        //不需要调用super方法
        debugMessage("onConsoleMessage", "message", message, "lineNumber", lineNumber, "sourceID", sourceID)
    }

    override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
        debugMessage("onConsoleMessage", "message", consoleMessage?.toSimpleString())
        //返回true，不再需要webview内部处理
        return true
    }
}
```

```bash
D debugMessage: ConcreteWebChromeClient;onConsoleMessage message messageLevel=TIP;message=console.debug;sourceId=;lineNumber=1
D debugMessage: ConcreteWebChromeClient;onConsoleMessage message messageLevel=LOG;message=console.log;sourceId=;lineNumber=2
D debugMessage: ConcreteWebChromeClient;onConsoleMessage message messageLevel=LOG;message=console.info;sourceId=;lineNumber=3
D debugMessage: ConcreteWebChromeClient;onConsoleMessage message messageLevel=WARNING;message=console.warn;sourceId=;lineNumber=4
D debugMessage: ConcreteWebChromeClient;onConsoleMessage message messageLevel=ERROR;message=console.error;sourceId=;lineNumber=5
```


## 开启 WebView 远程调试
从Android Kitkat(4.4)开始，WebView 支持与Chrome 连接执行远程调试。

开启很简单，如下代码
```kotlin
fun WebView.enableRemoteDebugging() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT && BuildConfig.DEBUG) {
        WebView.setWebContentsDebuggingEnabled(true)
    }
}
```

但需要注意两点

  * 一定要限定运行设备大于等于4.4系统
  * 强烈建议限定在Debug编译(或等同条件)包下开启，不建议Release包也启用该功能


配置完成后，启动App，打开Chrome，输入`chrome://inspect`
![https://asset.droidyue.com/image/2019_09/webview-debugging.png](https://asset.droidyue.com/image/2019_09/webview-debugging.png)


可以调试的功能有

  * 审查元素
  * 执行Javascript
  * 查看网页资源
  * 进行性能分析
  * 其他功能

具体内容可以访问[https://developers.google.com/web/tools/chrome-devtools/remote-debugging/webviews](https://developers.google.com/web/tools/chrome-devtools/remote-debugging/webviews)了解。


## 推荐阅读
  * [WebView分类文章](https://droidyue.com/blog/categories/webview/)



