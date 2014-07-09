---
layout: post
title: "在bash中检测进程是否正在运行"
date: 2014-06-29 17:03
comments: true
categories: Bash Shell
keywords: process, running process, ps, grep，进程，执行的进程
---

这里简单介绍一个自己写的检测某个进程是否存在的bash小脚本。直接上代码。
<!--more-->
```bash
#!/bin/bash
ps_out=`ps -ef | grep $1 | grep -v 'grep' | grep -v $0`
result=$(echo $ps_out | grep "$1")
if [[ "$result" != "" ]];then
    echo "Running"
else
    echo "Not Running"
fi
```
##举例使用
比如我们启动了一个这样的进程`python -m SimpleHTTPServer 8000`,我们想检测这个进程是否存在，可以这样。
```bash
17:38:07-androidyue~/osc_git/shell_works (master)$ ./checkRunningProcess.sh 'SimpleHTTPServer'
Running
```
##些许说明
  * 该脚本会自动去除**包含目标信息的grep进程**。以及**当前这个正在执行的脚本**。
  * 使用保存文件后，确保具有可执行属性。

##Read More
  * http://stackoverflow.com/questions/2903354/bash-script-to-check-running-process/24140715#24140715 

##推荐
  * <a href="http://www.amazon.cn/gp/product/B009O49G7Q/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B009O49G7Q&linkCode=as2&tag=droidyue-23">Shell脚本编程诀窍:适用于Linux、Bash等</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B009O49G7Q" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

