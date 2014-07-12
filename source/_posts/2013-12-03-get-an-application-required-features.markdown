---
layout: post
title: "Get An Application Required Features"
date: 2013-12-03 17:20
comments: true
categories: application Android feature permission GooglePlay
---
How to get application's required features? Actually the **aapt** really does a great help.
```bash
#Usage:aapt dump badging apk_location | grep feature 

#Example
aapt dump badging /tmp/language_check_maxthon_99985f_2793_4.1.3.1000_remote_develop.apk | grep Features

#Result
uses-feature-not-required:'android.hardware.location'
uses-feature-not-required:'android.hardware.location.network'
uses-feature-not-required:'android.hardware.location.gps'
uses-feature-not-required:'android.hardware.screen.portrait'
uses-feature-not-required:'android.hardware.telephony'
uses-feature-not-required:'android.hardware.wifi'
uses-feature:'android.hardware.touchscreen'
uses-implied-feature:'android.hardware.touchscreen','assumed you require a touch screen unless explicitly made optional'
```
To understand the feature more detailed, please visit [http://developer.android.com/guide/topics/manifest/uses-feature-element.html](http://developer.android.com/guide/topics/manifest/uses-feature-element.html)

###Others
  * <a href="http://www.amazon.com/gp/product/1118183487/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1118183487&linkCode=as2&tag=droidyueblog-20&linkId=K5JVVV33JQSV3IMA">Professional Android Sensor Programming</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=1118183487" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

