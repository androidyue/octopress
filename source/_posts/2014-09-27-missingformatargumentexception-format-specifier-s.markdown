---
layout: post
title: "MissingFormatArgumentException: Format specifier 's'"
date: 2014-09-27 10:09
comments: true
categories: Java 技巧
---
贴出一个简单的异常，分析一下原因，以及推荐一个相对好一些的替代方法。
如下，如果我们进行字符串格式化提供的值的数量少于字符串格式符（%s）的数量，就会抛出MissingFormatArgumentException异常。
<!--more-->
###错误代码
```java lineos:false
String format = "%s/%s";
String.format(format, "a");
```

###崩溃信息
```java lineos:false
Exception in thread "main" java.util.MissingFormatArgumentException: Format specifier 's'
	at java.util.Formatter.format(Unknown Source)
	at java.util.Formatter.format(Unknown Source)
	at java.lang.String.format(Unknown Source)
	at Concatenation.testFormat(Concatenation.java:17)
	at Concatenation.main(Concatenation.java:4)
```

###替代方法
相比字符串的格式化操作，使用字符串的替换更加安全，避免因为疏忽或者考虑不全等带来的崩溃问题。
```java lineos:false
String s = "%country%/%city%".replace("%country%", "China").replace("%city%", "Beijing");
```


###其他
  * <a href="http://www.amazon.cn/gp/product/B0084ASO7E/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0084ASO7E&linkCode=as2&tag=droidyue-23">数学之美</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0084ASO7E" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00D36S64K/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00D36S64K&linkCode=as2&tag=droidyue-23">像计算机科学家一样思考Java</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00D36S64K" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00HQW9FMO/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00HQW9FMO&linkCode=as2&tag=droidyue-23">微信公众平台应用开发:方法、技巧与案例</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00HQW9FMO" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

