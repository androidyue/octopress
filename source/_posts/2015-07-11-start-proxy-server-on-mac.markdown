---
layout: post
title: "在Mac上为其他设备开启代理"
date: 2015-07-11 17:36
comments: true
categories: Mac Proxy
---

前些日子，想要查看一个Release版本的HTTP请求，由于已经是发布版本，日志已然关闭，遂开始从HTTP代理的思路着手。

本文是偏于操作的总结，行文目的是快速解决诸如上面的问题，不是为了深入了解squidman。如需深入俩接，请参考文章尾部的进阶推荐内容。
<!--more-->

###Fiddler铩羽而归
首先尝试了鼎鼎有名的Fiddler，Fiddler是一款基于.NET的应用，天然运行在Windows系统上。但是想要安装到Mac上则需要安装.NET运行时，可是一旦启动Fiddler代理就无缘无故崩溃，最后不得不铩羽而归，另谋他路。

###SquidMan
SquidMan是一款Mac上的图形化的squid代理服务器的安装管理工具。使用squid服务器软件可以帮助我们实现如下功能

  * 缓存下载内容，减少网络带宽，加速网页浏览。
  * 作为代理服务器，供其他设备使用。

这里我们用到的是其代理功能。

巧妇难为无米之炊，首先要做的就是安装squidman，从[这里](http://squidman.net/squidman/)下载对应的版本并安装，然后进行启动即可。


###客户端配置
以下操作的WIFI热点应该为Mac设备与客户端设备同时连接的热点，以确保在同一局域网中。
代理服务器的IP地址使用`ifconfig`查看，端口默认为8087。
以Android设备为例

设置-->WLAN-->长按目标WIFI热点-->修改网络-->勾选显示高级选项-->修改代理为手动，填出代理服务器的地址和端口，保存即可。

###查看日志
####终端查看
个人喜欢使用终端查看，使用tail命令查看访问日志一目了然。
```java
tail -200f ~/Library/Logs/squid/squid-access.log
```

####客户端查看
使用SquidMan客户端查看也是一种选择，选择Window-->Tools即可看到如下的界面

{%img http://7jpolu.com1.z0.glb.clouddn.com/squidman_tools.png %}

Access Log不会自动追加最新的请求日志，需要再次点击Access Log按钮才可以。
###问题解决
####无法访问网络 403
```java
1434336922.275   1140 192.168.1.100 TCP_DENIED/403 4286 GET http://m.baidu.com/? - HIER_NONE/- text/html
1434336922.594     71 192.168.1.100 TCP_DENIED/403 3979 GET http://www.squid-cache.org/Artwork/SN.png - HIER_NONE/- text/html
```
日志全部显示为TCP_DENIED/403，表明Squidman拒绝了来自客户端的请求

解决方法，在配置文件中找到如下代码

{%img http://7jpolu.com1.z0.glb.clouddn.com/squidman_403.png  %}

替换为`http_access allow all`，即允许所有的HTTP访问，停止Squiman，然后重新启动，如果失败，再次点击重新启动即可。


####无法查看GET参数
```java
1434340562.396    339 192.168.1.100 TCP_MISS/200 82471 GET http://m.baidu.com/s? - HIER_DIRECT/115.239.210.14 text/html
```
默认情况下，从日志中是无法看到GET查询参数的，因为在写入日志前，程序已经过滤掉了这些数据。通过在配置中加入`strip_query_terms off`保存，重新启动，再次查看日志，就可以看到查询参数了。
```java
1434340777.200    287 192.168.1.100 TCP_MISS/200 82272 GET http://m.baidu.com/s?from=1097d&word=%E6%8A%80%E6%9C%AF%E5%B0%8F%E9%BB%91%E5%B1%8B - HIER_DIRECT/115.239.210.14 text/html
```
###进阶推荐
  * [Squid Config Examples](http://wiki.squid-cache.org/ConfigExamples)
  * [Squid configuration References](http://www.squid-cache.org/Doc/config/)
  * [鸟哥的Linux私房菜:服务器架设篇](http://www.amazon.cn/gp/product/B008AEI8A2/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B008AEI8A2&linkCode=as2&tag=droidyue-23)
