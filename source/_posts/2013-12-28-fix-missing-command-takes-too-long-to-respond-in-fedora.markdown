---
layout: post
title: "Fix missing command takes too long to respond in Fedora"
date: 2013-12-28 21:51
comments: true
categories: fedora linux bash
---
I am getting well on with Fedora now. However when I was a fresher to Fedora, I have met a lot of problems.   
One of them is that When I type some wrong commands It will take too long to respond. It's totally different from Ubuntu,which I used before. However I like it could quickly reponse even through the command does not exist. 
```bash
unset command_not_found_handle
```
Ok.Add the above code to .bashrc And it works.

##Others
  * <a href="http://www.amazon.com/gp/product/0133477436/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0133477436&linkCode=as2&tag=droidyueblog-20&linkId=5GLJHW56AE72I7WS">A Practical Guide to Fedora and Red Hat Enterprise Linux (7th Edition)</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=0133477436" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

