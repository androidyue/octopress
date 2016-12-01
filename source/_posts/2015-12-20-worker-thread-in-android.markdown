---
layout: post
title: "关于Android中工作者线程的思考"
date: 2015-12-20 10:47
comments: true
categories: Android WorkerThread
---
##版权说明

本文为 InfoQ 中文站特供稿件，首发地址为：http://www.infoq.com/cn/articles/android-worker-thread 如需转载，请与 InfoQ 中文站联系。


##摘要
在Android开发过程中，我们经常使用工作者线程，如AsyncTask和线程池。然而我们经常使用的这些工作者线程存在哪些不易察觉的问题呢，关于工作者线程有哪些优化呢，文本将逐一介绍并回答这些问题。



本文系2015 北京 GDG Devfest分享内容文章。

在Android中，我们或多或少使用了工作者线程，比如Thread，AsyncTask，HandlerThread，甚至是自己创建的线程池，使用工作者线程我们可以将耗时的操作从主线程中移走。然而在Android系统中为什么存在工作者线程呢，常用的工作者线程有哪些不易察觉的问题呢，关于工作者线程有哪些优化的方面呢，本文将一一解答这些问题。
<!--more-->
##工作者线程的存在原因
  * 因为Android的UI单线程模型，所有的UI相关的操作都需要在主线程(UI线程)执行
  * Android中各大组件的生命周期回调都是位于主线程中，使得主线程的职责更重
  * 如果不使用工作者线程为主线程分担耗时的任务，会造成应用卡顿，严重时可能出现ANR(Application Not Responding),即程序未响应。

因而，在Android中使用工作者线程显得势在必行，如一开始提到那样，在Android中工作者线程有很多，接下来我们将围绕AsyncTask，HandlerThread等深入研究。

##AsyncTask
AsyncTask是Android框架提供给开发者的一个辅助类，使用该类我们可以轻松的处理异步线程与主线程的交互，由于其便捷性，在Android工程中，AsyncTask被广泛使用。然而AsyncTask并非一个完美的方案，使用它往往会存在一些问题。接下来将逐一列举AsyncTask不容易被开发者察觉的问题。

###AsyncTask与内存泄露
内存泄露是Android开发中常见的问题，只要开发者稍有不慎就有可能导致程序产生内存泄露，严重时甚至可能导致OOM(OutOfMemory，即内存溢出错误)。AsyncTask也不例外，也有可能造成内存泄露。

以一个简单的场景为例：
在Activity中，通常我们这样使用AsyncTask
```java
//In Activity
new AsyncTask<String, Void, Void>() {

    @Override
    protected Void doInBackground(String... params) {
        //some code
        return null;
    }
}.execute("hello world");
```
上述代码使用的匿名内存类创建AsyncTask实例，然而在Java中，`非静态内存类会隐式持有外部类的实例引用`，上面例子AsyncTask创建于Activity中，因而会隐式持有Activity的实例引用。

而在AsyncTask内部实现中,mFuture同样使用匿名内部类创建对象，而mFuture会作为执行任务加入到任务执行器中。
```
private final WorkerRunnable<Params, Result> mWorker;
public AsyncTask() {
    mFuture = new FutureTask<Result>(mWorker) {
        @Override
        protected void done() {
            //some code
        }
    };
}
```
而mFuture加入任务执行器，实际上是放入了一个静态成员变量SERIAL_EXECUTOR指向的对象SerialExecutor的一个ArrayDeque类型的集合中。
```java
public static final Executor SERIAL_EXECUTOR = new SerialExecutor();
private static class SerialExecutor implements Executor {
        final ArrayDeque<Runnable> mTasks = new ArrayDeque<Runnable>();

    public synchronized void execute(final Runnable r) {
        mTasks.offer(new Runnable() {
            public void run() {
                //fake code
                r.run();
            }
        });
    }
}
```

当任务处于排队状态，则Activity实例引用被静态常量SERIAL_EXECUTOR 间接持有。

