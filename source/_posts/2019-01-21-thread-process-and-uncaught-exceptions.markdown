---
layout: post
title: "聊一聊未捕获异常与进程退出的关联"
date: 2019-01-21 19:52
comments: true
categories: Thread JVM Java Process 进程 主线层 子线程  Android 
---

之前的文章[JVM 如何处理未捕获异常](https://droidyue.com/blog/2019/01/06/how-java-handle-uncaught-exceptions/) 我们介绍了JVM如何处理未捕获异常，今天我们研究一个更加有意思的问题，就是在JVM中如果发生了未捕获异常，会导致JVM进程退出么。

关于什么是未捕获异常，我们在之前的文章已经介绍过，这里不再赘述，如欲了解，请阅读[JVM 如何处理未捕获异常](https://droidyue.com/blog/2019/01/06/how-java-handle-uncaught-exceptions/)

<!--more-->

## 辅助方法

### 一个产生未捕获异常的方法
```java
//In Utils.java file
    public static void causeNPE() {
        String s = null;
        s.length();
    }
```

### 线程睡眠方法
```java
//In Utils.java file
    public static void makeThreadSleep(long durationInMillSeconds) {
        try {
            Thread.sleep(durationInMillSeconds);
        } catch (InterruptedException e) {
            System.out.println("makeThreadSleep interrupted");
            e.printStackTrace();
        }
    }
```
使用该方法的目的主要有

  * 让当前线程睡眠，确保其他线程启动完成
  * 让当前线程睡眠，确保当前线程不至于快速结束而销毁

### 打印全部线程信息方法
```java
//In Utils.java file
    public static void dumpAllThreadsInfo() {
        Set<Thread> threadSet = Thread.getAllStackTraces().keySet();
        for(Thread thread: threadSet) {
            System.out.println("dumpAllThreadsInfo thread.name=" + thread.getName()
                    + ";thread.state=" + thread.getState()
                    + ";thread.isAlive=" + thread.isAlive()
                    + ";group=" + thread.getThreadGroup()
            );
        }
    }
```

### 打印辅助测试的时间
```java
//输出结果类似 16:55:55
    public static String getTimeForDebug() {
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
        return sdf.format(new Date());
    }
```


## 验证方法
这里的验证我们按照表现来区分，我们将验证以下场景

  * 在子线程中制造未捕获异常
  * 在主线程中制造未捕获异常

同时上面的场景，在通用的JVM和Android上表现有一些差异，我们也都会进行覆盖研究。

## 子线程中的未捕获异常
我们使用下面的代码，模拟一个在子线程中出现未捕获异常的场景。
```java
    private static void startErrorThread() {
        new Thread(new Runnable(){

            @Override
            public void run() {
                System.out.println("startErrorThread currentThread.name=" + Thread.currentThread().getName()
                + "; happened at " + Utils.getTimeForDebug());
                Utils.causeNPE();
            }
        }).start();
        Utils.makeThreadSleep(10 * 1000);
        System.out.println("Thread main sleepFinished at " + Utils.getTimeForDebug());
        Utils.dumpAllThreadsInfo();
    }
```
我们期待的输出结果是
  
  * 新启动的子线(应该是Thread-0)程因为NPE未捕获而导致线程销毁
  * 主线程不受刚刚异常的影响(进程还存在)，在睡眠10秒后，会打印出所有线程的信息（不包含刚刚崩溃线程Thread-0的信息）

```java 
//异常发生 输出线程名称和发生异常的时间
startErrorThread currentThread.name=Thread-0; happened at 16:59:04
//异常崩溃的信息
Exception in thread "Thread-0" java.lang.NullPointerException
	at Utils.causeNPE(Utils.java:35)
	at Main$3.run(Main.java:115)
	at java.lang.Thread.run(Thread.java:748)
//主线程睡眠结束(对比时间，确定差为10秒)    
Thread main sleepFinished at 16:59:14
//主线程不受影响，继续执行操作
dumpAllThreadsInfo thread.name=Attach Listener;thread.state=RUNNABLE;thread.isAlive=true;group=java.lang.ThreadGroup[name=system,maxpri=10]
dumpAllThreadsInfo thread.name=Reference Handler;thread.state=WAITING;thread.isAlive=true;group=java.lang.ThreadGroup[name=system,maxpri=10]
dumpAllThreadsInfo thread.name=Monitor Ctrl-Break;thread.state=RUNNABLE;thread.isAlive=true;group=java.lang.ThreadGroup[name=main,maxpri=10]
dumpAllThreadsInfo thread.name=Signal Dispatcher;thread.state=RUNNABLE;thread.isAlive=true;group=java.lang.ThreadGroup[name=system,maxpri=10]
dumpAllThreadsInfo thread.name=Finalizer;thread.state=WAITING;thread.isAlive=true;group=java.lang.ThreadGroup[name=system,maxpri=10]
dumpAllThreadsInfo thread.name=main;thread.state=RUNNABLE;thread.isAlive=true;group=java.lang.ThreadGroup[name=main,maxpri=10]
//进程结束
Process finished with exit code 0
```

看起来，子线程发生未捕获的异常不会导致进程的退出（也不会影响其他的线程)。

### Android有点不一样
这个时候可能做Android开发的同学可能会站起来。

**提问**：不对啊，我把你的代码放到Android项目中执行，会出现应用已停止的对话框，然后我的进程怎么就退出了呢,老哥，你的结论不对吧。

**回答**：哈哈，这个问题是一个好问题，想要回答这个问题，就需要了解JVM如何处理未捕获异常的。这也是我们之前文章[JVM 如何处理未捕获异常](https://droidyue.com/blog/2019/01/06/how-java-handle-uncaught-exceptions/)介绍的。

这里简单概括一下就是，当JVM发现异常后

  * 首先尝试检测当前的Thread是否有UncaughtExeptionHandler，并尝试分发出问题的Throwable实例
  * 如果上一步找不到对应的UncaughtExceptionHandler，则分发问题的Throwable实例到其所在的ThreadGroup
  * ThreadGroup优先会将Throwable实例分发给其父ThreadGroup
  * 如果ThreadGroup没有父ThreadGroup，则尝试分发给所有线程默认使用的UncaughtExceptionHandler

所以，我们按照这个流程扒了一下[RuntimeInit.java](https://android.googlesource.com/platform/frameworks/base/+/jb-mr1-release/core/java/com/android/internal/os/RuntimeInit.java) 发现了这样的代码。

```java
    /**
     * Use this to log a message when a thread exits due to an uncaught
     * exception.  The framework catches these for the main threads, so
     * this should only matter for threads created by applications.
     */
    private static class UncaughtHandler implements Thread.UncaughtExceptionHandler {
        public void uncaughtException(Thread t, Throwable e) {
            try {
                // Don't re-enter -- avoid infinite loops if crash-reporting crashes.
                if (mCrashing) return;
                mCrashing = true;
                if (mApplicationObject == null) {
                    Slog.e(TAG, "*** FATAL EXCEPTION IN SYSTEM PROCESS: " + t.getName(), e);
                } else {
                    Slog.e(TAG, "FATAL EXCEPTION: " + t.getName(), e);
                }
                // 展示 应用已停止的 对话框
                // Bring up crash dialog, wait for it to be dismissed
                ActivityManagerNative.getDefault().handleApplicationCrash(
                        mApplicationObject, new ApplicationErrorReport.CrashInfo(e));
            } catch (Throwable t2) {
                try {
                    Slog.e(TAG, "Error reporting crash", t2);
                } catch (Throwable t3) {
                    // Even Slog.e() fails!  Oh well.
                }
            } finally {
            	//杀掉进程
                // Try everything to make sure this process goes away.
                Process.killProcess(Process.myPid());
                System.exit(10);
            }
        }
    }
```
上述代码会执行两个主要的操作

  * 展示一个崩溃的对话框
  * 在finally 部分，杀掉当前的进程

Android系统会在进程启动后，通过下面的代码为所有的线程设置默认的UncaughtExceptionHandler
```java
/* set default handler; this applies to all threads in the VM */
Thread.setDefaultUncaughtExceptionHandler(new UncaughtHandler());
```



同时由于如下原因
  
  * 出问题的线程没有通过`Thread.setUncaughtExceptionHandler`显式设置对应的处理者
  * 线程所在的ThreadGroup实例属于原生的ThreadGroup，而不是用户自定义并重写`uncaughtException`的ThreadGroup子类。

所以出现未捕获的异常，默认就会走到了Android系统默认设置的所有线程共用的处理者。  

### 如果发生在主线程中呢
前面说的都是子线程，那么如果主线程出现未捕获异常，进程应该会退出吧。
```java
    private static void uncaughtExceptionInMainThread() {
        Utils.causeNPE();
    }
```
执行上面的代码，得到进程退出的日志
```java
Exception in thread "main" java.lang.NullPointerException
	at Utils.causeNPE(Utils.java:35)
	at Main.uncaughtExceptionInMainThread(Main.java:28)
	at Main.main(Main.java:14)

Process finished with exit code 1
```

可是当我们执行下面的这份代码（启动另一个线程并休眠20秒），结果却是不一样的
```java
    private static void uncaughtExceptionInMainThreadNotLastUserThread() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                Utils.makeThreadSleep(20 * 1000);
                System.out.println("uncaughtExceptionInMainThreadNotLastUserThread time=" + Utils.getTimeForDebug()
                    + ";thread=" + Thread.currentThread().getName()
                );
                Utils.dumpAllThreadsInfo();
            }
        }).start();
        Utils.makeThreadSleep(5 * 1000);
        System.out.println("uncaughtExceptionInMainThreadNotLastUserThread mainThread time=" + Utils.getTimeForDebug());
        Utils.causeNPE();
    }
```
得到的日志输出是
```java 
uncaughtExceptionInMainThreadNotLastUserThread mainThread time=20:48:09
// 异常发生
Exception in thread "main" java.lang.NullPointerException
	at Utils.causeNPE(Utils.java:35)
	at Main.uncaughtExceptionInMainThreadNotLastUserThread(Main.java:44)
	at Main.main(Main.java:15)
//Thread-0  线程休眠结束	
uncaughtExceptionInMainThreadNotLastUserThread time=20:48:24;thread=Thread-0
// 打印此时的全部线程信息
dumpAllThreadsInfo thread.name=Signal Dispatcher;thread.state=RUNNABLE;thread.isAlive=true;group=java.lang.ThreadGroup[name=system,maxpri=10]
dumpAllThreadsInfo thread.name=DestroyJavaVM;thread.state=RUNNABLE;thread.isAlive=true;group=java.lang.ThreadGroup[name=main,maxpri=10]
dumpAllThreadsInfo thread.name=Thread-0;thread.state=RUNNABLE;thread.isAlive=true;group=java.lang.ThreadGroup[name=main,maxpri=10]
dumpAllThreadsInfo thread.name=Monitor Ctrl-Break;thread.state=RUNNABLE;thread.isAlive=true;group=java.lang.ThreadGroup[name=main,maxpri=10]
dumpAllThreadsInfo thread.name=Reference Handler;thread.state=WAITING;thread.isAlive=true;group=java.lang.ThreadGroup[name=system,maxpri=10]
dumpAllThreadsInfo thread.name=Attach Listener;thread.state=RUNNABLE;thread.isAlive=true;group=java.lang.ThreadGroup[name=system,maxpri=10]
dumpAllThreadsInfo thread.name=Finalizer;thread.state=WAITING;thread.isAlive=true;group=java.lang.ThreadGroup[name=system,maxpri=10]
//进程退出
Process finished with exit code 1
```
进程并没有随着主线程中出现未捕获异常而理解退出，而是等到我们启动的Thread-0结束之后才退出的。

那么这是为什么呢，看过我之前文章[JVM 中的守护线程](https://droidyue.com/blog/2018/12/16/daemon-thread-in-java/)的朋友应该了解

JVM退出通常有两种情况

  * 有效的调用System.exit()
  * 所有的非守护线程退出后，JVM就会自动退出

因此不难得出结论
  
  * 第一段代码中，只有主线程一个非守护线程，主线程销毁，所以进程会结束
  * 第二段代码中，主线程销毁后，还有一个Thread-0(由主线程启动，所以也是一个非守护线程)，JVM会等待其结束后而退出。

## 结论
所以未捕获异常只会导致所属线程销毁，并不会导致JVM退出。这里我还找到一份官方API文档作为佐证。
>Uncaught exceptions are handled in shutdown hooks just as in any other thread, by invoking the uncaughtException method of the thread's ThreadGroup object. The default implementation of this method prints the exception's stack trace to System.err and terminates the thread; it does not cause the virtual machine to exit or halt.

上面的内容来自[Runtime.addShutdownHook](https://docs.oracle.com/javase/7/docs/api/java/lang/Runtime.html#addShutdownHook(java.lang.Thread)

## 参考声明
  * [Will an exception thrown in a Different thread will crash the main thread?](https://stackoverflow.com/questions/40902082/will-an-exception-thrown-in-a-different-thread-will-crash-the-main-thread) 
