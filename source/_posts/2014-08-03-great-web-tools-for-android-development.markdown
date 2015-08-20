---
layout: post
title: "快速提高Android开发效率的Web工具"
date: 2014-08-03 14:34
comments: true
categories: Android 效率
---
在Google的广大支持下，便捷开发Android程序的Native工具层出不穷。其实Android开发涉及到的范围也不小，一些Web工具有时候也会带来事半功倍的效果。有些甚至是一些native应用无法做到的。本文，将简单列举一下本人正在使用的一些工具，当然也会持续更新。
<!--more-->

##查找优秀的参考工程
codota是一个查找可供参考的Android工程的网站，它的爬虫已经采集了将近7百万个工程。比如我们想要写一段Android中检测网络可用性的代码，我们只需要在搜索框中输入network，就会找到已经存在的优秀工程中关于这一逻辑的具体实现，确实为我们编码节省不少重复造轮子的成本。另外，codeta还有支持Android Studio的插件，让查找源码更快捷。

地址:[codota,Find Great Code Examples](http://www.codota.com/)

##Android军火库
android-arsenal，中文意思 Android军火库，里面手机了Android中的SDK，Library以及Android开发的工具，满满的干货。有木有一种想见恨晚的赶脚，快来加入书签吧。

地址:[The Android Arsenal - A categorized directory of free libraries and tools for Android](http://android-arsenal.com/)   

注意https协议的地址稍有问题，建议使用http协议的地址。

##在线反编译
当你还在花时间切换不同的反编译工具时，一个在线反编译网站应运而生，它就是[Android APK Decompiler](http://www.decompileandroid.com/)，只需上传要反编译的apk包，无需多时，源码可以下载下来了。

地址：[Android APK Decompiler](http://www.decompileandroid.com/)


##Grepcode
grepcode.com是一个Java源码搜索引擎，对于查看Android代码也不例外。并且支持多个API版本快速切换查看。如果你的IDE关联本地代码后，让机器累的喘不过气来，那么就试一试这个在线的工具吧。

地址：[grepcode.com](http://grepcode.com/search/?query=google+android&entity=project)

##Android Asset Studio
这是一个神奇的网页，里面包含了多个与资源相关的在线工具，比如icon制作（桌面icon，通知栏icon等），9patch图片制作，ActionBar样式等相关的工具。当你有资源相关的工作时，不妨试一试这个网页工具。

地址：[Android Asset Studio](http://romannurik.github.io/AndroidAssetStudio/index.html)

##快速下载Google Play应用
由于一些你懂的原因，国内无法直接访问Google Play商店。而且下载Google Play商店还是需要登陆谷歌账户，以国内的网络，下载成功简直是太困难了。  
这里介绍一款不需要账户国内即可访问的Web工具。可以通过输入包名或者Google Play地址即可下载。

地址:<a href="http://apps.evozi.com/apk-downloader/" target="_blank">APK Downloader</a>


##进制转换
Android中所有的资源都有一个对应的资源ID，资源ID的类型为16进制的整数。有些时候特殊的场合处理资源ID，为了调试需要进行进制转换，比如16进制转常用的10进制。不用自己算，使用下面的工具就可以轻松搞定。

地址：<a href="http://www.binaryhexconverter.com/hex-to-decimal-converter" target="_blank">Hex To Decimal Converter</a>

##UI相关必备
通常UI设计师都会给开花童鞋色值，当疏忽的时候，我们可以使用截图软件得到10进制的三个值，然后将其转换成色值。这里有一个便捷的RGB工具。

地址：<a href="http://www.colorspire.com/rgb-color-wheel/" target="_blank">RGB Color Wheel/</a>

##JSON格式化
在CS应用中，客户端和服务器端通常使用json作为数据交换格式。当分析的时候，我们必然是将raw数据转换成可读性更高的。快来使用这个强大的工具吧。

地址：<a href="http://json.parser.online.fr/" target="_blank">JSON Parser</a>

##查看HTML5,JS,CSS可用情况
caniuse.com是一个检测HTML5，JS，CSS在各个浏览器平台是否可用的web工具。便于我们了解前端方案是否在目标设备上是否有效。

地址：[caniuse.com](http://caniuse.com/#search=queryselector)

###其他
  * <a href="http://www.amazon.cn/gp/product/B007A9W11U/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B007A9W11U&linkCode=as2&tag=droidyue-23">提升工作与生活效率的52项原则</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B007A9W11U" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00CE1JQO4/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00CE1JQO4&linkCode=as2&tag=droidyue-23">Android中的高级编程有哪些</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00CE1JQO4" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
