---
layout: post
title: "系统剖析Android中的内存泄漏"
date: 2016-11-23 07:13
comments: true
categories: Android
---

作为Android开发人员，我们或多或少都听说过内存泄漏。那么何为内存泄漏，Android中的内存泄漏又是什么样子的呢，本文将简单概括的进行一些总结。

关于内存泄露的定义，我可以理解成这样
>没有用的对象无法回收的现象就是内存泄露

<!--more-->

如果程序发生了内存泄露，则会带来如下的问题

  * 应用可用的内存减少，增加了堆内存的压力
  * 降低了应用的性能，比如会触犯更频繁的GC
  * 严重的时候可能会导致内存溢出错误，即OOM Error

在正式介绍内存泄露之前，我们有必要介绍一些必要的预备知识。

## 预备知识1： Java中的对象

  * 当我们使用`new`指令生成对象时，堆内存将会为此开辟一份空间存放该对象
  * 创建的对象可以被局部变量，实例变量和类变量引用。
  * 通常情况下，类变量持有的对象生命周期最长，实例变量次之，局部变量最短。
  * 垃圾回收器回收非存活的对象，并释放对应的内存空间。

## 预备知识2：Java中的GC

  * 和C++不同，对象的释放不需要手动完成，而是由垃圾回收器自动完成。
  * 垃圾回收器运行在JVM中
  * 通常GC有两种算法：引用计数和GC根节点遍历

### 引用计数
  * 每个对象有对应的引用计数器
  * 当一个对象被引用（被复制给变量，传入方法中）,引用计数器加1
  * 当一个对象不被引用（离开变量作用域），引用计数器就会减1
  * 基于这种算法的垃圾回收器效率较高
  * 循环引用的问题引用计数算法的垃圾回收器无法解决。
  * 主流的JVM很少使用基于这种算法的垃圾回收器实现。

### GC根节点遍历
  * 识别对象为垃圾从被称为GC 根节点出发
  * 每一个被遍历的强引用可到达对象，都会被标记为存活
  * 在遍历结束后，没有被标记为存活的对象都被视为垃圾，需要后续进行回收处理
  * 主流的JVM一般都采用这种算法的垃圾回收器实现

