---
layout: post
title: "Mac下关于DNS服务器的终端操作汇总"
date: 2021-01-25 12:13
comments: true
categories: Mac DNS LAN Wi-Fi server
---

Mac中有时候我们需要调整DNS来处理一些事情，作为终端控，使用终端调整DNS顺理成章，如下为一些关于DNS服务器终端处理的记录。

<!--more-->

## 获取网络服务
```java
networksetup -listallnetworkservices
An asterisk (*) denotes that a network service is disabled.
USB 10/100/1000 LAN
Wi-Fi
```

## 获取WIFI的DNS服务器地址
```java
networksetup -getdnsservers Wi-Fi
8.8.8.8
```

## 获取`USB 10/100/1000 LAN`的DNS服务器地址
```java
networksetup -getdnsservers "USB 10/100/1000 LAN"
There aren't any DNS Servers set on USB 10/100/1000 LAN.
```

## 设置WIFI DNS服务器地址
```java
networksetup -setdnsservers Wi-Fi 114.114.114.114
```

## 设置WIFI 多个DNS服务器地址
```java
networksetup -setdnsservers Wi-Fi 8.8.8.8 114.114.114.114
```
使用空格分别多个DNS服务器地址

## 清空WIFI DNS服务器地址
```java
networksetup -setdnsservers Wi-Fi Empty
```

以上。
