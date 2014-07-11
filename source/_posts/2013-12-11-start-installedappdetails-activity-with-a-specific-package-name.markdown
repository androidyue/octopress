---
layout: post
title: "Start InstalledAppDetails Activity With A Specific Package Name"
date: 2013-12-11 16:49
comments: true
categories: 
---
This trick works. It's really easy.
```java
    //Let take com.mx.browser as the package name
    Intent intent = new Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:com.mx.browser"));
    startActivity(intent);
```
<!--more-->
Here is the javadoc of android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS 
>Activity Action: Show screen of details about a particular application.  
>In some cases, a matching Activity may not exist, so ensure you safeguard against this.  
>Input: The Intent's data URI specifies the application package name to be shown, with the "package" scheme. That is "package:com.my.app".  
>Output: Nothing.  


A glance at how InstalledAppDetails get packageName
```java
    final Bundle args = getArguments();
    String packageName = (args != null) ? args.getString(ARG_PACKAGE_NAME) : null;
    if (packageName == null) {
        Intent intent = (args == null) ?
        getActivity().getIntent() : (Intent) args.getParcelable("intent");
        if (intent != null) {
            packageName = intent.getData().getSchemeSpecificPart();
        }
    }
```

###Others
  * <a href="http://www.amazon.cn/gp/product/B00BSXRLR8/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00BSXRLR8&linkCode=as2&tag=droidyue-23">疯狂Android讲义</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00BSXRLR8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

