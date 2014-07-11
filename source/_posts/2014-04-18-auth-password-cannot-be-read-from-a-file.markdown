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
  * <a href="http://www.amazon.cn/gp/product/B0027VSA7U/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0027VSA7U&linkCode=as2&tag=droidyue-23">程序员的自我修养:链接、装载与库</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0027VSA7U" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

