---
layout: post
title: "Android中HTTP相关的API"
date: 2015-05-30 23:09
comments: true
categories: Android 
---
Android中大多数应用都会发送和接受HTTP请求，在Android API中主要由两个HTTP请求的相关类，一个是HttpURLConnection，另一个是Apache HTTP Client。这两个类实现的HTTP请求都支持HTTPS协议，基于流的上传和下载，可配置超时时间，IPv6和连接池。
<!--more-->
##Apache HTTP Client
DefaultHttpClient和同类的AndroidHttpClient都是可扩展的类。它们有大量且灵活的API，适用于网页浏览器开发。同时它们比较稳定并且bug较少。但是繁多的API的现实下，对其改善与保持兼容性不可得兼，明显Android团队的精力已然不在Apache HTTP Client。

##HttpURLConnection
HttpURLConnection是一个通用，轻量的实现，可以满足大多数的程序进行HTTP请求。这个类虽然一开始比较简陋，但是其主要的几个API使得我们更容易进行稳定改善。

###连接池污染
在冻酸奶（Android 2.2）之前，HttpURLConnection有着一些烦人的bug。最烦人的就是调用一个可读的InputStream的close方法会污染连接池。我们需要禁用连接池绕开这个问题，如下代码可以禁用连接池。
```java
private void disableConnectionReuseIfNecessary() {
    // HTTP connection reuse which was buggy pre-froyo
    if (Integer.parseInt(Build.VERSION.SDK) < Build.VERSION_CODES.FROYO) {
        System.setProperty("http.keepAlive", "false");
    }
}
```

###压缩数据与大小
从2.3开始，我们默认对返回的响应进行了压缩，HttpURLConnection会自动为发出去的请求加上`Accept-Encoding: gzip`这个头信息。如果gzip压缩的响应有问题，可以通过下面代码禁用gzip。
```java
urlConnection.setRequestProperty("Accept-Encoding", "identity");
```

由于HTTP中的Content-Length头信息返回的是压缩后的大小，所以我们不能使用getContentLength()来计算未压缩数据的大小。正确的做法应该是读取HTTP响应中的字节，直到InputStream.read()方法返回为-1.

###HTTPs改进
从Gingerbread开始，增加了对HTTPs链接的优化。在进行HTTPs请求之前，HttpsURLConnection会尝试使用服务器名字指示(Server Name Indication)，这种技术可以让多个HTTPs主机共享一个IP地址。在HTTPs请求中，HttpsURLConnection也支持压缩和会话标签（Session Tickets）。一旦连接失败，HttpsURLConnection会不使用上面的三个特性进行重试。这样即可以保证在连接时高效率地连接到最新的服务器，也可以在不破坏兼容性的同时连接到旧服务器。


###响应缓存
从4.0开始，HttpURLConnection引入了响应缓存机制。一旦缓存创建，后续的HTTP请求会按照下面情况处理

  * 完全缓存的响应会直接从本地存储中读取，响应很快，不需要网络连接。
  * 有条件的缓存必须由服务端进行freshness验证，比如client发出一个请求，如"Give me /foo.png if it changed since yesterday"，然后服务器端要么返回最新的内容，要么返回304未修改的状态。如果内容不变，则不下载。
  * 没有缓存的响应需要服务器处理，然后这些请求被缓存下来。

对于低于4.0的版本，我们可以使用反射开启响应的缓存机制
```java
private void enableHttpResponseCache() {
    try {
        long httpCacheSize = 10 * 1024 * 1024; // 10 MiB
        File httpCacheDir = new File(getCacheDir(), "http");
        Class.forName("android.net.http.HttpResponseCache")
            .getMethod("install", File.class, long.class)
            .invoke(null, httpCacheDir, httpCacheSize);
    } catch (Exception httpResponseCacheNotAvailable) {
    }
}
```
当然，这里还需要服务器端设置HTTP缓存相关的头信息。

##哪家强
在2.3之前的版本，Apache的HTTP请求响应实现比较稳定，bug也少，所以在那些版本上它的最好。  

但是在2.3之后，毫无疑问，HttpURLConnection是最好的。它API精简实用，默认支持压缩，响应缓存等。最重要的这是Android团队重点投入的，而Apache的版本已经被抛弃了。所以还是使用HttpURLConnection吧。

##原文信息
  * [Android’s HTTP Clients](http://android-developers.blogspot.com/2011/09/androids-http-clients.html)

























