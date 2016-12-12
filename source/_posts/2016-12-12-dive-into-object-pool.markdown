---
layout: post
title: "关于对象池的一些分析"
date: 2016-12-12 18:57
comments: true
categories: Java Android 设计模式
---

在日常的开发工作中，我们可能使用或者听说过对象池，线程池以及连接池。本文将介绍对象池的产生缘由，具体实现细节，以及需要注意的问题。


## 什么是对象池（模式）
  * 对象池（模式）是一种创建型设计模式
  * 它持有一个初始化好的对象的集合，将对象提供给调用者。


<!--more-->


## 对象池的目的
  * 减少频繁创建和销毁对象带来的成本，实现对象的缓存和复用




## 什么条件下使用对象池
  * 创建对象的成本比较大，并且创建比较频繁。比如线程的创建代价比较大，于是就有了常用的线程池。


## 对象池的例子
Android中使用对象池的应用有很多,比如下面的这些都是应用了该模式


  * Handler处理的Message
  * 线程池执行器ThreadPoolExecutor
  * 控件TabLayout
  * 控制TypedArray的Resources


以一个简单的获取SytledAttributions代码为例，展示一下对象池的应用
```java
    // Text colors/sizes come from the text appearance first
    final TypedArray ta = context.obtainStyledAttributes(mTabTextAppearance,
        android.support.v7.appcompat.R.styleable.TextAppearance);
    try {
        mTabTextSize = ta.getDimensionPixelSize(
                android.support.v7.appcompat.R.styleable.TextAppearance_android_textSize, 0);
        mTabTextColors = ta.getColorStateList(
                android.support.v7.appcompat.R.styleable.TextAppearance_android_textColor);
    } finally {
        ta.recycle();
    }
```


想必这段代码都可能写过，那就是在一开始的时候，我们都会被告诫：使用TypedArray结束的时候，一定要调用它的recycle方法。


回想起来，当时自己还很疑惑为什么要这么规定，其实很简单，它使用了对象池。


> 调用者通过obtain方法从对象池中获取对象，然后使用完毕后，需要使用recycle方法返还给对象池。




## 三种角色
上面的介绍中，也或多或少提到了下面的三种角色


  * Reusable 可重用的对象
  * Client   调用者
  * ReusablePool 可重用的对象的池


### Reusable
  * 创建的成本较大，比如线程或者数据库连接
  * 被ReusablePool持有
  * 被Client消费使用，使用完成应该被返回到ReusablePool


### ReusablePool
  * 维护一定数量的Reusable，提供给客户端使用
  * 提供`aquire`或者`obtain`等方法，便于客户端请求Reusable
  * 提供`recycle`或者`release`等方法，便于客户端使用完毕后，将Reusable对象奉还。


### Client
  * 请求ReusablePool或者Reusable对象
  * 使用完毕Reusable对象后，返回给ReusablePool




## 对象池无可用的对象时，再次对象请求，可能的表现行为
  * 如果池的大小可以增长，创建新的对象并返回给client
  * 阻塞client调用，直到有可用的对象回收并返回
  * 抛出异常，通知client
  * 返回null给client




## 同步处理
在多线程的环境下，我们也会使用对象池。因此做好必要的同步是必须的。


要进行同步处理的通常是这两个方法




  * aquire或obtain 负责返回对象
  * release或recycle 负责回收对象


下面是一段进行同步处理了的对象池的源码。


```java
public static class SynchronizedPool<T> extends SimplePool<T> {
        private final Object mLock = new Object();


        /**
         * Creates a new instance.
         *
         * @param maxPoolSize The max pool size.
         *
         * @throws IllegalArgumentException If the max pool size is less than zero.
         */
        public SynchronizedPool(int maxPoolSize) {
            super(maxPoolSize);
        }


        @Override
        public T acquire() {
            synchronized (mLock) {
                return super.acquire();
            }
        }


        @Override
        public boolean release(T element) {
            synchronized (mLock) {
                return super.release(element);
            }
        }
}
```


上述代码为Android中`android.support.v4.util`提供的Pools中的`SynchronizedPool`的实现，它使用了synchronized关键字实现同步问题。




## 对象池与单例模式
为了统一管理对象，建议将对象池设为单例。


应用单例模式的时候，需要确保在多线程并发的情况下保持唯一的实例创建，具体实现方案，可以参考[单例这种设计模式](http://droidyue.com/blog/2015/01/11/looking-into-singleton/)


## 池的大小选择
  * 通常情况下，我们需要控制对象池的大小
  * 如果对象池没有限制，可能导致对象池持有过多的闲置对象，增加内存的占用
  * 如果对象池闲置过小，没有可用的对象时，会造成之前`对象池无可用的对象时，再次请求`出现的问题
  * 对象池的大小选取应该结合具体的使用场景，结合数据（触发池中无可用对象的频率）分析来确定。


## 空间换时间的折中
  * 本质上，对象池属于空间换时间的折中
  * 它通过缓存初始化好的对象来提升调用者请求对象的响应速度。
  * 除此之外，折中（tradeoff）是软件开发中的一个重要的概念，会贯穿整个软件开发过程中。


## 对象池好处
  * 提升了client获取对象的响应速度，比如单个线程和资源连接的创建成本都比较大。
  * 一定程度上减少了GC的压力。
  * 对于实时性要求较高的程序有很大的帮助


## 对象池弊端
### 脏对象的问题
所谓的脏对象就是指的是当对象被放回对象池后，还保留着刚刚被客户端调用时生成的数据。


脏对象可能带来两个问题


  * 脏对象持有上次使用的引用，导致内存泄漏等问题。
  * 脏对象如果下一次使用时没有做清理，可能影响程序的处理数据。


### 生命周期的问题
处于对象池中的对象生命周期要比普通的对象要长久。维持大量的对象也是比较占用内存空间的。


以ThreadPoolExecutor为例，它提供了`allowCoreThreadTimeOut`和`setKeepAliveTime`两种方法，可以在超时后销毁核心线程。我们在具体的实践中可以参考这个策略。


### 异常处理问题
相对来说，使用对象池client调用也会复杂一些，比如请求对象时有可能出现的阻塞，异常或者null值。这些都需要我们做一些额外的处理，来确保程序的正常运行。




除此之外，还有上面的提到的两个问题，他们分别是


  * 同步问题
  * 池大小设置问题


所以当我们想要使用对象池时，需要谨慎的衡量并准确的实现，享受它带来的好处，并避免其带来的问题。


##参考文章
  * http://www.oodesign.com/object-pool-pattern.html