在通常情况下，当设备发生屏幕旋转事件，当前的Activity被销毁，新的Activity被创建，以此完成对布局的重新加载。

而本例中，当屏幕旋转时，处于排队的AsyncTask由于其对Activity实例的引用关系，导致这个Activity不能被销毁，其对应的内存不能被GC回收，因而就出现了内存泄露问题。

关于如何避免内存泄露，我们可以使用静态内部类 + 弱引用的形式解决。

###cancel的问题
AsyncTask作为任务，是支持调用者取消任务的，即允许我们使用AsyncTask.canncel()方法取消提交的任务。然而其实cancel并非真正的起作用。

首先，我们看一下cancel方法：
```java
public final boolean cancel(boolean mayInterruptIfRunning) {
    mCancelled.set(true);
    return mFuture.cancel(mayInterruptIfRunning);
}
```
cancel方法接受一个boolean类型的参数，名称为`mayInterruptIfRunning`，意思是是否可以打断正在执行的任务。

当我们调用cancel(false)，不打断正在执行的任务，对应的结果是

  * 处于doInBackground中的任务不受影响，继续执行
  * 任务结束时不会去调用`onPostExecute`方法，而是执行`onCancelled`方法

当我们调用cancel(true)，表示打断正在执行的任务，会出现如下情况：

  * 如果doInBackground方法处于阻塞状态，如调用Thread.sleep,wait等方法，则会抛出InterruptedException。
  * 对于某些情况下，有可能无法打断正在执行的任务

如下，就是一个cancel方法无法打断正在执行的任务的例子
```
AsyncTask<String,Void,Void> task = new AsyncTask<String, Void, Void>() {

    @Override
    protected Void doInBackground(String... params) {
        boolean loop = true;
        while(loop) {
            Log.i(LOGTAG, "doInBackground after interrupting the loop");
        }
        return null;
    }
}


task.execute("hello world");
try {
    Thread.sleep(2000);//确保AsyncTask任务执行
    task.cancel(true);
} catch (InterruptedException e) {
    e.printStackTrace();
}
```
上面的例子，如果想要使cancel正常工作需要在循环中，需要在循环条件里面同时检测`isCancelled()`才可以。

###串行带来的问题

Android团队关于AsyncTask执行策略进行了多次修改，修改大致如下：

  * 自最初引入到Donut(1.6)之前，任务串行执行
  * 从Donut到GINGERBREAD_MR1(2.3.4),任务被修改成了并行执行
  * 从HONEYCOMB（3.0）至今，任务恢复至串行，但可以设置`executeOnExecutor()`实现并行执行。

然而AsyncTask的串行实际执行起来是这样的逻辑

  * 由串行执行器控制任务的初始分发
  * 并行执行器一次执行单个任务，并启动下一个

在AsyncTask中，并发执行器实际为ThreadPoolExecutor的实例，其CORE_POOL_SIZE为当前设备CPU数量+1，MAXIMUM_POOL_SIZE值为CPU数量的2倍 + 1。

以一个四核手机为例，当我们持续调用AsyncTask任务过程中

  * 在AsyncTask线程数量小于CORE_POOL_SIZE(5个)时，会启动新的线程处理任务，不重用之前空闲的线程
  * 当数量超过CORE_POOL_SIZE(5个)，才开始重用之前的线程处理任务

但是由于AsyncTask属于默认线性执行任务，导致并发执行器总是处于某一个线程工作的状态，因而造成了ThreadPool中其他线程的浪费。同时由于AsyncTask中并不存在allowCoreThreadTimeOut(boolean)的调用，所以ThreadPool中的核心线程即使处于空闲状态也不会销毁掉。

##Executors
Executors是Java API中一个快速创建线程池的工具类，然而在它里面也是存在问题的。