![http://7xuvjz.com1.z0.glb.clouddn.com/how_gc_works.png](http://7xuvjz.com1.z0.glb.clouddn.com/how_gc_works.png)

以上图为例，我们可以知道


  * 最下层的两个节点为GC Roots，即GC Tracing的起点
  * 中间的一层的对象，可以强引用到达GC根节点，所以被标记为存活
  * 最上层的三个对象，无法强引用达到GC根节点，所以无法标记为存活，也就是所谓的垃圾，需要被后续回收掉。


上面的垃圾回收中，我们提到的两个概念，一个是GC根节点，另一个是强引用

**在Java中，可以作为GC 根节点的有**

  * 类，由系统类加载器加载的类。这些类从不会被卸载，它们可以通过静态属性的方式持有对象的引用。注意，一般情况下由自定义的类加载器加载的类不能成为GC Roots
  * 线程，存活的线程
  * Java方法栈中的局部变量或者参数
  * JNI方法栈中的局部变量或者参数
  * JNI全局引用
  * 用做同步监控的对象
  * 被JVM持有的对象，这些对象由于特殊的目的不被GC回收。这些对象可能是系统的类加载器，一些重要的异常处理类，一些为处理异常预留的对象，以及一些正在执行类加载的自定义的类加载器。但是具体有哪些前面提到的对象依赖于具体的JVM实现。


提到强引用，有必要系统说一下Java中的引用类型。Java中的引用类型可以分为一下四种：

  * 强引用： 默认的引用类型，例如`StringBuffer buffer = new StringBuffer();`就是buffer变量持有的为StringBuilder的强引用类型。
  * 软引用：即SoftReference，其指向的对象只有在内存不足的时候进行回收。
  * 弱引用：即WeakReference,其指向的对象在GC执行时会被回收。
  * 虚引用：即PhantomReference,与ReferenceQueue结合，用作记录该引用指向的对象已被销毁。

补充了预备知识，我们就需要具体讲一讲Android中的内存泄漏了。

## Android中的内存泄漏

归纳而言，Android中的内存泄漏有以下几个特点：

  * 相对而言，Android中的内存泄漏更加容易出现。
  * 由于Android系统为每个App分配的内存空间有限，在一个内存泄漏严重的App中，很容易导致OOM，即内存溢出错误。
  * 内存泄漏会随着App的推出而消失（即进程结束）。


在Android中的内存泄漏场景有很多，按照类型划分可以归纳为

  * 长期持有(Activity)Context导致的
  * 忘记注销监听器或者观察者
  * 由非静态内部类导致的

此外，如果按照泄漏的程度，可以分为

  * 长时间泄漏，即泄漏只能等待进程退出才消失
  * 短时间泄漏，被泄漏的对象后续会被回收掉。


###  长时间持有Activity实例
在Android中，Activity是我们常用的组件，通常情况下，一个Activity会包含了一些复杂的UI视图，而视图中如果含有ImageView，则有可能会使用比较大的Bitmap对象。因而一个Activity持有的内存会相对很多，如果造成了Activity的泄漏，势必造成一大块内存无法回收，发生泄漏。

这里举个简单的例子，说明Activity的内存泄漏，比如我们有一个叫做AppSettings的类，它是一个单例模式的应用。
```java
public class AppSettings {    
    private Context mAppContext;
    private static AppSettings sInstance = new AppSettings();

    //some other codes
    public static AppSettings getInstance() {
      return sInstance;
    }

    public final void setup(Context context) {
        mAppContext = context;
    }
}
```

当我们传入Activity作为Context参数时，则AppSettings实例会持有这个Activity的实例。

当我们旋转设备时，Android系统会销毁当前的Activity，创建新的Activity来加载合适的布局。如果出现Activity被单例实例持有，那么旋转过程中的旧Activity无法被销毁掉。就发生了我们所说的内存泄漏。

想要解决这个问题也不难，那就是使用Application的Context对象，因为它和AppSettings实例具有相同的生命周期。这里是通过使用`Context.getApplicationContext()`方法来实现。所以修改如下
```java
public class AppSettings {    
    private Context mAppContext;
    private static AppSettings sInstance = new AppSettings();

    //some other codes
    public static AppSettings getInstance() {
      return sInstance;
    }
  
    public final void setup(Context context) {
        mAppContext = context.getApplicationContext();
    }
}
```


### 忘记反注册监听器
在Android中我们会使用很多listener，observer。这些都是作为观察者模式的实现。当我们注册一个listener时，这个listener的实例会被主题所引用。如果主题的生命周期要明显大于listener，那么就有可能发生内存泄漏。

以下面的代码为例
```java
public class MainActivity extends AppCompatActivity implements OnNetworkChangedListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        NetworkManager.getInstance().registerListener(this);
    }

    @Override
    public void onNetworkUp() {

    }

    @Override
    public void onNetworkDown() {

    }
}
```

上述代码处理的业务，可以理解为

  * AppCompatActivity实现了OnNetworkChangedListener接口，用来监听网络的可用性变化
  * NetworkManager为单例模式实现，其registerListener接收了MainActivity实例

又是单例模式，可知NetworkManager会持有MainActivity的实例引用，因而屏幕旋转时，MainActivity同样无法被回收，进而造成了内存泄漏。

对于这种类型的内存泄漏，解决方法是这样的。即在MainActivity的onDestroy方法中加入反注销的方法调用。
```java
public class MainActivity extends AppCompatActivity implements OnNetworkChangedListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        NetworkManager.getInstance().registerListener(this);
    }

    @Override
    public void onNetworkUp() {

    }

    @Override
    public void onNetworkDown() {

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        NetworkManager.getInstance().unregisterListener(this);
    }

}
```

### 非静态内部类导致的内存泄漏
在Java中，非静态内部类会隐式持有外部类的实例引用。想要了解更多，可以参考这篇文章[细话Java："失效"的private修饰符](http://droidyue.com/blog/2014/10/02/the-private-modifier-in-java/)

通常情况下，我们会书写类似这样的代码
```java
public class SensorListenerActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        SensorManager sensorManager = (SensorManager) getApplicationContext().getSystemService(Context.SENSOR_SERVICE);
        sensorManager.registerListener(new SensorListener() {
            @Override
            public void onSensorChanged(int sensor, float[] values) {

            }

            @Override
            public void onAccuracyChanged(int sensor, int accuracy) {

            }
        }, SensorManager.SENSOR_ALL);
    }
}
```
其中上面的SensorListner实例是一个匿名内部类的实例，也是非静态内部类的一种。因此SensorListner也会持有外部SensorListenerActivity的实例引用。

而SensorManager作为单例模式实现，其生命周期与Application相同，和SensorListner对象生命周期不同，有可能间接导致SensorListenerActivity发生内存泄漏。

解决这种问题的方法可以是

  * 使用实例变量存储SensonListener实例，在Activity的onDestroy方法进行反注册。
  * 如果registerListener方法可以修改，可以使用弱引用或者WeakHashMap来解决。


除了上面的三种场景外，Android的内存泄漏还有可能出现在以下情况

  * 使用`Activity.getSystemService()`使用不当，也会导致内存泄漏。
  * 资源未关闭也会造成内存泄漏
  * Handler使用不当也可以造成内存泄漏的发生
  * 延迟的任务也可能导致内存泄漏

## 解决内存泄漏
想要解决内存泄漏无非如下两种方法

  * 手动解除不必要的强引用关系
  * 使用弱引用或者软引用替换强引用关系

下面会简单介绍一些内存泄漏检测和解决的工具
### Strictmode
  * StrictMode,严格模式，是Android中的一种检测VM和线程违例的工具。
  * 使用`detectAll()`或者`detectActivityLeaks()`可以检测Activity的内存泄漏
  * 使用`setClassInstanceLimit()`可以限定类的实例个数，可以辅助判断某些类是否发生了内存泄漏
  * 但是StrictMode只能检测出现象，并不能提供更多具体的信息。
  * 了解更多关于StrictMode，请访问[Android性能调优利器StrictMode](http://droidyue.com/blog/2015/09/26/android-tuning-tool-strictmode/)

### Android Memory Monitors
Android Memory Monitor内置于Android Studio中，用于展示应用内存的使用和释放情况。它大致长成这个样子

![http://7xuvjz.com1.z0.glb.clouddn.com/heap_monitor.gif](http://7xuvjz.com1.z0.glb.clouddn.com/heap_monitor.gif)

当你的App占用的内存持续增加，而且你同时出发GC，也没有进行释放，那么你的App很有可能发生了内存泄漏问题。

### LeakCanary

  * LeakCanary是一个检测Java和Android内存泄漏的库
  * 由Square公司开发
  * 集成LeakCanary之后，只需要等待内存泄漏出现就可以了，无需认为进行主动检测。
  * 关于如何使用LeakCanary，可以参考这篇文章 [Android内存泄漏检测利器：LeakCanary](http://droidyue.com/blog/2016/03/28/android-leakcanary/)

### Heap Dump
  * 一个Heap dump就是某一时间点的内存快照
  * 它包含了某个时间点的Java对象和类信息。
  * 我们可以通上述提到的Android Heap Monitor进行Heap Dump，当然LeakCanary也会生成Heap Dump文件。
  * 生成的Heap Dump文件扩展名为.hprof  即Heap Profile.
  * 通常情况下，一个heap profile需要转换后才能被MAT使用分析。

### Shallow Heap VS Retained Heap
  * Shallow Heap 指的是对象自身的占用的内存大小。
  * 对象x的Retained Set指的是如果对象x被GC移除，可以释放总的对象的集合。
  * 对象x的Retained Heap指的就是上述x的Retained Set的占用内存大小。

![http://7jpolu.com1.z0.glb.clouddn.com/shallow_heap_retained_heap.png](http://7jpolu.com1.z0.glb.clouddn.com/shallow_heap_retained_heap.png)

以上图做个例子，进行分析

  * A,B,C,D四个对象的Shallow Heap均为1M
  * B,C,D的Retained Heap均为1M
  * A的Retained Heap为4M

### 真实情况下如何计算泄漏内存大小
上述的Retained Heap的大小获取是基于假设的，而现实在进行分析中不可能基于这种方法，那么实际上计算泄漏内存的大小的方法其实是这样的。

这里我们需要一个概念，就是Dominator Tree（统治者树）。

  * 如果对象x统治对象y，那么每条从GC根节点到y对象的路径都会经过x，即x是GC根节点到y的必经之路。
  * 上述情况下，我们可以说x是y的统治者
  * 最近统治者指的是离对象y最近的统治者。

![http://7jpolu.com1.z0.glb.clouddn.com/dominator_tree.png](http://7jpolu.com1.z0.glb.clouddn.com/dominator_tree.png)

上图中

  * A和B都不无法统治C对象，即C对象被A和B的父对象统治
  * H不受F，G，D，E统治，但是受C统治
  * F和D是循环引用，但是按照路径的方向（从根节点到对象），D统治F

### 内存泄漏与OOM
  * OOM全称Out Of Memory Error 内存溢出错误
  * OOM发生在，当我们尝试进行创建对象，但是堆内存无法通过GC释放足够的空间，堆内存也无法在继续增长，从而完成对象创建请求，所以发生了OOM
  * OOM发生很有可能是内存泄漏导致
  * 但是并非所有的OOM都是由内存泄漏引起
  * 内存泄漏也并不一定引起OOM



## 声明
  * 其中第一张图片GC回收图来自Patrick Dubroy在Google IO的演讲Keynote
  * 最后一张Dorminator Tree来自MAT官方网站


## 一些链接
  * [垃圾回收器如何处理循环引用](http://droidyue.com/blog/2015/06/05/how-garbage-collector-handles-circular-references/)
  * [译文：理解Java中的弱引用](http://droidyue.com/blog/2014/10/12/understanding-weakreference-in-java/)
  * [Android中Handler引起的内存泄露](http://droidyue.com/blog/2014/12/28/in-android-handler-classes-should-be-static-or-leaks-might-occur/)
  * [避免Android中Context引起的内存泄露](http://droidyue.com/blog/2015/04/12/avoid-memory-leaks-on-context-in-android/)
  * [Google为何这样设计OnSharedPreferenceChangeListener](http://droidyue.com/blog/2014/11/29/why-onsharedpreferencechangelistener-was-not-called/)
  * [Keynote下载地址](http://droidyue.com/droidcon_2016/)

## 最后的话
内存泄漏在App中很常见，需要我们花时间去解决。

处理内存泄漏问题，不仅要解决掉，更应该善于整理总结，做到后续编码中主动避免。

本文是我在droidcon beijing 2016和 GDG Beijing Devfest所做分享的文章总结版。如有问题，欢迎指出。