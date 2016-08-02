---
layout: post
title: "如何在Android中避免创建不必要的对象"
date: 2016-08-01 19:28
comments: true
categories: Android 内存优化
---

在编程开发中，内存的占用是我们经常要面对的现实，通常的内存调优的方向就是尽量减少内存的占用。这其中避免创建不必要的对象是一项重要的方面。

Android设备不像PC那样有着足够大的内存，而且单个App占用的内存实际上是比较小的。所以避免创建不必要的对象对于Android开发尤为重要。

本文会介绍一些常见的避免创建对象的场景和方法，其中有些属于微优化，有的属于编码技巧，当然也有确实能够起到显著效果的方法。

<!--more-->

##使用单例
单例是我们常用的设计模式，使用这种模式，我们可以只提供一个对象供全局调用。因此单例是避免创建不必要的对象的一种方式。

单例模式上手容易，但是需要注意很多问题，最重要的就是多线程并发的情况下保证单例的唯一性。当然方式很多，比如饿汉式，懒汉式double-check等。这里介绍一个很极客的书写单例的方式。
```java
public class SingleInstance {
  private SingleInstance() {
  }
  
  public static SingleInstance getInstance() {
      return SingleInstanceHolder.sInstance;
  }
  
  private static class SingleInstanceHolder {
      private static SingleInstance sInstance = new SingleInstance();
  }
}
```
在Java中，类的静态初始化会在类被加载时触发，我们利用这个原理，可以实现利用这一特性，结合内部类，可以实现上面的代码，进行懒汉式创建实例。

