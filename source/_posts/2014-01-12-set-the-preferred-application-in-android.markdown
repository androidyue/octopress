---
layout: post
title: "Set The Preferred Application in Android"
date: 2014-01-12 14:29
comments: true
categories: Android PreferredApplication intent 
---
A great application should provide a function to let users set it as the preferred or default application. In this post, I will make a description on PreferredApplication  
Before an application is about to be set as default, it has two possibilities. One is that there is already a default application and the other is no default application. 
<!--more-->
###Detect the Default Application Exists or Not
This is really important. It determines what we should do next.
```java
    public void testGetDefaultActivity() {
        PackageManager pm = mContext.getPackageManager();
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setData(Uri.parse("http://www.google.com"));
        ResolveInfo info = pm.resolveActivity(intent, PackageManager.MATCH_DEFAULT_ONLY);
        Log.i(VIEW_LOG_TAG, "getDefaultActivity info = " + info + ";pkgName = " + info.activityInfo.packageName);
}
```
Result before I set Maxthon Browser as the default one. If no default one is set, the system will call the com.android.internal.app.ResolverActivity 
```java
I/View    ( 1145 ): View getDefaultActivity info = ResolveInfo{410e4868 com.android.internal.app.ResolverActivity p=0 o=0 m=0x0};pkgName = android
```
Result after I set Maxthon Browser as the default one. If the default one is set just call the default activity
```java
I/View    ( 1145 ): View getDefaultActivity info = ResolveInfo{410ae1e8 com.mx.browser.MxBrowserActivity p=0 o=0 m=0x208000};pkgName = com.mx.browser
```
So it is really clear that you could use the following code to judge.
```
//Use this to determine whether default application is set or not
boolean defaultSet = !"android".equals(info.activityInfo.packageName);
```
###If the default one is already set 
Just remove the preferred settings of the default application. However you could not do this in the code due to the permission control. It's generally done by users manually. What you could do is lead the user to the clear default page(installedAppDetails)
```java
public void testStartAppDetails() {
    //Use the destination package name
    Intent intent = new Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:com.mx.browser"));
    getActivity().startActivity(intent);
}
```
Then you navigate the user to the installedAppDetails and you could show some tips to click Button Clear Default. 
{% img /images/post_images/installed_app_details_clear_default.png %}
When users go back from installedAppDetails to your application check is there any default appliction now. If the default application(in general, it's not the previous one) remains repeat the above actions until there is not default one.

###No default One
Now there is only one step to set ours as the default one. You could not do this in codes. It's also required manual operation. What you could do is popup the selecting dialog and tip the use select your one.

```java
public void testStartChooseDialog() {
    Intent intent = new Intent();
    intent.setAction("android.intent.action.VIEW");
    intent.addCategory("android.intent.category.BROWSABLE");
    intent.setData(Uri.parse("http://androidyue.github.io/"));
    intent.setComponent(new ComponentName("android","com.android.internal.app.ResolverActivity"));
    getActivity().startActivity(intent);
}
```
The dialog is like this   
{% img /images/post_images/choose_default_activity_dialog.png %}  
What's more, your tips is really essential. Make sure to notify that  "Use by default for this action" should be  checked. 

###How to Clear my own default
```java
public void testClearDefault() {
    PackageManager pm = mContext.getPackageManager();
    pm.clearPackagePreferredActivities(mContext.getPackageName());
}
```
Note you could only clear packagePreferredActivities of your own.

###A step into system control
the following settings is some content of /data/system/packages.xml
```xml
<preferred-activities>
<item name="com.mx.browser/.MxBrowserActivity" match="200000" set="2">
<set name="com.android.browser/.BrowserActivity" />
<set name="com.mx.browser/.MxBrowserActivity" />
<filter>
<action name="android.intent.action.VIEW" />
<cat name="android.intent.category.BROWSABLE" />
<cat name="android.intent.category.DEFAULT" />
<scheme name="http" />
</filter>
</item>
</preferred-activities>
```

###Special
*  What will system do if I install or uninstall a related  application?
*  Actually the system provide you a special chance to rechoose if a related activity is added or removed. When you click the url it should popup a dialog not use the previous preferred activity.
*  When the system popup the choosing dialog?
*  After some tests I guess the system will make  a list of  interested activities instantly. And then use the previous list to compare with the list stored in /data/system/packages.xml. If they are not the same, the choose dialog should be poped up.


###Others
  * <a href="http://www.amazon.com/gp/product/B00K5B5Q80/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00K5B5Q80&linkCode=as2&tag=droidyueblog-20&linkId=LEBXDOQDCPOPP5AJ">Android Hacker's Handbook</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=B00K5B5Q80" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

