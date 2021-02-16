---
layout: post
title: "修复 Webview ERR_CACHE_MISS 问题"
date: 2021-02-16 12:43
comments: true
categories: WebView Android permission 
---
有一次写一个简单的例子，例子中使用了 WebView 出现了如下的问题


![https://asset.droidyue.com/image/2020_11/err_cahce_miss_sample.png](https://asset.droidyue.com/image/2020_11/err_cahce_miss_sample.png)


上图的网页提示`net::ERR_CACHE_MISS`错误。

<!--more-->

## 可能的原因
  * 没有增加网络访问权限申请
  * 网络访问权限写错了（检查一下大小写或者拼写错误，或放置位置）


## 解决方法
  * 在 Manifest中添加`<uses-permission android:name="android.permission.INTERNET"/>`


