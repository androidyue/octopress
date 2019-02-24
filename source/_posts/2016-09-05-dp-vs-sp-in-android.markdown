---
layout: post
title: "两分钟理解Android中SP与DP的区别"
date: 2016-09-05 19:41
comments: true
categories: Android 轻知识
---
从一开始写Android程序,就被告知这些常识

  * 长度宽度的数值要使用dp作为单位放入dimens.xml文件中
  * 字体大小的数值要使用sp作为单位,也放入dimens.xml文件中

然后,就没有然后了,仿佛潜台词就是说,你记住去用就行了.

<!--more-->

偶然有一天,当我们阴差阳错地将字体写成了dp,也是可以工作,而且效果和sp一样.

这时候,就开始怀疑了,到底有啥区别呢,dp和sp有什么不同呢?

我们做个简单的Sample验证一下,如下,一个布局代码
```java
<TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textSize="18sp"
        android:text="Hello World! in SP" />

<TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textSize="18dp"
        android:text="Hello World! in DP"
        />
```
得到的效果是这个样子

![dp and sp both normal](https://asset.droidyue.com/broken_images/dp_and_sp.webp)

但是,当我们进入系统设置中修改字体大小时

![system font settings](https://asset.droidyue.com/broken_images/change_system_font_size.webp)

再次进入之前的界面,发现了一些不一样的东西.

![dp and sp strange](https://asset.droidyue.com/broken_images/difference_after_changed.webp)

由此看来
   
   * 使用sp作为字体大小单位,会随着系统的字体大小改变
   * 而dp作为单位则不会.

关于sp,[文档](https://developer.android.com/guide/topics/resources/more-resources.html#Dimension)的描述为:
>Scale-independent Pixels - This is like the dp unit, but it is also scaled by the user's font size preference. It is recommend you use this unit when specifying font sizes, so they will be adjusted for both the screen density and the user's preference.
   
大致意思为
  
  * sp除了受屏幕密度影响外,还受到用户的字体大小影响
  * 通常情况下,建议使用sp来跟随用户字体大小设置

因此通常情况下,我们还是建议使用sp作为字体的单位,除非一些特殊的情况,不想跟随系统字体变化的,可以使用dp.