---
layout: post
title: "提高效率：按照包名过滤Android程序日志"
date: 2014-09-15 18:55
comments: true
categories: 每周一脚本 Python Android
---
在Android软件开发中，增加日志的作用很重要，便于我们了解程序的执行情况和数据。Eclipse开发工具会提供了可视化的工具，但是还是感觉终端效率会高一些，于是自己写了一个python的脚本来通过包名来过滤某一程序的日志。

###原理
通过包名得到对应的进程ID（可能多个），然后使用adb logcat 过滤进程ID即可得到对应程序的日志。
<!--more-->
###源码
```python lineos:false https://raw.githubusercontent.com/androidyue/weekly-scripts/master/python/logcatPkg.py
#!/usr/bin/env python
#coding:utf-8
#This script is aimed to grep logs by application(User should input a packageName and then we look up for the process ids then separate logs by process ids).

import os
import sys

packageName=str(sys.argv[1])

command = "adb shell ps | grep %s | awk '{print $2}'"%(packageName)
p = os.popen(command)
##for some applications,there are multiple processes,so we should get all the process id
pid = p.readline().strip()
filters = pid
while(pid != ""):
    pid = p.readline().strip()
    if (pid != ''):
        filters = filters +  "|" + pid
        #print 'command = %s;filters=%s'%(command, filters)
if (filters != '') :
    cmd = 'adb logcat | grep --color=always -E "%s" '%(filters)
    os.system(cmd)
```
###最新代码
 <a href="https://raw.githubusercontent.com/androidyue/weekly-scripts/master/python/logcatPkg.py" target="_blank">locatPkg.py</a>


###不足
   * 当脚本执行后，Android程序如果关闭或者重新启动，导致进程ID变化，无法自动继续输出日志，只能再次执行此脚本。


