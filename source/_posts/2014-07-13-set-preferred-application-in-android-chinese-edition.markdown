---
layout: post
title: "解密:Android设置默认程序"
date: 2014-07-13 12:09
comments: true
categories: Android
---

Android作为一个伟大的系统,自然提供了设置默认打开程序的实现.在这篇文章中,我会介绍如何在Android系统中设置默认的程序. 在设置默认程序之前,无非有两种情况,一种是已经有默认的程序,另一种则是没有任何默认程序.
<!--more-->
##检测是否有默认的程序
检查是必须的,因为结果关乎着我们下一步该怎么做.
```java
    public void testGetDefaultActivity() {
        PackageManager pm = mContext.getPackageManager();
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setData(Uri.parse("http://www.google.com"));
        ResolveInfo info = pm.resolveActivity(intent, PackageManager.MATCH_DEFAULT_ONLY);
        Log.i(VIEW_LOG_TAG, "getDefaultActivity info = " + info + ";pkgName = " + info.activityInfo.packageName);
}
```
其对应的日志输出如下
```java
I/View    ( 1145 ): View getDefaultActivity info = ResolveInfo{410e4868 com.android.internal.app.ResolverActivity p=0 o=0 m=0x0};pkgName = android
```
如果没有默认的程序,那么就会显示出默认的就会显示com.android.internal.app.ResolverActivity,那么这个ResolverActivity是什么呢,其实它就是一个选择打开程序的对话框,其庐山真面目应该是这样
{%img http://droidyueimg.qiniudn.com/resolveactivity.png Android ResolverActivity %}


如果我们设置了傲游浏览器作为我们的默认浏览器,那么默认的程序就应该显示关于傲游浏览器相关的信息. 如下.
```java
I/View    ( 1145 ): View getDefaultActivity info = ResolveInfo{410ae1e8 com.mx.browser.MxBrowserActivity p=0 o=0 m=0x208000};pkgName = com.mx.browser
```
那么如何判断是否设置了默认的程序呢,上面的方法默认的ResolveInfo,如果info.activityInfo.packageName为android,则没有设置,否则,有默认的程序.
```
public final boolean hasPreferredApplication(final Context context, final Intent intent) {
    PackageManager pm = context.getPackageManager();
    ResolveInfo info = pm.resolveActivity(intent, PackageManager.MATCH_DEFAULT_ONLY);
    return !"android".equals(info.activityInfo.packageName);
}
```
##如果有默认程序
我们需要做的是将现在的默认的程序的默认设置清除.

我们能通过代码直接将默认设置改写成我们的么,实际上是不行的,因为权限的问题. 原因是这样的Android因为基于Linux 内核,Linux有着很棒的用户概念,而Android中每个应用就是一个在Linux内核中的用户.两个级别相同的用户无法删除对方. 

所以,我们只能交给用户手动做.当然这也是绝大多数程序的做法.你需要做的就是将使用者带到程序详情页,通过这段代码可以跳转到应用详情页.
```java
public void testStartAppDetails() {
    //Use the destination package name
    Intent intent = new Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:com.mx.browser"));
    getActivity().startActivity(intent);
}
```
当跳转到已安装的应用详情页之后,你应该提示用处点击Clear Default 按钮.
{% img http://droidyueimg.qiniudn.com/choose_default_activity_dialog.png installed app details clear default%}

如果用户从安装详情页回到你的程序,你需要检测是不是用户清理了默认的程序设置,判断依据还是是否有默认的程序设置,如果还有默认的,继续提示需要手动清理其他已设置的程序,直到用户彻底清理完成之后,然后按照下面的没有默认设置程序的情况处理. 

注意,存在多次清理的情况,如设置浏览器,先清理了UC默认设置后,可能还需要清理海豚浏览器的情况.


##没有默认的程序.
如果没有默认的程序,我们就需要设置我们希望的程序作为默认,但是,这页不能在代码中实现,还是需要人为的交互选择才可以.你需要做的就是使用类似如下代码,然后弹出一个提示,告诉用户选择你的程序作为默认的程序.至于提示语你可以充分发挥你的想象力.

```java
public void testStartChooseDialog() {
    Intent intent = new Intent();
    intent.setAction("android.intent.action.VIEW");
    intent.addCategory("android.intent.category.BROWSABLE");
    intent.setData(Uri.parse("http://droidyue.com"));
    intent.setComponent(new ComponentName("android","com.android.internal.app.ResolverActivity"));
    getActivity().startActivity(intent);
}
```

##取消自己的默认程序设置
```java
public void testClearDefault() {
    PackageManager pm = mContext.getPackageManager();
    pm.clearPackagePreferredActivities(mContext.getPackageName());
}
```

上述方法只能清理自己的默认设置.

##更近一步
实际上关于默认设置的配置文件存放在/data/system/packages.xml
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

##One More Thing
  * 提问:当一个程序程序安装或卸载,系统会做什么
  * 回答:当一个程序安装或者卸载,以浏览器为例子,如果你安装了一个傲游浏览器或者卸载了一个UC浏览器,当你从外部程序打开一个链接时,系统不会使用之前的默认程序打开,而是弹出一个选择对话框供你选择.

  * 提问:什么时候系统会弹出选择打开程序列表
  * 回答:经本人测试,实际是这样的,当有一个Intent过来的时候,系统会动态地收集能处理的Activity,然后从/data/system/packages.xml 读取进行比较,如果两者不同,则弹出选择对话框.

###Others 
  * <a href="http://www.amazon.cn/gp/product/B009OLU8EE/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B009OLU8EE&linkCode=as2&tag=droidyue-23">Android系统源代码情景分析</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B009OLU8EE" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />


