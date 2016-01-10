---
layout: post
title: "修复Android中Navigation Bar遮挡PopupWindow的问题"
date: 2016-01-10 14:41
comments: true
categories: Android
---
最近遇到了一个问题，关于Navigation Bar遮挡PopupWindow的问题，问题不难，粗略做一点总结。

<!--more-->
##现象描述
  * 问题应该出现在5.0 Lollipop版本及以上
  * 遮挡的现象如下图,Navigation Bar位于了PopupWindow的上层，明显是一种问题。

![Android Navigation Bar Issue](http://7jpolu.com1.z0.glb.clouddn.com/navigation_issue.png)

##我的实现代码
```java
private void showPopupWindow() {
    if (mPopupWindow == null) {
    	View contentView = LayoutInflater.from(this).inflate(R.layout.popup_window_content, null);
       	mPopupWindow = new PopupWindow(contentView, LinearLayout.LayoutParams.MATCH_PARENT,500, true);
        mPopupWindow.setBackgroundDrawable(new BitmapDrawable());
    }
    mPopupWindow.showAtLocation(findViewById(R.id.contentContainer), Gravity.BOTTOM, 0,0);
}
```
**其实和具体的实现代码没有关系**，重点是修改主题style。

##修改style
修改v21/styles.xml(如没有，可以创建),将`android:windowDrawsSystemBarBackgrounds`修改为`false`。

```xml
<style name="AppTheme.NoActionBar">
    <item name="windowActionBar">false</item>
    <item name="windowNoTitle">true</item>
    <item name="android:windowDrawsSystemBarBackgrounds">false</item>
    <item name="android:statusBarColor">@android:color/transparent</item>
</style>
```

##修改好的效果
![Good PopupWindow](http://7jpolu.com1.z0.glb.clouddn.com/navigation_bar_good.png)

##demo源码
[Navigation Bar Issue Demo](https://github.com/androidyue/Navigation-Bar-Issue-Demo)
