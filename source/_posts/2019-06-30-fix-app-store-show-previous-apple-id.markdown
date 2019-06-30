---
layout: post
title: "修复应用无法通过App Store升级的问题"
date: 2019-06-30 20:20
comments: true
categories: Mac 
---
之前遇到过这样的问题

  * 从微信官网下载微信Mac版安装
  * 后来App Store提示有新的微信更新
  * 但是每次打开都是这样的画面，提示上一个账户（主动更换过账户）的信息
  * 而且上一个账户基本弃用，但是也无法使用当前账户更新

<!--more-->

![https://asset.droidyue.com/image/2019_02/macos-mojave-app-store-free-app-create-apple-id.jpg](https://asset.droidyue.com/image/2019_02/macos-mojave-app-store-free-app-create-apple-id.jpg)

## 尝试解决
  * 从Finder中切换到 Applications 删除Wechat 也不行

## 真正解决
  1.点击左上角菜单 进入 About this Mac（关于本台Mac）   
  2.切换到 Storage(存储)   
  3.点击Manage(管理)    
  4.切换到Applications(应用程序) 删除对应的Wechat安装包即可。   

如图
![https://asset.droidyue.com/image/2019_02/remove_apps.png](https://asset.droidyue.com/image/2019_02/remove_apps.png)


以上。
