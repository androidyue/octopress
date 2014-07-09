---
layout: post
title: "Gitlab开启Commit中comments通知"
date: 2014-07-03 20:58
comments: true
categories: gitlab git
keywords: gitlab,github,gitlab notification,gitlab comments,gitlab commit comment,gitlab邮件通知,gitlab通知
---
团队中使用Gitlab来管理代码,带来了很大的效率提高.于是就这样边使用边摸索着了解gitlab的功能.今天解决了一个关于通知的问题. 
在gitlab中很常见的一个功能就是对代码增加评论,如下图所示.
<!--more-->
{%img http://droidyueimg.qiniudn.com/add_commit_comments.png %}
那么,我增加了评论对方为什么收不到呢? 如果不支持对方收到,那么评论这样的代码审核还有什么太大的效率呢? 实际上对方是能否收到的,只是需要设置一下对方接受通知的级别.
###如下修改
让对方(建议是项目的全体开发)登陆,然后选择个人资料
{%img http://droidyueimg.qiniudn.com/login_user_profile.png %}
选择Notification项目,设置Notification Level为Watch.
{%img http://droidyueimg.qiniudn.com/set_notify_level_global.png %}
以上即可搞定.然后有修改后就能收到邮件通知了。


------------------------实现和完美的分割线-----------------------------
###单独设置组的Notification Level
{%img http://droidyueimg.qiniudn.com/set_notify_level_group.png %}
###单独设置工程的Notification Level
{%img http://droidyueimg.qiniudn.com/set_notify_level_group.png %}

##延伸链接
  * https://about.gitlab.com/ 

##推荐
  * <a href="http://www.amazon.cn/gp/product/B00DSZVXH8/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00DSZVXH8&linkCode=as2&tag=droidyue-23">Git版本控制</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00DSZVXH8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
