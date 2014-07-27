---
layout: post
title: "纠结才能写出好代码"
date: 2014-07-27 14:41
comments: true
categories: 编程随想
---

程序员的代码修炼应该有两个目标，一个是代码的执行效率，另一个是代码的可读性。朝着这两个目标努力的人很多，但是能够达到目标的人很少。

以前部门老大曾经说过一句话，大概意思是，想要写出好的代码，就要在写的时候纠结一会儿。

其实编程本身就是一个寻找最优解的哲学问题。解决一个问题，有时候我们要适度纠结，来使我们的代码更加可读，效率更高。
<!--more-->
以下以一个简单的例子，列举一下一个小纠结的问题。我们这里尽量将重点放在如何改善代码等问题上。

##方法作用
从WebView中读取Favicon，并且返回，如果webview为null，或者web.getFavicon()为null，则返回默认的一个图标。

##原始的代码
```java
public Bitmap getFavicon(final WebView webview) {
	if (null != webview && null != webview.getFavicon()) {
		return webview.getFavicon();
	} else {
		return BitmapFactory.decodeResource(getResources(), R.drawable.default_favicon);
	}
}
```
上面存在一种情况，即null != webview && null != webview.getFavicon() 这个条件成立的时候，其实还是有改善的地方，因为这种情况下webview.getFavicon()会存在两次调用，一次作为判断条件需要，另一次是返回引用需要。

##这样改好么
```java
public Bitmap getFavicon(final WebView webview) {
	if (null != webview) {
		Bitmap favicon = webview.getFavicon();
		if (null != favicon) {
			return favicon;
		} else {
			return BitmapFactory.decodeResource(getResources(), R.drawable.default_favicon);
		}
	} else {
		return BitmapFactory.decodeResource(getResources(), R.drawable.default_favicon);
	}
}
```
这种情况下，没有了上面存在的两次调用的问题了，但是关于返回默认值是存在两处相同的代码，如果需要修改默认的图标时，有可能需要修改两次。还是不够好。


##这个总可以了吧
```java
public Bitmap getFavicon(final WebView webview) {
	Bitmap defaultFavicon = BitmapFactory.decodeResource(getResources(), R.drawable.default_favicon);
	if (null != webview) {
		Bitmap favicon = webview.getFavicon();
		if (null != favicon) {
			return favicon;
		} else {
			return defaultFavicon;
		}
	} else {
		return defaultFavicon;
	}
}
```
这个确实没有上面的两个问题了，但是还是有不完美的地方，就是如果webview不为null，并且webview.getFavicon()也不为null，那么**Bitmap defaultFavicon = BitmapFactory.decodeResource(getResources(), R.drawable.default_favicon);**实际上是多余的。


##终于改好了
```java
public Bitmap getFavicon(final WebView webview) {
	Bitmap favicon = null;
	if (null != webview && (favicon = webview.getFavicon()) != null) {
		return favicon;
	} else {
		return BitmapFactory.decodeResource(getResources(), R.drawable.default_favicon);
	}
}
```
对，上面的代码没有一处多余，并且也是最简单的。

从现在开始，写代码的时候纠结吧。不要仅仅为了实现，更不要追求代码的数量，培养你的代码洁癖，做个代码艺术家。

###其他
  * <a href="http://www.amazon.cn/gp/product/B0061XKRXA/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0061XKRXA&linkCode=as2&tag=droidyue-23">纠结经典：代码大全</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0061XKRXA" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B0031M9GHC/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0031M9GHC&linkCode=as2&tag=droidyue-23">如何写出高效整洁的代码</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0031M9GHC" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B003BY6PLK/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B003BY6PLK&linkCode=as2&tag=droidyue-23">Martin Fowler这样重构代码</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B003BY6PLK" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />


