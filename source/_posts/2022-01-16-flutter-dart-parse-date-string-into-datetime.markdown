---
layout: post
title: "Flutter(Dart) 中将 2022-01-05 09:33:44 +0000 UTC 转成 datetime "
date: 2022-01-16 21:37
comments: true
categories: Flutter Dart UTC datetime 
---

在日常的开发中，进行日期转换是比较常用的。但是对于新接触 Flutter 的话，对这个日期`2022-01-05 09:33:44 +0000 UTC` 使用`DateTime.parse`直接转换，会有问题，如下。

```dart
print(DateTime.parse('2022-01-05 09:33:44 +0000 UTC'));

```

当我们运行后，会得到这样的崩溃stacktrace
```dart
Unhandled exception:
FormatException: Invalid date format
2022-01-05 09:33:44 +0000 UTC
#0      DateTime.parse (dart:core/date_time.dart:330:7)
#1      testDateFormat (file:///Users/xxx/IdeaProjects/dart_sample/bin/dart_sample.dart:38:18)
#2      main (file:///Users/xxx/IdeaProjects/dart_sample/bin/dart_sample.dart:26:3)
#3      _delayEntrypointInvocation.<anonymous closure> (dart:isolate-patch/isolate_patch.dart:295:32)
#4      _RawReceivePortImpl._handleMessage (dart:isolate-patch/isolate_patch.dart:192:12)
```
<!--more--> 

然而，要解决这个问题，需要使用一个新的pub dependency 来实现。
```bash
dependencies:
 intl: ^0.17.0

```

然后使用这样的转换即可
```dart
final time = '2022-01-05 09:33:44 +0000 UTC';
print(DateFormat('yyyy-MM-dd HH:mm:ss').parseUTC(time));
print(DateFormat('yyyy-MM-dd HH:mm:ssZ').parseUTC(time));
print(DateFormat('yyyy-MM-dd HH:mm:ssZ').parseUTC('2022-01-09 22:19:40.993584 +0800 CST m=+0.000077758'));
```


