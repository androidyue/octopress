---
layout: post
title: "Auth password cannot be read from a file"
date: 2014-04-18 21:35
comments: true
categories: linux openvpn auth
---
I am facing this problem which leaves the error message 
<!-- more -->
```java
'Auth' password cannot be read from a file  
```
Because I have set configuration like this in the .opvn file.
```java
auth-user-pass user_password.config
```
And after I googled I found one solution. It says You should recomiple the openVPN. Then I did as it said. It works.   
Now Go into the openvpn folder. and follow the below.
```bash
./configure --enable-password-save
make
sudo make install
```

###Others
  * <a href="http://www.amazon.com/gp/product/B00B7LQ6VS/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00B7LQ6VS&linkCode=as2&tag=droidyueblog-20&linkId=EIYGW33EVEKIWZOC">Guide to Firewalls and VPNs</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=B00B7LQ6VS" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

