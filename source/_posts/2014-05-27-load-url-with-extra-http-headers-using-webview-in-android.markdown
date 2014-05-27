---
layout: post
title: "Load URL With Extra HTTP Headers Using WebView In Android"
date: 2014-05-27 21:44
comments: true
categories: android webview HTTP header Referer
---
As we know, Webview will add the referer into the reqeust if we click a hyperlink to navigate to another one. But if we want to add a referer when a hard loading starts, What can we do to make it?  
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
> Written with [StackEdit](https://stackedit.io/).
