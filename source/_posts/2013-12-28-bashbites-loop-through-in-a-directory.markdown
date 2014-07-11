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
  * <a href="http://www.amazon.cn/gp/product/B009O49G7Q/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B009O49G7Q&linkCode=as2&tag=droidyue-23">Shell脚本编程诀窍:适用于Linux、Bash等</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B009O49G7Q" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

