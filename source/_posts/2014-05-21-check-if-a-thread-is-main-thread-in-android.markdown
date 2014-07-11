---
layout: post
title: "Check If A Thread Is Main Thread In Android"
date: 2014-05-21 21:42
comments: true
categories: thread android looper handler 
---
How to check a certain thread is the main one or not in Android? You may say it could be determined by checking the name. Yes, It may resolve the problem. However I think it's not reliable.   
<!-- more -->
This is the most reliable workaround. 
```java
public static boolean isInMainThread() {
	    return Looper.myLooper() == Looper.getMainLooper();
}
```
Actually the above code could already resolve your problem. If you want to know more details, please go on reading this post.  
Now Let's do some tests to check the reliability of this method. 
This the method with additional debug log
```java
private boolean isInMainThread() {
    Looper myLooper = Looper.myLooper();
	Looper mainLooper = Looper.getMainLooper();
	Log.i(LOGTAG, "isInMainThread myLooper=" + myLooper 
	    + ";mainLooper=" + mainLooper);
	return myLooper == mainLooper;
}
```	
Now we run this test case. Of course we assume that the following code is running in the main thread.
```java
Log.i(LOGTAG, "testInMainThread inMainThread=" + isInMainThread());
```
Look at the output log. It works well.
```bash
I/TestInMainThread(32028): isInMainThread myLooper=Looper{40d35ef8};mainLooper=Looper{40d35ef8}
I/TestInMainThread(32028): testInMainThread inMainThread=true
```
Now we are going to check the method running in a non-main thread without a message loop. 
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
As we can see from the below output. the main looper has been assigned. However the looper associated with the current thread is Null. That's because `Threads by default do not have a message loop associated with them. Of course, the method works`.
```bash
I/TestInMainThread(32028): isInMainThread myLooper=null;mainLooper=Looper{40d35ef8}
I/TestInMainThread(32028): testIn NOT in MainThread isMainThread=false
```
Then, Now we create a thread with a message loop. And let's have a check. According to Android Developer Docs, This is a typical example of the implementation of a Looper thread, using the separation of prepare() and loop() to create an initial Handler to communicate with the Looper.
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
Now both the looper bound to the current thread and the main looper has been assigned. However the are different. That's right; and the method still works.
```bash
I/TestInMainThread(32028): isInMainThread myLooper=Looper{40d72c58};mainLooper=Looper{40d35ef8}
I/TestInMainThread(32028): testInNonMainLooperThread isMainThread=false
```
But why? And what 's inside?
Let's see the code what's is inside the  Looper.class.
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
For the main thread, the prepareMainLooper method will be called by the Android Environment not by developers. In this way, the looper associated with the main thread is created and passed the reference to the sMainLooper; thus this could guarantee the two looper equals, actually the are the same one. 

For non-main thread without a message loop, the looper bound to the current thread is null, because you never call the prepare by yourself. Of course the two looper are different.

For non-main thread with a message loop, Before calling the Lopper.prepare method, the main looper is already assigned. And by calling this method, a looper bound to the current thread is created. And Of course, it is not the main looper.

The above code makes sense.

References:

   * http://developer.android.com/reference/android/os/Looper.html
   * http://grepcode.com/file/repository.grepcode.com/java/ext/com.google.android/android/4.4.2_r1/android/os/Looper.java/


###Others
  * <a href="http://www.amazon.com/gp/product/1783286873/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1783286873&linkCode=as2&tag=droidyueblog-20&linkId=GA4SWV3DJHSTDG7A">Asynchronous Android</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=1783286873" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

