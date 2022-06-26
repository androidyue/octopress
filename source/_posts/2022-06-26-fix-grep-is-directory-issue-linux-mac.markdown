---
layout: post
title: "Linux 下解决 grep is directory 问题"
date: 2022-06-26 20:52
comments: true
categories: Linux Grep Mac find bash 
---

Grep 是一个很便捷有用的终端工具，它可以帮助我们快速过滤筛选出一些内容。通常配合 find 命令，可以实现更加强大的能力。

比如这个这样的组合，可以快速发现并定位到 哪个.gradle 文件包含 maven.aliyun.com 。

```bash
find . -name "*.gradle" | xargs grep -E -n --color=always "maven.aliyun.com"
```

但是我们在执行的时候，总会遇到这样的错误提示输出。

```bash
grep: ./example/android/.gradle: Is a directory
```

<!--more-->

之所以出现这个问题，原因是 `find . -name "*.gradle"` 匹配到了 .gradle 目录，而使用 grep 只是单纯扫描这个目录（非包含内部文件）没有任何意义。

还在解决方法有很多，可以轻松规避这个错误输出。
 
## 方法一，递归查找该目录
我们可以通过 `-r` 指令，递归目录内部的文件查找
```bash
find . -name "*.gradle" | xargs grep -E -n --color=always -r "maven.aliyun.com"
./example/android/.gradle/build.gradle:7:            url 'http://maven.aliyun.com/nexus/content/repositories/releases/'
./example/android/.gradle/build.gradle:23:            url 'http://maven.aliyun.com/nexus/content/repositories/releases/'
./example/android/.gradle/build.gradle:7:            url 'http://maven.aliyun.com/nexus/content/repositories/releases/'
./example/android/.gradle/build.gradle:23:            url 'http://maven.aliyun.com/nexus/content/repositories/releases/'

```

## 方法二，跳过目录
我们可以通过 `--directories=skip` 跳过对文件夹的查找
```bash
find . -name "*.gradle" | xargs grep -E -n --color=always  "maven.aliyun.com" --directories=skip
 find . -name "*.gradle" | xargs grep -E -n --color=always  "maven.aliyun.com" --directories=skip
./example/android/.gradle/build.gradle:7:            url 'http://maven.aliyun.com/nexus/content/repositories/releases/'
./example/android/.gradle/build.gradle:23:            url 'http://maven.aliyun.com/nexus/content/repositories/releases/'
```

## 方案三，设置环境变量，跳过目录
```bash
export GREP_OPTIONS="--directories=skip"
find . -name "*.gradle" | xargs grep -E -n --color=always "maven.aliyun.com"
./example/android/.gradle/build.gradle:7:            url 'http://maven.aliyun.com/nexus/content/repositories/releases/'
./example/android/.gradle/build.gradle:23:            url 'http://maven.aliyun.com/nexus/content/repositories/releases/'

```

## 方案四， grep 输入源控制
我们可以使用 find 的 `-type f` 来只查找文件类型，排除目录类型。

```bash
find . -name "*.gradle" -type f |  xargs grep -E -n --color=always "maven.aliyun.com"
./example/android/.gradle/build.gradle:7:            url 'http://maven.aliyun.com/nexus/content/repositories/releases/'
./example/android/.gradle/build.gradle:23:            url 'http://maven.aliyun.com/nexus/content/repositories/releases/'

```

上面的方法都可以解决这个问题，大家可以随意选择偏好的方案处理使用。
