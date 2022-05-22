---
layout: post
title: "Flutter/Dart release 模式下屏蔽 debugPrint 与 print 输出"
date: 2022-05-23 07:30
comments: true
categories: Flutter Dart Android iOS
---


当我们在写 Flutter，Dart程序时，release 模式下，我们很奇怪的发现debugPrint和 print 这两个的输出内容，还是能够通过 `flutter logs` 展示出来。这一点尤其在端上暴露的问题要严重一些，比如涉及到一些敏感信息的日志打印。

本文，将会有两个超级简单的方法，来实现对这些输出的屏蔽，并且是专门治理 release 模式下的问题，debug 模式不受影响。


<!--more-->

## DebugPrint
DebugPrint  着实是一个比较迷惑的方法，看意思我们理解是在debug 模式下才进行日志打印，但是实际上，这个方法也会在 release 模式下进行日志输出。

好在，我们可以通过这样简单设置即可处理 上面的问题。


```dart
if (kReleaseMode) {
   debugPrint = (String? message, {int? wrapWidth}) {
     // empty debugPrint implementation in the release mode
    };
}

```

在 RunApp 启动之前即可。


## print 处理
print 的处理相对比较麻烦一些，但是 dart 层也提供了一个 重载print实现的方法，就是使用 Zone API. 


实现思路如下

  * 使用 runZonedGuarded 包裹  runApp   
  * 增加 zoneSpecification 参数配置 printHandler  
  * printHandler 增加release 模式控制，进行日志打印屏蔽处理。

具体代码如下


```dart
runZonedGuarded(() {
 runApp(MyApp());
}, (error, stackTrace) {
 print(stackTrace);
}, zoneSpecification: ZoneSpecification(
   print: (Zone self, ZoneDelegate parent, Zone zone, String message){
     /**
      * Print only in debug mode
      * */
     if (kDebugMode) {
       parent.print(zone, "wrapped content=$message");
     }
   }));

```

## 其他的建议
  * 使用自己封装的 Log 库，可以统一进行管理
  * 使用 lint 检查，检测并处理 使用 print，debugPrint的代码。
