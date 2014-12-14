---
layout: post
title: "应用认领那些事"
date: 2014-12-14 19:35
comments: true
categories: Android
---
最近公司的一款产品提交国内市场，发现有些国内市场提示需要进行应用认领。原因就是别人（或者市场抓取）已经在我们之前将这个应用提交到了该市场。认领成功后，这个应用就重回你的怀抱了，其实认领很简单，这里讲到的自然是对未签名的包进行签名。由于这样的操作细小琐屑，这样更需要记录一下，免得以后麻烦。
<!--more-->
##如何认领
  * 一般的就是市场提供一个未签名的apk包，认领方进行签名后，上传即可认领成功。
  * 另一种就是提供公司证明，这个我们不讲，也没什么可以讲。

通常情况下认领都会有对一个未签名的apk包签名认证这种方式，因为签名是软件发布商所独有的，通过对比测试需认领的包的签名和刚签过名的apk包是否一致，如果一致就认领成功，否则失败。

##对未签名包签名
```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore your_keystore  -storepass your_storepass -keypass your_keypass -signedjar path_of_signed_apk  path_of_unsigned_apk your_alias
```
###需要替换的值
  * your_key_store keystore文件路径
  * your_storepass   store密码
  * your_keypass    key密码
  * path_of_signed_apk 签名后apk保存的目录
  * path_of_unsigned_apk 待签名的apk包
  * your_alias keystore中的别名

注意上面的签名算法sigalg 使用SHA1withRSA或者MD5withRSA都可以。

##验证签名
```bash
jarsigner -verify -certs -verbose your_app.apk
```
比如我们验证百度金融的apk，会得到类似这样的结果
```bash
19:23 $ jarsigner -verify -certs -verbose BaiduFinance.apk | more

s      61679 Fri Nov 14 19:50:16 CST 2014 META-INF/MANIFEST.MF

      X.509, CN=Baidu, OU=Baidu Inc., O=Baidu Inc., L=Beijing, ST=Beijing, C=CN
      [certificate is valid from 12/6/13 10:19 AM to 11/24/63 10:19 AM]
      [CertPath not validated: Path does not chain with any of the trust anchors]

       61800 Fri Nov 14 19:50:16 CST 2014 META-INF/MCO_BAID.SF
         936 Fri Nov 14 19:50:16 CST 2014 META-INF/MCO_BAID.RSA
sm      2304 Fri Nov 14 19:49:32 CST 2014 assets/mean/data_mean_24_bank_card
```
##疑难问题
###No -tsa or -tsacert is provided and this jar is not timestamped
在签名时加入下面的选项
```bash
jarsigner -tsa http://timestamp.digicert.com
```

###Windows无法打开文件
有些Windows工具无法打开签名后的apk，如果你的签名没有错误，并且验证过，这种情况请忽略。

###签名认领失败
如果签名认领失败的话，请检查目前线上的包是否进行了二次打包被别人篡改了签名，如果是的话，需要进行商务上的沟通来解决了。
