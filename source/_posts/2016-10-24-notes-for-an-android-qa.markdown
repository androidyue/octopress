---
layout: post
title: "记一场 Android 技术答疑"
date: 2016-10-24 20:35
comments: true
categories: Android
---
之前在Stuq的Android课程中有幸分享了一些关于优化的问题,后期又处理了一些来自网友的问题,这里简单以文字形式做个整理.

<!--more-->

##网络IO应该在哪种形式的线程中执行
  * 首先网络IO一般耗时比较长，有的可能到几十毫秒
  * 由于耗时较长，如果采用单一线程处理，势必导致后续的请求无法快速执行
  * 建议使用线程池来处理达到快速响应和线程的复用。

简单示例：
```java
private void testDoNetworkRequest() {
    int corePoolSize = 5;
    int maxPoolSize = 10;
    //线程数量超过核心线程数之后的超时时间，即超过这个时间还没有新的task，多余的线程则销毁掉。
    long keepAliveTime = 10;
    ThreadPoolExecutor executor = new ThreadPoolExecutor(corePoolSize, maxPoolSize, keepAliveTime, TimeUnit.SECONDS, new LinkedBlockingDeque<Runnable>());
    
    executor.execute(new Runnable() {
        @Override
        public void run() {
            //Do network IO here
        }
    });
}
```

