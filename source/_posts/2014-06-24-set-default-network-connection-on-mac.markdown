---
layout: post
title: "Mac更改默认网络连接"
date: 2014-06-24 21:06
comments: true
categories: Mac VPN 
keywords: Mac, default network, network connection, VPN, VPN不生效，Mac VPN不生效
description: 修改默认网络连接 VPN不生效
---
使用了新的VPN,可以连接通过,但是访问Google还是不很慢,简直就是不生效.后来,运维同事帮忙解决了一下,解决方法就是将vpn设置默认的网络连接.  
<!--more-->
查看网络连接.直接的结果应该类似这样.
{%img http://droidyueimg.qiniudn.com/connection_previous.png %}
需要修改成这样的效果
{%img http://droidyueimg.qiniudn.com/connection_after.png %}
###How to do
####打开网络连接,按如下选择.
{%img http://droidyueimg.qiniudn.com/set_service_order.png %}
####拖拽你想要设置为默认的网络连接到顶部
{%img http://droidyueimg.qiniudn.com/drag_dest.png  %}

