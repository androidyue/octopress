---
layout: post
title: "一些快速提高Android开发的脚本与技巧（终端篇）"
date: 2016-05-02 21:09
comments: true
categories: Android Python shell ruby bash
---

正所谓“工欲善其事必先利其器”,一个好的工具或者技巧能让提升工作效率，起到事半功倍的效果。在这里斗胆列出一些窃以为一些可能快速提高Android日常开发的脚本，希望可以为大家提供一些好的工具，有帮助的思路。
<!--more-->

##打印Debug日志信息
该脚本打印了包含崩溃，异常，dalvikvm信息，严格模式和网页CONSOLE等信息。
```bash
#!/bin/sh
#Explanations:
# System.err to grep stacktrace information of catched exceptions
#AndroidRuntime to grep stacktrace information of uncaughted runtime exceptions
#MessageQueue to grep exceptions happended during MessageQueue
#CONSOLE to grep console message releated with javascript console.info
#dalvikvm informations about dalvik vm
#StrictMode information about StrictMode warnings
adb logcat |grep --color=always -E "System.err|AndroidRuntime|MessageQueue|CONSOLE|W/Bundle|dalvikvm|StrictMode"
```

查看详细及最新: [https://github.com/androidyue/DroidScripts/blob/master/shell/debugInfo.sh](https://github.com/androidyue/DroidScripts/blob/master/shell/debugInfo.sh)

##打印某个应用的日志
以下脚本为打印某个应用的日志，思路是将包名转为进程ip，然后过滤进程id即可。
```python
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
使用实例
```java
logcatPkg.py com.example.tester
```

##Git push快捷脚本
通常我们在做git push，我们的做法是`git push origin branch_name`，通常情况下branch_name即当前所在的分支。如下是一个简单的脚本，自动判断当前分支，你需要做的只是调用一下这个脚本即可。
```python
#!/usr/bin/env python
# coding=utf-8
from subprocess import Popen,PIPE,STDOUT
from os import system

def gpush():
    branchColorRule = readFromShell('git config color.branch')
    if ('always' == branchColorRule):
        system('git config color.branch auto')

    getBranch = "git branch | sed -n '/\* /s///p'"
    gitBranch = readFromShell(getBranch)
    command = 'git push origin %s'%(gitBranch)
    print command
    system(command)
    if ('always' == branchColorRule):
        system('git config color.branch always')


def readFromShell(command):
    p = Popen(command, shell=True, stdin=PIPE, stdout=PIPE, stderr=STDOUT, close_fds=True)
    result = p.stdout.read().strip()
    return result

gpush()
```

查看详细：[https://github.com/androidyue/DroidScripts/blob/master/python/gpush.py](https://github.com/androidyue/DroidScripts/blob/master/python/gpush.py)


##快速打开应用详情页
如下就是App详情页，使用这个页，我们可以卸载，强制停止，清除缓存，数据等操作。
![AppDetails](http://7xqzcv.com1.z0.glb.clouddn.com/app_details.jpg)

使用这个脚本，我们可以快速地进入这个页面
```bash
#!/bin/sh 
adb shell am start  -a "android.settings.APPLICATION_DETAILS_SETTINGS" -d "package:$1"
```
使用如下
```bash
bash clearAppData.sh com.droidyue.akoi
```
查看详细及最新: [https://github.com/androidyue/DroidScripts/blob/master/shell/clearAppData.sh](https://github.com/androidyue/DroidScripts/blob/master/shell/clearAppData.sh)


##查找目录下的文件
Unix中有一个很棒的查找工具，就是find，使用find，我们可以很快速查找某个目录下的的文件，支持通配符查找。在Android项目中，我们可以查找apk文件，图片文件等，另外加上xargs会变得更加强大
比如我们查找app目录下所有的apk文件，按照如下操作即可
```bash
find app/ -name *.apk
##结果
app/build/outputs/apk/app-debug-unaligned.apk
app/build/outputs/apk/app-debug.apk
```

如果我们查找到app目录下的所有apk文件，并删除，该怎么做呢，这时候就需要使用刚刚提到的xargs了
```bash
find app/ -name *.apk | xargs rm
```
xargs会将上一个命令的输出结果作为下一个命令的输入，如上操作就可以删除app目录下的所有apk文件。

##全文查找
在Android中开发时，我们常常会遇到这样的问题，比如我们需要将一个内容为"Settings"的按钮调整padding，通常我的做法是这样的。

方法一：

  * 查找内容为Settings的字符串的name
  * 然后根据得到的name查找所在的布局文件或代码文件

方法二：

  * 使用DDMS的monitor查找view的id
  * 然后根据id查找所在的布局文件或代码文件

总的来说，以上两种方法都需要用到文件的全文检索，通常我们可以使用Android Studio完成，但是个人倾向于使用Terminal。

基本脚本如下，这是一个很通用的当前目录全文查找脚本。
```
grep --ignore-case -E your_keyword . -R --color=always -n
```
上述命令对应的shell脚本为[gfind.sh](https://github.com/androidyue/DroidScripts/blob/master/shell/gfind.sh)

另外，还有一个专门为Android优化的全文查找，较上面速度提升将近多个数量级。
```
grep  -E $1 --exclude-dir={.git,lib,.gradle,.idea,build,captures} --exclude={*.png,*.jpg,*.jar}  . -R --color=always -n
```
脚本地址：[gfindx.sh](https://github.com/androidyue/DroidScripts/blob/master/shell/gfindx.sh)

上面的脚本，排除了.git,lib,.gradle,.idea等文件夹下的文件，也排除了类似png,jpg,jar等文件的查找，大大加快了查找效率。

上述两个脚本的使用方法，比如我们想要查找app下的，包含TextView的文件，如下即可。
```java
11:44:44-androidyue~/AndroidStudioProjects/AndroidGsonSample/app$ gfindx.sh TextView
./src/main/res/layout/activity_main.xml:9:    <TextView android:text="Hello World!" android:layout_width="wrap_content"
```
注意：查找app目录，需要自行切换到app目录下然后进行查找。

##查看当前的Activity
```java
 adb shell dumpsys window windows | grep -E 'mCurrentFocus|mFocusedApp' --color=always
```
完整脚本：[dumpCurrentActivity.sh](https://github.com/androidyue/DroidScripts/blob/master/shell/dumpCurrentActivity.sh)

使用示例，如下
```java
11:54:34-androidyue~/osc_git/shell_works (master)$ dumpCurrentActivity.sh 
  mCurrentFocus=Window{f03392f u0 com.netease.cloudmusic/com.netease.cloudmusic.activity.PlayerActivity}
  mFocusedApp=AppWindowToken{ae8bba4 token=Token{d3a37 ActivityRecord{19df1b36 u0 com.netease.cloudmusic/.activity.PlayerActivity t11318}}}
```

##用好alias
在用终端时，如果我们经常使用cd命令到一个固定的文件目录下，这时候，我们就需要考虑做点事情来提高这种重复的效率了。

比如我们经常执行这个操作
```java
cd ~/Documents/Android/XXXX
```

简化提速的方法是使用alias，即为操作设置别名，在.bashrc文件加入
```
alias cdProject="cd ~/Documents/Android/XXXX"
```
然后执行`source ~/.bashrc`更新配置，从此以后使用cdProject就可以轻松切换了。


以上就是关于一些简单的Android相关的脚本，终端是个好东西，希望大家可以好好利用，提升效率。


##脚本仓库
上面的脚本基本都存放于[https://github.com/androidyue/DroidScripts](https://github.com/androidyue/DroidScripts)，欢迎贡献。

