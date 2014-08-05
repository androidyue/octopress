---
layout: post
title: "自定义支持读取XML属性的View"
date: 2014-08-05 19:12
comments: true
categories: Android
---
在Android中，添加一个View很简单，简单的你可以简简单单地使用xml和一部分简单的java代码就可以搞定。
比如这样
<!--more-->
```xml linenos:false
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:paddingBottom="@dimen/activity_vertical_margin"
    android:paddingLeft="@dimen/activity_horizontal_margin"
    android:paddingRight="@dimen/activity_horizontal_margin"
    android:paddingTop="@dimen/activity_vertical_margin"
    tools:context=".MainActivity" >

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/hello_world" 
        />
</RelativeLayout>
```
Android Framework提供了这种便捷的xml布局方式，而且还可以支持从XML节点读取属性值。那么如果如何自定义View并且支持读取XML属性值呢。  
下面开始尝试以一种很简单容易理解的方式介绍一下。

##自定义View代码实现
比如我们自定义一个View，这个View继承自TextView，名称为ExTextView。这里我们创建简单的构造方法，仅仅包含Context和AttributeSet参数。这样我们就可以在布局编辑器中创建或者修改ExTextView的实例。
```java  linenos:false ExTextView.java
package com.example.customviewwithxml;

import android.content.Context;
import android.util.AttributeSet;
import android.widget.TextView;

public class ExTextView extends TextView {
	public ExTextView(Context context, AttributeSet attrs) {
		super(context, attrs);
	}
}
```

###定义XML属性
在使用系统内置的View时，我们可以通过在XML布局文件中指定属性来控制View的样式和行为。一个优秀的View应该可以通过XML来添加并且设置样式。所以，要让你自定义的View做到上述功能，你需要做。

  * 通过`<declare-styleable>` 来定义自定义View的属性集。
  * 可以在布局文件中指定View的属性值。
  * 在程序运行时可以检索读取属性值。
  * 为View应用读取出来的属性值。

现在就为你的View添加`<declare-styleable>`来定义属性集哈。 其存放文件为 **res/values/attrs.xml**。以下为几个简单实例。
```xml linenos:false attrs.xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
	<attr name="enableOnPad" format="boolean" />
	<attr name="supportDeviceType" format="reference"/>
    <declare-styleable name="ExTextView">
        <attr name="enableOnPad"/>
        <attr name="supportDeviceType"/>
    </declare-styleable>
</resources>
```
###注意
  * `<declare-styleable name="ExTextView">`中ExTextView为样式实体的名字，例样式实体的名字没有特殊的限制，但是通常约定为View的类名。

##布局中使用自定义View
一旦我们定义了属性值，我们可以想系统内置的属性值一样使用，唯一不同的是，自定义的属性值和系统提供的属于不同的名字空间。系统内置的属性归属于名字空间`http://schemas.android.com/apk/res/android` 而自定义的属性归属于名字空间**`http://schemas.android.com/apk/res/[your package name]`**
```xml linenos:false activity_main.xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:droidyue="http://schemas.android.com/apk/res/com.example.customviewwithxml"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:paddingBottom="@dimen/activity_vertical_margin"
    android:paddingLeft="@dimen/activity_horizontal_margin"
    android:paddingRight="@dimen/activity_horizontal_margin"
    android:paddingTop="@dimen/activity_vertical_margin"
    tools:context=".MainActivity" >

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/hello_world" 
        />
    
	<com.example.customviewwithxml.ExTextView 
		android:layout_width="wrap_content"
		android:layout_height="wrap_content"
		android:text="Hello World"
		droidyue:supportDeviceType="@array/support_device_types"	
		droidyue:enableOnPad="true"
		
	    />    
	
</RelativeLayout>
```

##读取XML属性值
当View从XML中被创建时，其所有标签的属性值都是以AttributeSet的对象从资源包中获取并传递。
###为什么不直接读取AttributeSet，而是obtainStyledAttributes
  * 属性值中得资源引用不能解析
  * 样式不会应用到View
  
```java linenos:false  ExTextView.java
public ExTextView(Context context, AttributeSet attrs) {
		super(context, attrs);
		TypedArray a = context.getTheme().obtainStyledAttributes(
		        attrs,R.styleable.ExTextView,
		        0, 0);
		int supportDevicesResId = a.getResourceId(R.styleable.ExTextView_supportDeviceType, 0);
		String[] supportDeviceTypes = context.getResources().getStringArray(supportDevicesResId);
		boolean enableOnPad = a.getBoolean(R.styleable.ExTextView_enableOnPad, false);
		Log.i(VIEW_LOG_TAG, "getAtrributeFromXml supportDeviceType=" + Arrays.toString(supportDeviceTypes) + ";enableOnPad=" + enableOnPad);
		a.recycle();
	}
```
注意，TypedArray实例为公用资源，再次使用之前需要回收（recycle）。

##延伸阅读
<a href="http://developer.android.com/training/custom-views/create-view.html" target="_blank">Create View</a>

##源码下载
<a href="http://pan.baidu.com/s/1c0gXfw8" target="_blank">百度云</a>
###其他
  * <a href="http://www.amazon.cn/gp/product/B00ASIN7G8/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00ASIN7G8&linkCode=as2&tag=droidyue-23">如何才能精通Android</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00ASIN7G8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B009OLU8EE/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B009OLU8EE&linkCode=as2&tag=droidyue-23">你能看懂Android系统源代码么</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B009OLU8EE" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00LVHTI9U/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00LVHTI9U&linkCode=as2&tag=droidyue-23">第一行代码:Android</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00LVHTI9U" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
