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
  * <a href="http://www.amazon.com/gp/product/143023668X/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=143023668X&linkCode=as2&tag=droidyueblog-20&linkId=UFUUGTHMMNFDY7EG">Taking Your OS X Lion to the Max (Technology in Action)</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=143023668X" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

