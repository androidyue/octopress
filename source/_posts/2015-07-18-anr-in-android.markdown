---
layout: post
title: "说说Android中的ANR"
date: 2015-07-18 17:53
comments: true
categories: Android ANR
---

有过Android开发经历的人都不会对ANR陌生，它和崩溃一样是程序设计的问题。本文将以较为深入的视角来介绍什么是ANR，出现场景，如何避免以及如何定位分析ANR,希望可以帮助大家在编写程序时有所帮助。
<!--more-->
##什么是ANR
ANR全称`Application Not Responding`，意思就是程序未响应。如果一个应用无法响应用户的输入，系统就会弹出一个ANR对话框，如下图所示,用户可以自行选择继续等待亦或者是停止当前程序。

{%img http://7jpolu.com1.z0.glb.clouddn.com/android_anr.png %}

##出现场景
  * 主线程被IO操作（从4.0之后网络IO不允许在主线程中）阻塞。
  * 主线程中存在耗时的计算
  * 主线程中错误的操作，比如Thread.wait或者Thread.sleep等 

Android系统会监控程序的响应状况，一旦出现下面两种情况，则弹出ANR对话框
  
  * 应用在**5秒**内未响应用户的输入事件（如按键或者触摸）
  * BroadcastReceiver未在**10秒**内完成相关的处理

##如何避免
基本的思路就是将IO操作在工作线程来处理，减少其他耗时操作和错误操作

  * 使用[AsyncTask](http://droidyue.com/blog/2014/11/08/bad-smell-of-asynctask-in-android/)处理耗时IO操作。
  * 使用Thread或者HandlerThread时，调用Process.setThreadPriority(Process.THREAD_PRIORITY_BACKGROUND)设置优先级，否则仍然会降低程序响应，因为默认Thread的优先级和主线程相同。
  * 使用[Handler](http://droidyue.com/blog/2014/12/28/in-android-handler-classes-should-be-static-or-leaks-might-occur/)处理工作线程结果，而不是使用Thread.wait()或者Thread.sleep()来阻塞主线程。
  * Activity的onCreate和onResume回调中尽量避免耗时的代码
  * BroadcastReceiver中onReceive代码也要尽量减少耗时，建议使用IntentService处理。

##画龙点睛
通常100到200毫秒就会让人察觉程序反应慢，为了更加提升响应，可以使用下面的几种方法

  * 如果程序正在后台处理用户的输入，建议使用让用户得知进度，比如使用ProgressBar控件。
  * 程序启动时可以选择加上欢迎界面，避免让用户察觉卡顿。
  * 使用Systrace和TraceView找出影响响应的问题。

##如何定位
如果开发机器上出现问题，我们可以通过查看`/data/anr/traces.txt`即可，最新的ANR信息在最开始部分。我们从stacktrace中即可找到出问题的具体行数。本例中问题出现在MainActivity.java 27行，因为这里调用了Thread.sleep方法。
```java
root@htc_m8tl:/ # cat /data/anr/traces.txt | more


----- pid 30307 at 2015-05-30 14:51:14 -----
Cmd line: com.example.androidyue.bitmapdemo

JNI: CheckJNI is off; workarounds are off; pins=0; globals=272

DALVIK THREADS:
(mutexes: tll=0 tsl=0 tscl=0 ghl=0)

"main" prio=5 tid=1 TIMED_WAIT
  | group="main" sCount=1 dsCount=0 obj=0x416eaf18 self=0x416d8650
  | sysTid=30307 nice=0 sched=0/0 cgrp=apps handle=1074565528
  | state=S schedstat=( 0 0 0 ) utm=5 stm=4 core=3
  at java.lang.VMThread.sleep(Native Method)
  at java.lang.Thread.sleep(Thread.java:1044)
  at java.lang.Thread.sleep(Thread.java:1026)
  at com.example.androidyue.bitmapdemo.MainActivity$1.run(MainActivity.java:27)
  at android.app.Activity.runOnUiThread(Activity.java:4794)
  at com.example.androidyue.bitmapdemo.MainActivity.onResume(MainActivity.java:33)
  at android.app.Instrumentation.callActivityOnResume(Instrumentation.java:1282)
  at android.app.Activity.performResume(Activity.java:5405)
```

如果是线上版本引起的，Google Play后台有相关的数据可以帮助查看分析并解决问题。

##细致分析
  **提问**: BroadcastReceiver过了60秒居然没有ANR？ 现场代码如下
```java
public class NetworkReceiver extends BroadcastReceiver{
    private static final String LOGTAG = "NetworkReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.i(LOGTAG, "onReceive intent=" + intent);
        try {
            Thread.sleep(60000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        Log.i(LOGTAG, "onReceive end");
    }
}
``` 
  **回答**：实际上已经发生了ANR，只是没有进行对话框弹出而已。这种ANR就是background ANR，即后台程序的ANR，我们可以通过过滤日志验证

```java
adb logcat | grep "NetworkReceiver|ActivityManager|WindowManager"
I/NetworkReceiver( 4109): onReceive intent=Intent { act=android.net.conn.CONNECTIVITY_CHANGE flg=0x8000010 cmp=com.example.androidyue.bitmapdemo/.NetworkReceiver (has extras) }
I/ActivityManager(  462): No longer want com.android.exchange (pid 1054): empty #17
I/NetworkReceiver( 4109): onReceive end
W/BroadcastQueue(  462): Receiver during timeout: ResolveInfo{5342dde4 com.example.androidyue.bitmapdemo.NetworkReceiver p=0 o=0 m=0x108000}
E/ActivityManager(  462): ANR in com.example.androidyue.bitmapdemo
E/ActivityManager(  462): Reason: Broadcast of Intent { act=android.net.conn.CONNECTIVITY_CHANGE flg=0x8000010 cmp=com.example.androidyue.bitmapdemo/.NetworkReceiver (has extras) }
E/ActivityManager(  462): Load: 0.37 / 0.2 / 0.14
E/ActivityManager(  462): CPU usage from 26047ms to 0ms ago:
E/ActivityManager(  462):   0.4% 58/adbd: 0% user + 0.4% kernel / faults: 1501 minor
E/ActivityManager(  462):   0.3% 462/system_server: 0.1% user + 0.1% kernel
E/ActivityManager(  462):   0% 4109/com.example.androidyue.bitmapdemo: 0% user + 0% kernel / faults: 6 minor
E/ActivityManager(  462): 1.5% TOTAL: 0.5% user + 0.9% kernel + 0% softirq
E/ActivityManager(  462): CPU usage from 87ms to 589ms later:
E/ActivityManager(  462):   1.8% 58/adbd: 0% user + 1.8% kernel / faults: 30 minor
E/ActivityManager(  462):     1.8% 58/adbd: 0% user + 1.8% kernel
E/ActivityManager(  462): 4% TOTAL: 0% user + 4% kernel
W/ActivityManager(  462): Killing ProcessRecord{5326d418 4109:com.example.androidyue.bitmapdemo/u0a10063}: background ANR
I/ActivityManager(  462): Process com.example.androidyue.bitmapdemo (pid 4109) has died.
```
除了日志，我们还可以根据前面提到的查看traces.txt文件。

**提问**:可以更容易了解background ANR么？

**回答**:当然可以，在Android开发者选项-->高级-->显示所有”应用程序无响应“勾选即可对后台ANR也进行弹窗显示，方便查看了解程序运行情况。

##参考文章
  * [Keeping Your App Responsive](http://developer.android.com/intl/zh-cn/training/articles/perf-anr.html)


{%include post/book_copyright.html %}
