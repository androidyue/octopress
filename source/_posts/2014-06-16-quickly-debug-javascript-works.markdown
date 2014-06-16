---
layout: post
title: "快速高效调试移动端前端代码"
date: 2014-06-16 20:28
comments: true
categories: android browser console javascript debug maxthon chromium
---
通常,前端调试输出一些日志信息可以使用alert或者console, 当然在Desktop机器上很容易,很多浏览器都支持,如果是在手机上,可能比较麻烦,怎么得到输出的console信息呢.
<!-- more -->
其实,使用傲游浏览器Android版,完全可以轻松的做到.下面以一个简单的例子来介绍一下.如,我们使用一下的网页代码,输出console
```html
<html>
    <head>
        <SCRIPT type="text/javascript">
            console.log('This is log level')
        </SCRIPT>
    </head>
</html>
```
在傲游浏览器andorid版上加载上述的网页,然后在终端过滤这个命令`adb logcat | grep MxWebViewDebug`就能得到以下输出.
```bash
13:22 $ adb logcat | grep MxWebViewDebug
I/MxWebViewDebug( 3614): [LOG:CONSOLE(844064902)] "This is log level", source:
```
上述日志格式,完全参考Chromium标准.
###Download
  * Play Store:https://play.google.com/store/apps/details?id=com.mx.browser
  * 中文官网下载:http://www.maxthon.cn/

###One More Thing
  * Q:为什么要写这个类似软文的东西呢?
  * A:首先这个功能是我做的,自己在一次写javascript时,发现不爽,然后就顺手加上了这个超级简单地小功能.感觉至少解决了包括我在内的至少一个人的痛处,不想让这个功能不为人知,于是写了这篇文章.


> Written with [StackEdit](https://stackedit.io/).