以Executors中获取一个固定大小的线程池方法为例
```java
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,0L, 
        TimeUnit.MILLISECONDS,new LinkedBlockingQueue<Runnable>());
}
```
在上面代码实现中，CORE_POOL_SIZE和MAXIMUM_POOL_SIZE都是同样的值，如果把nThreads当成核心线程数，则无法保证最大并发，而如果当做最大并发线程数，则会造成线程的浪费。因而Executors这样的API导致了我们无法在最大并发数和线程节省上做到平衡。

为了达到最大并发数和线程节省的平衡，建议自行创建ThreadPoolExecutor，根据业务和设备信息确定CORE_POOL_SIZE和MAXIMUM_POOL_SIZE的合理值。

##HandlerThread
HandlerThread是Android中提供特殊的线程类，使用这个类我们可以轻松创建一个带有Looper的线程，同时利用Looper我们可以结合Handler实现任务的控制与调度。以Handler的post方法为例，我们可以封装一个轻量级的任务处理器
```java
private Handler mHandler;
private LightTaskManager() {
    HandlerThread workerThread = new HandlerThread("LightTaskThread");
    workerThread.start();
    mHandler = new Handler(workerThread.getLooper());
}

public void post(Runnable run) {
    mHandler.post(run);
}

public void postAtFrontOfQueue(Runnable runnable) {
    mHandler.postAtFrontOfQueue(runnable);
}

public void postDelayed(Runnable runnable, long delay) {
    mHandler.postDelayed(runnable, delay);
}

public void postAtTime(Runnable runnable, long time) {
    mHandler.postAtTime(runnable, time);
}
```
在本例中，我们可以按照如下规则提交任务

  * post 提交优先级一般的任务
  * postAtFrontOfQueue 将优先级较高的任务加入到队列前端
  * postAtTime 指定时间提交任务
  * postDelayed 延后提交优先级较低的任务


上面的轻量级任务处理器利用HandlerThread的单一线程 + 任务队列的形式，可以处理类似本地IO（文件或数据库读取）的轻量级任务。在具体的处理场景下，可以参考如下做法：

  * 对于本地IO读取，并显示到界面，建议使用postAtFrontOfQueue
  * 对于本地IO写入，不需要通知界面，建议使用postDelayed
  * 一般操作，可以使用post

##线程优先级调整
在Android应用中，将耗时任务放入异步线程是一个不错的选择，那么为异步线程调整应有的优先级则是一件锦上添花的事情。众所周知，线程的并行通过CPU的时间片切换实现，对线程优先级调整，最主要的策略就是降低异步线程的优先级，从而使得主线程获得更多的CPU资源。

Android中的线程优先级和Linux系统进程优先级有些类似，其值都是从-20至19。其中Android中，开发者可以控制的优先级有：

  * `THREAD_PRIORITY_DEFAULT`，默认的线程优先级，值为0
  * `THREAD_PRIORITY_LOWEST`，最低的线程级别，值为19
  * `THREAD_PRIORITY_BACKGROUND` 后台线程建议设置这个优先级，值为10
  * `THREAD_PRIORITY_MORE_FAVORABLE` 相对`THREAD_PRIORITY_DEFAULT`稍微优先，值为-1
  * `THREAD_PRIORITY_LESS_FAVORABLE` 相对`THREAD_PRIORITY_DEFAULT`稍微落后一些，值为1

为线程设置优先级也比较简单，通用的做法是在run方法体的开始部分加入下列代码
```java
android.os.Process.setThreadPriority(priority);
```

通常设置优先级的规则如下：

  * 一般的工作者线程，设置成`THREAD_PRIORITY_BACKGROUND`
  * 对于优先级很低的线程，可以设置`THREAD_PRIORITY_LOWEST`
  * 其他特殊需求，视业务应用具体的优先级

##总结
在Android中工作者线程如此普遍，然而潜在的问题也不可避免，建议在开发者使用工作者线程时，从工作者线程的数量和优先级等方面进行审视，做到较为合理的使用。
