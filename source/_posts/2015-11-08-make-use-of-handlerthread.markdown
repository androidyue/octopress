---
layout: post
title: "详解 Android 中的 HandlerThread"
date: 2015-11-08 22:50
comments: true
categories: Android
---
HandlerThread是Android API提供的一个便捷的类，使用它我们可以快速的创建一个带有Looper的线程，有了Looper这个线程，我们又可以生成Handler，那么HandlerThread是什么，可以做什么呢，有哪些奇技淫巧可以被我们利用呢？
<!--more-->
##实现原理
在介绍原理之前，我们先使用普通的Thread来创建一个Handler，创建的过程大致如下：
```java
Handler mHandler;
private void createManualThreadWithHandler() {
	new Thread() {
    	@Override
        public void run() {
            super.run();
            Looper.prepare();
            mHandler = new Handler(Looper.myLooper());
            Looper.loop();
        }
    }.start();
}
```
实现很简单，在目标线程内如下配置
  
  * 调用Looper.prepare 创建与当前线程绑定的Looper实例
  * 使用上面创建的Looper生成Handler实例
  * 调用Looper.loop()实现消息循环

明白上面的实现步骤，HandlerThread的实现也就简单了，其实现为：
```java
@Override
public void run() {
	mTid = Process.myTid();
    Looper.prepare();
    synchronized (this) {
    	mLooper = Looper.myLooper();
    	notifyAll();
    }
    Process.setThreadPriority(mPriority);
    onLooperPrepared();
    Looper.loop();
    mTid = -1;
}
```
确实很简单，无需赘述。

##Handler原理
要理解Handler的原理，理解如下几个概念即可茅塞顿开。

  * Message 意为消息，发送到Handler进行处理的对象，携带描述信息和任意数据。
  * MessageQueue 意为消息队列，Message的集合。
  * Looper 有着一个很难听的中文名字，消息泵，用来从MessageQueue中抽取Message，发送给Handler进行处理。
  * Handler 处理Looper抽取出来的Message。

##如何使用
HandlerThread使用起来很容易，首先需要进行初始化。
```java
private Handler mHandler;
private LightTaskManager() {
    HandlerThread workerThread = new HandlerThread("LightTaskThread");
    workerThread.start();
    mHandler = new Handler(workerThread.getLooper());
}
```
注意：上面的`workerThread.start();`必须要执行。

至于如何使用HandlerThread来执行任务，主要是调用Handler的API
  
  * 使用post方法提交任务，postAtFrontOfQueue将任务加入到队列前端，postAtTime指定时间提交任务，postDelayed延后提交任务。
  * 使用sendMessage方法可以发送消息，sendMessageAtFrontOfQueue将该消息放入消息队列前端，sendMessageAtTime 指定时间发送消息，sendMessageDelayed延后提交消息。

通过包裹Handler API，我们可以实现如下代码(仅post相关方法):
```java
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

##控制优先级
了解到如何使用之外，关于HandlerThread的使用需要上升一个界别，那就是优化。这里的优化主要是合理调整HandlerThread的优先级。

HandlerThread的默认优先级是`Process.THREAD_PRIORITY_DEFAULT`,具体值为0。线程的优先级的取值范围为-20到19。优先级高的获得的CPU资源更多，反之则越少。-20代表优先级最高，19最低。0位于中间位置，但是作为工作线程的HandlerThread没有必要设置这么高的优先级，因而需要我们降低其优先级。

###可控制的优先级
  * THREAD_PRIORITY_DEFAULT，默认的线程优先级，值为0。
  * THREAD_PRIORITY_LOWEST，最低的线程级别，值为19。
  * THREAD_PRIORITY_BACKGROUND 后台线程建议设置这个优先级，值为10。
  * THREAD_PRIORITY_MORE_FAVORABLE 相对THREAD_PRIORITY_DEFAULT稍微优先，值为-1。
  * THREAD_PRIORITY_LESS_FAVORABLE 相对THREAD_PRIORITY_DEFAULT稍微落后一些，值为1。

以上的这些优先级都是可以在程序中设置的，除此之外还有不可控的优先级均有系统进行自动调整。

###如何修改权限
最通用的就是在run方法中，加入合理的设置优先级代码，比如
```
Runnable run = new Runnable() {
    @Override
    public void run() {
        android.os.Process.setThreadPriority(Process.THREAD_PRIORITY_BACKGROUND);
    }
};
LightTaskManager.getInstance().post(run);
```
上述方法不仅适用于HandlerThread，也可以适用于其他的线程。

除此之外，HandlerThread的构造方法也提供了设置优先级的功能。用法如下：
```java
HandlerThread workerThread = new HandlerThread("LightTaskThread", Process.THREAD_PRIORITY_BACKGROUND);
```

关于设置优先级，系统的AsyncTask已经开始进行了默认设置，将线程的优先级设置成THREAD_PRIORITY_BACKGROUND了。
```java
public AsyncTask() {
    mWorker = new WorkerRunnable<Params, Result>() {
        public Result call() throws Exception {
            mTaskInvoked.set(true);

            Process.setThreadPriority(Process.THREAD_PRIORITY_BACKGROUND);
            //noinspection unchecked
            Result result = doInBackground(mParams);
            Binder.flushPendingCommands();
            return postResult(result);
        }
    };
}
```

关于Android中线程的调度详情，请参考[剖析Android中进程与线程调度之nice]()

##应用场景
我们可以使用HandlerThread处理本地IO读写操作（数据库，文件），因为本地IO操作大多数的耗时属于毫秒级别，对于单线程 + 异步队列的形式 不会产生较大的阻塞。因此在这个HandlerThread中不适合加入网络IO操作。

对于本地IO读取操作，我们可以使用postAtFrontOfQueue方法，快速将读取操作加入队列前端执行，必要时返回给主线程更新UI。示例场景，从数据库中读取数据展现在ListView中。注意读取也是需要花费一定时间，推荐在数据展示之前有必要的用户可感知进度提示。

对于本地IO写操作，根据具体情况，选择post或者postDelayed方法执行。比如SharedPreference commit，或者文件写入操作。



















