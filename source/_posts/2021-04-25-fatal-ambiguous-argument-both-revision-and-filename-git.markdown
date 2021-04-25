---
layout: post
title: "Git 处理文件与 revison 冲突问题"
date: 2021-04-25 19:37
comments: true
categories: git log branch 
---

有一次，尝试使用git log 来查看某个分支(build.gradle)的历史提交时，遇到了这样的问题

```java
git log build.gradle
fatal: ambiguous argument 'build.gradle': both revision and filename
Use '--' to separate paths from revisions, like this:
'git <command> [<revision>...] -- [<file>...]'
```
<!--more-->

## 出错原因
  * 分支名(build.gradle)与 当前目录下的文件`build.gradle`重复


## 怎么做

  * 按照上面的提示使用`--` 进行分割即可。
  * `--` 前面的为revision 可以是分支，tag等
  * `--` 后面的为 file 即要操作的文件

### 查看分支的历史提交
```java
git log build.gradle --
```

### 查看某个文件的历史提交
```java
git log -- build.gradle
```

以上。
