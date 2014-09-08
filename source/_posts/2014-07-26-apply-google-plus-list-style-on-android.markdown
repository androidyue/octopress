---
layout: post
title: "超简单实现Google+列表特效"
date: 2014-07-26 10:32
comments: true
categories: Android UI
---
相信用过Google+的人都感到其应用的特效相当棒，本文将以超简单的形式来实现类似Google+列表的特效。仅仅写几行代码就可以实现奥。

##特效真面目
由于众所周知的原因，很多人无法使用Google+应用。所以有必要让大家先看一看真面目。
<!--more-->
P.S.找了很多的屏目录制软件都不行，并且没有4.4的机器，所以只能用最笨的方法录制了，请见谅哈。
<iframe height=498 width=510 src="http://player.youku.com/embed/XNzQ2MzAzNjIw" frameborder=0 allowfullscreen></iframe>

##特效动画
###from_bottom_to_top.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android"
     android:shareInterpolator="@android:anim/decelerate_interpolator">
    <translate
        android:fromXDelta="0%" android:toXDelta="0%"
        android:fromYDelta="100%" android:toYDelta="0%"
        android:duration="400" />
</set>

```

###from_top_to_bottom.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android"
     android:shareInterpolator="@android:anim/decelerate_interpolator">
    <translate
        android:fromXDelta="0%" android:toXDelta="0%"
        android:fromYDelta="-100%" android:toYDelta="0%"
        android:duration="400" />
</set>

```

##加入动画
```java
private int mLastPosition = -1;
@Override
public View getView(int position, View convertView, ViewGroup parent) {
	View view = super.getView(position, convertView, parent);
	int animResId;
	if (position > mLastPosition) {
		animResId = R.anim.from_bottom_to_top;
	} else {
		animResId = R.anim.from_top_to_bottom;
	}
			
	Animation animation = AnimationUtils.loadAnimation(getContext(), animResId);
	view.startAnimation(animation);
	mLastPosition = position;
	return view;
}
```

##源码
<a href="http://pan.baidu.com/s/1ntmelML" target="_blank">百度云盘</a>
  
###其他
  * <a href="http://www.amazon.cn/gp/product/B00FQEDTA8/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00FQEDTA8&linkCode=as2&tag=droidyue-23">精彩绝伦的Android UI设计</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00FQEDTA8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B0065DAGZK/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0065DAGZK&linkCode=as2&tag=droidyue-23">精通Android 3</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0065DAGZK" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

