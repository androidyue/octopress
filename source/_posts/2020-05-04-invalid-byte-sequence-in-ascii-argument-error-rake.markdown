---
layout: post
title: "invalid byte sequence in US-ASCII (Argument Error) 问题修复"
date: 2020-05-04 19:26
comments: true
categories: ruby utf-8 encode rake 
---

在使用Octopress（rake命令时报错）`invalid byte sequence in US-ASCII (Argument Error) when I run rake`

## 修复方法

终端执行
```bash
export RUBYOPT="-KU -E utf-8:utf-8"
```

或者将上面的代码内容放到.bashrc中。
