---
layout: post
title: "聊一聊Android 6.0的运行时权限"
date: 2016-01-17 20:40
comments: true
categories: Android
---
Android 6.0，代号棉花糖，自发布伊始，其主要的特征运行时权限就很受关注。因为这一特征不仅改善了用户对于应用的使用体验，还使得应用开发者在实践开发中需要做出改变。

没有深入了解运行时权限的开发者通常会有很多疑问，比如什么是运行时权限，哪些是运行时的权限，我的应用是不是会在6.0系统上各种崩溃呢，如何才能支持运行时权限机制呢。本文讲尝试回答这一些问题，希望读者阅读完成之后，都能找到较为完美的答案。
<!--more-->
##权限一刀切
在6.0以前的系统，都是权限一刀切的处理方式，**只要用户安装，Manifest申请的权限都会被赋予，并且安装后权限也撤销不了**。  
这种情况下，当我们从Google Play安装一个应用，在安装之前会得到这样的权限提示信息。

![Permission](http://7jpolu.com1.z0.glb.clouddn.com/pre-marshmallow-permission.jpg)

当上述对话框弹出后，用户只有两种选择：

  * 我信任你，即使有敏感权限
  * 你一个**应用，要这个权限干嘛，我还是不安装了。

所以，这种一刀切的处理方式还是有弊端的，我们没有办法只允许某些权限或者拒绝某些权限。

##棉花糖运行时权限
从棉花糖开始，Android系统引入了新的权限机制，即本文要讲的运行时权限。

何为运行时权限呢？举个栗子，以某个需要拍照的应用为例，当运行时权限生效时，其Camera权限不是在安装后赋予，而是在应用运行的时候进行请求权限（比如当用户按下”相机拍照“按钮后）看到的效果则是这样的

![Requesting Camera Permission](http://7jpolu.com1.z0.glb.clouddn.com/marshmallow-permission.png)

接下来，对于Camera权限的处理完全权交给用户。是不是有点像苹果系统的处理呢，不要说这是抄袭，暂且称为师夷长技以制夷。

##权限的分组
Android中有很多权限，但并非所有的权限都是敏感权限，于是6.0系统就对权限进行了分类，一般为下述几类

  * 正常(Normal Protection)权限
  * 危险(Dangerous)权限
  * 特殊(Particular)权限
  * 其他权限（一般很少用到）

##正常权限
正常权限具有如下的几个特点

  * 对用户隐私没有较大影响或者不会打来安全问题。
  * 安装后就赋予这些权限，**不需要显示提醒用户，用户也不能取消这些权限**。

###正常权限列表
```java
ACCESS_LOCATION_EXTRA_COMMANDS
ACCESS_NETWORK_STATE
ACCESS_NOTIFICATION_POLICY
ACCESS_WIFI_STATE
BLUETOOTH
BLUETOOTH_ADMIN
BROADCAST_STICKY
CHANGE_NETWORK_STATE
CHANGE_WIFI_MULTICAST_STATE
CHANGE_WIFI_STATE
DISABLE_KEYGUARD
EXPAND_STATUS_BAR
GET_PACKAGE_SIZE
INTERNET
KILL_BACKGROUND_PROCESSES
MODIFY_AUDIO_SETTINGS
NFC
READ_SYNC_SETTINGS
READ_SYNC_STATS
RECEIVE_BOOT_COMPLETED
REORDER_TASKS
REQUEST_INSTALL_PACKAGES
SET_TIME_ZONE
SET_WALLPAPER
SET_WALLPAPER_HINTS
TRANSMIT_IR
USE_FINGERPRINT
VIBRATE
WAKE_LOCK
WRITE_SYNC_SETTINGS
SET_ALARM
INSTALL_SHORTCUT
UNINSTALL_SHORTCUT
```
上述的权限基本设计的是关于网络，蓝牙，时区，快捷方式等方面，只要在Manifest指定了这些权限，就会被授予，并且不能撤销。

##特殊权限
这里讲特殊权限提前讲一下，因为这个相对来说简单一些。

特殊权限，顾名思义，就是一些特别敏感的权限，在Android系统中，主要由两个

  * SYSTEM_ALERT_WINDOW，设置悬浮窗，进行一些黑科技
  * WRITE_SETTINGS  修改系统设置

关于上面两个特殊权限的授权，做法是使用`startActivityForResult`启动授权界面来完成。

###请求SYSTEM_ALERT_WINDOW
```java
private static final int REQUEST_CODE = 1;
private  void requestAlertWindowPermission() {
    Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
    intent.setData(Uri.parse("package:" + getPackageName()));
    startActivityForResult(intent, REQUEST_CODE);
}

@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode == REQUEST_CODE) {
        if (Settings.canDrawOverlays(this)) {
        	Log.i(LOGTAG, "onActivityResult granted");
        }
    }
}
```

上述代码需要注意的是

  * 使用Action `Settings.ACTION_MANAGE_OVERLAY_PERMISSION`启动隐式Intent
  * 使用`"package:" + getPackageName()`携带App的包名信息
  * 使用`Settings.canDrawOverlays`方法判断授权结果


###请求WRITE_SETTINGS
```java
private static final int REQUEST_CODE_WRITE_SETTINGS = 2;
private void requestWriteSettings() {
    Intent intent = new Intent(Settings.ACTION_MANAGE_WRITE_SETTINGS);
    intent.setData(Uri.parse("package:" + getPackageName()));
    startActivityForResult(intent, REQUEST_CODE_WRITE_SETTINGS );
}
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode == REQUEST_CODE_WRITE_SETTINGS) {
        if (Settings.System.canWrite(this)) {
            Log.i(LOGTAG, "onActivityResult write settings granted" );
        }
    }
}
```

上述代码需要注意的是

  * 使用Action `Settings.ACTION_MANAGE_WRITE_SETTINGS` 启动隐式Intent
  * 使用`"package:" + getPackageName()`携带App的包名信息
  * 使用`Settings.System.canWrite`方法检测授权结果

注意：关于这两个特殊权限，一般不建议应用申请。

##危险权限
危险权限实际上才是运行时权限主要处理的对象，这些权限可能引起隐私问题或者影响其他程序运行。Android中的危险权限可以归为以下几个分组：

  * CALENDAR
  * CAMERA
  * CONTACTS
  * LOCATION
  * MICROPHONE
  * PHONE
  * SENSORS
  * SMS
  * STORAGE

各个权限分组与其具体的权限，可以参考下图：

![Permission Groups and detailed permissions](http://ww4.sinaimg.cn/large/6a195423jw1ezwpc11cs0j20hr0majwm.jpg)

##必须要支持运行时权限么
目前应用实际上是可以不需要支持运行时权限的，但是最终肯定还是需要支持的，只是时间问题而已。

想要不支持运行时权限机制很简单，只需要将`targetSdkVersion`设置低于23就可以了，意思是告诉系统，我还没有完全在API 23（6.0）上完全搞定，不要给我启动新的特性。

##不支持运行时权限会崩溃么
可能会，但不是那种一上来就噼里啪啦崩溃不断的那种。

如果你的应用将`targetSdkVersion`设置低于23，那么在6.0的系统上不会为这个应用开启运行时权限机制，即按照以前的一刀切方式处理。

###然而有点糟糕的是
6.0系统提供了一个应用权限管理界面，界面长得是这样的

{% img http://ww2.sinaimg.cn/large/6a195423jw1ezwqnmjhcdj20u01hc40k.jpg 300 %}


既然是可以管理，用户就能取消权限，当一个不支持运行时权限的应用某项权限被取消时

{%img http://ww4.sinaimg.cn/large/6a195423jw1ezwqaftmpgj20u01hc77e.jpg 300 %}

系统会弹出一个对话框提醒撤销的危害，如果用户执意撤销，会带来如下的反应

  * 如果你的程序正在运行，则会被杀掉。
  * 当你的应用再次运行时，可能出现崩溃

为什么会可能崩溃的，比如下面这段代码
```
TelephonyManager telephonyManager = (TelephonyManager)getSystemService(Context.TELEPHONY_SERVICE);
String deviceId = telephonyManager.getDeviceId();
if (deviceId.equals(mLastDeviceId)) {//This may cause NPE
  //do something
}
```
如果用户撤消了获取DeviceId的权限，那么再次运行时,deviceId就是null，如果程序后续处理不当，就会出现崩溃。

##该来的还得来
6.0的运行时权限，我们最终都是要支持的，通常我们需要使用如下的API

  * **int checkSelfPermission(String permission)** 用来检测应用是否已经具有权限
  * **void requestPermissions(String[] permissions, int requestCode)**  进行请求单个或多个权限
  * **void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults)** 用户对请求作出响应后的回调

以一个请求Camera权限为例
```java
    @Override
    public void onClick(View v) {
        if (!(checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED)) {
            requestCameraPermission();
        }
    }

    private static final int REQUEST_PERMISSION_CAMERA_CODE = 1;
    private void requestCameraPermission() {
        requestPermissions(new String[]{Manifest.permission.CAMERA}, REQUEST_PERMISSION_CAMERA_CODE);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQUEST_PERMISSION_CAMERA_CODE) {
            int grantResult = grantResults[0];
            boolean granted = grantResult == PackageManager.PERMISSION_GRANTED;
            Log.i(LOGTAG, "onRequestPermissionsResult granted=" + granted);
        }
    }
```

通常情况下，我们会得到这样的一个对话框

{%img http://ww1.sinaimg.cn/large/6a195423jw1ezwtttfjp1j20u01hc0vr.jpg 300 %}


**当用户选择允许，我们就可以在onRequestPermissionsResult方法中进行响应的处理，比如打开摄像头**  
**当用户拒绝，你的应用可能就开始危险了**

当我们再次尝试申请权限时，弹出的对话框和之前有点不一样了，主要表现为多了一个checkbox。如下图

{%img http://ww1.sinaimg.cn/large/6a195423jw1ezwtz1ljjgj20u01hcad8.jpg 300 %}

当用户勾选了”不再询问“拒绝后，你的程序基本这个权限就Game Over了。

不过，你还有一丝希望，那就是再出现上述的对话框之前做一些说明信息，比如你使用这个权限的目的（一定要坦白）。

shouldShowRequestPermissionRationale这个API可以帮我们判断接下来的对话框是否包含”不再询问“选择框。

###一个标准的流程
```java
if (!(checkSelfPermission(Manifest.permission.READ_CONTACTS) == PackageManager.PERMISSION_GRANTED)) {
  if (shouldShowRequestPermissionRationale(Manifest.permission.READ_CONTACTS)) {
      Toast.makeText(this, "Please grant the permission this time", Toast.LENGTH_LONG).show();
    }
    requestReadContactsPermission();
} else {
  Log.i(LOGTAG, "onClick granted");
}
```

###如何批量申请
批量申请权限很简单，只需要字符串数组放置多个权限即可。如请求代码
```java
private static final int REQUEST_CODE = 1;
private void requestMultiplePermissions() {
    String[] permissions = {Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_PHONE_STATE};
    requestPermissions(permissions, REQUEST_CODE);
}
```
对应的界面效果是
![Multiple Requesting Permissions](http://ww2.sinaimg.cn/large/6a195423jw1ezxulzbeu2j20iq0ggt9y.jpg)

注意：间隔较短的多个权限申请建议设置成单次多个权限申请形式，避免弹出多个对话框，造成不太好的视觉效果。

###申请这么多权限岂不是很累
其实你不需要每个权限都去显式申请，举一个例子，如果你的应用授权了读取联系人的权限，那么你的应用也是被赋予了写入联系人的权限。因为读取联系人和写入联系人这两个权限都属于联系人权限分组，所以一旦组内某个权限被允许，该组的其他权限也是被允许的。

##注意事项
###API问题
由于checkSelfPermission和requestPermissions从API 23才加入，低于23版本，需要在运行时判断 或者使用Support Library v4中提供的方法

  * ContextCompat.checkSelfPermission
  * ActivityCompat.requestPermissions
  * ActivityCompat.shouldShowRequestPermissionRationale

###多系统问题
当我们支持了6.0必须也要支持4.4，5.0这些系统，所以需要在很多情况下，需要有两套处理。比如Camera权限
```java
if (isMarshmallow()) {
    requestPermission();//然后在回调中处理
} else {
    useCamera();//低于6.0直接使用Camera
}
```
##两个权限
运行时权限对于应用影响比较大的权限有两个，他们分别是

  * READ_PHONE_STATE 
  * WRITE_EXTERNAL_STORAGE/READ_EXTERNAL_STORAGE

其中READ_PHONE_STATE用来获取deviceID，即IMEI号码。这是很多统计依赖计算设备唯一ID的参考。如果新的权限导致读取不到，避免导致统计的异常。建议在完全支持运行时权限之前，将对应的值写入到App本地数据中，对于新安装的，可以采取其他策略减少对统计的影响。

WRITE_EXTERNAL_STORAGE/READ_EXTERNAL_STORAGE这两个权限和外置存储（即sdcard）有关，对于下载相关的应用这一点还是比较重要的，我们应该尽可能的说明和引导用户授予该权限。


## 些许建议
  * 不要使用多余的权限，新增权限时要慎重
  * 使用Intent来替代某些权限，如拨打电话（和你的产品经理PK去吧）
  * 对于使用权限获取的某些值，比如deviceId，尽量本地存储，下次访问直接使用本地的数据值
  * 注意，由于用户可以撤销某些权限，所以不要使用应用本地的标志位来记录是否获取到某权限。

##注意
即使支持了运行时权限，也要在Manifest声明，因为市场应用会根据这个信息和硬件设备进行匹配，决定你的应用是否在该设备上显示。

##是否支持运行时权限
个人觉得Marshmallow的运行时权限对于用户来说绝对是一个好东西，但是目前想要支持需要做的事情还是比较多的。

对于一个有很多依赖的宿主应用，想要做到支持还是有一些工作量的，因为你的权限申请受制于依赖。

建议在短期内暂时可以不考虑支持该运行时权限机制,等时机成熟或者简单易用的第三方库完善之后再支持也未尝不可。
