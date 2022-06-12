---
layout: post
title: "谁动了我的奶酪，通过 git 找出内容变更历史"
date: 2022-06-13 06:19
comments: true
categories: Git bash Mac Linux 
---
在日常的开发过程中，一段代码内容被添加，删除都是稀疏平常的事情。这也就造成了我们日常开发工作中会遇到这样两个问题

  * 这个代码内容是谁添加的，是一直存在还是被修改过多次
  * 有一段代码被删除了，是谁删除的呢

<!--more-->

这里我们通过一个具体的例子来说明。

有一个 hosts.txt  文件，内容是

```
import lib/a
import lib/b
```

现在我们遇到这样的一个情况

  * 最早的host.txt 中包含了 lib/c 的引入
  * 但是在某一个版本 lib/c 被人移除掉了
  * 我们想确定是谁，哪个提交删除了这个 lib/c


我们可以使用这段脚本来实现，脚本很简单如下。
```
// 将下面的内容保存成 whoMovedMyCheese.sh 文件
#!/bin/bash
git log -S$1 $2


// 使用方法
whoMovedMyCheese.sh keyword  file_path
```
## 调用脚本查看

```bash

whoMovedMyCheese.sh lib/c hosts

commit a4b5ac190f9d152dbdb6555862617ba93f (HEAD -> master)
Author: hahaha <hahaha@hahaha.io>
Date:   Mon May 16 07:59:13 2022 +0800

    feat: remove lib/c

commit 89405dbe29ff79412f701e529791a10387e
Author: hahaha <hahaha@hahaha.io>
Date:   Mon May 16 07:58:53 2022 +0800

    new file:   host.txt
```

是的，通过上面的脚本就可以轻松查到一段内容的添加和删除提交历史了。是不是很方便和快捷，有效。

## 和 Git blame 对别

### 存在内容追踪历史追溯

  * git blame 只能查看到当前最近的一次修改, 
  * 本文方法可以查看出一个内容的修改历史，比如一段内容经过 增加-删除-再增加 这样的信息都是可以被查到的。

### 删除内容追踪
  * git blame 无法查看不存在的代码片段的信息
  * 本文方法可以查看到已经删除的内容的历史信息


Git 是一个好东西，把它利用好，尤其是 终端 git 命令利用好，你会轻轻松松在处理问题上做到高效快捷与准确。

