---
layout: post
title: "检查Android是否具有摄像头"
date: 2014-06-14 15:57
comments: true
categories: Android Camera 摄像头 后置摄像头  
---
通常我们进行摄像头操作，如扫描二维码需要判断是否有后置摄像头(Rear camera)，比如Nexus 7 一代就没有后置摄像头，这样在尝试使用的时候，我们需要进行判断进行一些提示或者处理。
<!-- more -->
以下代码为一系列的方法，用来判断是否有前置摄像头（Front Camera），后置摄像头。

```java
private static boolean checkCameraFacing(final int facing) {
    if (getSdkVersion() < Build.VERSION_CODES.GINGERBREAD) {
        return false;
    }
    final int cameraCount = Camera.getNumberOfCameras();
    CameraInfo info = new CameraInfo();
    for (int i = 0; i < cameraCount; i++) {
        Camera.getCameraInfo(i, info);
        if (facing == info.facing) {
            return true;
        }
    }
    return false;
}

public static boolean hasBackFacingCamera() {
    final int CAMERA_FACING_BACK = 0;
    return checkCameraFacing(CAMERA_FACING_BACK);
}

public static boolean hasFrontFacingCamera() {
    final int CAMERA_FACING_BACK = 1;
    return checkCameraFacing(CAMERA_FACING_BACK);
}

public static int getSdkVersion() {
    return android.os.Build.VERSION.SDK_INT;
}
```
注意：由于getNumberOfCameras以及getCameraInfo均为API 9 引入，所以方法只适用于2.3及其以上。

延伸阅读：http://developer.android.com/reference/android/hardware/Camera.html
http://developer.android.com/reference/android/hardware/Camera.CameraInfo.html

###Others
  * <a href="http://www.amazon.cn/gp/product/B00HYTROX6/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00HYTROX6&linkCode=as2&tag=droidyue-23">Android开发高手进阶（中国程序员）</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00HYTROX6" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

