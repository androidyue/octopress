---
layout: post
title: "How To Determine Whether A System is 64-bit or 32-bit"
date: 2013-11-04 16:01
comments: true
categories: linux 32-bit 64-bit OS
---
A trick in Bash
```bash 
#!/bin/bash
system_bits=`uname -m`
if [[ "$system_bits" == x86_64  ]]
then
    echo "It's a 64-bit system"
else
    echo "It's a 32-bit system"
fi

```


###Others
  * <a href="http://www.amazon.com/gp/product/0131480057/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0131480057&linkCode=as2&tag=droidyueblog-20&linkId=WHU4MINVD7K3ZNME">UNIX and Linux System Administration Handbook (4th Edition)</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=0131480057" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

