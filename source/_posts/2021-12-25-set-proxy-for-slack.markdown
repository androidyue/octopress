---
layout: post
title: "Slack 设置代li"
date: 2021-12-25 14:19
comments: true
categories: Slack proxy mac linux 
---


Slack 作为一个不错的团队协作沟通工具，被很多的团队采用。但是有时候网络并不是那么的好，需要让 Slack 走带理

但是 Slack 并没有提供 可视化的设置界面和选项。

不过经过一些摸索，发现还是有一些办法的。

<!--more-->

### 可行的技术方案
  * Slack --proxy-server="your_proxy_address"


### 实施步骤
  * 打开~/.bashrc(或~/.zshrc)
  * 添加别名设置到上述文件中  alias slackWithProxy="cd /tmp/ && nohup /Applications/Slack.app/Contents/MacOS/Slack --proxy-server="http://127.0.0.1:1087" &"
  * source ~/.bashrc(或 source ~/.zshrc)
  * 在终端输入 slackWithProxy 即可OK。
