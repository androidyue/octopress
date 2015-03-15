---
layout: post
title: "Android中Java和JavaScript交互"
date: 2014-09-20 21:37
comments: true
categories: Android Java JavaScript
---
Android提供了一个很强大的WebView控件用来处理Web网页，而在网页中，JavaScript又是一个很举足轻重的脚本。本文将介绍如何实现Java代码和Javascript代码的相互调用。
<!--more-->
##如何实现
实现Java和js交互十分便捷。通常只需要以下几步。
  
  * WebView开启JavaScript脚本执行
  * WebView设置供JavaScript调用的交互接口。
  * 客户端和网页端编写调用对方的代码。

##本例代码
为了便于讲解，先贴出全部代码
###Java代码
```java lineos:false 
package com.example.javajsinteractiondemo;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class MainActivity extends Activity {
	private static final String LOGTAG = "MainActivity";
	@SuppressLint("JavascriptInterface")
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		final WebView myWebView = (WebView) findViewById(R.id.myWebView);
		WebSettings settings = myWebView.getSettings();
		settings.setJavaScriptEnabled(true);
		myWebView.addJavascriptInterface(new JsInteration(), "control");
		myWebView.setWebChromeClient(new WebChromeClient() {});
		myWebView.setWebViewClient(new WebViewClient() {

			@Override
			public void onPageFinished(WebView view, String url) {
				super.onPageFinished(view, url);
				testMethod(myWebView);
			}
			
		});
		myWebView.loadUrl("file:///android_asset/js_java_interaction.html");
	}
	
	private void testMethod(WebView webView) {
		String call = "javascript:sayHello()";
		
		call = "javascript:alertMessage(\"" + "content" + "\")";
		
		call = "javascript:toastMessage(\"" + "content" + "\")";
		
		call = "javascript:sumToJava(1,2)";
		webView.loadUrl(call);
		
	}
	
	public class JsInteration {
		
		@JavascriptInterface
		public void toastMessage(String message) {
			Toast.makeText(getApplicationContext(), message, Toast.LENGTH_LONG).show();
		}
		
		@JavascriptInterface
		public void onSumResult(int result) {
			Log.i(LOGTAG, "onSumResult result=" + result);
		}
	}

}

```
###前端网页代码
```html lineos:false js_java_interaction.html
<html>
<script type="text/javascript">
    function sayHello() {
        alert("Hello")
    }

    function alertMessage(message) {
        alert(message)
    }

    function toastMessage(message) {
        window.control.toastMessage(message)
    }

    function sumToJava(number1, number2){
       window.control.onSumResult(number1 + number2) 
    }
</script>
Java-Javascript Interaction In Android
</html>
``` 
   
##调用示例
###js调用Java
调用格式为window.jsInterfaceName.methodName(parameterValues)
此例中我们使用的是control作为注入接口名称。
```html lineos:false
function toastMessage(message) {
	window.control.toastMessage(message)
}

function sumToJava(number1, number2){
   window.control.onSumResult(number1 + number2) 
}
```
###Java调用JS
webView调用js的基本格式为webView.loadUrl("javascript:methodName(parameterValues)")
####调用js无参无返回值函数
```java lineos:false
String call = "javascript:sayHello()";
webView.loadUrl(call);
```
####调用js有参无返回值函数
注意对于字符串作为参数值需要进行转义双引号。
```java lineos:false
String call = "javascript:alertMessage(\"" + "content" + "\")";
webView.loadUrl(call);
```
####调用js有参数有返回值的函数
Android在4.4之前并没有提供直接调用js函数并获取值的方法，所以在此之前，常用的思路是 java调用js方法，js方法执行完毕，再次调用java代码将值返回。
#####1.Java调用js代码
```java lineos:false
String call = "javascript:sumToJava(1,2)";
webView.loadUrl(call);
```
#####2.js函数处理，并将结果通过调用java方法返回
```javascript lineos:false
function sumToJava(number1, number2){
       window.control.onSumResult(number1 + number2) 
}
```
#####3.Java在回调方法中获取js函数返回值
```java lineos:false
@JavascriptInterface
public void onSumResult(int result) {
	Log.i(LOGTAG, "onSumResult result=" + result);
}
```
####<font color="blue">4.4处理</font>
Android 4.4之后使用evaluateJavascript即可。这里展示一个简单的交互示例
具有返回值的js方法
```html lineos:false
function getGreetings() {
		return 1;
}
```
java代码时用evaluateJavascript方法调用
```java lineos:false
private void testEvaluateJavascript(WebView webView) {
	webView.evaluateJavascript("getGreetings()", new ValueCallback<String>() {

	@Override
	public void onReceiveValue(String value) {
		Log.i(LOGTAG, "onReceiveValue value=" + value);
	}});
}
```
输出结果
```bash lineos:false
I/MainActivity( 1432): onReceiveValue value=1
```

