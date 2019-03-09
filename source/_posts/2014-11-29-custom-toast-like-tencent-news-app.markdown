---
layout: post
title: "仿腾讯新闻样式的Toast"
date: 2014-11-29 17:21
comments: true
categories: Android
---
厌倦了网易新闻无处不在的喷子，尝试了一下腾讯新闻，果然顿时清净了很多，当然这不是重点。个人感觉腾讯新闻客户端的Toast比较不错，相对于系统默认的Toast，更加能起到提醒的作用。于是反编译了一下，简单分享一下,其实很简单。
<!--more-->
## 先看效果

![Tencent News Toast](https://asset.droidyue.com/broken_images_2014/tencent_news_toast.png)

背景为深灰色，支持设置图片和文字。
## 布局文件
```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout 
    android:id="@+id/view_tips_layout" 
    android:background="@drawable/tips_bg" 
    android:layout_width="wrap_content" 
    android:layout_height="wrap_content"
  	xmlns:android="http://schemas.android.com/apk/res/android">
    <View 
        android:layout_width="160.0dip" 
        android:layout_height="160.0dip" 
        android:layout_centerInParent="true" />
   
    <LinearLayout 
        android:orientation="vertical" 
        android:layout_width="wrap_content" 
        android:layout_height="wrap_content" 
        android:layout_centerInParent="true">
        
        <ImageView 
            android:gravity="center" 
            android:layout_gravity="center" 
            android:id="@+id/tips_icon" 
            android:layout_width="wrap_content" 
            android:layout_height="wrap_content" 
            android:layout_marginBottom="10.0dip" 
            android:src="@drawable/tips_error" 
            android:contentDescription="@null" />
       
        <TextView 
            android:textSize="17.0sp" 
            android:textColor="#ffffffff" 
            android:gravity="center" 
            android:layout_gravity="center" 
            android:id="@+id/tips_msg" 
            android:layout_width="wrap_content" 
            android:layout_height="wrap_content" 
            android:lineSpacingExtra="3.0dip" />
    </LinearLayout>
</RelativeLayout>
```

## 程序代码
```java
Toast toast = new Toast(getApplicationContext());
View toastView = LayoutInflater.from(getApplicationContext()).inflate(R.layout.view_tips, null);
((ImageView)toastView.findViewById(R.id.tips_icon)).setImageResource(R.drawable.ic_launcher);
((TextView)toastView.findViewById(R.id.tips_msg)).setText("Error Occurs");
toast.setView(toastView);
toast.setGravity(Gravity.NO_GRAVITY, 0, 0);
toast.show();
```
Toast默认的位置为底部水平居中。我们可以通过设置setGravity(int, int, int)来进行设置位置。该方法接受三个参数，一个Gravity常量，一个x（水平）方向上的偏移量，一个y（竖直）方向上的偏移量。

如果我们想让位置向右我们需要增加x方向上的偏移量，如果想让位置向下，增大y方向上的偏移量。

## 多说
我们可以根据自己的需求去设置图片，文字，背景色等样式来定制想要的Toast。

注意，涉及到长度宽度字体大小相关的建议放到dimens文件，便于我们进行设备适配。

## 示例下载
[百度网盘](http://pan.baidu.com/s/1kTLxagZ)
