---
layout: post
title: "BashBites:Loop Through In A Directory"
date: 2013-12-28 10:12
comments: true
categories: Linux Shell for loop  bash
---
The trick is really easy. Just to keep record.Here we take the /tmp folder as the desired one.
```bash
#!/bin/bash 
cd /tmp
for file in `ls`
do
    echo $file
done
```
##Others
  * <a href="http://www.amazon.com/gp/product/0596009658/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0596009658&linkCode=as2&tag=droidyueblog-20&linkId=GR5OEAAOPTK3FZJL">Learning the bash Shell: Unix Shell Programming (In a Nutshell (O'Reilly))</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=0596009658" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

