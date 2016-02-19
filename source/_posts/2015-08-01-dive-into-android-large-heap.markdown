---
layout: post
title: "探究android:largeHeap"
date: 2015-08-01 17:10
comments: true
categories: Android
---
在日常的Android开发中，我们必然遇到过OutOfMemoryError这样的崩溃，产生的原因无外乎两点，一是内存过小不够用，二是程序设计有误，导致不能释放内存，其中后者情况较多。在解决这个问题时，我们亦或多或少听到android:largeHeap，然而这个概念又是什么呢，它该如何使用，存在哪些问题呢。本文讲比较全面介绍Android中的largeHeap帮助各位全面深入了解这个概念。
<!--more-->
##磨刀不误砍柴工
为了便于理解，先简单介绍一些和文章相关的基础概念。

  * 通常，一个Android程序在运行时会启动一个Dalvik虚拟机（暂不讨论ART模式）
  * 虚拟机的运行时内存一般由堆和栈两大部分构成。
  * 栈是存储方法调用的一片内存数据区。
  * 堆内存占据了虚拟机的大部分内存空间，程序执行时产生的对象就分配在堆内存上。
  * 如果是堆内存没有可用的空间存储生成的对象，JVM会抛出java.lang.OutOfMemoryError。

如若具体了解堆和栈，请参考文章[Java中的堆和栈的区别](http://droidyue.com/blog/2014/12/07/differences-between-stack-and-heap-in-java/)和[JVM运行时的数据区](http://droidyue.com/blog/2014/12/21/java-runtime-data-areas/)

##largeHeap介绍
一个应用如果使用了largeHeap，会请求系统为Dalvik虚拟机分配更大的内存空间。使用起来也很方便，只需在manifest文件application节点加入**android:largeHeap="true"**即可。
```xml
<application android:icon="@drawable/icon" 
	android:allowBackup="false"
	android:label="@string/app_name" 
	android:debuggable="true" 
	android:theme="@android:style/Theme.Black"
    android:largeHeap="true"
>
```

##largeHeap有多大
在Android中，有如下两个方法可以帮助我们查看当前内存大小

  * ActivityManager.getMemoryClass()获得内用正常情况下内存的大小
  * ActivityManager.getLargeMemoryClass()可以获得开启largeHeap最大的内存大小

然而largeHeap这个最大值是如何决定的呢？想要了解这个问题，我们就需要看一下Android系统中的一个文件。

这个文件路径是`/system/build.prop`，由于文件比较大，这里我们只截取关于dalvik内存的配置信息，如下。
```java
dalvik.vm.heapstartsize=8m
dalvik.vm.heapgrowthlimit=192m
dalvik.vm.heapsize=512m
dalvik.vm.heaptargetutilization=0.75
dalvik.vm.heapminfree=2m
dalvik.vm.heapmaxfree=8m
```

上面有诸多配置，但从字面意思也不难理解，为了正确理解，有必要逐一解释一下。

**dalvik.vm.heapstartsize=8m**

相当于虚拟机的 -Xms配置，该项用来设置堆内存的初始大小。

**dalvik.vm.heapgrowthlimit=192m**

相当于虚拟机的 -XX:HeapGrowthLimit配置，该项用来设置一个标准的应用的最大堆内存大小。一个标准的应用就是没有使用android:largeHeap的应用。

**dalvik.vm.heapsize=512m**

相当于虚拟机的 -Xmx配置，该项设置了使用android:largeHeap的应用的最大堆内存大小。


**dalvik.vm.heaptargetutilization=0.75**

相当于虚拟机的 -XX:HeapTargetUtilization,该项用来设置当前理想的堆内存利用率。其取值位于0与1之间。当GC进行完垃圾回收之后，Dalvik的堆内存会进行相应的调整，通常结果是当前存活的对象的大小与堆内存大小做除法，得到的值为这个选项的设置，即这里的0.75。注意，这只是一个参考值，[Dalvik虚拟机也可以忽略此设置](http://grepcode.com/file/repo1.maven.org/maven2/org.robovm/robovm-rt/1.0.0/dalvik/system/VMRuntime.java#VMRuntime.setTargetHeapUtilization%28float%29)。


**dalvik.vm.heapminfree=2m**与**dalvik.vm.heapmaxfree=8m**

dalvik.vm.heapminfree对应的是-XX:HeapMinFree配置，用来设置单次堆内存调整的最小值。**dalvik.vm.heapmaxfree**对应的是-XX:HeapMaxFree配置，用来设置单次堆内存调整的最大值。通常情况下，还需要结合上面的 -XX:HeapTargetUtilization的值，才能确定内存调整时，需要调整的大小。


##largeHeap需要权限么
为何有此疑问呢？ 原因是这样的。 首先一个设备的内存是固定的，当我们使用了largeHeap之后就可以使我们的程序内存增加，但这部分增加的内存有可能是源自被系统杀掉的后台程序。所以，使用largeHeap理论上是有可能杀掉其他的程序的。

然而，结果就是不需要权限，Google在一开始就是这样，只需要简单在Application元素上加入android:largeHeap="true"就能正常使用。

##largeHeap对GC的影响
拥有了更多的内存，是不是就意味着要花更多的时间遍历对象垃圾回收呢？其实不然。

首先largeHeap自Android 4.0开始支持，而并发的垃圾回收方式从Android 2.3开始引入。

在引入并发垃圾回收之前，系统采用了Stop-the-World回收方式，进行一次垃圾回收通常消耗几百毫秒，这是很影响交互和响应的。

引入并发垃圾回收之后,在GC开始和结束的阶段会有短暂的暂停时间，通常在10毫秒以内。

因此在支持largeHeap的系统上都采用了并发垃圾回收，GC的Pause Time不会很长，对交互响应影响甚微。

##慎用largeHeap
对于largeHeap的使用，我们该持有的谨慎的态度，largeHeap可以使用，但是要谨慎。

对于本身对内存要求过大的图片或者视频应用，我们可以使用largeHeap。

除上面的情况，如果仅仅是为了解决OutOfMemoryError这样的问题，而尝试使用largeHeap分配更大内存的这种指标不治本的方法不可取。对待这样的OOM问题，建议阅读以下几篇文章，了解Android中内存泄露和垃圾回收，从代码上去查找问题，从根本上解决问题。

##补漏
感谢大牛[裸奔的凯子哥](http://weibo.com/u/1783932377?topnav=1&wvr=6&topsug=1)指出。

无论是否开启largeHeap，ActivityManager.getLargeMemoryClass()都可以打印出largeHeap的大小。因为其本身只是读取了配置文件的值而已。即下面的代码无论largeHeap开启与否，打印出来的日志都相同
```java
		ActivityManager activityManager = (ActivityManager) getSystemService(ACTIVITY_SERVICE);

        int largeMemoryClass = activityManager.getLargeMemoryClass();
        int memoryClass = activityManager.getMemoryClass();

        ActivityManager.MemoryInfo info = new ActivityManager.MemoryInfo();
        activityManager.getMemoryInfo(info);

        Log.d(LOGTAG, "largeMemoryClass = " + largeMemoryClass);
        Log.d(LOGTAG, "memoryClass = " + memoryClass);
```

###如何验证
关于如何验证，这里设置一个按钮，每次创建100M的内存对象，观察开启largeHeap前后的反应
```java
private ArrayList<byte[]> mLeakyContainer = new ArrayList<>();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        findViewById(R.id.testBtn).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] b = new byte[100 * 1000 * 1000];
                mLeakyContainer.add(b);
            }
        });
        testMemoryInfo();
    }
```

  * 以正常情况下可用192M内存为例，点击两次按钮，应用崩溃。
  * 然后在manifest开启largeHeap，以最大512M内存可用为例，点击6次应用崩溃

验证源码可以访问github查看[largeHeapDemo](https://github.com/androidyue/largeHeapDemo)

##推荐文章
  * [Android中Handler引起的内存泄露](http://droidyue.com/blog/2014/12/28/in-android-handler-classes-should-be-static-or-leaks-might-occur/)
  * [避免Android中Context引起的内存泄露](http://droidyue.com/blog/2015/04/12/avoid-memory-leaks-on-context-in-android/)
  * [Google IO：Android内存管理主题演讲记录](http://droidyue.com/blog/2014/11/02/note-for-google-io-memory-management-for-android-chinese-edition/)

{%include post/book_copyright.html %}













