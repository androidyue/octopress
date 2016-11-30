---
layout: post
title: "关于Android中App的停止状态"
date: 2014-07-14 19:46
comments: true
categories: Android
---
很多人遇到过广播收不到的问题,比如Google Play推广安装广播没有收到等,诸如这些问题,又都是什么原因呢,这篇文章将进行回答.

从Android 3.1(HoneyComb) 也就是API 12开始,Android引入了一套新的启动控制,这就是程序的停止状态.那让我们看一下Google对于程序的停止状态的描述.

<!--more-->
##什么是程序的停止状态

>Starting from Android 3.1, the system's package manager keeps track of applications that are in a stopped state and provides a means of controlling their launch from background processes and other applications.

>从Android 3.1开始,系统的包管理器开始跟踪处理停止状态的程序.并且提供了方法来控制从后台进程或者其他程序对它们的启动.

>Note that an application's stopped state is not the same as an Activity's stopped state. The system manages those two stopped states separately.

>注意 程序的停止状态和Activity的停止状态不同,系统会单独处理这两种状态.

>The platform defines two new intent flags that let a sender specify whether the Intent should be allowed to activate components in stopped application.
Android平台提供了两个intent flags,用来让发送广播的一方决定广播是否需要同时发送给已经停止的程序.

>FLAG_INCLUDE_STOPPED_PACKAGES — Include intent filters of stopped applications in the list of potential targets to resolve against.
将已经支持的程序加入到能处理intent的目标处理者.

>FLAG_EXCLUDE_STOPPED_PACKAGES — Exclude intent filters of stopped applications from the list of potential targets.
在能处理intent的目标处理者中不包含已经停止的程序.



当如果intnet中没有或者设置了上面两个flag,在目标处理者中是包含已经处于停止的程序.但是注意,系统会为所有的广播intent增加FLAG_EXCLUDE_STOPPED_PACKAGES这个flag.

##为什么Android要引入这一状态
Note that the system adds FLAG_EXCLUDE_STOPPED_PACKAGES to all broadcast intents. It does this to prevent broadcasts from background services from inadvertently or unnecessarily launching components of stoppped applications. A background service or application can override this behavior by adding the FLAG_INCLUDE_STOPPED_PACKAGES flag to broadcast intents that should be allowed to activate stopped applications.

需要注意的是,系统会默认地对所有的广播intent增加一个FLAG_EXCLUDE_STOPPED_PACKAGES的flag,这样做的目的是为了阻止来自后台服务的广播不慎或者启动处于停止状态的程序的不必要的组件.

通常的intnet广播,处于停止状态的程序的receiver是无法接受到的.那么怎么才能让这些停止状态的程序接受到呢?可以这样做,在后台服务或者应用中发送广播时,增加一个FLAG_INCLUDE_STOPPED_PACKAGES 的flag,意思是包含处于停止状态的程序.这样就可以激活停止状态的程序.

正如上述引用指出,系统默认阻止广播intent发送给处于停止状态的程序包,实际上这是为了保证安全和省电需要.比如说网络变化的广播,如果某些程序注册监听,并且它在得到广播时,做一系列的网络操作,这样必然是很耗能源的.

##激活状态和停止状态的切换

当程序第一次安装并且没有启动,或者用户手动从程序管理将其停止后,程序都会处于停止状态.

###如何变为停止状态
  * 在设置应用管理中的应用详情页点击强制停止
  * 使用adb shell    `adb shell am force-stop package-name`
  * 使用ActivityManager的隐藏方法forceStopPackages,并且向manifest加入申请权限<uses-permission android:name="android.permission.FORCE_STOP_PACKAGES"/>

###如何脱离停止状态
  * 手动启动程序
  * 使用adb激活应用组件,如activity或者receiver

##发送广播intent给处于停止状态的应用
  * 在Java代码发送Intent时,加入flag FLAG_INCLUDE_STOPPED_PACKAGES
  * 如果使用adb,同样是加入FLAG_INCLUDE_STOPPED_PACKAGES(其具体值为32),如**adb shell am broadcast -a com.android.vending.INSTALL_REFERRER -f 32**


##检查是否处于停止状态
  * 进入设置--应用管理--某个应用的详细页,如果强制停止按钮不可用,则说明程序已经处于停止状态.
  * 进入设备终端,查看系统文件**cat /data/system/packages-stopped.xml**

##问答环节
  * 提问:如果我的程序没有activity只有一个receiver,我改如何激活才能接收到正常的广播intent呢
  * 回答:实际上,如果是上面所述的情况,该应用在安装之后不是处于停止状态,因为它没有任何用户可以直接点击的行为去将它移除停止状态.你可以正常接收广播intent,除非你人为地将它强制停止.

  * 提问:系统的程序刚安装会处于停止状态么?
  * 回答:系统的程序通常会存放在 /system/app目录下,在一开始安装之后不会处于停止状态.

  * 提问:Google Play的推广广播据说是在程序安装完成之后发送,是不是3.1之后受影响么
  * 回答:不受影响的.Google文档说INSTALL_REFERRER会在程序安装完成之后发送,据实际查看日志观察,从3.1之后,是在程序安装后第一次打开时发送.


##引用参考
<a href="http://developer.android.com/about/versions/android-3.1.html" target="_blank">Android 3.1 Hignlight</a>

###其他
  * <a href="http://www.amazon.cn/gp/product/B00EOIDFX8/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00EOIDFX8&linkCode=as2&tag=droidyue-23">Android开发权威指南</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00EOIDFX8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B007PMPHJA/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B007PMPHJA&linkCode=as2&tag=droidyue-23">Android框架揭秘</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B007PMPHJA" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />




































