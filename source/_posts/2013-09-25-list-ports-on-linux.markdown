---
layout: post
title: "List  Ports on Linux"
date: 2013-09-25 19:01
comments: true
categories: netstat linux pid udp tcp Mac lsof
---
I have often suffered this painful thing.When I start a service but the destination port is always used.So I should list all open ports and kill the occupied application.  
So This is a short tip for how to list open ports on Linux  
```bash
sudo netstat -tulpn
```
Note sometimes you should grant the command for a enough access.  
For a better understanding,please
```bash
man netstat
```
or navigate to http://linux.about.com/od/commands/l/blcmdl8_netstat.htm

For Mac Users
```bash
sudo lsof -i -P | grep -i "listen"
```

###Others
  * <a href="http://www.amazon.com/gp/product/0131480057/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0131480057&linkCode=as2&tag=droidyueblog-20&linkId=MSOTURV537Y3UKBC">UNIX and Linux System Administration Handbook</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=0131480057" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

