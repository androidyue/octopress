---
layout: post
title: "Flutter webview 处理回退历史"
date: 2022-07-12 08:31
comments: true
categories: Flutter webview Android iOS 
---
在 App 开发中，我们总会遇到使用 WebView 的情况， 比如 我们打开了 网页A，然后点击 A 中的链接跳转到 B。如果这个时候，我们按一下系统的返回键，预期的应该是 返回A，而不是推到一个 Native 页面。

<!--more-->

但事实就是，如果你没有经过特殊处理，那么很有可能就不是预期的效果(B -> A)。不过还在我们只需要简单修改代码，就能解决。


再次明确一下，我们的预期

  * 如果 webview 有可以回退的历史，当系统返回按键点击后，进行 webview 历史回退   
  * 否则执行 系统回退，返回上一个 native界面  


## 用到的核心代码
```dart
WebViewController? _webviewController;




WillPopScope(
  onWillPop: () => _exitApp(context),
  child: xxx,	
}



Future<bool> _exitApp(BuildContext context) async {
 if (await _webviewController!.canGoBack()) {
   print("onwill goback");
   _webviewController!.goBack();
   return Future.value(false);
 } else {
   debugPrint("_exit will not go back");
   return Future.value(true);
 }
}



```
  * WebViewController 实例 controllerGlobal 是用来判断检测并执行 webview 历史回退。
  * 使用 WillPopScope 用来监听 系统的返回键调用，并进行执行系统返回还是 回退 WebView 历史
  * 这里利用 controllerGlobal!.canGoBack 来判断是否可以回退 webview 历史
  * 如果需要执行 webview 回退历史，调用 controllerGlobal!.goBack()， 否则响应系统回退

## 完整的实例代码
```dart
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() => runApp(MaterialApp(home: WebViewExample()));

class WebViewExample extends StatefulWidget {
 @override
 _WebViewExampleState createState() => _WebViewExampleState();
}

class _WebViewExampleState extends State<WebViewExample> {

 WebViewController? _webviewController;

 Future<bool> _exitApp(BuildContext context) async {
   if (await _webviewController!.canGoBack()) {
     print("onwill goback");
     _webviewController!.goBack();
     return Future.value(false);
   } else {
     debugPrint("_exit will not go back");
     return Future.value(true);
   }
 }

 @override
 Widget build(BuildContext context) {
   return WillPopScope(
     onWillPop: () => _exitApp(context),
     child: Scaffold(
       appBar: AppBar(
         title: const Text('Flutter WebView example'),
         // This drop down menu demonstrates that Flutter widgets can be shown over the web view.
       ),
       // We're using a Builder here so we have a context that is below the Scaffold
       // to allow calling Scaffold.of(context) so we can show a snackbar.
       body: Builder(builder: (BuildContext context) {
         return WebView(
           initialUrl: 'http://droidyue.com',
           javascriptMode: JavascriptMode.unrestricted,
           onWebViewCreated: (WebViewController webViewController) {
             _webviewController = webViewController;
           },
         );
       }),
     ),
   );
 }
}



```

使用上述代码后，就可以轻松实现 优先响应 WebView 历史回退。
