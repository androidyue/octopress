---
layout: post
title: "AssetManager.finalize() timed out after 10 seconds分析"
date: 2018-07-10 21:44
comments: true
categories: Android 超时 
---

没有代码，就没有bug。程序员在编码时，总会比不避免的出现bug。倒不是因为我们热爱制造bug，创造机会和测试妹子频繁沟通。而是现实情况很复杂，存在着很多不确定性。尤其是那些崩溃从stacktrace上来看，完全想象不到和项目代码之间的直接联系。

<!--more-->

在我们的项目崩溃中，有一个比较常见的bug，就是 java.util.concurrent.TimeoutException android.content.res.AssetManager.finalize() timed out after 10 seconds  意思简单明了，就是说在AssetManager析构的时候发生了超时异常。

是的，道理我都懂，可是AssetManager不是我写的啊，这不是Android Framework的东西么，而且在stacktrace中丝毫看不到我项目代码的堆栈信息。这简直是无从下手。遇到这种情况，我们就需要从崩溃后台手机上的信息去分析产生的原因了

### 原理分析

  * Android在启动后会创建一些守护进程，其中涉及到该问题的有两个，分别是FinalizerDaemon和FinalizerWatchdogDaemon
  * FinalizerDaemon 析构守护线程。对于重写了成员函数finalize的对象，它们被GC决定回收时，并没有马上被回收，而是被放入到一个队列中，等待FinalizerDaemon守护线程去调用它们的成员函数finalize，然后再被回收。
  * FinalizerWatchdogDaemon析构监护守护线程。用来监控FinalizerDaemon线程的执行。一旦检测那些重写了finalize的对象在执行成员函数finalize时超出一定时间，那么就会退出VM。
  * 如果是FinalizerDaemon进行对象析构时间超过了MAX_FINALIZE_NANOS（这里是10s），FinalizerWatchdogDaemon进行就会抛出TimeoutException


出现场景
10s的超时其实是很大的一个值，一般的析构方法很难执行时间达到这个数值，那么就要分析一下这个问题的特征，来总结一下出现场景了。

针对分析了这类的崩溃的数据，不难会得到几个特征

  * 这个崩溃从数据来看，崩溃都是应用处于后台不可见的情况下发生
  * 崩溃时应用的使用时长（崩溃统计组件提供）普遍在几个小时的级别

从Stack Overflow上找到了一个相对比较合理的出现场景

  * 当你的应用处于后台，有对象需要释放回收内存时
  * 记录一个start_time 然后是FinalizerDaemon 开始析构AssetManager对象
  * 在这个过程中，设备突然进入了休眠状态，析构执行被暂停
  * 当过了一段时间，设备被唤醒，析构任务被恢复，继续执行，直至结束
  * 在析构完成后，得到一个end_time
  * FinalizerWatchdogDaemon 对end_time与start_time进行差值对比，发现超过了MAX_FINALIZE_NANOS，于是就抛出了TimeOut异常。

注意：应用后台执行的时间越长，出现的概率应该就会越大。


### 如何解决

这个问题，并不像NPE那样，可以快速定位解决，甚至来说，这个问题几乎无解。

理论上可能有帮助的措施是

  * 减少内存占用，避免不必要的对象创建
  * 消除内存泄露问题，缓解GC压力

但是这些措施，对于解决该问题起到的作用很微小。

### 如何缓解

凡事总有但是，但是我们可以缓解这个问题造成的影响。

所谓缓解之法，就是让崩溃悄无声息地发生，不影响用户体验，做到用户无感知崩溃。

前面也提到了，因为这种崩溃只出现在后台，我们可以对于这类的崩溃，稍作处理，就可以让崩溃的对话框不显示。具体可以参考这篇文章[Android中实现用户无感知处理后台崩溃](https://droidyue.com/blog/2018/04/01/do-not-bother-the-user-when-app-crash-in-a-background-state/)

以上。感谢下面的参考文章

### 参考文章

  * https://blog.csdn.net/jamin0107/article/details/78793021
  * https://stackoverflow.com/questions/24021609/how-to-handle-java-util-concurrent-timeoutexception-android-os-binderproxy-fin


