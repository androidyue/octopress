---
layout: post
title: "tar time stamp in the future 问题解决"
date: 2014-07-18 00:19
comments: true
categories: Linux Mac Unix
---

最近遇到过一个这样的问题,我在我的Mac机器将一个刚刚创建的文件进行tar打包生成文件scripts.tar.bz2,然后在一台Centos得到这个文件,进行解压,然后出现了如下问题 time stamp in the future.
<!--more-->
```bash
$ tar xvjf scripts.tar.bz2
temp
tar: temp: time stamp 2014-07-17 13:34:02 is 2459.292801106 s in the future
```
##原因
两台机器时间不一致,创建并压缩文件操作的机器(本例为Mac)的时间要大于解压文件机器(Centos)的时间

##对症下药
  * 将两台机器的时间调整为一致.
  * 加上m参数,如 **tar xvjfm scripts.tar.bz2** 使用解压机器上的时间.`-m, --touch                don't extract file modified time`

###其他
  * <a href="http://www.amazon.cn/gp/product/B003TJNO98/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B003TJNO98&linkCode=as2&tag=droidyue-23">鸟哥的Linux私房菜:基础学习篇</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B003TJNO98" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
