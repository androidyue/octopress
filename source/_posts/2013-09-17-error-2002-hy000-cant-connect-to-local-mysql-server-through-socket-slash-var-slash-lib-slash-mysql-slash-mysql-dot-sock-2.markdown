---
layout: post
title: "ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/var/lib/mysql/mysql.sock' (2)"
date: 2013-09-17 18:48
comments: true
categories: MySQL Linux mysqld
---
This works for me.
```bash
sudo systemctl start mysqld.service 
sudo systemctl enable mysqld.service
```

###Others
  * <a href="http://www.amazon.com/gp/product/059652708X/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=059652708X&linkCode=as2&tag=droidyueblog-20&linkId=QKWMKNBOZFFE7CLH">MySQL Cookbook</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=059652708X" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

