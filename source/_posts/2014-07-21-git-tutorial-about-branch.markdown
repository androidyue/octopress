---
layout: post
title: "持续整理:git分支操作"
date: 2014-07-21 19:07
comments: true
categories: Git
---

这篇文章主要的目的是记录一下git中关于分支相关的操作记录. 本文会持续更新,所有的操作都经过本人实践,可以正常运行,并且可以解决问题.

我就不罗嗦介绍什么事Git和Git有多么牛了.
<!--more-->
----------

###迁出远程分支
```bash
git checkout  -b new_local_branch_name repository_name/remote_branch_name
##Example
git checkout  -b custom origin/custom
##建议是本地的分支名字和其对应的远程分支名称一样.
```
----------

###查看本地所有分支
```bash
git branch
``` 

----------

###查看远程所有分支
```bash
git branch -r
```
----------

###删除本地分支
```bash
git branch -d your_branch_name
```
----------

###强制删除本地分支
```bash
git branch -D your_branch_name
```
----------

###删除远程分支
```bash
git push origin --delete your_branch_name
```
或者更简单的写法

```bash
git push origin :your_branch_name
```
----------

###其他
  * <a href="http://www.amazon.cn/gp/product/1430218339/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=1430218339&linkCode=as2&tag=droidyue-23">Pro Git</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=1430218339" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/1430218339/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=1430218339&linkCode=as2&tag=droidyue-23">成为大神必读的Git书籍</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=1430218339" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
