---
layout: post
title: "Mac 终端下获取文件的绝对路径"
date: 2022-02-21 21:26
comments: true
categories: Mac Linux Terminal bash shell File
---

## greadlink
greadlink 是一个系统自带的处理文件路径的命令，它的用法如下

```bash
greadlink -f file_name
```

示例
```bash
greadlink -f /tmp
/private/tmp

```

<!--more-->

## Realpath
realpath 是我比较常用的获取绝对路径的工具，它需要使用homebrew 进行安装后方可使用。

```
brew install coreutils
```
示例
```
realpath double_overflow.apk
/private/tmp/double_overflow.apk
```