关于单例，可以详细参考文章[单例这种设计模式](http://droidyue.com/blog/2015/01/11/looking-into-singleton/)

##避免进行隐式装箱
自动装箱是Java 5 引入的一个特性，即自动将原始类型的数据转换成对应的引用类型，比如将int转为Integer等。

这种特性，极大的减少了编码时的琐碎工作，但是稍有不注意就可能创建了不必要的对象了。比如下面的代码

```java
Integer sum = 0;
for(int i=1000; i<5000; i++){
   sum+=i;
}
```
上面的代码sum+=i可以看成sum = sum + i，但是+这个操作符不适用于Integer对象，首先sum进行自动拆箱操作，进行数值相加操作，最后发生自动装箱操作转换成Integer对象。其内部变化如下
```
int result = sum.intValue() + i;
Integer sum = new Integer(result);
```
由于我们这里声明的sum为Integer类型，在上面的循环中会创建将近4000个无用的Integer对象，在这样庞大的循环中，会降低程序的性能并且加重了垃圾回收的工作量。因此在我们编程时，需要注意到这一点，正确地声明变量类型，避免因为自动装箱引起的性能问题。

另外，当将原始数据类型的值加入集合中时，也会发生自动装箱，所以这个过程中也是有对象创建的。如有需要避免这种情况，可以选择`SparseArray`,`SparseBooleanArray`,`SparseLongArray`等容器。

关于Java中的自动装箱与拆箱，参考文章[Java中的自动装箱与拆箱](http://droidyue.com/blog/2015/04/07/autoboxing-and-autounboxing-in-java/)

##谨慎选用容器
Java和Android提供了很多编辑的容器集合来组织对象。比如`ArrayList`,`ContentValues`,`HashMap`等。

然而，这样容器虽然使用起来方便，但也存在一些问题，就是他们会自动扩容，这其中不是创建新的对象，而是创建一个更大的容器对象。这就意味这将占用更大的内存空间。

以HashMap为例，当我们put key和value时，会检测是否需要扩容，如需要则双倍扩容
```
@Override public V put(K key, V value) {
        if (key == null) {
            return putValueForNullKey(value);
        }
        //some code here

        // No entry for (non-null) key is present; create one
        modCount++;
        if (size++ > threshold) {
            tab = doubleCapacity();
            index = hash & (tab.length - 1);
        }
        addNewEntry(key, value, hash, index);
        return null;
    }
```

关于扩容的问题，通常有如下几种方法

  * 预估一个较大的容量值，避免多次扩容
  * 寻找替代的数据结构，确保做到时间和空间的平衡


##用好LaunchMode
提到LaunchMode必然和Activity有关系。正常情况下我们在manifest中声明Activity，如果不设置LaunchMode就使用默认的standard模式。

一旦设置成standard，每当有一次Intent请求，就会创建一个新的Activity实例。举个例子，如果有10个撰写邮件的Intent，那么就会创建10个ComposeMailActivity的实例来处理这些Intent。结果很明显，这种模式会创建某个Activity的多个实例。

如果对于一个搜索功能的Activity，实际上保持一个Activity示例就可以了，使用standard模式会造成Activity实例的过多创建，因而不好。

确保符合常理的情况下，合理的使用LaunchMode，减少Activity的创建。

详细了解LaunchMode，阅读文章[深入讲解Android中Activity launchMode
](http://droidyue.com/blog/2015/08/16/dive-into-android-activity-launchmode/)

##Activity处理onConfigurationChanged
这又是一个关于Activity对象创建相关的，因为Activity创建的成本相对其他对象要高很多。

默认情况下，当我们进行屏幕旋转时，原Activity会销毁，一个新的Activity被创建，之所以这样做是为了处理布局适应。当然这是系统默认的做法，在我们开发可控的情况下，我们可以避免重新创建Activity。

以屏幕切换为例，在Activity声明时，加上
```
<activity
    android:name=".MainActivity"
    android:label="@string/app_name"
    android:theme="@style/AppTheme.NoActionBar"
    android:configChanges="orientation" 
>
```
然后重写Activity的onConfigurationChanged方法
```java
public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    if (newConfig.orientation == Configuration.ORIENTATION_PORTRAIT) {
        setContentView(R.layout.portrait_layout);
    } else if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE) {
        setContentView(R.layout.landscape_layout);
    }
}
```

##注意字符串拼接
字符串这个或许是最不起眼的一项了。这里主要讲的是字符串的拼接

```java
Log.i(LOGTAG, "onCreate bundle=" + savedInstanceState);
```
这应该是我们最常见的打log的方式了，然而字符串的拼接内部实际是生成StringBuilder对象，然后挨个进行append，直至最后调用toString方法的过程。

下面是一段代码循环的代码，这明显是很不好的，因为这其中创建了很多的StringBuilder对象。
```java
public void  implicitUseStringBuilder(String[] values) {
  String result = "";
  for (int i = 0 ; i < values.length; i ++) {
      result += values[i];
  }
  System.out.println(result);
}
```

降低字符串拼接的方法有
  
  * 使用String.format替换
  * 如果是循环拼接，建议显式在循环外部创建StringBuilder使用

关于字符串拼接的原理考究，可以参考这篇文章[Java细节：字符串的拼接
](http://droidyue.com/blog/2014/08/30/java-details-string-concatenation/)

##减少布局层级
布局层级过多，不仅导致inflate过程耗时，还多创建了多余的辅助布局。所以减少辅助布局还是很有必要的。可以尝试其他布局方式或者自定义视图来解决这类的问题。

##提前检查，减少不必要的异常
异常对于程序来说，在平常不过了，然后其实异常的代码很高的，因为它需要收集现场数据stacktrace。但是还是有一些避免异常抛出的措施的，那就是做一些提前检查。

比如，我们想要打印一个文件的每一行字符串，没做检查的代码如下，是存在FileNotFoundException抛出可能的。
```java
private void printFileByLine(String filePath) {
    try {
        FileInputStream inputStream = new FileInputStream("textfile.txt");
        BufferedReader br = new BufferedReader(new InputStreamReader(inputStream));
        String strLine;
        //Read File Line By Line
        while ((strLine = br.readLine()) != null)   {
            // Print the content on the console
            System.out.println (strLine);
        }
        br.close();
    } catch(FileNotFoundException e) {
        e.printStackTrace(); 
    } catch (IOException e) {
        e.printStackTrace(); 
    }
}
```

如果我们进行文件是否存在的检查，抛出FileNotFoundException的概率会减少很多，
```java
private void printFileByLine(String filePath) {
        if (!new File(filePath).exists()) {
            return; 
        }
        try {
            FileInputStream inputStream = new FileInputStream("textfile.txt");
            BufferedReader br = new BufferedReader(new InputStreamReader(inputStream));
            String strLine;
            //Read File Line By Line
            while ((strLine = br.readLine()) != null)   {
                // Print the content on the console
                System.out.println (strLine);
            }
            br.close();
        } catch(FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
```
上述的检查是一个不错的编码技巧，建议采纳。

##不要过多创建线程
在android中，我们应该尽量避免在主线程中执行耗时的操作，因而需要使用其他线程。
```java
private void testThread() {
    new Thread() {
        @Override
        public void run() {
            super.run();
            //do some io work
        }
    }.start();
}
```
虽然这些能工作，但是创建线程的代价远比普通对象要高的多，建议使用HandlerThread或者ThreadPool做替换。

关于HandlerThread的文章，[详解 Android 中的 HandlerThread
](http://droidyue.com/blog/2015/11/08/make-use-of-handlerthread/index.html)

关于工作者线程,可以参考文章[关于Android中工作者线程的思考](http://droidyue.com/blog/2015/12/20/worker-thread-in-android/)

##使用注解替代枚举
枚举是我们经常使用的一种用作值限定的手段，使用枚举比单纯的常量约定要靠谱。然后枚举的实质还是创建对象。好在Android提供了相关的注解，使得值限定在编译时进行，进而减少了运行时的压力。相关的注解为IntDef和StringDef。

如下以IntDef为例，介绍如何使用

在一个文件中如下声明
```java
public class AppConstants {
    public static final int STATE_OPEN = 0;
    public static final int STATE_CLOSE = 1;
    public static final int STATE_BROKEN = 2;

    @IntDef({STATE_OPEN, STATE_CLOSE, STATE_BROKEN})
    public @interface  DoorState {}
}
```
然后设置书写这样的方法
```java
private void setDoorState(@AppConstants.DoorState int state) {
    //some code
}
```
当调用方法时只能使用`STATE_OPEN`，`STATE_CLOSE`和`STATE_BROKEN`。使用其他值会导致编译提醒和警告。

想要深入了解注解，可以阅读[详解Java中的注解](http://droidyue.com/blog/2016/04/24/look-into-java-annotation/)

##选用对象池
在Android中有很多池的概念，如线程池，连接池。包括我们很长用的Handler.Message就是使用了池的技术。

比如，我们想要使用Handler发送消息，可以使用`Message msg = new Message()`，也可以使用`Message msg = handler.obtainMessage()`。使用池并不会每一次都创建新的对象，而是优先从池中取对象。

使用对象池需要需要注意几点

  * 将对象放回池中，注意初始化对象的数据，防止存在脏数据
  * 合理控制池的增长，避免过大，导致很多对象处于闲置状态

##谨慎初始化Application
Android应用可以支持开启多个进程。
通常的做法是这样
```
<service android:name=".NetworkService"
    android:process=":network"
/>
```
通常我们在Application的`onCreate`方法中会做很多初始化操作,但是每个进程启动都需要执行到这个onCreate方法,为了避免不必要的初始化,建议按照进程(通过判断当前进程名)对应初始化.
```java
public class MyApplication extends Application {
    private static final String LOGTAG = "MyApplication";

    @Override
    public void onCreate() {
        String currentProcessName = getCurrentProcessName();
        Log.i(LOGTAG, "onCreate currentProcessName=" + currentProcessName);
        super.onCreate();
        if (getPackageName().equals(currentProcessName)) {
            //init for default process
        } else if (currentProcessName.endsWith(":network")) {
            //init for netowrk process
        }
    }

    private String getCurrentProcessName() {
        String currentProcessName = "";
        int pid = android.os.Process.myPid();
        ActivityManager manager = (ActivityManager) this.getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningAppProcessInfo processInfo : manager.getRunningAppProcesses()) {
            if (processInfo.pid == pid) {
                currentProcessName = processInfo.processName;
                break;
            }
        }
        return currentProcessName;
    }
}
```

上面的一些知识就是关于Android中如何避免创建多余对象的总结.欢迎提出意见和观点,共同进步.
