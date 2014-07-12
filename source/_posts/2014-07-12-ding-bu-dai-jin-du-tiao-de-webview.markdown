---
layout: post
title: "顶部带进度条的Webview"
date: 2014-07-12 21:34
comments: true
categories: Android
---
 
写这篇文章,做份备忘,简单滴展示一个带进度条的Webview示例,进度条位于Webview上面.

示例图如下
<!--more-->

{%img http://droidyueimg.qiniudn.com/webview_with_progressbar.png webview_with_progressbar %}
###主Activity代码
```java
package com.droidyue.demo.webviewprogressbar;
import android.app.Activity;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.view.View.OnClickListener;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.ProgressBar;

import com.droidyue.demo.webviewprogressbar.R;

public class MainActivity extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		final ProgressBar bar = (ProgressBar)findViewById(R.id.myProgressBar);

		final WebView webView = (WebView)findViewById(R.id.myWebView);
		webView.setWebChromeClient(new WebChromeClient() {

			@Override
			public void onProgressChanged(WebView view, int newProgress) {
				if (newProgress == 100) {
					bar.setVisibility(View.INVISIBLE);
				} else {
					if (View.INVISIBLE == bar.getVisibility()) {
						bar.setVisibility(View.VISIBLE);
					}
					bar.setProgress(newProgress);
				}
				super.onProgressChanged(view, newProgress);
			}
			
		});
		
		findViewById(R.id.myButton).setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View arg0) {
				webView.reload();
			}
			
		});
		final String url = "http://droidyue.com";
		webView.loadUrl(url);
	}
	

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

}

```
###布局文件代码
```xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:paddingBottom="@dimen/activity_vertical_margin"
    android:paddingLeft="@dimen/activity_horizontal_margin"
    android:paddingRight="@dimen/activity_horizontal_margin"
    android:paddingTop="@dimen/activity_vertical_margin"
    tools:context=".MainActivity" >
	
    <Button 
        android:id="@+id/myButton"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Reload"
        />
    
    <ProgressBar 
		style="?android:attr/progressBarStyleHorizontal"
        android:id="@+id/myProgressBar"
        android:layout_below="@id/myButton"
        android:layout_width="match_parent"
        android:layout_height="5px"
        />
	<WebView 
	    android:id="@+id/myWebView"
	    android:layout_below="@id/myProgressBar"
	    android:layout_width="match_parent"
	    android:layout_height="match_parent"
	    />
</RelativeLayout>

```
不要忘记在Mainfest加入使用网络权限哟.
```xml
<uses-permission android:name="android.permission.INTERNET"/>
```

实现很简单,没什么技术含量.备忘而已.   

关于如何自定义进度条请参考:<a href="http://winwyf.blog.51cto.com/4561999/857867" target="_blank">http://winwyf.blog.51cto.com/4561999/857867</a>

###Others
  * <a href="http://www.amazon.cn/gp/product/B00ASIN7G8/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00ASIN7G8&linkCode=as2&tag=droidyue-23">精通Android</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00ASIN7G8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
