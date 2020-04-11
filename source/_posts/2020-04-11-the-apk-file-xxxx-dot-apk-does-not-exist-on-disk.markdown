---
layout: post
title: "The APK file xxxx.apk does not exist on disk问题修复"
date: 2020-04-11 15:22
comments: true
categories: Android apk Espresso Gradle AndroidStudio
---

许久之前，用Espresso写过一些测试用例，但是执行的时候总是报这种错误

```bash
The APK file aaa-debug-4.2.8-886eda0d9d-400208.apk does not exist on disk.
Error while Installing APK
```
<!--more-->


## 解决方法
执行`File -> Sync Project with Gradle Files` 即可。
