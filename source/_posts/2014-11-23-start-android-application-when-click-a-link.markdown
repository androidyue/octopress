---
layout: post
title: "点击网页链接调用Android程序"
date: 2014-11-23 15:58
comments: true
categories: Android Intent
---
最近前端同事问了我一个问题，如何让网页链接实现启动Android的应用，网上有说重写WebView相关的shouldOverrideUrlLoading方法，但是这种理论上能实现，因为你的网页不是仅仅被你自己的webview来浏览，你需要做的是让市面上的浏览器支持才行。  


这里利用零碎的时间整理一下。主要涉及到的问题就是关于Intent在字符串形式和Intent对象之间的转换。如果你是一位前端工程师，请让你的Anroid开发小伙伴来看这篇文章，一同解决问题。
<!--more-->
##两种表现形式
Intent是Android开发中常见的API。在处理Android组件中，有着必不可少的作用。Intent可以以两种方式存在。
  
  * Intent对象。用于在程序中处理，在处理Android组件时使用。
  * 字符串形式的URI。 用于在非程序代码中，如网页中进行使用等。

而这里我们解决我们上面问题的就是后者，字符串形式的Intent。

##Intent对象转成字符串URI
Intent提供了两种将对象转换成字符串URI，一个是推荐的`public String toUri (int flags)`，
在API 4加入，将Intent对象转换成字符串形式的URI。字符串形式的URI可以包含Intent的data,action,categories, type, flags, package, component和extras。
```java
Intent intent = new Intent();
ComponentName comp = new ComponentName("com.mx.app.mxhaha", "com.mx.app.MxMainActivity");
intent.setComponent(comp);
Log.i(LOGTAG, "intent.uri=" + intent.toUri(Intent.URI_INTENT_SCHEME));
```
生成的字符串URI为
```
intent:#Intent;component=com.mx.app.mxhaha/com.mx.app.MxMainActivity;end
```

另一个方法是`public String toURI ()`，
这是一个弃用的方法，因为它生成的字符串以**#**开头，**放在链接上会被当成锚点**。不建议使用使用这个方法。

上面的Intent对象使用toUri转换成
```
#Intent;component=com.mx.app.mxhaha/com.mx.app.MxMainActivity;end
```

##字符串URI转成Intent对象
###getIntent(String uri)
这个方法只适用于处理以#开头的URI，而且在其方法内部实际上是调用的`parseUri(uri, 0)`来实现的。这个方法已经被比较为弃用，不推荐使用。

###getIntentOld(String uri)
getIntentOld既可以支持#开头的URI转换成Intent对象，如果uri不是Intent的字符串形式，那么也会返回一个Intent，只是其data部分为uri，action为android.intent.action.VIEW。

###parseUri(String uri, int flags)
这个是最完整的转换方法。接收uri和flag作为参数。支持将字符串形式的URI转成Intent对象.

以下为一个既可以解析**intent:**开头的URI也可以解析**#Intent**开头的URI的方法。
```java
public static Intent parseIntent(String url) {
	Intent intent = null;
	// Parse intent URI into Intent Object
	int flags = 0;
	boolean isIntentUri = false;
	if (url.startsWith("intent:")) {
		isIntentUri = true;
		flags = Intent.URI_INTENT_SCHEME;
	} else if (url.startsWith("#Intent;")) {
		isIntentUri = true;
	}
	if (isIntentUri) {
		try {
			intent = Intent.parseUri(url, flags);
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
	}
	return intent;
}
```

##多说一下
对于Intent字符串形式URI在网页链接中的应用，不同的浏览器实现程度不一致。目前[傲游浏览器Android版](http://www.maxthon.cn/)由我已经完全实现这一功能。希望其他的浏览器也可以实现一下这个功能。
