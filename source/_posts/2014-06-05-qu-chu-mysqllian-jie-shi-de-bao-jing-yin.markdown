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
