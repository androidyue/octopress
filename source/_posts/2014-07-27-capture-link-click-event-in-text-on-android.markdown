---
layout: post
title: "捕获Android文本中链接点击事件"
date: 2014-07-27 09:33
comments: true
categories: Android
---
Android中的TTextView很强大，我们可以不仅可以设置纯文本为其内容，还可以设置包含网址和电子邮件地址的内容，并且使得这些点击可以点击。但是我们可以捕获并控制这些链接的点击事件么，当然是可以的。

本文将一个超级简单的例子介绍一下如何实现在Android TextView　捕获链接的点击事件。

<!--more-->

##关键实现
实现原理就是将所有的URL设置成ClickSpan，然后在它的onClick事件中加入你想要的控制逻辑就可以了。
```java
	private void setLinkClickable(final SpannableStringBuilder clickableHtmlBuilder, 
			final URLSpan urlSpan) {
	    int start = clickableHtmlBuilder.getSpanStart(urlSpan);
	    int end = clickableHtmlBuilder.getSpanEnd(urlSpan);
	    int flags = clickableHtmlBuilder.getSpanFlags(urlSpan);
	    ClickableSpan clickableSpan = new ClickableSpan() {
	          public void onClick(View view) {
	        	  //Do something with URL here.
	        	  
	          }
	    };
	    clickableHtmlBuilder.setSpan(clickableSpan, start, end, flags);
	}

	private CharSequence getClickableHtml(String html) {
	    Spanned spannedHtml = Html.fromHtml(html);
	    SpannableStringBuilder clickableHtmlBuilder = new SpannableStringBuilder(spannedHtml);
	    URLSpan[] urls = clickableHtmlBuilder.getSpans(0, spannedHtml.length(), URLSpan.class);   
	    for(final URLSpan span : urls) {
	    	setLinkClickable(clickableHtmlBuilder, span);
	    }
	    return clickableHtmlBuilder;
	}
```

##如何使用
```java
		TextView myTextView = (TextView)findViewById(R.id.myTextView);
		String url = "This is a page with lots of URLs. <a href=\"http://droidyue.com\">droidyue.com</> " +
				"This left is a very good blog. There are so many great blogs there. You can find what" +
				"you want in that blog."  
				+ "The Next Link is <a href=\"http://www.google.com.hk\">Google HK</a>";
		myTextView.setText(getClickableHtml(url));
```

##实现自己的控制
我们需要在ClickSpan的onClick方法中加入自己的控制逻辑，比如我们使用傲游浏览器打开点击的链接。
```java
public void onClick(View view) {
	Log.i(LOGTAG, "onClick url=" + urlSpan.getURL() );
    Intent intent = new Intent(Intent.ACTION_VIEW);
	intent.setData(Uri.parse(urlSpan.getURL()));
	intent.setPackage("com.mx.browser");
	startActivity(intent);
}
```

##提醒
不要忘了设置TextView的autoLink属性。
```xml
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/hello_world" 
    android:id="@+id/myTextView"
    android:autoLink="web" 
/>
```

##demo源码
<a href="http://pan.baidu.com/s/1i3kQ1RB" target="_blank">百度云盘</a>

###其他
  * <a href="http://www.amazon.cn/gp/product/B00CE1JQO4/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00CE1JQO4&linkCode=as2&tag=droidyue-23">Android中的高级编程部分</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00CE1JQO4" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

  * <a href="http://www.amazon.cn/gp/product/B00ASIN7G8/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00ASIN7G8&linkCode=as2&tag=droidyue-23">精通Android其实并不难</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00ASIN7G8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />


