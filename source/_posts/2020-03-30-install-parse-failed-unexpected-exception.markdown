---
layout: post
title: "INSTALL PARSE FAILED UNEXPECTED EXCEPTION 问题"
date: 2020-03-30 20:59
comments: true
categories: adb android 安卓 apk
---

顺手整理一个之前记录未文字输出的老问题，使用adb install爆出的问题
```bash
adb install -r -d "2.8.5-475.apk"
adb: failed to install 2.8.5-475.apk: Failure [INSTALL_PARSE_FAILED_UNEXPECTED_EXCEPTION:
Failed to parse /data/app/vmdl981460948.tmp/base.apk: AndroidManifest.xml]
```
<!--more-->

## 原因

apk在传入过程中出现错误，所以导致了该问题出现

## 解决方案

重新传输没有问题的apk包。

## 怎么验证apk包没有问题
  * 发送者发apk，顺带着apk的md5值
  * 接收端接收apk，并校验apk的md5值是否与发送者的一致。

以上。
