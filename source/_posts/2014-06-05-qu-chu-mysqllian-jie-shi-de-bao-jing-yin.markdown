---
layout: post
title: "去除mysql连接时的报警音"
date: 2014-06-05 21:34
comments: true
categories: mysql 
---
在使用命令行进入mysql时如果没有进行设置会有报警音很是吓人,使用这个命令可以去掉吓人的声音。
```bash
mysql -h localhost -u root -b -p
```
起作用的就是-p。

###Others
  * <a href="http://www.amazon.cn/gp/product/B004J33P3I/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B004J33P3I&linkCode=as2&tag=droidyue-23">MySQL入门很简单</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B004J33P3I" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

