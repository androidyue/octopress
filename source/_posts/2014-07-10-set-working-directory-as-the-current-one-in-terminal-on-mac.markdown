---
layout: post
title: "Mac终端新标签打开当前目录"
date: 2014-07-10 19:02
comments: true
categories: Mac Linux Tools
---
Mac中终端每次打开一个标签都是一个固定的路径,这点对于从Linux发行版过来的用户来说,简直是很不爽,那么如何实现像Linux发行版一样,新标签的打开路径和启动它的标签路径一直呢?

以下几种方法仅供参考.分别是设置shell脚本, 修改Terminal设置,和修改iTerm设置.
<!--more-->

##最Geek
创建文件/usr/local/bin/nt (需要Root权限),内容为 
```bash
#!/bin/bash
#!/bin/bash
osascript -e 'tell application "Terminal"' \
-e 'tell application "System Events" to tell process "Terminal" to keystroke "t" using command down' \
-e "do script with command \"cd `pwd`;clear\" in selected tab of the front window" \
-e 'end tell' &> /dev/null
```
赋予可执行权限
```bash
sudo chmod a+x /usr/local/bin/nt
```
如不生效,重启终端程序.

##修改Terminal设置
选择Preferences--Startup--New tabs open with 或者如下图.
{%img http://droidyueimg.qiniudn.com/system_terminal_working_path.png Mac Set Terminal Wroking Directory %}

##修改iTerm设置
选择Preferences--Profile--General--Working Directory 或者如下图
{%img http://droidyueimg.qiniudn.com/iterm_set_working_path.png Mac iTerm Set Working Directory %}

##Others
  * <a href="http://www.amazon.cn/gp/product/B004BR2OW0/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B004BR2OW0&linkCode=as2&tag=droidyue-23">开始Mac:实战手册</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B004BR2OW0" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

