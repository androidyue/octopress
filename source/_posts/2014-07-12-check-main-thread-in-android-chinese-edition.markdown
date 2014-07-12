---
layout: post
title: "Android中检测当前是否为主线程"
date: 2014-07-12 16:50
comments: true
categories: Android
---
如果在Android中判断某个线程是否是主线程？对于这个问题，你可能说根据线程的名字，当然这个可以解决问题，但是这样是最可靠的么？万一某天Google一下子将线程的名字改称其他神马东西呢。  
<!-- more -->

##方法揭晓
下面的方法是最可靠的解决方案。 
```java
public static boolean isInMainThread() {
	    return Looper.myLooper() == Looper.getMainLooper();
}
```
实际上，写到这里就基本解决了文章标题的问题了，但是仅仅研究到这里太肤浅了，刨的不够深，所以需要继续，希望你也可以继续读下去。

##刨根问底
###实验一
好，现在，我们对这个稳定的方法做一些测试，首先，下面的方法会增加一些调试打印信息。
```java
private boolean isInMainThread() {
    Looper myLooper = Looper.myLooper();
	Looper mainLooper = Looper.getMainLooper();
	Log.i(LOGTAG, "isInMainThread myLooper=" + myLooper 
	    + ";mainLooper=" + mainLooper);
	return myLooper == mainLooper;
}
```	
好，然后我们在主线程中运行一个测试，调用上述方法。比如我们这样调用。
```java
Log.i(LOGTAG, "testInMainThread inMainThread=" + isInMainThread());
```
OK，我们看一下输出日志。验证OK。
```bash
I/TestInMainThread(32028): isInMainThread myLooper=Looper{40d35ef8};mainLooper=Looper{40d35ef8}
I/TestInMainThread(32028): testInMainThread inMainThread=true
```

###实验二
现在我们继续在一个没有消息循环的非主线程，进行验证。
```java
new Thread() {
    @Override
    public void run() {
		Log.i(LOGTAG, "testIn NOT in MainThread isMainThread="
		    + isInMainThread());
		super.run();
	}
}.start();
```

正如我们看到的如下日志结果，主线程的Looper（翻译成循环泵，不是很好听）已经被初始化赋值。但是我们新创建的线程的looper还是null。这是因为**Android中的线程默认没有一个和它绑定了的消息循环**（**Threads by default do not have a message loop associated with them. Of course, the method works**）
```bash
I/TestInMainThread(32028): isInMainThread myLooper=null;mainLooper=Looper{40d35ef8}
I/TestInMainThread(32028): testIn NOT in MainThread isMainThread=false
```


###实验三
继续，我们创建一个绑定了消息循环的线程，根据Android开发者文档说明，以下是一个典型的创建消息循环线程的示例，使用单独prepare（）方法和loop（）方法来创建一个绑定到Looper的Handler。
```java
new Thread() {
	private Handler mHandler;
	@Override
	public void run() {
	    Looper.prepare();
	    mHandler = new Handler() {
            public void handleMessage(Message msg) {
		        // process incoming messages here
		    }
	    };
	    Log.i(LOGTAG, "testInNonMainLooperThread isMainThread=" 
            + isInMainThread());
		Looper.loop();
	}
		
}.start();
```
OK，现在再次检查以下日志，
```bash
I/TestInMainThread(32028): isInMainThread myLooper=Looper{40d72c58};mainLooper=Looper{40d35ef8}
I/TestInMainThread(32028): testInNonMainLooperThread isMainThread=false
```
两个Looper都被初始化赋值了，但是他们是不同的对象。


##原理发掘
但是，这是为什么呢，这里面有什么奥秘呢？ 好，让我们看以下Looper.class
```java
    // sThreadLocal.get() will return null unless you've called prepare().
    static final ThreadLocal<Looper> sThreadLocal = new ThreadLocal<Looper>();
    private static Looper sMainLooper;  // guarded by Looper.class
    
    /**
     * Initialize the current thread as a looper, marking it as an
     * application's main looper. The main looper for your application
     * is created by the Android environment, so you should never need
     * to call this function yourself.  See also: {@link #prepare()}
     */
    public static void prepareMainLooper() {
        prepare(false);
        synchronized (Looper.class) {
            if (sMainLooper != null) {
                throw new IllegalStateException("The main Looper has already been prepared.");
            }
            sMainLooper = myLooper();
        }
    }
    
    private static void prepare(boolean quitAllowed) {
        if (sThreadLocal.get() != null) {
            throw new RuntimeException("Only one Looper may be created per thread");
        }
        sThreadLocal.set(new Looper(quitAllowed));
    }
    
    /**
     * Return the Looper object associated with the current thread.  
     * Returns null if the calling thread is not associated with a Looper.
     */
    public static Looper myLooper() {
        return sThreadLocal.get();
    }
    
     /** Returns the application's main looper, which lives in the main thread of the application.
     */
    public static Looper getMainLooper() {
        synchronized (Looper.class) {
            return sMainLooper;
        }
    }
``` 

对于主线程来说，prepareMainLooper这个方法会被Android运行环境调用，而不是程序显式调用。通过这个方法，主线程的looper被创建，并且将对象引用传递给sMainLooper。所以保证了主线程myLooper()获取到的引用和getMainLooper()获取到的都是同一个引用。


对于没有消息循环的非主线程，默认的当前线程的looper是null，因为你从来没有手动地调用prepare()，所以它和主线程的looper不一样。


对于绑定了消息循环的非主线程，当调用Looper.prepare方法时，主线程的Looper已经由Android运行环境创建，当调用prepare方法后，绑定到这个非主线程的looper被创建，当然，这不可能和主线程的Looper一样。

综上所述，这个方法是可靠的。

引用:

   * http://developer.android.com/reference/android/os/Looper.html
   * http://grepcode.com/file/repository.grepcode.com/java/ext/com.google.android/android/4.4.2_r1/android/os/Looper.java/


###其他
  * <a href="http://www.amazon.cn/gp/product/B009OLU8EE/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B009OLU8EE&linkCode=as2&tag=droidyue-23">Android系统源代码情景分析</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B009OLU8EE" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />


