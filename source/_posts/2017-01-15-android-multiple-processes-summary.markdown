---
layout: post
title: "关于 Android 应用多进程的整理"
date: 2017-01-15 20:38
comments: true
categories: Android
---

在计算机操作系统中，进程是进行资源分配和调度的基本单位。这对于基于Linux内核的Android系统也不例外。在Android的设计中，一个应用默认有一个(主)进程。但是我们通过配置可以实现一个应用对应多个进程。

本文将试图对于Android中应用多进程做一些整理总结。

<!--more-->

## android:process
  * 应用实现多进程需要依赖于android:process这个属性
  * 适用元素：Application, Activity, BroadcastReceiver, Service, ContentProvider。
  * 通常情况下，这个属性的值应该是":"开头。表示这个进程是应用私有的。无法在在跨应用之间共用。
  * 如果该属性值以小写字母开头，表示这个进程为全局进程。可以被多个应用共用。（文章结尾会探讨这个问题）

一个应用 android:process 简单示例

```xml
<activity android:name=".MusicPlayerActivity" android:process=":music"/>
        
<activity android:name=".AnotherActivity" android:process="droidyue.com"/>
```

## 应用多进程有什么好处

###增加App可用内存
在Android中，默认情况下系统会为每个App分配一定大小的内存。比如从最早的16M到后面的32M或者48M等。具体的内存大小取决于硬件和系统版本。

这些有限的内存对于普通的App还算是够用，但是对于展示大量图片的应用来说，显得实在是捉襟见肘。

仔细研究一下，你会发现原来系统的这个限制是作用于进程的(毕竟进程是作为资源分配的基本单位)。意思就是说，如果一个应用实现多个进程，那么这个应用可以获得更多的内存。

于是，增加App可用内存成了应用多进程的重要原因。

###独立于主进程
除了增加App可用内存之外，确保使用多进程，可以独立于主进程，确保某些任务的执行和完成。

举一个简单的例子，之前的一个项目存在退出的功能，其具体实现为杀掉进程。为了保证某些统计数据上报正常，不受当前进程退出的影响，我们可以使用独立的进程来完成。

## 多进程的不足与缺点

### 数据共享问题
  * 由于处于不同的进程导致了数据无法共享内容，无论是static变量还是单例模式的实现。
  * SharedPreferences 还没有增加对多进程的支持。
  * 跨进程共享数据可以通过Intent,Messenger，AIDL等。

### SQLite容易被锁
  * 由于每个进程可能会使用各自的SQLOpenHelper实例，如果两个进程同时对数据库操作，则会发生SQLiteDatabaseLockedException等异常。
  * 解决方法：可以使用ContentProvider来实现或者使用其他存储方式。

### 不必要的初始化
  * 多进程之后，每个进程在创建的时候，都会执行自己的Application.onCreate方法。
  * 通常情况下，onCreate中包含了我们很多业务相关的初始化，更重要的这其中没有做按照进程按需初始化，即每个进程都会执行全部的初始化。
  * 按需初始化需要根据当前进程名称，进行最小需要的业务初始化。
  * 按需初始化可以选择简单的if else判断，也可以结合工厂模式

一些简单的代码示例

#### 获取当前的进程名
```java
private String getCurrentProcessName() {
    String currentProcName = "";
    int pid = android.os.Process.myPid();
    ActivityManager manager = (ActivityManager) this.getSystemService(Context.ACTIVITY_SERVICE);
    for (ActivityManager.RunningAppProcessInfo processInfo : manager.getRunningAppProcesses()) {
        if (processInfo.pid == pid) {
            currentProcName = processInfo.processName;
            break;
        }
    }
    return currentProcName;
}
```
#### 基本的进程初始化类
这个类用来每个进程共用的业务初始化逻辑。

```java
public class AppInitialization {
    @CallSuper
    public void onAppCreate(Application application) {
        Log.i("AppInitialization", "onAppCreate is being executed.");
    }
}
```

####工厂模式的应用
```java
public class AppInitFactory {
    public static AppInitialization getAppInitialization(String processName) {
        AppInitialization appInitialization;
        if (processName.endsWith(":game")) {
            appInitialization = new GameAppInitialization();
        } else if (processName.endsWith(":music")) {
            appInitialization = new MusicAppInitialization();
        } else {
            appInitialization = new AppInitialization();
        }
        return appInitialization;
    }

    static class GameAppInitialization extends AppInitialization {
        @Override
        public void onAppCreate(Application application) {
            super.onAppCreate(application);
            Log.i("GameAppInitialization", "onAppCreate is being executed.");
        }
    }

    static class MusicAppInitialization extends AppInitialization {
        @Override
        public void onAppCreate(Application application) {
            super.onAppCreate(application);
            Log.i("MusicAppInitialization", "onAppCreate is being executed.");
        }
    }
}
```

#### 具体的调用时的代码
```java
public class MyApplication extends Application{
    private static final String LOGTAG = "MyApplication";

    @Override
    public void onCreate() {
        super.onCreate();
        String currentProcessName = getCurrentProcessName();
        Log.i(LOGTAG, "onCreate currentProcessName=" + currentProcessName);
        AppInitialization appInitialization = AppInitFactory.getAppInitialization(currentProcessName);
        if (appInitialization != null) {
            appInitialization.onAppCreate(this);
        }
    }
}
```

## 是否需要多进程
判断是否需要多进程，需要视具体情况而定。

### 内存限制
  * 研究内存占用居高不下的原因
  * 如果是由内存泄漏导致，尝试解决来降低内存占用
  * 如有必要，可以通过配置[largeHeap](http://droidyue.com/blog/2015/08/01/dive-into-android-large-heap/)尝试解决

除了内存限制之外，还需要考虑是否真的需要独立于主进程来执行某些操作。


##关于android:process的其他问题
在android:process部分我们提到，如果这个属性值以小写字母开头，那么就是全局的进程，可以被其他应用共用。

所谓的共用，指的是不同的App的组件运行在同一个指定的进程中。

###准备条件
受制于Android系统的安全机制，我们需要做到以下两个准备条件才可以。

  * 这个应用使用同样的签名
  * 两个应用指定同一个android:sharedUserId的值

### 具体示例

第一个App的Manifest文件，AnotherActivity运行在名为droidyue.com的进程中。
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          package="com.droidyue.androidmutipleprocesssample"
        android:sharedUserId="droidyue.com"
    >

    <application
            android:name=".MyApplication"
            android:allowBackup="true"
            android:icon="@mipmap/ic_launcher"
            android:label="@string/app_name"
            android:supportsRtl="true"
            android:theme="@style/AppTheme">
        
        <activity android:name=".AnotherActivity" android:process="droidyue.com"/>
    </application>

</manifest>
```

第二个App的Manifest文件，SecondActivity运行在名为droidyue.com的进程中。

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.jishuxiaoheiwu.accessfromanotherprocess"
    android:sharedUserId="droidyue.com"
    >

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        <activity android:name=".SecondActivity"
            android:process="droidyue.com"
            />
    </application>

</manifest>
```

上面的AnotherActivity和SecondActivity会运行在一个名为droidyue.com的进程中，尽管他们位于不同的App中。

但是这种共用进程的方式会引发很多问题，不太建议大家使用。


以上就是我关于Android中多进程的一些浅显的研究，如有问题，欢迎指正。

