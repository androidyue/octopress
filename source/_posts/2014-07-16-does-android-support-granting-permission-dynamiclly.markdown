---
layout: post
title: "Android支持动态申请权限么"
date: 2014-07-16 18:52
comments: true
categories: Android
---

作为Android开发者,为程序增加权限是在正常不过的事情了,做法必然是在mainifest中,写入类似这样`<uses-permission android:name="android.permission.INTERNET" />`的信息. 以静态申请的形式来完成. 于是这里我想抛出一个问题,Android平台支持动态申请权限么.
<!--more-->
相信很多人回答都是不支持,当然这个答案是对的,但是为什么不支持呢,知其然更要知其所以然.了解其原因还是相当有必要的.

##原因列举
  * Android没有提供动态申请权限的机制.
  
  * 目前的静态申请可以将权限安全隐患放在程序安装之前一次提示搞定,而如果动态申请,就会时不时弹出申请框.这样的用户体验太差了.
  
  * 一些权限申请需要依赖于设备的feature(特性),使用静态申请可以明确知道设备需要的特性,Google Play根据程序需要的特性和目标设备具有的特性来决定该设备是否被展示和安装.而动态申请无法明确知道需要的feature.可能导致可以展示的应用无法安装.

  * 可能会带来安全隐患问题.
  

##延伸阅读
  * http://stackoverflow.com/questions/4838779/get-android-permission-dynamiclly
  * http://stackoverflow.com/questions/7517171/is-there-any-way-to-ask-permission-programmatically
  
###其他
  * <a href="http://www.amazon.cn/gp/product/B009OLU8EE/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B009OLU8EE&linkCode=as2&tag=droidyue-23">Android系统源代码情景分析</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B009OLU8EE" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
