---
layout: post
title: "剖析Android中进程与线程调度之nice"
date: 2015-09-05 11:35
comments: true
categories: Android
---
在计算机操作系统中，进程是进行资源分配和调度的基本单位，同时每个进程之内也可以存在多个线程。那么在Android系统（Linux Kernel）中，进程是如何去抢占资源，线程又是如何根据优先级切换呢，本文将尝试剖析这个问题，研究nice在Linux以及Android系统中的应用。
<!--more-->
##一些概念
  * 进程 是计算机系统中，程序运行的实体，也是线程的容器。
  * 线程 是进程中实际执行单位，一个线程是程序执行流的最小单元。在一个进程中可以有多个线程存在。


##nice与进程调度
Linux中，使用nice value（以下成为nice值）来设定一个进程的优先级，系统任务调度器根据nice值合理安排调度。

  * nice的取值范围为-20到19。
  * 通常情况下，nice的默认值为0。视具体操作系统而定。
  * nice的值越大，进程的优先级就越低，获得CPU调用的机会越少，nice值越小，进程的优先级则越高，获得CPU调用的机会越多。
  * 一个nice值为-20的进程优先级最高，nice值为19的进程优先级最低。
  * 父进程fork出来的子进程nice值与父进程相同。父进程renice，子进程nice值不会随之改变。

###词源考究
nice这个命令的来源几乎没有资料提到，于是便尝试自己来推断一下。在诸如词霸，沪江等词典给出的意思均为`好的；美好的；可爱的；好心的，友好的`。而有道词典则稍微给出了一个其他词典没有的`和蔼的`。个人认为有道给出的这个比较合理。要想做到和蔼，就需要做到谦让，因此或多或少牺牲自己一点，成全他人。所以nice值越高，越和蔼，但是自己的优先级也会越低。

###renice
对于一个新的进程我们可以按照下面的代码为一个进程设定nice值。
```bash
nice -n 10 adb logcat
```
对于已经创建的进程，我们可以使用renice来修改nice值
```
sudo renice -n 0 -p 24161
```
该命令需要使用root权限，-p对应的值为进程id。

注意renice命令在Linux发行版中-n 的值应该为进程的目标优先级。而Mac下-n，则是代表对当前权限的增加值。
比如在Mac下，讲一个进程的nice值由19改成10，可以这样操作`sudo renice -n -9  -p 24161`,这一点需要注意，避免掉进坑里。


###Android中的nice
由于Android基于Linux Kernel，在Android中也存在nice值。但是一般情况下我们无法控制，原因如下：

  * Android系统并不像其他Linux发行版那样便捷地使用nice命令操作。
  * renice需要root权限，一般应用无法实现。


##线程调度
虽然对于进程的优先级，我们无法控制，但是我们可以控制进程中的线程的优先级。在Android中有两种线程的优先级，一种为Android API版本，另一种是 Java 原生版本。

###Android API
Android中的线程优先级别目前规定了如下，了解了进程优先级与nice值的关系，那么线程优先级与值之间的关系也就更加容易理解。

  * THREAD_PRIORITY_DEFAULT，默认的线程优先级，值为0。
  * THREAD_PRIORITY_LOWEST，最低的线程级别，值为19。
  * THREAD_PRIORITY_BACKGROUND 后台线程建议设置这个优先级，值为10。
  * THREAD_PRIORITY_FOREGROUND 用户正在交互的UI线程，代码中无法设置该优先级，系统会按照情况调整到该优先级，值为-2。
  * THREAD_PRIORITY_DISPLAY 也是与UI交互相关的优先级界别，但是要比THREAD_PRIORITY_FOREGROUND优先，代码中无法设置，由系统按照情况调整，值为-4。
  * THREAD_PRIORITY_URGENT_DISPLAY 显示线程的最高级别，用来处理绘制画面和检索输入事件，代码中无法设置成该优先级。值为-8。
  * THREAD_PRIORITY_AUDIO 声音线程的标准级别，代码中无法设置为该优先级，值为 -16。
  * THREAD_PRIORITY_URGENT_AUDIO 声音线程的最高级别，优先程度较THREAD_PRIORITY_AUDIO要高。代码中无法设置为该优先级。值为-19。
  * THREAD_PRIORITY_MORE_FAVORABLE 相对THREAD_PRIORITY_DEFAULT稍微优先，值为-1。
  * THREAD_PRIORITY_LESS_FAVORABLE 相对THREAD_PRIORITY_DEFAULT稍微落后一些，值为1。

使用Android API为线程设置优先级也很简单，只需要在线程执行时调用android.os.Process.setThreadPriority方法即可。这种在线程运行时进行修改优先级，效果类似renice。
```
new Thread () {
    @Override
    public void run() {
    	super.run();
        android.os.Process.setThreadPriority(Process.THREAD_PRIORITY_BACKGROUND);
    }
}.start();
```

###Java原生API
Java为Thread提供了三个级别的设置，

  * MAX_PRIORITY，相当于android.os.Process.THREAD_PRIORITY_URGENT_DISPLAY，值为10。
  * MIN_PRIORITY，相当于android.os.Process.THREAD_PRIORITY_LOWEST，值为0。
  * NORM_PRIORITY，相当于android.os.Process.THREAD_PRIORITY_DEFAULT，值为5。

使用setPriority我们可以为某个线程设置优先级，使用getPriority可以获得某个线程的优先级。

在Android系统中，不建议使用Java原生的API，因为Android提供的API划分的级别更多，更适合在Android系统中进行设定细致的优先级。


##注意
Android API的线程优先级和Java原生API的优先级是相对独立的，比如使用android.os.Process.setThreadPriority(Process.THREAD_PRIORITY_BACKGROUND)后，使用Java原生API,Thread.getPriority()得到的值不会改变。如下面代码：
```
new Thread() {
    @Override
    public void run() {
        super.run();
        Log.i(LOGTAG, "Java Thread Priority Before=" + Thread.currentThread().getPriority());
        Process.setThreadPriority(Process.THREAD_PRIORITY_LOWEST);
        Log.i(LOGTAG, "Java Thread Priority=" + Thread.currentThread().getPriority());
    }
}.start();
```
上述代码的运行日志为
```
I/MainActivity( 3679): Java Thread Priority Before=5
I/MainActivity( 3679): Java Thread Priority=5
```

由于上面的这一点缺陷，导致我们在分析ANR trace时需要注意，在下面的ANR日志信息中，`prio=5`中proi的值对应的Java原生API的线程优先级。而`nice=-6`中的nice表示的Android API版本的线程优先级。

```
"main" prio=5 tid=1 NATIVE
  | group="main" sCount=1 dsCount=0 obj=0x41690f18 self=0x4167e650
  | sysTid=1765 nice=-6 sched=0/0 cgrp=apps handle=1074196888
  | state=S schedstat=( 0 0 0 ) utm=5764 stm=3654 core=2
  #00  pc 00022624  /system/lib/libc.so (__futex_syscall3+8)
  #01  pc 0000f054  /system/lib/libc.so (__pthread_cond_timedwait_relative+48)
  #02  pc 0000f0b4  /system/lib/libc.so (__pthread_cond_timedwait+64)
```

##避免ANR
我在之前的文章[说说Android中的ANR](http://droidyue.com/blog/2015/07/18/anr-in-android/)中提到使用WorkerThread处理耗时IO操作，同时将WorkerThread的优先级降低，对于耗时IO操作，比如读取数据库，文件等，我们可以设置该workerThread优先级为THREAD_PRIORITY_BACKGROUND，以此降低与主线程竞争的能力。
