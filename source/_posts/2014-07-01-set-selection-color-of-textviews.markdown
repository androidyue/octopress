---
layout: post
title: "EditText和AutoCompleteTextView设置文字选中颜色"
date: 2014-07-01 20:58
comments: true
categories: 备忘 Android
keywords: Android,EditText,AutoCompleteTextView,Selection Color,textColorHighlight,选中颜色,highlight
---
EditText和AutoCompleteTextView设置文字选中颜色
大多数Android Rom上,文本选择的背景色都是很好看的鲜绿色, 但是在某些垃圾的三星手机上,居然是蓝色,令人恶心反感,其实完全可以通过程序来修改,文本的默认选中背景色. 
<!--more-->

###所用API解释
>android:textColorHighlight
Color of the text selection highlight.

###EditText设置效果
{%img http://7jpolu.com1.z0.glb.clouddn.com/demo-edittext_selection_bg.png %}
###AutoCompleteTextView 设置效果
{%img http://7jpolu.com1.z0.glb.clouddn.com/demo_autocompletetextview_selection_bg.png %}

###实现代码
```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical" >
    <EditText 
 		android:id="@+id/et_inputBox"       
 		android:layout_height="wrap_content"
 		android:layout_width="match_parent"
 		android:textColorHighlight="#B4DF87"
        />
    
    <AutoCompleteTextView 
        android:id="@+id/act_input"
        android:layout_below="@id/et_inputBox"
        android:layout_width="fill_parent"
		android:layout_height="wrap_content"
		android:textColorHighlight="#B4DF87"
        />
</LinearLayout>
```

###推荐
  * <a href="http://www.amazon.cn/gp/product/B00ELMXLOK/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00ELMXLOK&linkCode=as2&tag=droidyue-23">更优秀的APP:31个APP用户界面设计经典案例</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00ELMXLOK" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B007B78JUS/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B007B78JUS&linkCode=as2&tag=droidyue-23">Android创意实例详解</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B007B78JUS" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

