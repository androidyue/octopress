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
