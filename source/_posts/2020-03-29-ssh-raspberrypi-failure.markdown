---
layout: post
title: "修复ssh 首次登录树莓派失败的问题"
date: 2020-03-29 19:46
comments: true
categories: ssh raspberrypi linux mac
---

默认情况下，树莓派不支持ssh登录，需要做一些简单的处理

解决方法很简单

  * 在Mac或者linux电脑上，使用终端进入`cd /Volumes/disk_of_raspberry`
  * 创建一个文件，叫做ssh,`touch ssh`

<!--more-->

完整的代码大概是
```bash
cd /Volumes/disk_of_raspberry
touch ssh
```



