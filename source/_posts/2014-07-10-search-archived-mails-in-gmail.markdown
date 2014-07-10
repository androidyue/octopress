---
layout: post
title: "Gmail查找存档的邮件"
date: 2014-07-10 20:56
comments: true
categories: Google Gmail
---

##什么是已归档邮件
邮件归档后将从您的收件箱中删除，但是仍保留在您的账户中，便于之后查找。归档操作就像将邮件放入档案柜中妥善保管一样，而不是将其丢入垃圾箱。
<!--more-->
##如何查找已归档邮件
输入如下,进行搜索即可.
```bash
has:nouserlabels -in:Sent -in:Chat -in:Draft -in:Inbox
```
##语法解释
  * has:nouserlabels 搜索尚未应用您所创建标签的邮件
  * -（连字符）用于排除不包含您的搜索字词的邮件

##参考
  * https://support.google.com/mail/answer/6576?hl=zh-Hans
  * https://support.google.com/mail/answer/7190?hl=zh-Hans

##Others
  * <a href="http://www.amazon.cn/gp/product/0672338394/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=0672338394&linkCode=as2&tag=droidyue-23">Gmail in 10 Minutes, Sams Teach Yourself</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=0672338394" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
