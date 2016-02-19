---
layout: post
title: "Android中处理Touch Icon的方案"
date: 2015-01-18 21:23
comments: true
categories: Android WebApp
---
苹果的Touch Icon相对我们都比较熟悉，是苹果为了支持网络应用（或者说网页）添加到桌面需要的图标，有了这些Touch Icon的网页链接更加和Native应用更相像了。由于苹果设备IPod，IPhone,IPad等设备广泛，很多网页都提供了touch icon这种图标资源。由于Android中并没有及早的有一份这样的标准，当我们想把网页添加到桌面时，仍然需要使用苹果的Touch Icon。
<!--more-->
##Touch Icon
当我们想让一个网页比较完美地添加到桌面，通常情况下我们需要设置一个png图片文件作为apple-touch-icon。比如
```html
<link rel="apple-touch-icon" href="/custom_icon.png">
```
如果想支持IPhone和IPad，我们需要使用sizes属性来制定多个图片，默认sizes的值为60 x 60。
```html
<link rel="apple-touch-icon" href="touch-icon-iphone.png">
<link rel="apple-touch-icon" sizes="76x76" href="touch-icon-ipad.png">
<link rel="apple-touch-icon" sizes="120x120" href="touch-icon-iphone-retina.png">
<link rel="apple-touch-icon" sizes="152x152" href="touch-icon-ipad-retina.png">
```
在IOS7之前，苹果系统会对添加到桌面的图标进行圆角化等视觉上的处理，为了不让其处理，我们可以使用apple-touch-icon-precomposed来作为rel的值实现。

