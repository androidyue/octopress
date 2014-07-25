---
layout: post
title: "Git 取消跟踪已版本控制的文件"
date: 2014-07-25 20:00
comments: true
categories: Git
---

Git 是一个很好的版本控制工具，当然驾驭起来相比 SVN 要稍微复杂一些。初入 Git，难免有一些问题。比如我们不小心将某个文件加入了版本控制，但是突然又不想继续跟踪控制这个文件了，怎么办呢？

<!--more-->
其实方法也是很简单的。使用**git update-index**即可。
###不想继续追踪某个文件
```bash
git update-index --assume-unchanged your_file_path
```
###如果想再次继续跟踪某个文件
```bash
git update-index --no-assume-unchanged your_file_path
```

###其他
  * <a href="http://www.amazon.cn/gp/product/1430218339/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=1430218339&linkCode=as2&tag=droidyue-23">Git大神之路：Pro Git</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=1430218339" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B0058FLC40/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0058FLC40&linkCode=as2&tag=droidyue-23">Git权威指南</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0058FLC40" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />




