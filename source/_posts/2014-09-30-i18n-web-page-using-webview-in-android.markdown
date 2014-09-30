---
layout: post
title: "利用WebView实现网页的i18n"
date: 2014-09-30 21:44
comments: true
categories: Javascript Android i18n L10n
---

软件如果想在全球获得更多的用户，国际化与本地化（internationalization and localization 简称：i18n 和L10n）是非常必要的。本文将介绍一个很geeky的方法来利用webview实现html的i18n。
<!--more-->
##基本概念
国际化是指在设计软件，将软件与特定语言及地区脱钩的过程。当软件被移植到不同的语言及地区时，软件本身不用做内部工程上的改变或修正。本地化则是指当移植软件时，加上与特定区域设置有关的信息和翻译文件的过程。  

国际化和本地化之间的区别虽然微妙，但却很重要。国际化意味着产品有适用于任何地方的“潜力”；本地化则是为了更适合于“特定”地方的使用，而另外增添的特色。用一项产品来说，国际化只需做一次，但本地化则要针对不同的区域各做一次。 这两者之间是互补的，并且两者合起来才能让一个系统适用于各地。

上述摘自[维基百科 国际化与本地化](http://zh.wikipedia.org/wiki/%E5%9B%BD%E9%99%85%E5%8C%96%E4%B8%8E%E6%9C%AC%E5%9C%B0%E5%8C%96)

##问题
如何实现网页的国际化和本地化，支持更多的语言呢？最简单的逻辑可能类似如下伪代码实现
```javascript lineos:false
if (isChinese) {
	lable.innerText = "中文"
} else if (isEnglish) {
	lable.innerText = "English"
}
```
但是这样是很有问题的，如果增加了语言必然要修改代码代码，违背了对修改关闭的原则。所以上述并不是一种很好的方法

##更Hacky的实现
实现思路主要是借助强大的Android系统的资源适配机制（基于设备设备的信息Locale等匹配最合适的资源）。貌似这个是Chrome中网页实现i18n的逻辑。实现步骤主要如下

  * Android程序提供必要多个Locale的资源
  * 将网页需要的文字资源组成JSON交换格式
  * WebView注入一个变量，变量内容为上一步的JSON数据
  * 网页实现读取资源，为元素设置内容
  * 加载网页

###提供多个Locale文字资源
####values/strings.xml
```xml lineos:false
<?xml version="1.0" encoding="utf-8"?>
<resources>    
    <string name="city_beijing">Beijing</string>
    <string name="country_china">China</string>
</resources>
```
####values-zh-rCN/strings.xml
```xml lineos:false
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="city_beijing">北京</string>
    <string name="country_china">中国</string>
</resources>
```

###接下来的代码
```java lineos:false
WebView myWebView = new WebView(this);
addContentView(myWebView, new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));
//将网页需要的文字资源组成JSON交换格式
JSONObject jsObj = new JSONObject();
try {
	jsObj.put("country", getString(R.string.country_china));
	jsObj.put("city", getString(R.string.city_beijing));
} catch (JSONException e) {
	e.printStackTrace();
}
//WebView注入一个变量，变量内容为上一步的JSON数据
String injectString = "var textRes = " + jsObj;
Log.i(LOGTAG, "injuectString = " + injectString);
WebSettings settings = myWebView.getSettings();
settings.setJavaScriptEnabled(true);
myWebView.loadUrl("javascript:" + injectString);
myWebView.loadUrl("file:///android_asset/location.html");
```

###网页实现
```html lineos:false
<html>
	<head>
		<title>i18n Test</title>
	</head>
	<body>
		<label id="country"></label>
		<lable id="city"></lable>
	</body>
	<script type="text/javascript">
		document.getElementById('country').innerText= textRes.country
		document.getElementById('city').innerText = textRes.city
	</script>
</html>
```
###结果
  * 当系统语言为中文简体环境下网页显示**中国 北京**
  * 当系统语言为非中文简体环境下网页显示**China Beijing**


###Demo源码下载
[@百度网盘](http://pan.baidu.com/s/1sjwNamL)

###其他
  * <a href="http://www.amazon.cn/gp/product/B00ASIN7G8/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00ASIN7G8&linkCode=as2&tag=droidyue-23">这样才可以精通Android</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00ASIN7G8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B002JCU2TG/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B002JCU2TG&linkCode=as2&tag=droidyue-23">瞬间之美:Web界面设计如何让用户心动</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B002JCU2TG" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
