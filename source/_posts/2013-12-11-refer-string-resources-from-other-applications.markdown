---
layout: post
title: "Refer String Resources From Other Applications"
date: 2013-12-11 16:22
comments: true
categories: Android R string PackageManager 
---
The following code works. Here take getting String resource for example. 
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

###Others
  * <a href="http://www.amazon.com/gp/product/B00KV4VU40/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00KV4VU40&linkCode=as2&tag=droidyueblog-20&linkId=URSU4PBXOJMQRSIN">Passive Income with Android</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=B00KV4VU40" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

