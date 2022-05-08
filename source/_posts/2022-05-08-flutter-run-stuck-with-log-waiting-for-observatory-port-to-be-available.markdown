---
layout: post
title: "Flutter 在 iOS 模拟器中运行卡住问题解决"
date: 2022-05-08 22:41
comments: true
categories: Flutter iOS 模拟器 
---


当我们尝试在 iOS 模拟器运行 `flutter run` 可能会出现类似如下的卡住问题。

```java
executing: xcrun simctl launch xxx-54F9-427F-8119-xxxx com.hahaha.app --enable-dart-profiling --enable-checked-mode --verify-entry-points --observatory-port=0
[+1000 ms] com.hahaha.app: 49573
[        ] Waiting for observatory port to be available…
```

模拟器上的 App 也无法打开，也看不出有什么具体的崩溃问题。不知如何是好。

<!--more-->


不过，还是有办法解决的，那就是使用 XCode 运行项目，查看输出


## 使用 Xcode 打开项目
```
cd ios/
open Runner.xcworkspace
```

## 点击运行
像正常的 iOS 项目一样，点击 那个类似播放的按钮进行编译运行。

## 查看日志

等到运行后，大概在 XCode 右下角，就会发现一定的错误信息
```java
dyld: Symbol not found: _$s7SwiftUI4ViewP14_viewListCountxxdddx6inputsSiSgxxxAA01_ceF6xxdxxddInputsV_tFZxxxxTq
  Referenced from: /Users/xxxxx/Library/Developer/CoreSimulator/Devices/xxxxddxx-54F9-427F-8119-xxxxx/data/Containers/Bundle/Application/xxxx-8791-4B78xxx-A9C1-381572AC1A2B/Runner.app/Frameworks/abcde.framework/abcde (which was built for iOS 14.0)
  Expected in: /System/Library/Frameworks/SwiftUI.framework/SwiftUI
 in /Users/xxxxxx/Library/Developer/CoreSimulator/Devices/xxxxx-54F9-427F-8119-xxxxxx/data/Containers/Bundle/Application/xxxxx-8791-4B78-xxxx-381572xAC1A2B/Runner.app/Frameworks/abcde.framework/abcde
dyld: launch, loading dependent libraries
```


通过分析上面的错误日志，我们可以确定，这个问题是因为在低于 14 的模拟器上是无法运行这个应用的。


