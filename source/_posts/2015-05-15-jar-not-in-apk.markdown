---
layout: post
title: "JAR包未加入APK程序"
date: 2015-05-15 20:45
comments: true
categories: Android
---

前段时间打包遇到了一个问题，jar包不能加入到apk包中。从Eclipse中完全可以，一旦放到服务器端进行打包就出现了问题。
<!--more-->
使用`ant debug -d`得到的信息如下
```java
[dx] trouble processing:
       [dx] bad class file magic (cafebabe) or version (0033.0000)
       [dx] ...while parsing com/solo/adsdk/network/a.class
       [dx] ...while processing com/solo/adsdk/network/a.class
       [dx]
       [dx] trouble processing:
       [dx] bad class file magic (cafebabe) or version (0033.0000)
       [dx] ...while parsing com/solo/adsdk/network/b.class
       [dx] ...while processing com/solo/adsdk/network/b.class
       [dx]
       [dx] trouble processing:
       [dx] bad class file magic (cafebabe) or version (0033.0000)
       [dx] ...while parsing com/solo/adsdk/network/AdsLoader.class
       [dx] ...while processing com/solo/adsdk/network/AdsLoader.class
       [dx]
       [dx] trouble processing:
       [dx] bad class file magic (cafebabe) or version (0033.0000)
       [dx] ...while parsing com/solo/adsdk/network/UrlConfig.class
       [dx] ...while processing com/solo/adsdk/network/UrlConfig.class
```
相比到这里，原因不言则明，原来是jar包的编译版本比工程编译的版本不一致，真实的情况是前后比后者编译版本高。
经过分析，jar包的编译环境是Java 7， 而工程打包的编译环境是Java 6.

##如何解决
解决这个问题也简单，不出如下做法

  * 更换成Java 6编译出来的jar包
  * 使用java 7 打包工程。

##如何得知jar包编译版本
###解压jar包
```java
jar fx android-support-v4.jar
```
解压后查看当前目录，会多出一个文件夹，这里是名字为android的文件夹。

###查看文件信息
```java
11:52 $ file android/support/v4/net/ConnectivityManagerCompat.class
android/support/v4/net/ConnectivityManagerCompat.class: compiled Java class data, version 49.0 (Java 1.5)
```
###查找版本
上面我们得到了`version 49.0 (Java 1.5)`，有些情况下我们得到的只有`version 49.0`需要查找下面的列表
####版本映射
  * 45.3 = Java 1.1
  * 46 = Java 1.2
  * 47 = Java 1.3
  * 48 = Java 1.4
  * 49 = Java 5
  * 50 = Java 6
  * 51 = Java 7
  * 52 = Java 8

###参考文章
  * [What version of javac built my jar?](http://stackoverflow.com/questions/3313532/what-version-of-javac-built-my-jar)











