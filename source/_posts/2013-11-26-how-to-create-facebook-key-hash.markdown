---
layout: post
title: "How To Create Facebook Key Hash"
date: 2013-11-26 19:15
comments: true
categories: Android 
---
When I create a new application on Facebook, I meet the problem. Facebook asks me to provide the Key Hash. But it does not show the guidance about how to generate. After Googling, I have found this works for me.  
Before executing the following command, you need install openssl 
```bash
keytool -exportcert -alias your-alias-value -keystore your-keystore-path | openssl  sha1 -binary | openssl  base64
```
Replace **your-alias-value** and **your-keystore-path**  with the real data.

###Others
  * <a href="http://www.amazon.com/gp/product/1118717376/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1118717376&linkCode=as2&tag=droidyueblog-20&linkId=SPBASU6QEEYMTWUU">Android Programming: Pushing the Limits</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=1118717376" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

