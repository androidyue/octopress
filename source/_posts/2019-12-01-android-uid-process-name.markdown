---
layout: post
title: "在 Android 中如何确定 App(Activity) 的启动者"
date: 2019-12-01 21:40
comments: true
categories: Android Linux 
---


最近在帮忙定位一个问题，涉及到某个应用自动启动了，为了确定是谁调用的，使用如下的日志进行查看（注：为了简单考虑，下面的启动者为launcher）

```bash
(pre_release|✔) % adb logcat | grep -E "ActivityManager: START" --color=always
I ActivityManager: START u0 {act=android.intent.action.MAIN 
cat=[android.intent.category.HOME] flg=0x10000000 hwFlg=0x10 
cmp=com.huawei.android.launcher/.unihome.UniHomeLauncher (has extras)} from uid 10070
```
<!--more-->
我们看最后看到这个`from uid 10070`，嗯，基本定位到了是这个uid的应用启动了。


## 确定 uid 10070 是哪个 App
确定uid不能说明问题，我们至少需要确定是哪个应用，我们尝试使用下面的命令过滤进程有关数据
```bash
adb shell ps | grep 10070
没有任何数据输出
```

然而一无所获。

当然前面说了，示例的启动者是launcher，那我们过滤一下launcher

```bash
adb shell ps | grep launcher
u0_a70        2207   620 4979992 156312 0                   0 S com.huawei.android.launcher
```

我们发现了`u0_a70`和`10070`貌似有一些关联（至少都含有70）

于是我们使用下面的命令确定id

```bash
adb shell id u0_a70
uid=10070(u0_a70) gid=10070(u0_a70) groups=10070(u0_a70), context=u:r:shell:s0
```

果然，`u0_a70`和`10070` 是有关联的

## u0_a70 的含义
  * u0  默认的手机第一个用户（可以通过设置里面的多用户新增和切换）
  * a 代表app
  * 70 代表着第70个应用

## 转换公式
简单而言，对应的公式是这样

>
>u0_a70 = "u0_" + "a" + (uid(这里是10070) - FIRST_APPLICATION_UID(固定值10000)) 
>

具体复杂的转换，请参考这段代码
```java
/**
     * Generate a text representation of the uid, breaking out its individual
     * components -- user, app, isolated, etc.
     * @hide
     */
    public static void formatUid(StringBuilder sb, int uid) {
        if (uid < Process.FIRST_APPLICATION_UID) {
            sb.append(uid);
        } else {
            sb.append('u');
            sb.append(getUserId(uid));
            final int appId = getAppId(uid);
            if (isIsolated(appId)) {
                if (appId > Process.FIRST_ISOLATED_UID) {
                    sb.append('i');
                    sb.append(appId - Process.FIRST_ISOLATED_UID);
                } else {
                    sb.append("ai");
                    sb.append(appId - Process.FIRST_APP_ZYGOTE_ISOLATED_UID);
                }
            } else if (appId >= Process.FIRST_APPLICATION_UID) {
                sb.append('a');
                sb.append(appId - Process.FIRST_APPLICATION_UID);
            } else {
                sb.append('s');
                sb.append(appId);
            }
        }
    }
```

部分常量
```java
   /**
     * Defines the start of a range of UIDs (and GIDs), going from this
     * number to {@link #LAST_APPLICATION_UID} that are reserved for assigning
     * to applications.
     */
    public static final int FIRST_APPLICATION_UID = 10000;
    /**
     * Last of application-specific UIDs starting at
     * {@link #FIRST_APPLICATION_UID}.
     */
    public static final int LAST_APPLICATION_UID = 19999;
    /**
     * First uid used for fully isolated sandboxed processes (with no permissions of their own)
     * @hide
     */
    @UnsupportedAppUsage
    @TestApi
    public static final int FIRST_ISOLATED_UID = 99000;
     /**
     * First uid used for fully isolated sandboxed processes spawned from an app zygote
     * @hide
     */
    @TestApi
    public static final int FIRST_APP_ZYGOTE_ISOLATED_UID = 90000;
```

以上。



## References
  * [https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/os/Process.java](https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/os/Process.java)
  * [https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/os/UserHandle.java](https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/os/UserHandle.java)
  * [https://stackoverflow.com/questions/17054996/compare-uid-from-android-packagemanager-to-uid-from-ls-l](https://stackoverflow.com/questions/17054996/compare-uid-from-android-packagemanager-to-uid-from-ls-l)