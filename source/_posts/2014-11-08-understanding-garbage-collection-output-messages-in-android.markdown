---
layout: post
title: "译文：理解Android中垃圾回收日志信息"
date: 2014-11-08 18:16
comments: true
categories: Android
---

如果你是一名Android开发者并且常常看程序日志的话，那么下面的这些信息对你来说可能一点都不陌生。
```java
GC_CONCURRENT freed 178K, 41% free 3673K/6151K, external 0K/0K, paused 2ms+2ms
GC_EXPLICIT freed 6K, 41% free 3667K/6151K, external 0K/0K, paused 29ms
GC_CONCURRENT freed 379K, 42% free 3856K/6535K, external 0K/0K, paused 2ms+3ms
GC_EXPLICIT freed 144K, 41% free 3898K/6535K, external 0K/0K, paused 32ms
GC_CONCURRENT freed 334K, 40% free 4091K/6727K, external 0K/0K, paused 2ms+3ms
```

但是这些到底是什么，又有什么含义呢？
<!--more-->
上面的这几行就是Android系统垃圾回收的部分输出信息。每当垃圾回收被触发的时候，你就可以通过logcat查看到这样的信息。这样短短的一行的日志有着很大的信息量。比如通过日志我们可以发现程序可能有内存（泄露）问题。本文将具体介绍这些日志信息的每一部分的含义来帮助帮助大家更好地了解垃圾回收的运行情况。

##原因
<font color="red">GC_CONCURRENT</font> freed 178K, 41% free 3673K/6151K, external 0K/0K, paused 2ms+2ms   
<font color="red">GC_EXPLICIT</font> freed 6K, 41% free 3667K/6151K, external 0K/0K, paused 29ms  

红颜色标出的部分就是垃圾回收触发的原因。在Android中有五种类型的垃圾回收触发原因。

  * **GC_CONCURRENT** 当堆内存增长到一定程度时会触发。此时触发可以对堆中的没有用的对象及时进行回收，腾出空间供新的对象申请，避免进行不必要的增大堆内存的操作。
  * **GC_EXPLICIT**   当程序中调用System.gc()方法触发。这个方法应避免出现在程序中调用。因为JVM有足够的能力来控制垃圾回收。
  * **GC_EXTERNAL_MALLOC** 当Bitmap和NIO Direct ByteBuffer对象分配外部存储（机器内存，非Dalvik堆内存）触发。这个日志只有在2.3之前存在，从2.3系统开始，垃圾回收进行了调整，前面的对象都会存储到Dalivik堆内存中。所以在2.3系统之后，你就再也不会看到这种信息了。
  * **GC_FOR_MALLOC** 当堆内存已满，系统需要更多内存的时候触发。这条日志出现后意味着JVM要暂停你的程序进行垃圾回收操作。
  * **GC_HPROF_DUMP_HEAP** 当创建一个内存分析文件HPROF时触发。
  
##结果
GC_CONCURRENT <font color="red">freed 178K</font>, 41% free 3673K/6151K, external 0K/0K, paused 2ms+2ms   
GC_EXPLICIT <font color="red">freed 6K</font>, 41% free 3667K/6151K, external 0K/0K, paused 29ms  

这部分数据告诉我们JVM进行垃圾回收释放了多少空间。

##堆内存数据
GC_CONCURRENT freed 178K, <font color="red">41% free 3673K/6151K</font>, external 0K/0K, paused 2ms+2ms   
GC_EXPLICIT freed 6K, <font color="red">41% free 3667K/6151K</font>, external 0K/0K, paused 29ms  

这部分告诉我们堆内存中可用内存占的比例，当前活跃的对象总的空间，以及当前堆的总大小。所以这里的数据就是41%的堆内存可用，已经使用了3673K，总的堆内存大小为6151K。

##外部存储数据
GC_EXTERNAL_ALLOC freed 1125K, 47% free 6310K/11847K,  <font color="red">external 1051K/1103K</font>, paused 46ms  
GC_EXTERNAL_ALLOC freed 295K, 47% free 6335K/11847K,  <font color="red">external 1613K/1651K</font>, paused 41ms  

这部分数据告诉我们外部存储（位于机器内存）对象的数据。在2.3之前，bitmap对象存放在机器内存。因此在第一条数据中我们可以看到以有1051K使用，外部存储为1103K。

上面两行数据相差100毫秒，我们可以看到第一条数据表明外部存储快满了，由于GC_EXTERNAL_ALLOC被触发，外部存储空间扩大到了1651K。

##垃圾回收暂停时间
GC_CONCURRENT freed 178K, 41% free 3673K/6151K, external 0K/0K, <font color="red">paused 2ms+2ms</font>   
GC_EXPLICIT freed 6K, 41% free 3667K/6151K, external 0K/0K, <font color="red">paused 29ms</font>  

这部分数据表明垃圾回收消耗的时间。在GC_CONCURRENT回收时，你会发现两个暂停时间。一个是在回收开始的暂停时间，另一个时在回收结束的暂停时间。GC_CONCURRENT从2.3开始引入，相比之前的程序全部暂停的垃圾回收机制，它的暂停时间要小的多。一般少于5毫秒。因为GC_CONCURRENT的绝大多数操作在一个单独的线程中进行。

本文中内容摘自 Google I/O 2011: Memory management for Android Apps，如果感兴趣，请访问[这里](http://droidyue.com/blog/2014/11/02/note-for-google-io-memory-management-for-android-chinese-edition/)了解更多。


##原文地址
https://sites.google.com/site/pyximanew/blog/androidunderstandingddmslogcatmemoryoutputmessages

