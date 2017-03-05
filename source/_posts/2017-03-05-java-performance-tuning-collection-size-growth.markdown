---
layout: post
title: "Java性能调优之容器扩容问题"
date: 2017-03-05 20:31
comments: true
categories: Java Android
---

在Java和Android编程中，我们经常使用类似ArrayList,HashMap等这些容器。这些容器少则存储几条，多则上千甚至更多。作为性能调优的一部分，容器调优往往被我们忽略，本文将尝试探索阐述一些关于容器调优中的扩容问题。虽然以Java为例，但是也同样适用于其他编程语言。

<!--more-->
首先以我们最常用的ArrayList为例，它是一个基于数组的List实现。
```java
public static void main(String[] args) {
    ArrayList<Object> collection = new ArrayList(); 
    for (int i = 0; i< 1000; i++) {
        collection.add(new Object());
    }
} 
```

以上代码很简单，不用赘述。那我们使用NetBeans的profile插件 来看一下关于Object对象分配的stacktrace

![http://7jpolu.com1.z0.glb.clouddn.com/object_allocation_stacktrace.png](http://7jpolu.com1.z0.glb.clouddn.com/object_allocation_stacktrace.png)

从stacktrace中，我们可以发现

  * Object对象trace始于ArrayList.add方法
  * 经过了一个叫做ArrayList.grow方法

以上我们可以推断，ArrayList对象发生了扩容操作。因为使用无参的构造方法，会初始化一个存储容量为0的数组。

如下代码为ArrayList的构造方法
```java
private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};
public ArrayList(int initialCapacity) {
    if (initialCapacity > 0) {
        this.elementData = new Object[initialCapacity];
    } else if (initialCapacity == 0) {
        this.elementData = EMPTY_ELEMENTDATA;
    } else {
        throw new IllegalArgumentException("Illegal Capacity: " + initialCapacity);
    }
}

    
public ArrayList() {
    this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
}
```
然而想要容量1000个Object实例，这个过程中则需要不断的扩容,在这个过程中发生了以下几点

  * 确定新的容量，并以新容量为大小创建新的数组
  * 将旧数组的数据拷贝到新数组中
  * 旧的数组将会后续被GC回收掉

除此之外，扩容还会增加CPU高速缓存的**未**命中率。因为

> 在JVM中，一般来说，由于对象和其字段常常都需要同时引用，将对象和其字段尽可能放在内存中相邻位置能够减少CPU高速缓存的未命中率。

而ArrayList扩容后的新数组可能不在于该对象相邻，所以扩容理论上会增加CPU高速缓存的未命中率。

注意：上面提到的都是CPU高速缓存的未命中率，不是命中率。

## 更容易扩容的HashMap
HashMap作为一个高效的key-value的容器，内部也维护了一个Entry数组，也存在扩容的问题。

然而，HashMap为了更加有效的避免数组冲突，引入了两个概念。
  
  * threshold 阈(yu，四声)值，当内部数据占用量超过这个值，进行扩容。
  * loadFactor 通常为0.75,用来计算threshold值，即threshold = 容量 * loadFactor

举个例子

  * 创建一个HashMap设置初始化容量为16，使用默认的loadFactor 0.75，即threshold为12
  * 然后不断的填充key,value数据
  * 当内部数据占用量超过12时，就会触发扩容操作，而不是等到16的时候。
  * 通常的扩容为双倍扩容，即变成原来的两倍，这里为32.

因此说HashMap更容易触发扩容，但是这其实是一种在hash与容量占用的一种平衡。

## 如何解决或者改善扩容问题
### 使用预设较为合理的初始容量
SQLiteDatabase提供了方便的ContentValues简化了我们处理列名与值的映射，ContentValues内部采用了HashMap来存储Key-Value数据，ContentValues的初始容量是8，如果当添加的数据超过8之前，则会进行双倍扩容操作，

因此建议对ContentValues填入的内容进行估量，根据实际需要的字段数量，设置合理的初始化数量。



### 尝试使用其他非基于数组的数据结构
数组的一大优点就是随机访问很高效，这是链表所无法匹敌的。

但是并不是所有的时候都数组都有明显优势

  * 不需要随机访问或者数据量很小
  * 在频繁的增加和删除数据的时候，链表有明显的优势。

一些替代方案
  
  * 对于List，可以考虑使用LinkedList
  * 对于Map，可以考虑使用TreeMap
  * 关于替代HashMap，Android引入了一个叫做ArrayMap的类，用来解决HashMap内存占用的问题。具体可以参考[深入剖析 Android中的 ArrayMap](http://droidyue.com/blog/2017/02/12/dive-into-arraymap-in-android/)



关于扩容的问题就是以上内容，当我们无论是使用任何数据结构时都需要考虑到具体的环境和需要，确保能够做到最优。



















