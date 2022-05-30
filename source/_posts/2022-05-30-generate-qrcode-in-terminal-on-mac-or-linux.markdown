---
layout: post
title: "Mac 下 终端也能生成二维码了"
date: 2022-05-30 07:45
comments: true
categories: Linux Mac Shell Terminal Bash 
---

有些时候，我们需要将链接或者文本转换成 二维码，通常这时候我们会使用网上的在线服务进行处理，其实我们还可以做到更加简单，使用终端即可生成二维码。

这里，我们需要借助 Mac 下 homebrew 的一个库来实现，这个库的名字叫做 qrencode。下面就是关于 这个库的安装，封装，以及使用。
<!--more-->

## 安装
```bash
brew install qrencode
```


## 使用
```bash
qrencode  -t ANSIUTF8 https://droidyue.com
```
执行上面的语句，就能马上看到一个二维码在终端生成了。


## 保存成脚本(qrCodeGenerate.sh)
```bash
#!/bin/bash
qrencode  -t ANSIUTF8 $1
```

## 脚本使用
```bash
qrCodeGenerate.sh https://droidyue.com
```
保存成脚本，让我们后续使用起来更加的简单与快捷。

## qrencode 文档
  * https://formulae.brew.sh/formula/qrencode
