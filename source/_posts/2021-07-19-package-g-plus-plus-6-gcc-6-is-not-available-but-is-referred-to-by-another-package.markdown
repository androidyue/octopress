---
layout: post
title: "gcc-6 g++-6 无法安装问题解决"
date: 2021-07-19 19:15
comments: true
categories: gcc-6 g++-6 Ubuntu Linux Centos deb apt 
---

在 Ubuntu 20.04 安装gcc-6和g++-6 遇到这样的问题

```bash
sudo apt-get install gcc-6 g++-6 -y
Reading package lists... Done
Building dependency tree       
Reading state information... Done
Package gcc-6 is not available, but is referred to by another package.
This may mean that the package is missing, has been obsoleted, or
is only available from another source

Package g++-6 is not available, but is referred to by another package.
This may mean that the package is missing, has been obsoleted, or
is only available from another source

```

<!--more--> 

## 解决步骤
  * 打开源配置文件 `sudo vim  /etc/apt/sources.list `
  * 在文件末尾增加 `deb http://dk.archive.ubuntu.com/ubuntu/ bionic main universe` 并保存退出
  * 执行更新 `sudo apt update`
  * 再次安装`sudo apt-get install gcc-6 g++-6 -y` 搞定。