注意

  * 上面限定了结果返回结果为String，对于简单的类型会尝试转换成字符串返回，对于复杂的数据类型，建议以字符串形式的json返回。
  * evaluateJavascript方法必须在UI线程（主线程）调用，因此onReceiveValue也执行在主线程。
  

##疑问解答
###<font color="red">Alert无法弹出</font>
你应该是没有设置WebChromeClient,按照以下代码设置
```java
myWebView.setWebChromeClient(new WebChromeClient() {});

```

###<font color="red">Uncaught ReferenceError: functionName is not defined</font>
问题出现原因，**网页的js代码没有加载完成**，就调用了js方法。解决方法是在网页加载完成之后调用js方法
```java fileos:false
myWebView.setWebViewClient(new WebViewClient() {

	@Override
	public void onPageFinished(WebView view, String url) {
		super.onPageFinished(view, url);
		//在这里执行你想调用的js函数
	}
	
});
```

###<font color="red">Uncaught TypeError: Object [object Object] has no method</font>
####安全限制问题
如果只在4.2版本以上的机器出问题，那么就是系统处于安全限制的问题了。Android文档这样说的
>Caution: If you've set your targetSdkVersion to 17 or higher, you must add the @JavascriptInterface annotation to any method that you want available your web page code (the method must also be public). If you do not provide the annotation, then the method will not accessible by your web page when running on Android 4.2 or higher.

中文大意为
>警告：如果你的程序目标平台是17或者是更高，你必须要在暴露给网页可调用的方法（这个方法必须是公开的）加上@JavascriptInterface注释。如果你不这样做的话，在4.2以以后的平台上，网页无法访问到你的方法。

#####解决方法
  * 将targetSdkVersion设置成17或更高，引入@JavascriptInterface注释
  * 自己创建一个注释接口名字为@JavascriptInterface，然后将其引入。注意这个接口不能混淆。这种方式不推荐，大概在4.4之后有问题。

注，创建@JavascriptInterface代码
```java lineos:false
public @interface JavascriptInterface {

}
```

####代码混淆问题
如果在没有混淆的版本运行正常，在混淆后的版本的代码运行错误，并提示Uncaught TypeError: Object [object Object] has no method，那就是你没有做混淆例外处理。
在混淆文件加入类似这样的代码
```ruby lineos:false
keepattributes *Annotation*
keepattributes JavascriptInterface
-keep class com.example.javajsinteractiondemo$JsInteration {
    *;
}

```

###<font color="red">All WebView methods must be called on the same thread</font>
过滤日志曾发现过这个问题。
```java lineos:false
E/StrictMode( 1546): java.lang.Throwable: A WebView method was called on thread 'JavaBridge'. All WebView methods must be called on the same thread. (Expected Looper Looper (main, tid 1) {528712d4} called on Looper (JavaBridge, tid 121) {52b6678c}, FYI main Looper is Looper (main, tid 1) {528712d4})
E/StrictMode( 1546): 	at android.webkit.WebView.checkThread(WebView.java:2063)
E/StrictMode( 1546): 	at android.webkit.WebView.loadUrl(WebView.java:794)
E/StrictMode( 1546): 	at com.xxx.xxxx.xxxx.xxxx.xxxxxxx$JavaScriptInterface.onCanGoBackResult(xxxx.java:96)
E/StrictMode( 1546): 	at com.android.org.chromium.base.SystemMessageHandler.nativeDoRunLoopOnce(Native Method)
E/StrictMode( 1546): 	at com.android.org.chromium.base.SystemMessageHandler.handleMessage(SystemMessageHandler.java:27)
E/StrictMode( 1546): 	at android.os.Handler.dispatchMessage(Handler.java:102)
E/StrictMode( 1546): 	at android.os.Looper.loop(Looper.java:136)
E/StrictMode( 1546): 	at android.os.HandlerThread.run(HandlerThread.java:61)
```
在js调用后的Java回调线程并不是主线程。如打印日志可验证
```bash lineos:false
ThreadInfo=Thread[WebViewCoreThread,5,main]
```
解决上述的异常，将webview操作放在主线程中即可。
```java
webView.post(new Runnable() {
    @Override
    public void run() {
        webView.loadUrl(YOUR_URL).
    }
});
```

###其他
  * <a href="http://www.amazon.cn/gp/product/B00LVHTI9U/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00LVHTI9U&linkCode=as2&tag=droidyue-23">第一行代码:Android</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00LVHTI9U" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B0097CON2S/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0097CON2S&linkCode=as2&tag=droidyue-23">JavaScript语言精粹</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0097CON2S" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00B14IGUK/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00B14IGUK&linkCode=as2&tag=droidyue-23">安全技术大系:Web前端黑客技术揭秘</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00B14IGUK" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
