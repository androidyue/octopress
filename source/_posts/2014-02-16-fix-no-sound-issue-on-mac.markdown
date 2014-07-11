---
layout: post
title: "Fix No Sound Issue On Mac"
date: 2014-02-16 13:25
comments: true
categories: Mac sound
---
Now I am dealing with Mac OSX. However I found sometimes this is no sound. People say it's a bug. I have tried some methods. And found this goes for me every time. 
```bash
#!/bin/bash
sudo kextunload /System/Library/Extensions/AppleHDA.kext
sudo kextload /System/Library/Extensions/AppleHDA.kext
```
Put the code into a shell script and run the script whenever the issue occurs.

###Others
  * <a href="http://www.amazon.cn/gp/product/B00CBBKBAA/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00CBBKBAA&linkCode=as2&tag=droidyue-23">I'm a Mac:雄狮训练手册</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00CBBKBAA" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

