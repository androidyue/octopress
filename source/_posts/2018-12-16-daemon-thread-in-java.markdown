---
layout: post
title: "JVM 中的守护线程"
date: 2018-12-16 19:22
comments: true
categories: Java JVM 线程 Thread
---
在之前的[《详解JVM如何处理异常》](https://droidyue.com/blog/2018/10/21/how-jvm-handle-exceptions/)提到了守护线程，当时没有详细解释，所以打算放到今天来解释说明一下JVM守护线程的内容。


## 特点
  * 通常由JVM启动
  * 运行在后台处理任务，比如垃圾回收等
  * 用户启动线程执行结束或者JVM结束时，会等待所有的非守护线程执行结束，但是不会因为守护线程的存在而影响关闭。

<!--more-->

## 判断线程是否为守护线程
判断一个线程是否为守护线程，主要依据如下的内容

```java
/* Whether or not the thread is a daemon thread. */
private boolean     daemon = false;

/**
* Tests if this thread is a daemon thread.
*
* @return  <code>true</code> if this thread is a daemon thread;
*          <code>false</code> otherwise.
* @see     #setDaemon(boolean)
*/
public final boolean isDaemon() {
   return daemon;
}

```

下面我们进行一些简单的代码，验证一些关于守护线程的特性和一些猜测。

## 辅助方法

打印线程信息的方法，输出线程的组，是否为守护线程以及对应的优先级。

```java
private static void dumpAllThreadsInfo() {
   Set<Thread> threadSet = Thread.getAllStackTraces().keySet();
   for(Thread thread: threadSet) {
       System.out.println("dumpAllThreadsInfo thread.name=" + thread.getName()
               + ";group=" + thread.getThreadGroup()
               + ";isDaemon=" + thread.isDaemon()
               + ";priority=" + thread.getPriority());
   }
}

```

线程睡眠的方法
```java
private static void makeThreadSleep(long durationInMillSeconds) {
   try {
       Thread.sleep(durationInMillSeconds);
   } catch (InterruptedException e) {
       e.printStackTrace();
   }

}
```


## 验证普通的(非守护线程)线程会影响进程(JVM)退出
```java
private static void testNormalThread() {
   long startTime = System.currentTimeMillis();
   new Thread("NormalThread") {
       @Override
       public void run() {
           super.run();
           //保持睡眠，确保在执行dumpAllThreadsInfo时，该线程不会因为退出导致dumpAllThreadsInfo无法打印信息。
           makeThreadSleep(10 * 1000);
           System.out.println("startNormalThread normalThread.time cost=" + (System.currentTimeMillis() - startTime));
       }
   }.start();
   //主线程暂定3秒，确保子线程都启动完成
   makeThreadSleep(3 * 1000);
   dumpAllThreadsInfo();
   System.out.println("MainThread.time cost = " + (System.currentTimeMillis() - startTime));
}
```

获取输出日志
```java
dumpAllThreadsInfo thread.name=Signal Dispatcher;group=java.lang.ThreadGroup[name=system,maxpri=10];isDaemon=true;priority=9
dumpAllThreadsInfo thread.name=Attach Listener;group=java.lang.ThreadGroup[name=system,maxpri=10];isDaemon=true;priority=9
dumpAllThreadsInfo thread.name=Monitor Ctrl-Break;group=java.lang.ThreadGroup[name=main,maxpri=10];isDaemon=true;priority=5
dumpAllThreadsInfo thread.name=Reference Handler;group=java.lang.ThreadGroup[name=system,maxpri=10];isDaemon=true;priority=10
dumpAllThreadsInfo thread.name=main;group=java.lang.ThreadGroup[name=main,maxpri=10];isDaemon=false;priority=5
dumpAllThreadsInfo thread.name=NormalThread;group=java.lang.ThreadGroup[name=main,maxpri=10];isDaemon=false;priority=5
dumpAllThreadsInfo thread.name=Finalizer;group=java.lang.ThreadGroup[name=system,maxpri=10];isDaemon=true;priority=8
MainThread.time cost = 3009  
startNormalThread normalThread.time cost=10003 
Process finished with exit code 0   结束进程
```

我们根据上面的日志，我们可以发现

   * `startNormalThread normalThread.time cost=10003`代表着子线程执行结束，先于后面的进程结束执行。
   * `Process finished with exit code 0`  代表 结束进程 


以上日志可以验证进程是在我们启动的子线程结束之后才退出的。



## 验证JVM不等待守护线程就会结束

其实上面的例子也可以验证JVM不等待JVM启动的守护线程(Reference Handler,Signal Dispatcher等)执行结束就退出。

这里我们再次用一段代码验证一下JVM不等待用户启动的守护线程结束就退出的事实。


```java
private static void testDaemonThread() {
   long startTime = System.currentTimeMillis();
   Thread daemonThreadSetByUser = new Thread("daemonThreadSetByUser") {
       @Override
       public void run() {
           makeThreadSleep(10 * 1000);
           super.run();
           System.out.println("daemonThreadSetByUser.time cost=" + (System.currentTimeMillis() - startTime));
       }
   };
   daemonThreadSetByUser.setDaemon(true);
   daemonThreadSetByUser.start();
   //主线程暂定3秒，确保子线程都启动完成
   makeThreadSleep(3 * 1000);
   dumpAllThreadsInfo();
   System.out.println("MainThread.time cost = " + (System.currentTimeMillis() - startTime));
}

```
上面的结果得到的输出日志为

```java
dumpAllThreadsInfo thread.name=Signal Dispatcher;group=java.lang.ThreadGroup[name=system,maxpri=10];isDaemon=true;priority=9
dumpAllThreadsInfo thread.name=Attach Listener;group=java.lang.ThreadGroup[name=system,maxpri=10];isDaemon=true;priority=9
dumpAllThreadsInfo thread.name=Monitor Ctrl-Break;group=java.lang.ThreadGroup[name=main,maxpri=10];isDaemon=true;priority=5
dumpAllThreadsInfo thread.name=Reference Handler;group=java.lang.ThreadGroup[name=system,maxpri=10];isDaemon=true;priority=10
dumpAllThreadsInfo thread.name=main;group=java.lang.ThreadGroup[name=main,maxpri=10];isDaemon=false;priority=5
dumpAllThreadsInfo thread.name=daemonThreadSetByUser;group=java.lang.ThreadGroup[name=main,maxpri=10];isDaemon=true;priority=5
dumpAllThreadsInfo thread.name=Finalizer;group=java.lang.ThreadGroup[name=system,maxpri=10];isDaemon=true;priority=8
MainThread.time cost = 3006

Process finished with exit code 0

```
我们可以看到，上面的日志没有类似daemonThreadSetByUser.time cost=的信息。可以确定JVM没有等待守护线程结束就退出了。

注意：

  * 新的线程是否初始为守护线程，取决于启动该线程的线程是否为守护线程。
  * 守护线程默认启动的线程为守护线程，非守护线程启动的线程默认为非守护线程。
  * 主线程（非守护线程）启用一个守护线程，需要调用Thread.setDaemon来设置启动线程为守护线程。



## 关于Priority与守护线程的关系
有一种传言为守护线程的优先级要低，然而事实是

  * 优先级与是否为守护线程没有必然的联系
  * 新的线程的优先级与创建该线程的线程优先级一致。
  * 但是建议将守护线程的优先级降低一些。

感兴趣的可以自己验证一下（其实上面的代码已经有验证了）
