---
layout: post
title: "每周一脚本：过滤单个Android程序日志"
date: 2014-09-15 18:55
comments: true
categories: 每周1脚本 Python Android 效率
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

###使用方法
```bash lineos:false
python logcatPkg.py com.mx.browser
```

###最新代码
 <a href="https://raw.githubusercontent.com/androidyue/weekly-scripts/master/python/logcatPkg.py" target="_blank">locatPkg.py</a>


###不足
   * 当脚本执行后，Android程序如果关闭或者重新启动，导致进程ID变化，无法自动继续输出日志，只能再次执行此脚本。


###其他
  * <a href="http://www.amazon.cn/gp/product/B00KVLDS20/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00KVLDS20&linkCode=as2&tag=droidyue-23">仅用两周就能自制脚本语言？</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00KVLDS20" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B002A2LQR2/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B002A2LQR2&linkCode=as2&tag=droidyue-23">一个不错的Shell脚本学习指南</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B002A2LQR2" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B005YWYH6C/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B005YWYH6C&linkCode=as2&tag=droidyue-23">Windows 7脚本编程和命令行工具指南</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B005YWYH6C" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
