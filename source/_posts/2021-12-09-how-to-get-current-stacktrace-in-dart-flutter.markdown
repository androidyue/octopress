---
layout: post
title: "Flutter/Dart 获取当前的 stacktrace"
date: 2021-12-09 07:51
comments: true
categories: Dart Flutter Thread Stacktrace  
---

## 出现异常时获取 stacktrace
```dart
void _printException() {
 try {
   1 ~/ 0;
 } catch (e, s) {
   print('_printException $e; $s');
 }
}

```

对应的 stacktrace 日志信息
```dart
_printException IntegerDivisionByZeroException; #0      int.~/ (dart:core-patch/integers.dart:30:7)
#1      _printException (file:///Users/androidyue/Documents/self_host/dart_current_stacktrace/bin/dart_current_stacktrace.dart:10:7)
#2      main (file:///Users/androidyue/Documents/self_host/dart_current_stacktrace/bin/dart_current_stacktrace.dart:3:3)
#3      _delayEntrypointInvocation.<anonymous closure> (dart:isolate-patch/isolate_patch.dart:281:32)
#4      _RawReceivePortImpl._handleMessage (dart:isolate-patch/isolate_patch.dart:184:12)

```

<!--more-->

## 非异常出现时获取 stacktrace

如果只是想获取当前 stacktrace，比如用来确定某些方法的执行调用场景。

1. 可以通过人为制造 异常 的方式来进行输出打印。

```dart
void _printCurrentStacktrace() {
 try {
   throw 'printCurrentStacktrace';
 } catch (e, s) {
   print('_printCurrentStacktrace;$s');
 }
}

```


2. 不人为制造异常得到 stacktrace（使用`StackTrace.current`）
```dart
void _printCurrentStacktraceV2() {
 print('_printCurrentStacktraceV2 ${StackTrace.current}');
}

```