更多关于Touch Icon的信息，可以访问[水果开发者网站](https://developer.apple.com/library/mac/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)了解更多。

##Android中有缺陷的实现
在Android WebView提供了处理Touch Icon的回调，`onReceivedTouchIconUrl(WebView view, String url,boolean precomposed)`该方法返回了对我们有用的touch icon的url，和是否为预组合（在IOS中不需要进行视觉处理）。虽然有这些数据，我们可以进行处理，但是这其中是有问题的，就是我们不好确定文件的大小，来选择适合的图片。

举个例子,如下一个网页的源码，其中sizes的顺序不规律
```html
<link rel="apple-touch-icon-precomposed" sizes="72x72" href="http://www.qiyipic.com/20130423143600/fix/H5-72x72.png">
<link rel="apple-touch-icon-precomposed" sizes="114x114" href="http://www.qiyipic.com/20130423143600/fix/H5-114x114.png">
<link rel="apple-touch-icon-precomposed" sizes="57x57" href="http://www.qiyipic.com/20130423143600/fix/H5-57x57.png">
<link rel="apple-touch-icon-precomposed"  href="http://www.qiyipic.com/20130423143600/fix/H5-0x0.png">
```
加载网页，onReceivedTouchIconUrl输出的日志
```bash
I/MainActivity( 6995): onReceivedTouchIconUrl url=http://www.qiyipic.com/20130423143600/fix/H5-0x0.png;precomposed=true
I/MainActivity( 6995): onReceivedTouchIconUrl url=http://www.qiyipic.com/20130423143600/fix/H5-57x57.png;precomposed=true
I/MainActivity( 6995): onReceivedTouchIconUrl url=http://www.qiyipic.com/20130423143600/fix/H5-114x114.png;precomposed=true
I/MainActivity( 6995): onReceivedTouchIconUrl url=http://www.qiyipic.com/20130423143600/fix/H5-72x72.png;precomposed=true
```
从上面的输出来看，基本上是后面（书写）的元素先打印出来，所以这个回调的缺陷如下

  * 由于Touch Icon url地址没有硬性规定，不能根据url包含某些尺寸来判断使用哪个icon
  * 由于网页编写touch icon元素相对随意，不能根据onReceivedTouchIconUrl调用先后来决定使用哪个icon
  * 回调中没有sizes属性值，不好确定使用哪个icon
  * 如果我们选取质量最高的图片，然后进行适当压缩处理或许可以解决问题，但是将全部icon下载下来或者根据Head头信息总感觉不怎么好。

##改进方法
既然WebView没有现成的方法满足我们的需求，只好自己来实现。其实实现方法还是比较简单地就是js脚本注入检测网页元素中得touch icon，返回json数据。
###JavaScript方法
下面的JS代码所做的功能为查找所有为touch icon的link元素，包含正常的还标记为precomposed。然后将这些link元素的属性存入json数据，最后返回给Java代码中对应的回调。
```javascript
var touchIcons = [];
function gatherTouchIcons(elements) {
	var normalTouchIconLength = elements.length;
	var currentElement;
	for (var i =0; i < normalTouchIconLength;i++) {
		currentElement = elements[i];
		var size;
		if (currentElement.hasAttribute('sizes')) {
			size = currentElement.sizes[0];
		} else {
			size = '';
		}
		var info = {'sizes':size, 'rel': currentElement.rel, 'href': currentElement.href};
		touchIcons.push(info);
	}
}

function obtainTouchIcons() {
	normalElements = document.querySelectorAll("link[rel='apple-touch-icon']");
	precomposedElements = document.querySelectorAll("link[rel='apple-touch-icon-precomposed']");
	gatherTouchIcons(normalElements);
	gatherTouchIcons(precomposedElements);
	var info = JSON.stringify(touchIcons);
	window.app_native.onReceivedTouchIcons(document.URL, info);
}
obtainTouchIcons();
```

###Java代码
这里为了便于理解还是全部贴出了demo的源码，demo中当网页加载完成之后注入上面的js代码获取touch icon信息，然后返回给java的回调方法中。如果不清楚Java和JavaScript交互，可以访问[Android中Java和JavaScript交互](http://droidyue.com/blog/2014/09/20/interaction-between-java-and-javascript-in-android/)了解更多。
```java
package com.example.obtaintouchicon;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {

	protected String LOGTAG = "MainActivity";

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		WebView webView = new WebView(this);
		webView.getSettings().setJavaScriptEnabled(true);
		webView.setWebViewClient(new WebViewClient() {
			@Override
			public void onPageFinished(WebView view, String url) {
				super.onPageFinished(view, url);
				final String touchIconJsCode = getTouchIconJsCode();
				Log.i(LOGTAG , "onPageFinished url = " + url + ";touchIconJsCode=" + touchIconJsCode);
				view.loadUrl("javascript:" + touchIconJsCode);
			}
		});
		webView.addJavascriptInterface(new JsObject(), "app_native");
		webView.loadUrl("http://192.168.1.5:8000/html/touchicon.html");
	}

	
	private class JsObject {
		
		@JavascriptInterface
		public void onReceivedTouchIcons(String url, String json) {
			Log.i(LOGTAG, "onReceivedTouchIcons url=" + url + ";json=" + json);
		}
	}
	
	private String getTouchIconJsCode() {
		StringBuilder total = new StringBuilder();
		InputStream inputStream = null;
		BufferedReader bufferReader = null;
		try {
			inputStream = getAssets().open("touchicon.js");
			bufferReader = new BufferedReader(new InputStreamReader(inputStream));
			String line;
			while ((line = bufferReader.readLine()) != null) {
			    total.append(line);
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (null != inputStream) {
				try {
					inputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return total.toString();
	}
}
```
###返回的JSON数据
```java
[
	{
		"sizes":"72x72",
		"rel":"apple-touch-icon-precomposed",
		"href":"http://www.qiyipic.com/20130423143600/fix/H5-72x72.png"
	},
	{
		"sizes":"114x114",
		"rel":"apple-touch-icon-precomposed",
		"href":"http://www.qiyipic.com/20130423143600/fix/H5-114x114.png"
	},
	{
		"sizes":"57x57",
		"rel":"apple-touch-icon-precomposed",
		"href":"http://www.qiyipic.com/20130423143600/fix/H5-57x57.png"
	},
	{
		"sizes":"",
		"rel":"apple-touch-icon-precomposed",
		"href":"http://www.qiyipic.com/20130423143600/fix/H5-0x0.png"
	}
]
```
我们可以对得到的JSON数据按照需要处理。

##Google会改进么
答案是会，而且已经改进，但Google修改的不是onReceivedTouchIconUrl这个方法，而是Google正在推行自己的一套规则。

在Chrome上，Google增加了这样一个元素，这是Google提供的为网页程序定义元数据的方法。
```html
<link rel="manifest" href="manifest.json">
```
在元数据json中，你可以自定义title，起始页，程序是横屏还是竖屏展示。一个简单地json实例如下，这里我们可以看到其中icons中存在多个类似touch icon的图标，src代表图标路径，sizes代表大小，type就是mimetype，density指的是Android中的屏幕密度（这样更加Android化了）。
```java
{
  "name": "Web Application Manifest Sample",
  "icons": [
    {
      "src": "launcher-icon-0-75x.png",
      "sizes": "36x36",
      "type": "image/png",
      "density": "0.75"
    },
    {
      "src": "launcher-icon-1x.png",
      "sizes": "48x48",
      "type": "image/png",
      "density": "1.0"
    },
    {
      "src": "launcher-icon-1-5x.png",
      "sizes": "72x72",
      "type": "image/png",
      "density": "1.5"
    },
    {
      "src": "launcher-icon-2x.png",
      "sizes": "96x96",
      "type": "image/png",
      "density": "2.0"
    },
    {
      "src": "launcher-icon-3x.png",
      "sizes": "144x144",
      "type": "image/png",
      "density": "3.0"
    },
    {
      "src": "launcher-icon-4x.png",
      "sizes": "192x192",
      "type": "image/png",
      "density": "4.0"
    }
  ],
  "start_url": "index.html",
  "display": "standalone",
  "orientation": "landscape"
}
```
关于Google这套新的标准，可以参考[Add to Homescreen](https://developer.chrome.com/multidevice/android/installtohomescreen)

但是由于目前，这种标准实施率相对比较低，所以我们还是需要使用苹果的touch icon。

##推荐阅读
  * [Everything you always wanted to know about touch icons](https://mathiasbynens.be/notes/touch-icons)


##源码下载
  * [http://pan.baidu.com/s/1dDD3gZZ](http://pan.baidu.com/s/1dDD3gZZ)
