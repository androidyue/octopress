---
layout: post
title: "如何从UA分辨出Android设备类型"
date: 2014-08-05 22:29
comments: true
categories: Android
---

随着Android设备增多，不少网站都开始设备Android设备，而Android主流设备类型以手机和平板为主。网站在适配时通过User Agent(用户代理，以下简称UA)又如何区分呢，本文部分内容翻译自Google官方博客<a href="http://googlewebmastercentral.blogspot.hk/2011/03/mo-better-to-also-detect-mobile-user.html" target="_blank">Mo’ better to also detect “mobile” user-agent</a>。
<!--more-->
##一针见血
标准判断规则：**Mobile Android has "Mobile" string in the User-Agent header. Tablet Android does not.**  
<font color="red">在Android设备UA字符串中，移动设备包含**Mobile**字符串，而平板设备没有。</font>

##旁征博引
在最初的Android设备（即手机）中UA字符串中包含着**android**,所以那时候可以使用检测UA字符串中是否包含（不区分大小写）**android**来判断。

  
但是后来一个新的Android设备出现了，就是Android平板，不幸的是，Android平板上的UA也包含android，而对于平板上更适合展示桌面（PC）的网页版式。而如果仅仅以上述的判断规则，会给平板用户带来不是很好的用户体验。


鉴于上述问题，Google的Android工程师提出了一个解决方案。对于引导到移动版式的设备，即手机，需要从UA字符串中同时判断是否包含**mobile**和**android**这两个单词。我们先看一些示例。

比如这个UA字符串
```bash 
Mozilla/5.0 (Linux; U; Android 3.0; en-us; Xoom Build/HRI39) AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13
```
因为这个UA字符串中没有mobile，所以需要把它引导到桌面版式（或者一个为Android大屏设备定制的版式）。从这个UA字符串中我们可以了解到，它来自一个大屏设置，即摩托罗拉的XOOM平板。


我们再看另一个UA字符串
```bash
Mozilla/5.0 (Linux; U; Android 2.2.1; en-us; Nexus One Build/FRG83) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1
```
包含了mobile和android,所以把这台Nexus One手机导向到移动版式吧。

相信通过上面两个UA字符串对比，你发现了UA的一些共性了吧，我们看看这些共性吧。
{%img http://git.oschina.net/androidyue/blogres/raw/master/android-user-agent.jpeg Android User Agent commonalities %}

##最后
所以，当你依据检测UA来判断Android手机设备，请同时检查android和mobile两个字符串。


###其他
  * <a href="http://www.amazon.cn/gp/product/B007OQQVMY/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B007OQQVMY&linkCode=as2&tag=droidyue-23">这才是JavaScript的高级程序设计</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B007OQQVMY" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00ENZ67VE/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00ENZ67VE&linkCode=as2&tag=droidyue-23">极客用什么高科技的钟表</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00ENZ67VE" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00ASIN7G8/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00ASIN7G8&linkCode=as2&tag=droidyue-23">这就叫精通Android？</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00ASIN7G8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

