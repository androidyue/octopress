---
layout: post
title: "Mac下实现超快捷切换DNS"
date: 2020-01-28 14:39
comments: true
categories: Mac dns script 脚本 8.8.8.8 114 Google 域名解析
---

在有些情况下，我们需要切换DNS来实现一些处理。但是频繁的进入设置-网络 的确很麻烦，于是再次朝着脚本的思路想了想，发现还是可以实现的。下面的脚本就能便捷的实现切换WIFI的DNS并验证。

<!--more-->


## changeToGoogleDns.sh

该脚本的内容切换DNS为信用值很高的Google DNS 8.8.8.8。虽然Google被墙，但是这个DNS地址还是可以用的。而且这也算是我主要使用的DNS。

对应的脚本内容为
```bash
#!/bin/bash
networksetup -setdnsservers Wi-Fi 8.8.8.8
```

## changeTo114Dns.sh

114的DNS也是一种选择，但是我几乎不用，可以作为一种选择。

对应的脚本内容为
```bash
#!/bin/bash
networksetup -setdnsservers Wi-Fi 114.114.114.114
```


## dumpWifiDNS.sh
设置完成DNS之后，需要做的通常是验证以下，下面是验证DNS设置结果的脚本的内容
```bash
#!/bin/bash
networksetup -getdnsservers Wi-Fi
```
简单执行以下就可以了。
```bash
➜  scripts dumpWifiDNS.sh
8.8.8.8
```

## 其他酷酷的脚本
  * [终端依赖者福利：终端也能实现翻译功能了](https://droidyue.com/blog/2019/12/15/translate-words-in-terminal/)
  * [Mac 下在终端直接查看图片](https://droidyue.com/blog/2019/12/08/display-img-in-ternimal/)
  * [在终端使用脚本查看网站 SSL 证书信息](https://droidyue.com/blog/2019/10/27/view-ssl-certificate-in-terminal/)
  * [更多脚本](https://droidyue.com/blog/categories/jiao-ben/)