关于线程的文章，请参考

  * [关于Android中工作者线程的思考](http://droidyue.com/blog/2015/12/20/worker-thread-in-android/)
  * [详解 Android 中的 HandlerThread](http://droidyue.com/blog/2015/11/08/make-use-of-handlerthread/)
  * [译文：Android中糟糕的AsyncTask](http://droidyue.com/blog/2014/11/08/bad-smell-of-asynctask-in-android/)
  * [剖析Android中进程与线程调度之nice](http://droidyue.com/blog/2015/09/05/android-process-and-thread-schedule-nice/)
  * [Android进程线程调度之cgroups](http://droidyue.com/blog/2015/09/17/android-process-and-thread-schedule-cgroups/) 

##如何优化字符串拼接
  * 字符串拼接无法避免的创建StringBuilder对象
  * 如果是循环情况下拼接，需要显式在循环外声明一个StringBuilder对象

###不好的代码
```java
public void  implicitUseStringBuilder(String[] values) {
  String result = "";
  for (int i = 0 ; i < values.length; i ++) {
      result += values[i];//create new StringBuilder object every time
  }
  System.out.println(result);
}
```

###改进后的代码
```java
public void explicitUseStringBuider(String[] values) {
  StringBuilder result = new StringBuilder();
  for (int i = 0; i < values.length; i ++) {
      result.append(values[i]);
  }
}
```

关于拼接字符串的文章

  * [Java细节：字符串的拼接](http://droidyue.com/blog/2014/08/30/java-details-string-concatenation/)


##使用Handler到底需不需要使用弱引用，什么时候情况下用
  * 正常境况下的引用都为强引用，其特点是及时内存溢出也不可以被回收
 
```java
ArrayList list = new ArrayList();
```
  * 弱引用则会在垃圾回收时被回收掉，因而弱引用解决内存泄露的一种方法。
```java
ArrayList list = new ArrayList();
WeakReference<ArrayList> listWeakRef = new WeakReference<ArrayList>(list);
ArrayList myList = listWeakRef.get();
```

  * Handler是否需要设置弱引用，取决于它是否可能发生内存泄露

###Handler内存泄露的场景
  * Message的target变量实际是Handler对象
  * Message存放在MessageQueue中
  * MessageQueue通常为Looper持有
  * Looper和可以认为和线程生命周期相同
  * 通常情况下，我们使用匿名内部类的形式创建Handler，而匿名内部类（非静态内部类）会隐式持有外部类的引用。即如下的mHandler会隐式持有Activity的实例引用。
```java
private Handler mHandler = new Handler() {
    @Override
    public void handleMessage(Message msg) {
        super.handleMessage(msg);
    }
};
```
  * 如果有一个延迟很久的消息，可能会导致Activity内存泄露
  * 可以使用弱引用解决内存泄露问题
  * 也可以在Activity onDestory方法中调用`handler.removeCallbacksAndMessages(null);`
  
相关文章

  * [Android中Handler引起的内存泄露](http://droidyue.com/blog/2014/12/28/in-android-handler-classes-should-be-static-or-leaks-might-occur/)
  * [详解 Android 中的 HandlerThread](http://droidyue.com/blog/2015/11/08/make-use-of-handlerthread/)

## 网络数据返回先通知界面还是先更新数据库
  * 通常境况下，可以选择先更新界面再更新数据库
  * 如果数据很重要，建议先更新数据库在通知界面更新


## 业务场景：需要定时后台扫描数据库，上传本地照片至云端，定时任务采用何种模式
  * Handler或者Timer定时一般为秒级别的任务,Timer会启动额外线程，而Handler可以不用。
  * 无论是Handler还是Timer都需要依赖于进程存活
  * 利用Handler实现定时任务的类:[HandlerTimer](https://github.com/androidyue/HandlerTimer/blob/master/app/src/main/java/com/droidyue/handlertimer/HandlerTimer.java)
  * 如果时间较长，则需要使用AlarmManager
  * 另外，我们对于这种业务应该优先考虑是否可以基于事件通知。
  * 如果是加入媒体库的文件，我们可以使用registerContentObserver监听媒体库文件变化。

## static 单例是怎么保证单例的？没太看明白
  * static变量为类所有
  * staitc只初始化一次，即在调用的时候。
  * 如下代码，`STATIC_OBJECT`只在第一次调用时初始化，后续调用则不会再执行初始化
```
public class Example {
    public static Object STATIC_OBJECT = new Object();
}
```
  * 使用static机制创建单例
```java
public class SingleInstance {
    private SingleInstance() {
    }
  
    public static SingleInstance getInstance() {
        return SingleInstanceHolder.sInstance;
    }
  
    private static class SingleInstanceHolder {
        private static SingleInstance sInstance = new SingleInstance();
    }
}
```
关于单例的文章

  * [单例这种设计模式](http://droidyue.com/blog/2015/01/11/looking-into-singleton/)

## 把Activity作为参数传给一个静态方法,会影响这个Activity的正常销毁吗
  * 内存泄露与方法是否是静态与否无关，与内部的方法体实现有关系。
  * 内存泄露可以简单理解成：生命周期长的对象不正确持有了持有了生命周期短的对象，导致生命周期短的对象无法回收。
  * 比如Activity实例被Application对象持有，Activity实例被静态变量持有。

关于Android中内存泄漏的文章

  * [Android中Handler引起的内存泄露](http://droidyue.com/blog/2014/12/28/in-android-handler-classes-should-be-static-or-leaks-might-occur/)
  * [避免Android中Context引起的内存泄露](http://droidyue.com/blog/2015/04/12/avoid-memory-leaks-on-context-in-android/)
  * [Google为何这样设计OnSharedPreferenceChangeListener](http://droidyue.com/blog/2014/11/29/why-onsharedpreferencechangelistener-was-not-called/)
  * [Android内存泄漏检测利器：LeakCanary](http://droidyue.com/blog/2016/03/28/android-leakcanary/)

## Bitmap优化
  * `options.inJustDecodeBounds = true;`可以获取width,height和mimetype等信息，但不会申请内存占用
  * 合理进行缩放，一个高分辨率的图片不仅展示在一个小的imageView中，不仅不会有任何视觉优势，反而还占用了很大的内存
  * 将Bitmap处理移除主线程
  * 使用LruCache或者DiskLruCache缓存Bitmap
  * before 2.3 手动调用recycle()方法

关于Bitmap的文章

  * [Google IO：Android内存管理主题演讲记录](http://droidyue.com/blog/2014/11/02/note-for-google-io-memory-management-for-android-chinese-edition/)

## 多次在生产签名打包后的apk，出现功能不可用的情况，比方说有个社会化分享功能，写代码时都可以正常实现，但签名生成apk后该功能无法再使用了，点击分享面板的平台，没有任何响应。请问是怎么回事，这种问题解决应该从哪几个方面入手，希望有一些思路可供参考
  * 应该是混淆引起的
  * 混淆是将易读性较好的变量，方法和类名替换成可读性较差的名称
  * 混淆的目的是为了加大逆向的成本，但不能避免
  * 通常混淆的处理是将某些库不加入混淆
  * 第三方的库不建议混淆
  
### 一些需要排除混淆的
  * 被native方法调用的java方法
  * 供javascript调用的java方法
  * 反射调用的方法
  * AndroidManifest中声明的组件
  * 总结：即所有硬编码的元素（变量，方法，类）

关于混淆,请参考文章[读懂 Android 中的代码混淆](http://droidyue.com/blog/2016/07/10/understanding-android-obfuscated-code-by-proguard/)
    