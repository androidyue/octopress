---
layout: post
title: "Android NinePatch Attention"
date: 2014-04-26 12:23
comments: true
categories: Android Drawable NinePatch 
---
I have got many crash report data about using NinePath Drwable. I put a .9.png file into the drawable-xhdpi folder and the file did not exist in any other folder. And I got ResourceNotFoundException. I got this following sayings.  
<!-- more -->
>A NinePatchDrawable graphic is a stretchable bitmap image, which Android will automatically resize to accommodate the contents of the View in which you have placed it as the background. An example use of a NinePatch is the backgrounds used by standard Android buttons — buttons must stretch to accommodate strings of various lengths. A NinePatch drawable is a standard PNG image that includes an extra 1-pixel-wide border. **It must be saved with the extension .9.png, and saved into the res/drawable/ directory of your project.**
[http://developer.android.com/guide/topics/graphics/2d-graphics.html#nine-patch](http://developer.android.com/guide/topics/graphics/2d-graphics.html#nine-patch)


The .9.png files must be saved into the res/drawable directory. Why? I guess the legacy Resouce Loading System implemententation may result in this issue. So at least put one .9.png file into the drawable folder. 

###Others
  * <a href="http://www.amazon.com/gp/product/B00G25D7ZM/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00G25D7ZM&linkCode=as2&tag=droidyueblog-20&linkId=M7NYZAPPBPLTIFRV">Android Programming: Pushing the Limits</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=B00G25D7ZM" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

