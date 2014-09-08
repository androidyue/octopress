---
layout: post
title: "Android中自定义Checkbox"
date: 2014-07-27 14:06
comments: true
categories: Android UI
---
在Android中，Checkbox是一个很重要的UI组件，而且在Android中，它展现的形式越来越好看，这就说明有些系统，比如4.0以下，checkbox还是比较不好看，或者跟软件的风格不协调，就需要我们自定义这个组件。

自定义这个组件很简单，简单的增加修改xml文件即可。
<!--more-->

##准备工作
准备好两张图片，一个是选中的图片，另一个是未选中的图片。本文以checked.png和unchecked.png为例。

##设置选择框
在drawable下新建文件custom_checkbox.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android" >
    <item android:state_checked="true" android:drawable="@drawable/checked"></item>
	<item android:state_checked="false" android:drawable="@drawable/unchecked"></item>
	<item android:drawable="@drawable/unchecked"></item><!-- The default one -->
</selector>
```

##应用自定义
设置button属性值为上面定义的custom_checkbox。
```xml
<CheckBox 
	android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:button="@drawable/custom_checkbox"
/>
```

自定义完毕，跑起来你的程序吧。

###其他
  * <a href="http://www.amazon.cn/gp/product/B00FQEDTA8/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00FQEDTA8&linkCode=as2&tag=droidyue-23">从响应用户交互出发，设计Android的UI</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00FQEDTA8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B009NKMGTG/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B009NKMGTG&linkCode=as2&tag=droidyue-23">一个都不能少的Android UI基础教程</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B009NKMGTG" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
