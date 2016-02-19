---
layout: post
title: "Gmail托管邮箱发邮件认证失败"
date: 2015-05-22 21:47
comments: true
categories: Gmail
---
Gmail是一款很优秀的邮件工具，我一直使用Gmail来托管公司的邮箱，利用最棒的过滤器进行过滤垃圾邮件。前段时间公司邮箱密码更换，使用了新的密码后导致了只能收邮件不能发邮件，每次发邮件都会提示这样的错误。

<!--more-->
```java
Delivery to the following recipient failed permanently:
     someone@example.net
Technical details of permanent failure:
Google tried to deliver your message, but it was rejected by the relay smtp.example.net by smtp.example.net. [xx.xx.xxx.xx].

The error that the other server returned was:
535 5.7.8 Error: authentication failed: authentication failure
 (SMTP AUTH failed with the remote server)
```
后来Google查找`gmail SMTP AUTH failed with the remote server`便找到了这篇文章，于是简单整理一下了解决方法。

##如何修复
  1.进入Gmail中的设置  
  2.选择**Accounts and Import**  
  3.找到**Send Mail As**区域，找到刚刚出现错误的邮箱那一项，点击**edit info**  
  4.上一步会出现一个弹窗，点击**Next Step**  
  5.更新你最新的密码，按实际情况选择TLS，SSL或者不安全连接。然后点击**Save Changes**  
  6.尝试发邮件吧，一切都正常了。  

##感谢参考文章
  * [Gmail Suddenly Stopped Sending My Business Emails](http://www.webholism.com/blog/sara/gmail-suddenly-stopped-sending-my-business-emails/)
