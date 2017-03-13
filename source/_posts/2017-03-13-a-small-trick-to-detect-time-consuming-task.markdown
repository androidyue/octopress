---
layout: post
title: "Android中一个简单有用的发现性能问题的方法"
date: 2017-03-13 21:57
comments: true
categories: Android 性能
---

在Android中，性能优化是我们持之不懈的工作。这其中，在主线程执行耗时的任务，可能会导致界面卡顿，甚至是ANR（程序未响应）。当然Android提供了很多优秀的工具，比如StrictMode，Method Tracing等，便于我们检测问题。

这里，本文将介绍一个更加简单有效的方法。相比StrictMode来说更加便于发现问题，相比Method Tracing来说更加容易操作。

<!--more-->
首先，我们有这样一个程序代码
```java
	@Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        writeContentToFile();
    }

    private void writeContentToFile() {
        File log = new File(Environment.getExternalStorageDirectory(), "Log.txt");
        Writer outWriter = null;
        try {
            outWriter = new BufferedWriter(new FileWriter(log.getAbsolutePath(), false));
            outWriter.write(new Date().toString());
            outWriter.write(" : \n");
            outWriter.flush();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (outWriter != null) {
                try {
                    outWriter.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
```

上面的代码需要优化，因为

  * writeContentToFile 是一个本地文件写操作，比较耗时
  * 而writeContentToFile 这个方法却放在了主线程中，必然会阻塞主线程其他的工作顺利执行。

上面介绍StrictMode和Method Traing都可以检测这个问题，这里我们我们用一个更简单的方法
```java
	public void checkWorkerThread() {
        boolean isMainThread = Looper.myLooper() == Looper.getMainLooper();
        if (isMainThread) {
            if (BuildConfig.DEBUG) {
                throw new RuntimeException("Do not do time-consuming work in the Main thread");
            }
        }
    }
```
这段方法有几点注意的。

  * 主线程判断，使用`Looper.myLooper() == Looper.getMainLooper()`可以准确判断当前线程是否为主线程。
  * BuildConfig.DEBUG 条件控制，只有在debug环境下抛出异常，给予开发者明显的提示。当然也可以使用自定义的是否抛出异常的逻辑
  * 如果当前线程不是主线程，那么就被认为是工作者线程。

比如上面的方法加入checkWorkerThread检查
```java
	private void writeContentToFile() {
        checkWorkerThread();
        //代码省略，具体实现参考上面
    }
```
再次执行程序，会曝出异常。
```java
java.lang.RuntimeException: Unable to start activity ComponentInfo{com.droidyue.checkthreadsample/com.droidyue.checkthreadsample.MainActivity}: java.lang.RuntimeException: Do not do time-consuming work in the Main thread
       	at android.app.ActivityThread.performLaunchActivity(ActivityThread.java:2664)
       	at android.app.ActivityThread.handleLaunchActivity(ActivityThread.java:2733)
       	at android.app.ActivityThread.access$900(ActivityThread.java:187)
       	at android.app.ActivityThread$H.handleMessage(ActivityThread.java:1584)
       	at android.os.Handler.dispatchMessage(Handler.java:111)
       	at android.os.Looper.loop(Looper.java:194)
       	at android.app.ActivityThread.main(ActivityThread.java:5869)
       	at java.lang.reflect.Method.invoke(Native Method)
       	at java.lang.reflect.Method.invoke(Method.java:372)
       	at com.android.internal.os.ZygoteInit$MethodAndArgsCaller.run(ZygoteInit.java:1019)
       	at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:814)
 Caused by: java.lang.RuntimeException: Do not do time-consuming work in the Main thread
       	at com.droidyue.checkthreadsample.MainActivity.checkWorkerThread(MainActivity.java:34)
       	at com.droidyue.checkthreadsample.MainActivity.writeContentToFile(MainActivity.java:40)
       	at com.droidyue.checkthreadsample.MainActivity.onCreate(MainActivity.java:27)
       	at android.app.Activity.performCreate(Activity.java:6127)
       	at android.app.Instrumentation.callActivityOnCreate(Instrumentation.java:1123)
       	at android.app.ActivityThread.performLaunchActivity(ActivityThread.java:2617)
       	... 10 more
```

通过分析crash stacktrace 我们可以很轻松的发现问题的根源并解决。


## 哪些方法需要加上检查

  * 本地IO读写
  * 网络操作
  * Bitmap相关的缩放等
  * 其他耗时的任务

## 如何选择工作者线程
Android中的工作者线程API有很多，简单的有Thread,AsyncTask，也有ThreadPool，HandlerThread等。关于如何选择，可以参考这篇文章。[关于Android中工作者线程的思考](http://droidyue.com/newtab.html?url=http%3A%2F%2Fdroidyue.com%2Fblog%2F2015%2F12%2F20%2Fworker-thread-in-android%2F)


## 对比
  * StrictMode 是一把利器，但是检测的东西很多，打印出来的日志可能也有很多，查找定位问题可能不如文章的方法方便。
  * Method Tracing，需要刻意并时不时进行设置start和stop操作，文章的方法，可以说是一劳永逸。

## 检测会不会有性能问题
  * 理论上是不会的，通常这个检测的代价要远远比耗时任务要小很多。
  * 如果想进一步优化的，可以在编译期屏蔽这个方法的调用，即assumenosideeffects，具体可以参考[关于Android Log的一些思考](http://droidyue.com/newtab.html?url=http%3A%2F%2Fdroidyue.com%2Fblog%2F2015%2F11%2F01%2Fthinking-about-android-log%2F)中的编译期屏蔽 的内容。

## 延伸阅读
  * [详解 Android 中的 HandlerThread](http://droidyue.com/newtab.html?url=http%3A%2F%2Fdroidyue.com%2Fblog%2F2015%2F11%2F08%2Fmake-use-of-handlerthread%2F)
  * [Android性能调优利器StrictMode](http://droidyue.com/newtab.html?url=http%3A%2F%2Fdroidyue.com%2Fblog%2F2015%2F09%2F26%2Fandroid-tuning-tool-strictmode%2F)
  * [Android中检测当前是否为主线程](http://droidyue.com/newtab.html?url=http%3A%2F%2Fdroidyue.com%2Fblog%2F2014%2F07%2F12%2Fcheck-main-thread-in-android-chinese-edition%2F)
  * [说说Android中的ANR](http://droidyue.com/newtab.html?url=http%3A%2F%2Fdroidyue.com%2Fblog%2F2015%2F07%2F18%2Fanr-in-android%2F)


当你刚刚写完一个方法时，考虑这一下这个方法会不会很耗时，如果耗时，不妨增加一个线程的check。注意，一定要加载debug版，不要影响到线上的用户。

