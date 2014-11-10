---
layout: post
title: "译文：Android中糟糕的AsyncTask"
date: 2014-11-08 14:33
comments: true
categories: Android
---
AsyncTask是一个很常用的API，尤其异步处理数据并将数据应用到视图的操作场合。其实AsyncTask并不是那么好，甚至有些糟糕。本文我会讲AsyncTask会引起哪些问题，如何修复这些问题，并且关于AsyncTask的一些替代方案。

##AsyncTask
从Android API 3（1.5 Cupcake）开始，AsyncTask被引入用来帮助开发者更简单地管理线程。实际上在Android 1.0和1.1也是有类似的实现，那就是UserTask。UserTask和AsyncTask有着相同的API及实现，但是由于由于1.0和1.1的设备份额微乎其微，这里的概念就不会涉及到UserTask。
<!--more-->

##生命周期
关于AsyncTask存在一个这样广泛的误解，很多人认为一个在Activity中的AsyncTask会随着Activity的销毁而销毁。然后事实并非如此。AsyncTask会一直执行doInBackground()方法直到方法执行结束。一旦上述方法结束，会依据情况进行不同的操作。
  
  * 如果cancel(boolean)调用了，则执行onCancelled(Result)方法
  * 如果cancel(boolean)没有调用，则执行onPostExecute(Result)方法

AsyncTask的cancel方法需要一个布尔值的参数，参数名为mayInterruptIfRunning,意思是`如果正在执行是否可以打断`,如果这个值设置为true，表示这个任务可以被打断，否则，正在执行的程序会继续执行直到完成。如果在doInBackground()方法中有一个循环操作，我们应该在循环中使用isCancelled()来判断，如果返回为true，我们应该避免执行后续无用的循环操作。

总之，我们使用AsyncTask需要确保AsyncTask正确地取消。

##不好好工作的cancel()
简而言之的答案，**有时候起作用**。

如果你调用了AsyncTask的cancel(false)，doInBackground()仍然会执行到方法结束，只是不会去调用onPostExecute()方法。但是实际上这是让应用程序执行了没有意义的操作。那么是不是我们调用cancel(true)前面的问题就能解决呢？并非如此。如果mayInterruptIfRunning设置为true，会使任务尽早结束，但是如果的doInBackground()有不可打断的方法会失效，比如这个BitmapFactory.decodeStream() IO操作。但是你可以提前关闭IO流并捕获这样操作抛出的异常。但是这样会使得cancel()方法没有任何意义。

##内存泄露
还有一种常见的情况就是，在Activity中使用非静态匿名内部AsyncTask类，由于Java内部类的特点，AsyncTask内部类会持有外部类的隐式引用。详细请参考[细话Java："失效"的private修饰符](http://droidyue.com/blog/2014/10/02/the-private-modifier-in-java/),由于AsyncTask的生命周期可能比Activity的长，当Activity进行销毁AsyncTask还在执行时，由于AsyncTask持有Activity的引用，导致Activity对象无法回收，进而产生内存泄露。

##结果丢失
另一个问题就是在屏幕旋转等造成Activity重新创建时AsyncTask数据丢失的问题。当Activity销毁并创新创建后，还在运行的AsyncTask会持有一个Activity的非法引用即之前的Activity实例。导致onPostExecute()没有任何作用。

##串行还是并行
关于AsyncTask时串行还是并行有很多疑问，这很正常，因为它经过多次的修改。如果你并不明白什么时串行还是并行，可以通过接下来的例子了解，假设我们在一个方法体里面有如下两行代码
```java
new AsyncTask1().execute();
new AsyncTask2().execute();
```
上面的两个任务时同时执行呢，还是AsyncTask1执行结束之后，AsyncTask2才能执行呢？实际上是结果依据API不同而不同。

###在1.6(Donut)之前:
在第一版的AsyncTask，任务是串行调度。一个任务执行完成另一个才能执行。由于串行执行任务，使用多个AsyncTask可能会带来有些问题。所以这并不是一个很好的处理异步（尤其是需要将结果作用于UI试图）操作的方法。

###从1.6到2.3(Gingerbread)
后来Android团队决定让AsyncTask并行来解决1.6之前引起的问题，这个问题是解决了，新的问题又出现了。很多开发者实际上依赖于顺序执行的行为。于是很多并发的问题蜂拥而至。

###3.0（Honeycomb）到现在
好吧，开发者可能并不喜欢让AsyncTask并行，于是Android团队又把AsyncTask改成了串行。当然这一次的修改并没有完全禁止AsyncTask并行。你可以通过设置executeOnExecutor(Executor)来实现多个AsyncTask并行。关于API文档的描述如下

>If we want to make sure we have control over the execution, whether it will run serially or parallel, we can check at runtime with this code to make sure it runs parallel:

```java
public static void execute(AsyncTask as) {
	if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.HONEYCOMB_MR1) {
		as.execute();
	} else {
		as.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
	}
}
//(This code does not work for API lvl 1 to 3)
```

##真的需要AsyncTask么
并非如此，使用AsyncTask虽然可以以简短的代码实现异步操作，但是正如本文提到的，你需要让AsyncTask正常工作的话，需要注意很多条条框框。推荐的一种进行异步操作的技术就是使用Loaders。这个方法从Android 3.0 (Honeycomb)开始引入，在android支持包中也有包含。可以通过查看官方的文档来详细了解[Loaders](http://developer.android.com/guide/components/loaders.html)。

本次译文对原文有少部分删减修改处理。

##引用推荐
  * [原文地址(墙外的 Orz)](http://bon-app-etit.blogspot.hk/2013/04/the-dark-side-of-asynctask.html)
  * [Grepcode AsyncTsk 源码参考](http://grepcode.com/file/repository.grepcode.com/java/ext/com.google.android/android/4.4.4_r1/android/os/AsyncTask.java#AsyncTask)
  * [另一篇介绍AsyncTask陷阱的文章](http://blog.danlew.net/2014/06/21/the-hidden-pitfalls-of-asynctask/)
  * <a href="http://www.amazon.cn/gp/product/B009OLU8EE/ref=as_li_qf_sp_asin_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B009OLU8EE&linkCode=as2&tag=droidyue-23">罗升阳的Android系统源代码情景分析</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B009OLU8EE" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

