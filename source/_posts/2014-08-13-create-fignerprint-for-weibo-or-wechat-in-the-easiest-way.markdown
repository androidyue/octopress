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
真心觉得从手机上安装apk，输入包名得到签名，再取复制，再转到计算机上。麻烦！！！！！哈哈。

###其他
  * <a href="http://www.amazon.cn/gp/product/B00647RV78/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00647RV78&linkCode=as2&tag=droidyue-23">Google Android SDK开发范例大全</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00647RV78" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00HECZXKE/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00HECZXKE&linkCode=as2&tag=droidyue-23">Android 开发入门与实战</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00HECZXKE" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
