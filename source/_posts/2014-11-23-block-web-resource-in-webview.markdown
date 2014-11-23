---
layout: post
title: "Android中WebView拦截替换网络请求数据"
date: 2014-11-23 21:54
comments: true
categories: Android WebView
---
Android中处理网页时我们必然用到WebView,这里我们有这样一个需求，我们想让WebView在处理网络请求的时候将某些请求拦截替换成某些特殊的资源。具体一点儿说，在WebView加载 `http://m.sogou.com` 时，会加载一个logo图片，我们的需求就是将这个logo图片换成另一张图片。
<!--more-->
###shouldInterceptRequest
好在Android中的WebView比较强大，从API 11(Android 3.0)开始， shouldInterceptRequest被引入就是为了解决这一类的问题。

shouldInterceptRequest这个回调可以通知主程序WebView处理的资源（css,js,image等）请求，并允许主程序进行处理后返回数据。如果主程序返回的数据为null，WebView会自行请求网络加载资源，否则使用主程序提供的数据。注意这个回调发生在非UI线程中,所以进行UI系统相关的操作是不可以的。

shouldInterceptRequest有两种重载。

  * **public WebResourceResponse shouldInterceptRequest (WebView view, String url)** 从API 11开始引入，API 21弃用
  * **public WebResourceResponse shouldInterceptRequest (WebView view, WebResourceRequest request)** 从API 21开始引入

本次例子暂时使用第一种，即shouldInterceptRequest (WebView view, String url)。

###示例代码
```java
WebView webView = new WebView(this);
webView.setWebViewClient(new WebViewClient() {

	@Override
	public WebResourceResponse shouldInterceptRequest(WebView view,	String url) {
		Log.i(LOGTAG, "shouldInterceptRequest url=" + url + ";threadInfo" + Thread.currentThread());
		WebResourceResponse response = null;
		if (url.contains("logo")) {
			try {
				InputStream localCopy = getAssets().open("droidyue.png");
				response = new WebResourceResponse("image/png", "UTF-8", localCopy);
			} catch (IOException e) {
				e.printStackTrace();
			}		
		}
		return response;
	}	
});
setContentView(webView);
webView.loadUrl("http://m.sogou.com");
```
其中WebResourceResponse需要设定三个属性，MIME类型，数据编码，数据(InputStream流形式)。


###示例下载
  * [百度云盘](http://pan.baidu.com/s/1ntOaHoH)
