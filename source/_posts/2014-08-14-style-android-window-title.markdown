---
layout: post
title: "Android UI之自定义Window Title样式"
date: 2014-08-14 20:07
comments: true
categories: Android UI
---

Android提供了很多控件便于开发者进行UI相关的程序设计。但是很多时候，默认的一些UI设置不足以满足我们的需求，要么不好看，要么高度不够，亦或者是与应用界面不协调。于是这时候需要通过自定义样式或者自定义控件来实现。

当然，在空间足以满足需求的情况下，通常需要定义样式就可以搞定。本文将简单介绍如何通过自定义样式来实现定义Window Title。

<!--more-->
##先看一下效果图
{%img http://droidyueimg.qiniudn.com/style_window_title.png Custom Window Title Using Style %}

##逐步实现
在**res/values/styles.xml**文件中加入下列代码
```xml lineos:false res/values/styles.xml

 <style name="MyActivityTheme" parent="android:Theme.Light" >
    	<item name="android:windowTitleBackgroundStyle">@style/windowTitleBackgroundStyle</item>
    	<item name="android:windowTitleStyle">@style/windowTitleStyle</item>
    	<!-- Window Header Height -->
    	<item name="android:windowTitleSize">54dp</item>
	</style>
	
	<!-- Preference Settings Window Title -->
	<style name="windowTitleBackgroundStyle">  
    	<item name="android:background">#CCE8CF</item>                
  	</style>
  	
  	<style name="windowTitleStyle">
    	<item name="android:textColor">#FF0000</item>
    	<item name="android:paddingLeft">25dp</item>
    	<item name="android:textSize">20sp</item>
  	</style>
```
在Manifest中指定Activity或者Application的主题为上面定义的MyActivityTheme，下面以设置Activity为例。
```xml lineos:false
<activity
    android:name="com.example.stylewindowtitle.MainActivity"
    android:label="@string/app_name"
    android:theme="@style/MyActivityTheme"
>
<!--code goes here-->
```

##延伸阅读
<a href="http://developer.android.com/reference/android/R.attr.html" target="_blank">Android中的属性</a>

###其他
  * <a href="http://www.amazon.cn/gp/product/B00D73BJWK/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00D73BJWK&linkCode=as2&tag=droidyue-23">浪潮之巅</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00D73BJWK" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B004Y4QWMS/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B004Y4QWMS&linkCode=as2&tag=droidyue-23">启示录:打造用户喜爱的产品</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B004Y4QWMS" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/0307463745/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=0307463745&linkCode=as2&tag=droidyue-23">Rework</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=0307463745" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

