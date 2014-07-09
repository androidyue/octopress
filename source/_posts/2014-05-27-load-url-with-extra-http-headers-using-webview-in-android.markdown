---
layout: post
title: "Load URL With Extra HTTP Headers Using WebView In Android"
date: 2014-05-27 21:44
comments: true
categories: android webview HTTP header Referer
---
As we know, Webview will add the referer into the reqeust if we click a hyperlink to navigate to another one. But if we want to add a referer when a hard loading starts, What can we do to make it?  
<!-- more -->
Since Froyo(API Level 8), the webview starts providing an interface for us to send extra HTTP headers when loading a URL.
>public void loadUrl (String url, Map<String, String> additionalHttpHeaders)  
Added in API level 8  
Loads the given URL with the specified additional HTTP headers.  
Parameters  
url	the URL of the resource to load  
additionalHttpHeaders	the additional headers to be used in the HTTP request for this URL, specified as a map from name to value. Note that if this map contains any of the headers that are set by default by this WebView, such as those controlling caching, accept types or the User-Agent, their values may be overriden by this WebView's defaults.

Now this is a working example.  
```java
public void testLoadURLWithHTTPHeaders() {
    final String url = "http://androidyue.github.io/";
    WebView webView = new WebView(getActivity());
    Map<String,String> extraHeaders = new HashMap<String, String>();
    extraHeaders.put("Referer", "http://www.google.com");
    webView.loadUrl(url, extraHeaders);
}
```
For more details about HTTP Headers, please visit [List_of_HTTP_header_fields](http://en.wikipedia.org/wiki/List_of_HTTP_header_fields)
More details about Webview, please visit [http://developer.android.com/reference/android/webkit/WebView.html](http://developer.android.com/reference/android/webkit/WebView.html) 

###推荐
  * <a href="http://www.amazon.cn/gp/product/B008B4DY78/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B008B4DY78&linkCode=as2&tag=droidyue-23">深入Android应用开发:核心技术解析与最佳实践</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B008B4DY78" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00931Y3PK/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00931Y3PK&linkCode=as2&tag=droidyue-23">Android从入门到精通</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00931Y3PK" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B008Z1IFGC/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B008Z1IFGC&linkCode=as2&tag=droidyue-23">Android移动开发技术丛书:Android网络开发技术实战详解</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B008Z1IFGC" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

