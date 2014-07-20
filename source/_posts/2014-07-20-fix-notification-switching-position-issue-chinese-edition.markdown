---
layout: post
title: "Android修复通知栏跳动的问题"
date: 2014-07-20 11:59
comments: true
categories: Android
---

曾经遇到过这样的问题，在我的代码中使用了通知栏，一切都正常，但是就是正在进行的通知栏中属于我的程序的那一条总是上下跳来跳去，一闪一闪的。感觉用户体验很不好，于是Google一下，找到了解决方法。
<!-- more -->
在我的代码，我是这样写的。
```java
    notification.when = System.currentTimeMillis();
```
这就是问题的关键，对于通知来说，when这个属性值应该在activity一启动的时候就应该固定。如果没有固定，就会使用默认的值，默认的值就是当前的时间，即`System.currentTimeMillis()`的值。因此使用一个自定义的固定值就可以解决问题。
```java
final long TIMESTAMP_FIXED = 1234567890l;
notification.when = TIMESTAMP_FIXED;
```
以下如Google介绍如何使用notification的when的说明。
>A timestamp related to this notification, in milliseconds since the epoch. Default value: Now. Choose a timestamp that will be most relevant to the user. For most finite events, this corresponds to the time the event happened (or will happen, in the case of events that have yet to occur but about which the user is being informed). Indefinite events should be timestamped according to when the activity began. Some examples:

>  *  Notification of a new chat message should be stamped when the message was received.
>  * Notification of an ongoing file download (with a progress bar, for example) should be stamped when the download started.
>  *  Notification of a completed file download should be stamped when the download finished.
>  *  Notification of an upcoming meeting should be stamped with the time the meeting will begin (that is, in the future).
>  *  Notification of an ongoing stopwatch (increasing timer) should be stamped with the watch's start time.
>  *  Notification of an ongoing countdown timer should be stamped with the timer's end time.

###Reference
  * [http://developer.android.com/reference/android/app/Notification.html#when](http://developer.android.com/reference/android/app/Notification.html#when)

###其他
  * <a href="http://www.amazon.cn/gp/product/B00J91AF9C/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00J91AF9C&linkCode=as2&tag=droidyue-23">打造高质量Android应用:Android开发必知的50个诀窍</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00J91AF9C" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00D2ID4PK/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00D2ID4PK&linkCode=as2&tag=droidyue-23">深入理解Java虚拟机:JVM高级特性与最佳实践</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00D2ID4PK" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
