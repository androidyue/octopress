---
layout: post
title: "Android Studio 无 创建 Flutter 工程选项（New Flutter Project）解决"
date: 2022-04-10 12:07
comments: true
categories: Android Flutter Mobile App 
---

最近想要使用 Android Studio 创建一个新的  Flutter 工程，发现 Android Studio 并没有相应的创建选项。

于是开始排查问题，想起来最近优化 Android Studio 插件（关闭了一些感觉无用的插件），后来尝试恢复了一些，发现重启之后可以了。
<!--more-->

所以这个问题的原因在于关闭了一个 Android Apk Support 的插件。将它开启后，重启 Android Studio 就可以了。

开启的步骤如下图所示

![https://asset.droidyue.com/image/2022/h1/android_studio_android_support.png](https://asset.droidyue.com/image/2022/h1/android_studio_android_support.png)

以上。
