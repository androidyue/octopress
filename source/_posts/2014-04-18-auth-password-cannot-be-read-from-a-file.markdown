---
layout: post
title: "Auth password cannot be read from a file"
date: 2014-04-18 21:35
comments: true
categories: linux openvpn auth
---
I am facing this problem which leaves the error message 
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
