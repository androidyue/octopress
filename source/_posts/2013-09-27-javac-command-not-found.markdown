---
layout: post
title: "javac:command not found"
date: 2013-09-27 22:31
comments: true
categories: javac java openjdk fedora
---
I have been getting well on with my java tool.However When I use the javac command.It says 
```bash
javac : command not found
```
It's just because I just only install the JRE(Java Runtime Environment) and do not install JDK(Java Development KIt).I got the answer going for my fedora
```bash
sudo yum install java-devel
```

##Others
  * <a href="http://www.amazon.cn/gp/product/B00E0D2OX4/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00E0D2OX4&linkCode=as2&tag=droidyue-23">图灵经典:Java程序员修炼之道</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00E0D2OX4" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

