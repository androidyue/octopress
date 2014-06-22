---
layout: post
title: "Octopress填坑日记"
date: 2014-06-22 10:44
comments: true
categories: Octopress 404 noise.png line-tile.png rss.png code_bg.png
---

今日开始开始填Octpress在天朝的坑。
<!--more-->
###文件404问题
{%img http://droidyueimg.qiniudn.com/octopress_404_img.png %}
修改代码简直是太辛苦了。毕竟涉及文件比较多。
于是干脆简单粗暴的把这些文件不存在的文件都创建了吧。直接上代码了
```bash
cd source/
mkdir github
mkdir github/images
cp images/noise.png github/images/
cp images/line-tile.png github/images/
cp images/rss.png github/images/
cp images/code_bg.png github/images/
```


> Written with [StackEdit](https://stackedit.io/).
