---
layout: post
title: "Android/iOS 终端快速截屏技巧"
date: 2022-02-06 19:44
comments: true
categories: Android iOS Flutter Mac Linux Bash Shell Terminal 
---

传统的方式进行截屏大概是这样：

  * 使用手机截屏按钮截屏
  * 将截屏软件通过 通讯软件（微信和飞书等）发到电脑上

但是这其中需要在手机上安装软件可能就不是十分的便捷和高效。

其实有更加边界的方式处理截屏。这其中有两种方式适用于安卓，一种方式适用于 iOS 设备。

<!--more-->
### adb Android 真机截屏

```bash
#!/bin/bash
filename=/tmp/screen_$(date +%s).png
adb exec-out screencap -p > $filename

open $filename

```

上面的脚本内容大概有这样几步
  
  * 进行截图，保存到制定的目录下
  * 将上一步生成的截图文件，自动大概

最后，用户只需要执行一次 复制粘贴即可。




### Android/iOS 截屏
有一种更通用的截图方式，适用于 Android 和 iOS 设备，其原理就是利用 flutter 的 screenshot 命令。


```bash
#!/bin/bash
mkdir /tmp/flt_pj
cd /tmp/flt_pj
flutter create .
filename=/tmp/screen_$(date +%s).png
flutter screenshot --out=$filename
open $filename
```

但是这个脚本有一些小问题就是 需要创建 flutter 工程，但是耗时还是可以接收的。

以上脚本内容，保存成文件，执行即可。


