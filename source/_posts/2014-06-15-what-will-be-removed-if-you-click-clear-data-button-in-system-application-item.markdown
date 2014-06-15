---
layout: post
title: "Android中系统设置中的清除数据究竟会清除哪些数据"
date: 2014-06-15 17:07
comments: true
categories: Android lib files database shared_prefs cache Application Clear Data
---
What will be removed If you click Clear Data Button in the System Application 

今天中的一个story突然提到了系统设置中的清理数据，后来开始思考究竟系统的应用的这个清理功能，究竟会清理那些数据。
于是开始研究，以com.mx.browser为例，思路大概为首先为/data/data/com.mx.browser下的每一个文件夹下建立一个标志文件，这里为1.txt，然后执行清理数据操作，最后对比结果。
首先，进行清楚数据之前的的各个文件夹的情况。
<!-- more -->
```bash
/data/data/com.mx.browser # ls
lib
files
databases
shared_prefs
app_thumbnails
cache
app_webIcons
app_appcache
app_databases
app_geolocation
```

为每个文件夹下创建一个标志（同时验证是否删除文件夹的情况）
```bash
/data/data/com.mx.browser # touch lib/1.txt
/data/data/com.mx.browser # touch files/1.txt
/data/data/com.mx.browser # touch databases/1.txt
/data/data/com.mx.browser # touch shared_prefs/1.txt
/data/data/com.mx.browser # touch app_thumbnails/1.txt
/data/data/com.mx.browser # touch cache/1.txt
/data/data/com.mx.browser # touch app_webIcons/1.txt
/data/data/com.mx.browser # touch app_appcache/1.txt
/data/data/com.mx.browser # touch app_databases/1.txt
/data/data/com.mx.browser # touch app_geolocation/1.txt
```
执行清理数据操作。
查看执行清理数据操作后的结果。
```bash
/data/data/com.mx.browser # ls
lib
/data/data/com.mx.browser #
```

查看lib情况
```bash
/data/data/com.mx.browser # cd lib/
/data/data/com.mx.browser/lib # ls
1.txt
/data/data/com.mx.browser/lib #
```

总上所述，发现系统中的设置，应用中的清理数据，会清理掉除去lib文件夹（含内部文件）的文件及文件夹。
p.s./sdcard/Android/data/这个目录也是和包名相关的，但是系统中的清理数据不会清理掉这个目录中的相关信息。


> Written with [StackEdit](https://stackedit.io/).
