---
layout: post
title: "使用 FVM 解决 flutter 3 无法添加 uploader 问题"
date: 2022-11-20 21:41
comments: true
categories: Flutter FVM 
---

Flutter 3 之后，移除了 添加 uploader 的功能，这使得一些使用unpub 的用户很是苦恼，所以想要继续使用命令添加 uploader， 需要切回 flutter 2 才可以。

这里简单介绍一个很便捷的方式来处理上面的问题，就是使用 fvm 来指定 flutter 2 来执行 uploader 添加。 

<!--more-->

## 安装 FVM

```
brew tap leoafarias/fvm
brew install fvm
```
注： 如果没有安装homebrew， 需要安装一下。 


## 使用

如下内容保存为脚本 `addUnpubUploader.sh`
```
#!/bin/bash
fvm spawn 2.10.3 packages pub uploader  add $1 --verbose
```

执行脚本
```bash
bash addUnpubUploader.sh aaa@gmail.com 
```



## Referrence 
* https://fvm.app/