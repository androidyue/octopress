---
layout: post
title: "Jar mismatch! Fix your dependencies"
date: 2013-11-27 18:07
comments: true
categories: Facebook library android-support-v4.jar
---
There was a requirement of my work. It requires me to integrated my current project with Facebook SDK for measuring. However this came into my sights. 
```bash
Jar mismatch! Fix your dependencies 
```
The fact is that Both my project and my library project which the former refers to have used android-support-v4.jar. However I realize the two android-support-v4.jar are different after making the md5 hash.  
My solution:  
**I use the android-support-v4.jar in my project as the right one. And then replace the one in Facebook SDK with my project one. And then it works.**  
But my question remains; why it asks me for fix the dependencies to use the same lib jar file?  
I guess android will keep only one file for all the references so this will ask developers to make all the same lib all the same.
Sorry for the codeless post.

###Others
  * <a href="http://www.amazon.com/gp/product/B00LPFYSC0/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00LPFYSC0&linkCode=as2&tag=droidyueblog-20&linkId=MJP6M2P4HTA5FSWF">Social: 50 Ways to Improve Your Professional Life</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=B00LPFYSC0" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

