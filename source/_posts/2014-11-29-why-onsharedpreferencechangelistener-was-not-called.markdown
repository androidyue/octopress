---
layout: post
title: "Google为何这样设计OnSharedPreferenceChangeListener"
date: 2014-11-29 16:41
comments: true
categories: Android
---
之前使用OnSharedPreferenceChangeListener，遇到了点小问题，就是有些时候OnSharedPreferenceChangeListener没有被触发。最近花了点时间研究了一下，小做整理。本文将会介绍监听器不被触发的原因，解决方法，以及其中隐含的一些技术细节。
<!--more-->
##问题再现
OnSharedPreferenceChangeListener是Android中SharedPreference文件发生变化的监听器。通常我们想要进行监听，会实现如下的代码。
```java
protected void onCreate(Bundle savedInstanceState) {
	PreferenceManager.getDefaultSharedPreferences(getApplicationContext())
		.registerOnSharedPreferenceChangeListener(new OnSharedPreferenceChangeListener() {
		@Override
		public void onSharedPreferenceChanged(
			SharedPreferences sharedPreferences, String key) {
			Log.i(LOGTAG, "testOnSharedPreferenceChangedWrong key =" + key);
		}
	});
}
```
这种写法看上去没有什么问题，而且很多时候开始几次onSharedPreferenceChanged方法也可以被调用。但是过一段时间（简单demo不容易出现，但是使用DDMS中的gc会立刻导致接下来的问题），你会发现前面的方法突然不再被调用，进而影响到程序的处理。

##原因剖析
简而言之，就是你注册的监听器被移除掉了。  
首先我们先了解一下registerOnSharedPreferenceChangeListener注册的实现。
```
private final WeakHashMap<OnSharedPreferenceChangeListener, Object> mListeners =
            new WeakHashMap<OnSharedPreferenceChangeListener, Object>();
//some code goes here
public void More ...registerOnSharedPreferenceChangeListener(OnSharedPreferenceChangeListener listener) {
    synchronized(this) {
    	mListeners.put(listener, mContent);
    }
}
```
从上面的代码可以得知，一个OnSharedPreferenceChangeListener对象实际上是放到了一个WeakHashMap的容器中，执行完示例中的onCreate方法，这个监听器对象很快就会成为垃圾回收的目标，由于放在WeakHashMap中作为key不会阻止垃圾回收，所以当监听器对象被回收之后，这个监听器也会从mListeners中移除。所以就造成了onSharedPreferenceChanged不会被调用。

关于WeakHashMap相关，请阅读[译文：理解Java中的弱引用](http://droidyue.com/blog/2014/10/12/understanding-weakreference-in-java/)进而更多了解。

##如何解决
###改为对象成员变量（推荐）
将监听器作为Activity的一个成员变量，在Activity的onResume进行注册，在onPause时进行注销。推荐在这两个Activity生命周期中进行处理，尤其是当SharedPreference值发生变化后，对Activity展示的UI进行处理操作的情况。这种方法是最推荐的解决方案。
```java
private OnSharedPreferenceChangeListener mListener = new OnSharedPreferenceChangeListener() {

	@Override
	public void onSharedPreferenceChanged(
		SharedPreferences sharedPreferences, String key) {
		Log.i(LOGTAG, "instance variable key=" + key);
	}
};

@Override
protected void onResume() {
	PreferenceManager.getDefaultSharedPreferences(getApplicationContext()).registerOnSharedPreferenceChangeListener(mListener);
	super.onResume();
}

@Override
protected void onPause() {
	PreferenceManager.getDefaultSharedPreferences(getApplicationContext()).unregisterOnSharedPreferenceChangeListener(mListener);
	super.onPause();
}
```

###改为静态变量（不推荐）
如下，将一个指向匿名的内部类对象的变量sListener使用static修饰，这个内部类对象则不会持有外部类的引用。  
但是这种做法并不推荐，因为一个静态变量和与外部实例不相关，我们很难和外部实例进行一些操作。
```java
private static OnSharedPreferenceChangeListener sListener = new OnSharedPreferenceChangeListener() {
	@Override
	public void onSharedPreferenceChanged(
		SharedPreferences sharedPreferences, String key) {
		Log.i(LOGTAG, "static variable key=" + key);
	}
};
```

##为什么这样设计
可能会有人认为这是系统设计的猫腻或者bug，其实不然，这正是Android设计人员的高明之处。  

正如我们示例的代码一样，将一个（隐式的）局部变量添加到监听器容器中，如果该容器只是一个普通的HashMap，这样会导致内存泄露，因为该容器还有局部变量指向的对象，该对象又隐式持有外部Activity的对象，导致Activity无法被销毁。关于非静态内部类持有隐式持有外部类引用，请参考[细话Java："失效"的private修饰符](http://droidyue.com/blog/2014/10/02/the-private-modifier-in-java/)

除此之外，因为局部变量无法在其所在方法外部访问，这样就导致了我们只可以使用方法中使用局部变量就行注册，在合适的时机却无法使用局部变量进行注销。


##三本帮助深入研究Java的书
  * [Java Performance](http://www.amazon.cn/gp/product/0137142528/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=0137142528&linkCode=as2&tag=droidyue-23)
  * [Java编程思想(第4版)](http://www.amazon.cn/gp/product/B0011F7WU4/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0011F7WU4&linkCode=as2&tag=droidyue-23)
  * [Sun 公司核心技术丛书:Effective Java中文版(第2版)](http://www.amazon.cn/gp/product/B001PTGR52/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B001PTGR52&linkCode=as2&tag=droidyue-23)
