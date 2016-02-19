---
layout: post
title: "超简单生成微博微信应用签名"
date: 2014-08-13 20:00
comments: true
categories: Android
---

集成微博或者微信的SDK时，编辑应用信息要求填写应用签名，官方推荐下载一个apk工具。有那么复杂么，直接终端就可以搞定。
<!--more-->
```bash
19:33 $ keytool -exportcert -alias your_alias_name -keystore your_keystore_path | openssl md5
##然后按照提示输入密码
Enter keystore password:  ********
```
替换上面的your_alias_name 和your_keystore_path即可。  

###更便捷的方法
感谢网友指出，这是一个更编辑的方法。
```bash
androidyue/tmp$ keytool -list -v -keystore mykiki 
Enter keystore password: 
```

真心觉得从手机上安装apk，输入包名得到签名，再取复制，再转到计算机上。麻烦！！！！！
