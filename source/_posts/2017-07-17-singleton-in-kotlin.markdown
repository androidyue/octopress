---
layout: post
title: "Kotlin中的单例模式"
date: 2017-07-17 22:03
comments: true
categories: Kotlin 单例模式 设计模式
---
在编程中，我们都应该接触到设计模式，无论是从时间总结，亦或者是从书上习得后尝试使用。这其中单例模式，是我们编程过程中很常见，也很简单的一种设计模式。我曾经写过一篇比较通用的关于该模式的文章，即[单例这种设计模式](http://droidyue.com/newtab.html?url=http%3A%2F%2Fdroidyue.com%2Fblog%2F2015%2F01%2F11%2Flooking-into-singleton%2F)。

目前，随着Google钦定Kotlin为Android 开发官方语言，Kotlin的学习热潮也应声而起。本文尝试讲解单例模式在Kotlin的具体实现和应用。希望能够对大家学习使用Kotlin有所帮助。

<!--more-->

## 超简版单例
Kotlin引入了一个叫做object的类型，用来很容易的实现单例模式。如下面的代码
```java
object SimpleSington {
	fun test() {}
}
//在Kotlin里调用
SimpleSington.test()

//在Java中调用
SimpleSington.INSTANCE.test();
```

这个版本的实现，其实是个语法糖（Kotlin漫山遍野都是语法糖）。其真正的实现类似于这样
```
public final class SimpleSington {
   public static final SimpleSington INSTANCE;

   private SimpleSington() {
      INSTANCE = (SimpleSington)this;
   }

   static {
      new SimpleSington();
   }
}
```

因而Kotlin这个超简版单例实现省去了

  * 显式声明静态instance变量
  * 将构造函数private化处理

### 关于调用时注意
这段单例代码在Kotlin中使用很简单，即
```java
SimpleSington.test()
```

但是在Java和Kotlin混编时，Java代码中调用则需要注意，使用如下
```java
SimpleSington.INSTANCE.test();
```

其实在Kotlin中调用单例本质上还是涉及到了INSTANCE这个变量，只是为了简化，隐藏了一些细节。

object类型的单例模式，本质上是饿汉式加载，即在类加载的时候创建单例。它可能存在的问题有

  * 如果构造方法中存在过多的处理，会导致加载这个类时比较慢，可能引起性能问题。
  * 如果使用饿汉式的话，只进行了类的装载，并没有实质的调用，会造成资源的浪费。

## 懒汉式加载
针对饿汉式的潜在问题，我们可以使用懒汉式来解决，即将实例初始化放在开始使用之前。Kotlin版的懒汉式加载代码如下
```java
class LazySingleton private constructor(){
    companion object {
        val instance: LazySingleton by lazy { LazySingleton() }
    }
}
```
  
  * 显式声明构造方法为private
  * companion object用来在class内部声明一个对象
  * LazySingleton的实例instance 通过lazy来实现懒汉式加载
  * lazy默认情况下是线程安全的，这就可以避免多个线程同时访问生成多个实例的问题


## 该用哪个版本
关于如何选择饿汉式还是懒汉式，通常应该从两方面考虑

  * 实例初始化的性能和资源占用
  * 编写的效率和简洁

对于实例初始化花费时间较少，并且内存占用较低的话，应该使用object形式的饿汉式加载。否则使用懒汉式。


关于单例的更多知识和问题，请参考阅读[单例这种设计模式](http://droidyue.com/newtab.html?url=http%3A%2F%2Fdroidyue.com%2Fblog%2F2015%2F01%2F11%2Flooking-into-singleton%2F)
