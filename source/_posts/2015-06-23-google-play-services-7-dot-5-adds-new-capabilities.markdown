---
layout: post
title: "Google Play Services 7.5新增API及多项特性"
date: 2015-06-23 21:00
comments: true
categories: Google Android
---
### 版权说明
本文为 InfoQ 中文站特供稿件，首发地址为：[文章链接](http://www.infoq.com/cn/news/2015/06/google-play-services-75)。如需转载，请与 InfoQ 中文站联系。

### 摘要

最近的Google I/O开发者大会上，Google宣布推出7.5版的Google Play服务，该版本在特性方面增加了诸如智能密码锁和实例ID等功能。在API方面，增加了Google云推送和Google Cast相关的API，同时在Android Wear设备上支持访问Google地图API。

<!--more-->
### 正文

最近的Google I/O开发者大会上，Google[宣布](http://android-developers.blogspot.com.es/2015/05/a-closer-look-at-google-play-services-75.html)推出7.5版的Google Play服务，该版本在特性方面增加了诸如智能密码锁和实例ID等功能。在API方面，增加了Google云推送和Google Cast相关的API，同时在Android Wear设备上支持访问Google地图API。

**智能密码锁**

[智能密码锁](https://developers.google.com/identity/smartlock-passwords/android/)为了简化登陆流程，增加了名为[CredentialsApi](https://developer.android.com/reference/com/google/android/gms/auth/api/credentials/CredentialsApi.html)的API和UI，并允许我们对已保存的证书进行检索和保存以备后用。密码管理器是从Chrome浏览器的密码管理器演变而来。了解更多关于该功能细节，请查阅InfoQ[具体介绍文章](http://www.infoq.com/news/2015/06/google-smart-lock-passwords)。

**实例ID，身份与授权**

[实例ID](https://developers.google.com/instance-id/reference)是一项云服务，该服务用来提供一个唯一的ID来唯一性鉴定应用实例。使用的场景比如确定哪一个应用实例正在发送请求等问题。实例ID还可以用来生成安全令牌，使用安全令牌可以授权第三方应用访问你的应用的服务器端控制的资源，同时安全令牌也可以用来验证一个应用的真实性。

**Google云推送**

上面提到的实例ID与[Google云推送](https://developer.android.com/google/gcm/index.html)紧密相关，Google云推送作为一个服务，既可以接收来自服务器端的信息也可以从客户端向服务器端传送数据。此外，Google云推送还新加入了一个API允许应用设置一个或多个话题进而帮助消息能够精准推送。不仅如此，该服务还增加了一个新的类[GcmNetworkManager](https://developer.android.com/reference/com/google/android/gms/gcm/GcmNetworkManager.html)，使用这个类，当服务器端有新信息时，应用与服务器端进行数据同步更加容易。GcmNetworkManager支持对常见行为的处理，比如等待网络连接，设备充电，网络重试和回退等，另外它还支持对后台网络操作的调度进行优化。

**Google Cast**

众所周知，Google Cast是一套将设备内容呈现到电视或者音响的解决方案，新增的[远程显示API](https://developers.google.com/cast/docs/remote)使得管理镜像显示更加容易，另外通过增加媒体队列使得[RemoteMediaPlayer](https://developer.android.com/reference/com/google/android/gms/cast/RemoteMediaPlayer.html)可以无缝支持媒体重放。

**Google地图和Google Fit**

正如一开始提到的，在Android Wear设备上可以使用Google[地图API](http://developer.android.com/reference/com/google/android/gms/maps/package-summary.html)了。

[Google Fit](https://developers.google.com/fit/)，用来构建健康应用解决方案，现在可以使用新增加的[RecordingApi](https://developer.android.com/reference/com/google/android/gms/fitness/RecordingApi.html)收集行走距离和燃烧的卡路里数据。


Google Play服务是一个有着系统级别权限的并且可升级的服务和API。正如InfoQ[指出的](http://www.infoq.com/news/2013/09/play-services-beat-fragmentation)那样，”在这种情况下，Google可以在宣布之后数天内铺开这些新特性“，如果没有这项服务，则需要底层系统的更新。因为Play服务完全由Google控制，OEM厂商无法修改，所以该服务在缓解软件碎片化问题上起了很关键的作用。

__查看英文原文：__[Google Play Services 7.5 Adds New Capabilities, APIs, and More](http://www.infoq.com/news/2015/06/google-play-services-75)























