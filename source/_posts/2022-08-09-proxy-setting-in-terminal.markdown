---
layout: post
title: "Linux/Mac 终端代理设置，取消与排除名单"
date: 2022-08-09 08:33
comments: true
categories: Terminal 终端 Mac Linux Bash Proxy 
---

在一个不友好的网络环境中，有些开发资源（依赖）无法被直接下载安装，这时候我们需要使用代理。

如果是经常使用终端的情况，终端关于代理的内容必不可少。

<!--more-->


## 设置 http 代理
```
$ export http_proxy=http://server-ip:port/
$ export http_proxy=http://127.0.0.1:3128/
$ export http_proxy=http://proxy-server.mycorp.com:3128/
$ export http_proxy=socks5://PROXYHOST:PROXYPORT


```

## 设置 https 代理
```
$ export https_proxy=https://server-ip:port/
$ export https_proxy=https://127.0.0.1:3128/
$ export https_proxy=https://proxy-server.mycorp.com:3128/
$ export https_proxy=socks5://PROXYHOST:PROXYPORT

```



## 取消设置代理
```
unset http_proxy

unset https_proxy

```

## 设置代理排除名单

有时候，我们需要开启代理，但是有些域名不走代理，比如

  * 内部的网络，使用代理会出现错误  
  * 国内网络，使用代理后会变慢


```

export NO_PROXY=droidyue.com,127.0.0.1

```

上述 设置代理，设置代理排除名单，也可以放到 .bashrc 或 .zshrc 自动持久化处理。
