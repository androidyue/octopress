---
layout: post
title: "Android Webview加载网页时发送HTTP头信息"
date: 2014-07-12 08:36
comments: true
categories: Android Webview
---
众所周知，当你点击一个超链接进行跳转时，WebView会自动将当前地址作为Referer（引荐）发给服务器，因此很多服务器端程序通过是否包含referer来控制盗链，所以有些时候，直接输入一个网络地址，可能有问题，那么怎么解决盗链控制问题呢，其实在webview加载时加入一个referer就可以了，如何添加呢？
<!-- more -->
从Android 2.2 （也就是API 8）开始，WebView新增加了一个接口方法，就是为了便于我们加载网页时又想发送其他的HTTP头信息的。
>public void loadUrl (String url, Map<String, String> additionalHttpHeaders)  
Added in API level 8  
Loads the given URL with the specified additional HTTP headers.  
Parameters  
url	the URL of the resource to load  
additionalHttpHeaders	the additional headers to be used in the HTTP request for this URL, specified as a map from name to value. Note that if this map contains any of the headers that are set by default by this WebView, such as those controlling caching, accept types or the User-Agent, their values may be overriden by this WebView's defaults.
 
以下是一个简单的demo，来展示以下如何使用。 
```java
public void testLoadURLWithHTTPHeaders() {
    final String url = "http://droidyue.com";
    WebView webView = new WebView(getActivity());
    Map<String,String> extraHeaders = new HashMap<String, String>();
    extraHeaders.put("Referer", "http://www.google.com");
    webView.loadUrl(url, extraHeaders);
}
```

同样上面也可以应用到UserAgent等其他HTTP头信息  
<a href="http://droidyue.com/blog/2014/05/27/load-url-with-extra-http-headers-using-webview-in-android/" target="_blank">英文版文章</a>
###其他
  * <a href="http://www.amazon.cn/gp/product/B00LF7R8MA/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00LF7R8MA&linkCode=as2&tag=droidyue-23">高性能浏览器网络</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00LF7R8MA" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

