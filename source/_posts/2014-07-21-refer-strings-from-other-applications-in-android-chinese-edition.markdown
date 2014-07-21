---
layout: post
title: "Android实现引用其他程序的文本资源"
date: 2014-07-21 07:39
comments: true
categories: Android
---
在Android中引用其他程序的文本资源并不是很常见,但是有时候还是很是有需要的,通常引用的多半是系统的程序的文本资源.

下面以一个超简单的例子,来展示以下如何实现.
<!--more-->
```java
public void testUseAndroidString() {

    Context context = getContext();
    Resources res = null;
    try {
        //I want to use the clear_activities string in Package com.android.settings
        res = context.getPackageManager().getResourcesForApplication("com.android.settings");
        int resourceId = res.getIdentifier("com.android.settings:string/clear_activities", null, null);
        if(0 != resourceId) {
            CharSequence s = context.getPackageManager().getText("com.android.settings", resourceId, null);
            Log.i(VIEW_LOG_TAG, "resource=" + s);
        }
    } catch (NameNotFoundException e) {
        e.printStackTrace();
    }
    
}
```

###其他
  * <a href="http://www.amazon.cn/gp/product/B00BMTVUGG/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00BMTVUGG&linkCode=as2&tag=droidyue-23">Android软件安全与逆向分析</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00BMTVUGG" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00E192518/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00E192518&linkCode=as2&tag=droidyue-23">你一定爱读的极简欧洲史</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00E192518" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
