---
layout: post
title: "WebView重写onJsAlert那些事"
date: 2014-07-09 21:35
comments: true
categories: Android WebView JavaScript
---
本文主要将如何重写onJsAlert,让烦人的对话框变为无干扰的Toast,以及为什么onJsAlert只调用一次的问题.
###什么是Javascript Alert
Alert是一种提示信息或者警告信息的对话框,一旦显示到用户面前,只能点击OK才能关闭.
<!--more-->
通常一般的实现类似
```html
<html>
    <SCRIPT type="text/javascript">
        alert('This is alert dialog !')
    </SCRIPT>
</html>
```

对应的效果图:

![Javascript Alert](https://asset.droidyue.com/broken_images_2014/js_alert.png)

###onJsAlert API 介绍

>public boolean onJsAlert (WebView view, String url, String message, JsResult result)  
Added in API level 1  
Tell the client to display a javascript alert dialog. If the client returns true, WebView will assume that the client will handle the dialog. If the client returns false, it will continue execution.  
Parameters  
view	The WebView that initiated the callback.  
url	The url of the page requesting the dialog.  
message	Message to be displayed in the window.  
result	A JsResult to confirm that the user hit enter.  
Returns  
boolean Whether the client will handle the alert dialog.  

###重写为Toast展示
其实Alert,只是提示信息,而且这个提示信息还是阻塞其他操作的,为什么我们不适用一个长时间显示的Toast呢?  




下面示范一下如何换成Toast.
```java
@Override
public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
	Log.i("MainActivity", "onJsAlert url=" + url + ";message=" + message);
    Toast.makeText(getApplicationContext(), message, Toast.LENGTH_LONG).show();
    result.confirm();
    return true;
}
```

###为什么onJsAlert只调用了一次
如果你没有参考上述部分或者没有留意,有时候你会发现onJsAlert只调用了一次,为什么呢,实际上,你可能忽略了一句调用.就是处理JsResult.

>public final void cancel ()
Added in API level 1
Handle the result if the user cancelled the dialog.

>public final void confirm ()
Added in API level 1
Handle a confirmation response from the user.

你需要调用result.confirm()或者result.cancel()来处理jsResult,否则会出问题.

###demo下载
  * http://pan.baidu.com/s/14bjMA

###延伸阅读:
http://www.w3schools.com/js/js_popup.asp
http://developer.android.com/reference/android/webkit/JsResult.html

###推荐
  * <a href="http://www.amazon.cn/gp/product/B00FQEDTA8/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00FQEDTA8&linkCode=as2&tag=droidyue-23">精彩绝伦的Android UI设计:响应式用户界面与设计模式</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00FQEDTA8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B0097CON2S/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0097CON2S&linkCode=as2&tag=droidyue-23">JavaScript语言精粹</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0097CON2S" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
 
