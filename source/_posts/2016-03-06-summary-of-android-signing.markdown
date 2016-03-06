---
layout: post
title: "Android签名相关知识整理"
date: 2016-03-06 16:17
comments: true
categories: Android
---

不止一次有用到Android签名相关的知识，每次都几乎从零开始在Google上搜索找，不想在继续这样了，找了个时间好好整理了一下自己用到的一些碎片知识，于是乎放到这里，一是备忘，二是帮助别人。

<!--more-->
##从APK文件中获取签名信息
###使用方法
```java
keytool -list -printcert -jarfile your_apk_file
```

###输出信息
  * 签名Owner,Issuer等信息
  * 签名的fingerprints,如md5及sha1等值
  * 签名有效期等信息

###示例效果
```java
16:29 $ keytool -list -printcert -jarfile akoi_1.2.apk
Signer #1:

Signature:

Owner: CN=Andrew Wallace, OU=droidyue.com, O=droidyue.com, L=Beijing, ST=Beijing, C=86
Issuer: CN=Andrew Wallace, OU=droidyue.com, O=droidyue.com, L=Beijing, ST=Beijing, C=86
Serial number: 11a8a4a3
Valid from: Tue Feb 10 18:07:43 CST 2015 until: Sun Jun 13 18:07:43 CST 3013
Certificate fingerprints:
	 MD5:  46:C5:BE:EF:B5:C9:00:E1:FA:42:50:50:57:54:CA:15
	 SHA1: C1:14:5D:0A:C2:BF:F6:06:43:20:AE:2C:07:12:97:58:C2:1B:39:D1
	 SHA256: 0E:88:7D:C2:4C:D6:84:A7:58:D4:24:1E:9D:38:F9:05:98:1E:B2:A2:D7:CB:0F:81:74:60:5B:38:89:FF:21:1C
	 Signature algorithm name: SHA256withRSA
	 Version: 3
```

##从签名文件中获取签名信息
###使用方法
```java
keytool -list -v -keystore your_kestore_file
```
注意，上述命令执行后，会提示输入密码，其实输入错误也没有关系，不影响结果。

###输出信息
  * 签名Owner,Issuer等信息
  * 签名的fingerprints,如md5及sha1等值
  * 签名有效期等信息


###示例效果
```java
Keystore type: JKS
Keystore provider: SUN

Your keystore contains 1 entry

Alias name: droidyue.com
Creation date: Feb 10, 2015
Entry type: PrivateKeyEntry
Certificate chain length: 1
Certificate[1]:
Owner: CN=Andrew Wallace, OU=droidyue.com, O=droidyue.com, L=Beijing, ST=Beijing, C=86
Issuer: CN=Andrew Wallace, OU=droidyue.com, O=droidyue.com, L=Beijing, ST=Beijing, C=86
Serial number: 11a8a4a3
Valid from: Tue Feb 10 18:07:43 CST 2015 until: Sun Jun 13 18:07:43 CST 3013
Certificate fingerprints:
	 MD5:  46:C5:BE:EF:B5:C9:00:E1:FA:42:50:50:57:54:CA:15
	 SHA1: C1:14:5D:0A:C2:BF:F6:06:43:20:AE:2C:07:12:97:58:C2:1B:39:D1
	 SHA256: 0E:88:7D:C2:4C:D6:84:A7:58:D4:24:1E:9D:38:F9:05:98:1E:B2:A2:D7:CB:0F:81:74:60:5B:38:89:FF:21:1C
	 Signature algorithm name: SHA256withRSA
	 Version: 3
```

##重新签名APK
在没有源码情况下，我们就能对apk进行更换签名。

###脚本
  * [signapk.sh](https://apk-resigner.googlecode.com/svn/trunk/signapk.sh)
  * [备用地址](http://7jpqsg.com1.z0.glb.clouddn.com/signapk.sh)

###使用方法
```java
bash signapk.sh your_apk_file your_keystore_file keystore_pass keystore_alias
```

###示例效果
```java
16:57 $ bash signapk.sh weixin6313android740.apk ~/Documents/baidu_disk/百度云同步盘/droidapp/mykiki 123456 droidyue.com
param1 weixin6313android740.apk
param2 /Users/androidyue/Documents/droidapp/mykiki
param3 123456
param4 droidyue.com
deleting: META-INF/MANIFEST.MF
deleting: META-INF/DROIDYUE.SF
deleting: META-INF/DROIDYUE.RSA
   adding: META-INF/MANIFEST.MF
   adding: META-INF/DROIDYUE.SF
   adding: META-INF/DROIDYUE.RSA
......
Verification succesful
```

生成的文件会放在当前目录，其文件名相对输入文件，增加了`signed_`前缀，比如对`weixin6313android740.apk`进行上述操作得到的输出文件是`signed_weixin6313android740.apk`


##Gradle build生成签名APK
想要在执行gradle build时生成指定签名的apk，需要在build.gradle中如下修改
```java
android {
    
    signingConfigs {
        release {
            storeFile file("myrelease.keystore")
            storePassword "********"
            keyAlias "******"
            keyPassword "******"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

