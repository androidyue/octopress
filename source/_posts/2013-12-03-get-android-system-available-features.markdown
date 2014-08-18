---
layout: post
title: "Get Android System Available Features"
date: 2013-12-03 17:20
comments: true
categories: Android feature GooglePlay use-feature
---
An easy way to get system available features. 

```java
private void dumpSystemFeatures() {

    FeatureInfo[] features = this.getPackageManager().getSystemAvailableFeatures();
        for (FeatureInfo f : features) {
            Log.i(LOGTAG, "dumpSystemFeatures f" + f);
        }
}
```
Have a glance at the result  
```
I/MainActivity(13514): dumpSystemFeatures fFeatureInfo{40d74fd0 android.hardware.wifi fl=0x0}
I/MainActivity(13514): dumpSystemFeatures fFeatureInfo{40d75048 android.hardware.location.network fl=0x0}
I/MainActivity(13514): dumpSystemFeatures fFeatureInfo{40d750d8 android.hardware.nfc fl=0x0}
I/MainActivity(13514): dumpSystemFeatures fFeatureInfo{40d75150 com.google.android.feature.GOOGLE_BUILD fl=0x0}
I/MainActivity(13514): dumpSystemFeatures fFeatureInfo{40d751f0 android.hardware.location fl=0x0}
I/MainActivity(13514): dumpSystemFeatures fFeatureInfo{40d75270 android.hardware.sensor.gyroscope fl=0x0}
I/MainActivity(13514): dumpSystemFeatures fFeatureInfo{40d75300 android.hardware.screen.landscape fl=0x0}
I/MainActivity(13514): dumpSystemFeatures fFeatureInfo{40d75390 android.hardware.screen.portrait fl=0x0}
I/MainActivity(13514): dumpSystemFeatures fFeatureInfo{40d75420 android.hardware.wifi.direct fl=0x0}
I/MainActivity(13514): dumpSystemFeatures fFeatureInfo{40d754a8 android.hardware.usb.accessory fl=0x0}
I/MainActivity(13514): dumpSystemFeatures fFeatureInfo{40d75530 android.hardware.bluetooth fl=0x0}
I/MainActivity(13514): dumpSystemFeatures fFeatureInfo{40d755b0 android.hardware.touchscreen.multitouch.distinct fl=0x0}
I/MainActivity(13514): dumpSystemFeatures fFeatureInfo{40d75660 android.hardware.microphone fl=0x0}
I/MainActivity(13514): dumpSystemFeatures fFeatureInfo{40d756e8 android.hardware.sensor.light fl=0x0}
I/MainActivity(13514): dumpSystemFeatures fFeatureInfo{40d75770 android.hardware.camera.autofocus fl=0x0}
I/MainActivity(13514): dumpSystemFeatures fFeatureInfo{40d75800 android.software.live_wallpaper fl=0x0}
I/MainActivity(13514): dumpSystemFeatures fFeatureInfo{40d75890 android.hardware.camera.flash fl=0x0}
I/MainActivity(13514): dumpSystemFeatures fFeatureInfo{40d75918 android.hardware.telephony fl=0x0}
I/MainActivity(13514): dumpSystemFeatures fFeatureInfo{40d75998 android.software.sip fl=0x0}
......
```

##The Other way
You can also use `adb shell` to get into the shell of your device and the use  `pm list features`  to get the available features of a device.
```
root@android:/ # pm list features
feature:reqGlEsVersion=0x20000
feature:android.hardware.bluetooth
feature:android.hardware.camera
feature:android.hardware.camera.autofocus
feature:android.hardware.camera.flash
feature:android.hardware.camera.front
feature:android.hardware.faketouch
feature:android.hardware.location
feature:android.hardware.location.gps
feature:android.hardware.location.network
feature:android.hardware.microphone
feature:android.hardware.nfc
feature:android.hardware.screen.landscape
feature:android.hardware.screen.portrait
feature:android.hardware.sensor.accelerometer
feature:android.hardware.sensor.compass
feature:android.hardware.sensor.gyroscope
feature:android.hardware.sensor.light
feature:android.hardware.sensor.proximity
feature:android.hardware.telephony
feature:android.hardware.telephony.gsm
feature:android.hardware.touchscreen
feature:android.hardware.touchscreen.multitouch
feature:android.hardware.touchscreen.multitouch.distinct
feature:android.hardware.touchscreen.multitouch.jazzhand
feature:android.hardware.usb.accessory
feature:android.hardware.usb.host
feature:android.hardware.wifi
feature:android.hardware.wifi.direct
feature:android.software.live_wallpaper
feature:android.software.sip
feature:android.software.sip.voip
feature:com.cisco.anyconnect.permissions.patch.htc
feature:com.htc.android.rosie.widget
feature:com.htc.lockscreen.fusion
feature:com.nxp.mifare
```

For a detailed understanding of use-filter,please read this post [http://developer.android.com/guide/topics/manifest/uses-feature-element.html](http://developer.android.com/guide/topics/manifest/uses-feature-element.html)

###Others
  * <a href="http://www.amazon.com/gp/product/1118183487/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1118183487&linkCode=as2&tag=droidyueblog-20&linkId=K5JVVV33JQSV3IMA">Professional Android Sensor Programming</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=1118183487" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

