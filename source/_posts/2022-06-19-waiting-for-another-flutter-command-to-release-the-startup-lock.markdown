---
layout: post
title: "Waiting for another flutter command to release the startup lock 问题解决"
date: 2022-06-19 21:39
comments: true
categories: Flutter Dart Linux IDE AS
---
在 Flutter 开发过程中，我们有时候会遇到这个问题，提示下面的信息，然后就一直卡住了。

```bash
Waiting for another flutter command to release the startup lock
```

针对这个问题的解决办法也比较简单

<!--more-->

## 方法一
```bash
killall -9 dart
```

## 方法二
  * 重新启动 IDE

