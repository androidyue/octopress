---
layout: post
title: "Mac 下在终端直接查看图片"
date: 2019-12-08 20:02
comments: true
categories: mac shell iterm2 linux imgcat 
---

在开发的过程中，我们通常会遇到这样的情况，就是我们需要根据图片的url地址查看其对应的内容，通常的做法就是把这个图片链接贴到浏览器。不过一直好奇，能不能再终端中直接展示，于是做了一些搜索，发现了对应的实现方式。

注意：此方式只适用于Mac，其他的Linux 发行版 需要自行按照如下的思路查找对应的工具。

<!--more-->

## 安装imgcat
使用iTerm 2 执行如下的语句(或者是选择 iTerm2菜单 -> Install Shell Integration安装)
```
curl -L https://iterm2.com/shell_integration/install_shell_integration_and_utilities.sh | bash
```

安装完成之后，建议重新启动iTerm 2

## 使用imgcat 展示本地图片

用法很简单，`imgcat localfile`,操作示例

![https://asset.droidyue.com/image/2019_11/imgcat_local_file_2.png](https://asset.droidyue.com/image/2019_11/imgcat_local_file_2.png)

## 使用imgcat 展示网络上的图片
由于imgcat的参数只支持本地的文件，如果想要展示网络的文件，我们需要写一个简单的脚本实现。

脚本内容
```bash
#!/bin/bash
rm -rf "/tmp/1.png"
curl -o "/tmp/1.png" "$1"
~/.iterm2/imgcat "/tmp/1.png"
```

执行效果如下

![https://asset.droidyue.com/image/2019_11/catimg_result.png](https://asset.droidyue.com/image/2019_11/catimg_result.png)

