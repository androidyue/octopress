---
layout: post
title: "Fix Notification Switching Position Issue"
date: 2014-03-21 22:14
comments: true
categories: Android Notification 
---
I once faced with a problem. I wrote a piece of code related with notifcation. Everything goes fine except one little issue. I found the ongoing notification switching order. My notification blinked each second.  After Googling I found the reason and resolved the problem.  
<!-- more -->
In my code I wrote like this
```java
    notification.when = System.currentTimeMillis();
```
That's was the key point. For the notification the when timestamp should be fixed when an activity starts. And the default value is Now(which is the value of System.currentTimeMillis()).I used **a fixed value** and resovled the problem.
```java
notification.when = TIMESTAMP_FIXED;
```
Now This is what Google says  
>A timestamp related to this notification, in milliseconds since the epoch. Default value: Now. Choose a timestamp that will be most relevant to the user. For most finite events, this corresponds to the time the event happened (or will happen, in the case of events that have yet to occur but about which the user is being informed). Indefinite events should be timestamped according to when the activity began. Some examples:

>  *  Notification of a new chat message should be stamped when the message was received.
>  * Notification of an ongoing file download (with a progress bar, for example) should be stamped when the download started.
>  *  Notification of a completed file download should be stamped when the download finished.
>  *  Notification of an upcoming meeting should be stamped with the time the meeting will begin (that is, in the future).
>  *  Notification of an ongoing stopwatch (increasing timer) should be stamped with the watch's start time.
>  *  Notification of an ongoing countdown timer should be stamped with the timer's end time.
>  Reference from [http://developer.android.com/reference/android/app/Notification.html#when](http://developer.android.com/reference/android/app/Notification.html#when)

##Others
  * <a href="http://www.amazon.com/gp/product/1430249862/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1430249862&linkCode=as2&tag=droidyueblog-20&linkId=SA6OP7HQUFINEY44">Pro Android UI</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=1430249862" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

