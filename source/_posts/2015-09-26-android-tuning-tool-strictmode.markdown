---
layout: post
title: "Android性能调优利器StrictMode"
date: 2015-09-26 20:50
comments: true
categories: Android 性能优化
---
作为Android开发，日常的开发工作中或多或少要接触到性能问题，比如我的Android程序运行缓慢卡顿，并且常常出现ANR对话框等等问题。既然有性能问题，就需要进行性能优化。正所谓工欲善其事，必先利其器。一个好的工具，可以帮助我们发现并定位问题，进而有的放矢进行解决。本文主要介绍StrictMode 在Android 应用开发中的应用和一些问题。
<!--more-->
##什么是StrictMode
StrictMode意思为严格模式，是用来检测程序中违例情况的开发者工具。最常用的场景就是检测主线程中本地磁盘和网络读写等耗时的操作。  

###严在哪里
既然叫做严格模式，那么又严格在哪些地方呢？  
在Android中，主线程，也就是UI线程，除了负责处理UI相关的操作外，还可以执行文件读取或者数据库读写操作（从Android 4.0 开始，网络操作禁止在主线程中执行，否则会抛出[NetworkOnMainThreadException](http://droidyue.com/blog/2014/11/08/look-into-android-dot-os-dot-networkonmainthreadexception/)）。使用严格模式，系统检测出主线程违例的情况会做出相应的反应，如日志打印，弹出对话框亦或者崩溃等。换言之，严格模式会将应用的违例细节暴露给开发者方便优化与改善。

###具体能检测什么
严格模式主要检测两大问题，一个是线程策略，即TreadPolicy，另一个是VM策略，即VmPolicy。

###ThreadPolicy
线程策略检测的内容有

  * 自定义的耗时调用 使用**detectCustomSlowCalls()**开启
  * 磁盘读取操作 使用**detectDiskReads()**开启
  * 磁盘写入操作 使用**detectDiskWrites()**开启
  * 网络操作  使用**detectNetwork()**开启

###VmPolicy
虚拟机策略检测的内容有

  * Activity泄露 使用**detectActivityLeaks()**开启
  * 未关闭的Closable对象泄露  使用**detectLeakedClosableObjects()**开启
  * 泄露的Sqlite对象  使用**detectLeakedSqlLiteObjects()**开启
  * 检测实例数量 使用**setClassInstanceLimit()**开启

##工作原理
其实StrictMode实现原理也比较简单，以IO操作为例，主要是通过在open，read，write，close时进行监控。`libcore.io.BlockGuardOs`文件就是监控的地方。以open为例，如下进行监控。

```java
@Override
public FileDescriptor open(String path, int flags, int mode) throws ErrnoException {
	BlockGuard.getThreadPolicy().onReadFromDisk();
    if ((mode & O_ACCMODE) != O_RDONLY) {
    	BlockGuard.getThreadPolicy().onWriteToDisk();
    }
    return os.open(path, flags, mode);
}
```
其中**onReadFromDisk()**方法的实现，代码位于StrictMode.java中。
```
public void onReadFromDisk() {
    if ((mPolicyMask & DETECT_DISK_READ) == 0) {
    	return;
    }
    if (tooManyViolationsThisLoop()) {
    	return;
    }
    BlockGuard.BlockGuardPolicyException e = new StrictModeDiskReadViolation(mPolicyMask);
    e.fillInStackTrace();
    startHandlingViolationException(e);
}
```
##如何使用
关于StrictMode如何使用，最重要的就是如何启用严格模式。

###放在哪里
严格模式的开启可以放在Application或者Activity以及其他组件的onCreate方法。为了更好地分析应用中的问题，建议放在Application的onCreate方法中。

###简单启用
以下的代码启用全部的ThreadPolicy和VmPolicy违例检测
```java
if (IS_DEBUG && Build.VERSION.SDK_INT >= Build.VERSION_CODES.GINGERBREAD) {
    StrictMode.setThreadPolicy(new StrictMode.ThreadPolicy.Builder().detectAll().penaltyLog().build());
	StrictMode.setVmPolicy(new VmPolicy.Builder().detectAll().penaltyLog().build());
}
```
严格模式需要在debug模式开启，不要在release版本中启用。

同时，严格模式自API 9 开始引入，某些API方法也从 API 11 引入。使用时应该注意 API 级别。

如有需要，也可以开启部分的严格模式。

###查看结果
严格模式有很多种报告违例的形式，但是想要分析具体违例情况，还是需要查看日志，终端下过滤StrictMode就能得到违例的具体stacktrace信息。
```bash
adb logcat | grep StrictMode
```

##解决违例
  * 如果是主线程中出现文件读写违例，建议使用工作线程（必要时结合Handler）完成。
  * 如果是对SharedPreferences写入操作，在API 9 以上 建议优先调用apply而非commit。
  * 如果是存在未关闭的Closable对象，根据对应的stacktrace进行关闭。
  * 如果是SQLite对象泄露，根据对应的stacktrace进行释放。

举个例子

以主线程中的文件写入为例，引起违例警告的代码
```java
public void writeToExternalStorage() {
    File externalStorage = Environment.getExternalStorageDirectory();
    File destFile = new File(externalStorage, "dest.txt");
    try {
    	OutputStream output = new FileOutputStream(destFile, true);
        output.write("droidyue.com".getBytes());
        output.flush();
        output.close();
    } catch (FileNotFoundException e) {
   		e.printStackTrace();
    } catch (IOException e) {
    	e.printStackTrace();
    }
}
```
引起的警告为
```bash
D/StrictMode( 9730): StrictMode policy violation; ~duration=20 ms: android.os.StrictMode$StrictModeDiskReadViolation: policy=31 violation=2
D/StrictMode( 9730): 	at android.os.StrictMode$AndroidBlockGuardPolicy.onReadFromDisk(StrictMode.java:1176)
D/StrictMode( 9730): 	at libcore.io.BlockGuardOs.open(BlockGuardOs.java:106)
D/StrictMode( 9730): 	at libcore.io.IoBridge.open(IoBridge.java:390)
D/StrictMode( 9730): 	at java.io.FileOutputStream.<init>(FileOutputStream.java:88)
D/StrictMode( 9730): 	at com.example.strictmodedemo.MainActivity.writeToExternalStorage(MainActivity.java:56)
D/StrictMode( 9730): 	at com.example.strictmodedemo.MainActivity.onCreate(MainActivity.java:30)
D/StrictMode( 9730): 	at android.app.Activity.performCreate(Activity.java:4543)
```
因为上述属于主线程中的IO违例，解决方法就是讲写入操作放入工作线程。
```
public void writeToExternalStorage() {
    new Thread() {
	    @Override
	    public void run() {
	    	super.run();
	    	File externalStorage = Environment.getExternalStorageDirectory();
	    	File destFile = new File(externalStorage, "dest.txt");
	    	try {
	    		OutputStream output = new FileOutputStream(destFile, true);
	        	output.write("droidyue.com".getBytes());
	        	output.flush();
	        	output.close();
	        } catch (FileNotFoundException e) {
	        	e.printStackTrace();
	        } catch (IOException e) {
	        	e.printStackTrace();
			}
	    }
  	}.start();
}
```
然而这并非完善，因为OutputStream.write方法可能抛出IOException，导致存在OutputStream对象未关闭的情况，仍然需要改进避免出现Closable对象未关闭的违例。改进如下
```java
public void writeToExternalStorage() {
    new Thread() {
    	@Override
        public void run() {
        	super.run();
            File externalStorage = Environment.getExternalStorageDirectory();
            File destFile = new File(externalStorage, "dest.txt");
            OutputStream output = null;
            try {
                output = new FileOutputStream(destFile, true);
                output.write("droidyue.com".getBytes());
                output.flush();
                output.close();
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                if (null != output) {
                    try {
                    	output.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }.start();
}
```



##检测内存泄露
通常情况下，检测内存泄露，我们需要使用MAT对heap dump 文件进行分析，这种操作不困难，但也不容易。使用严格模式，只需要过滤日志就能发现内存泄露。

这里以Activity为例说明，首先我们需要开启对检测Activity泄露的违例检测。使用上面的detectAll或者detectActivityLeaks()均可。其次写一段能够产生Activity泄露的代码。
```
public class LeakyActivity extends Activity{
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        MyApplication.sLeakyActivities.add(this);
    }
}
```
MyApplication中关于sLeakyActivities的部分实现
```java
public class MyApplication extends Application {
	public static final boolean IS_DEBUG = true;
    public static ArrayList<Activity> sLeakyActivities = new ArrayList<Activity>();

}
```

当我们反复进入LeakyActivity再退出，过滤StrictMode就会得到这样的日志
```bash
E/StrictMode( 2622): class com.example.strictmodedemo.LeakyActivity; instances=2; limit=1
E/StrictMode( 2622): android.os.StrictMode$InstanceCountViolation: class com.example.strictmodedemo.LeakyActivity; instances=2; limit=1
E/StrictMode( 2622): 	at android.os.StrictMode.setClassInstanceLimit(StrictMode.java:1)
```
分析日志，LeakyActivity本应该是只存在一份实例，但现在出现了2个，说明LeakyActivity发生了内存泄露。

严格模式除了可以检测Activity的内存泄露之外，还能自定义检测类的实例泄露。从API 11 开始，系统提供的这个方法可以实现我们的需求。
```
public StrictMode.VmPolicy.Builder setClassInstanceLimit (Class klass, int instanceLimit)
```
举个栗子，比如一个浏览器中只允许存在一个SearchBox实例，我们就可以这样设置已检测SearchBox实例的泄露
```
StrictMode.setVmPolicy(new VmPolicy.Builder().setClassInstanceLimit(SearchBox.class, 1).penaltyLog().build());
```

##noteSlowCall
StrictMode从 API 11开始允许开发者自定义一些耗时调用违例，这种自定义适用于自定义的任务执行类中，比如我们有一个进行任务处理的类，为TaskExecutor。
```
public class TaskExecutor {
    public void execute(Runnable task) {
        task.run();
    }
}
```
先需要跟踪每个任务的耗时情况，如果大于500毫秒需要提示给开发者，noteSlowCall就可以实现这个功能，如下修改代码
```java
public class TaskExecutor {

    private static long SLOW_CALL_THRESHOLD = 500;
    public void executeTask(Runnable task) {
        long startTime = SystemClock.uptimeMillis();
        task.run();
        long cost = SystemClock.uptimeMillis() - startTime;
        if (cost > SLOW_CALL_THRESHOLD) {
            StrictMode.noteSlowCall("slowCall cost=" + cost);
        }
    }
}
```
执行一个耗时2000毫秒的任务
```bash
TaskExecutor executor = new TaskExecutor();
executor.executeTask(new Runnable() {
	@Override
    public void run() {
        try {
        	Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
});
```
得到的违例日志，注意其中`~duration=20 ms`并非耗时任务的执行时间，而我们的自定义信息`msg=slowCall cost=2000`才包含了真正的耗时。
```bash
D/StrictMode(23890): StrictMode policy violation; ~duration=20 ms: android.os.StrictMode$StrictModeCustomViolation: policy=31 violation=8 msg=slowCall cost=2000
D/StrictMode(23890): 	at android.os.StrictMode$AndroidBlockGuardPolicy.onCustomSlowCall(StrictMode.java:1163)
D/StrictMode(23890): 	at android.os.StrictMode.noteSlowCall(StrictMode.java:1974)
D/StrictMode(23890): 	at com.example.strictmodedemo.TaskExecutor.executeTask(TaskExecutor.java:17)
D/StrictMode(23890): 	at com.example.strictmodedemo.MainActivity.onCreate(MainActivity.java:36)
D/StrictMode(23890): 	at android.app.Activity.performCreate(Activity.java:4543)
D/StrictMode(23890): 	at android.app.Instrumentation.callActivityOnCreate(Instrumentation.java:1071)
D/StrictMode(23890): 	at android.app.ActivityThread.performLaunchActivity(ActivityThread.java:2158)
D/StrictMode(23890): 	at android.app.ActivityThread.handleLaunchActivity(ActivityThread.java:2237)
D/StrictMode(23890): 	at android.app.ActivityThread.access$600(ActivityThread.java:139)
D/StrictMode(23890): 	at android.app.ActivityThread$H.handleMessage(ActivityThread.java:1262)
D/StrictMode(23890): 	at android.os.Handler.dispatchMessage(Handler.java:99)
D/StrictMode(23890): 	at android.os.Looper.loop(Looper.java:156)
D/StrictMode(23890): 	at android.app.ActivityThread.main(ActivityThread.java:5005)
D/StrictMode(23890): 	at java.lang.reflect.Method.invokeNative(Native Method)
D/StrictMode(23890): 	at java.lang.reflect.Method.invoke(Method.java:511)
D/StrictMode(23890): 	at com.android.internal.os.ZygoteInit$MethodAndArgsCaller.run(ZygoteInit.java:784)
D/StrictMode(23890): 	at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:551)
D/StrictMode(23890): 	at dalvik.system.NativeStart.main(Native Method)
```

##其他技巧
除了通过日志查看之外，我们也可以在开发者选项中开启严格模式，开启之后，如果主线程中有执行时间长的操作，屏幕则会闪烁，这是一个更加直接的方法。

{% img  http://7jpolu.com1.z0.glb.clouddn.com/strictmode_developer_tools.png %}

##问题来了
###日志的时间靠谱么
在下面的过滤日志中，我们看到下面的一个IO操作要消耗31毫秒，这是真的么  
```bash
D/StrictMode( 2921): StrictMode policy violation; ~duration=31 ms: android.os.StrictMode$StrictModeDiskReadViolation: policy=31 violation=2
D/StrictMode( 2921): 	at android.os.StrictMode$AndroidBlockGuardPolicy.onReadFromDisk(StrictMode.java:1176)
D/StrictMode( 2921): 	at libcore.io.BlockGuardOs.read(BlockGuardOs.java:148)
D/StrictMode( 2921): 	at libcore.io.IoBridge.read(IoBridge.java:422)
D/StrictMode( 2921): 	at java.io.FileInputStream.read(FileInputStream.java:179)
D/StrictMode( 2921): 	at java.io.InputStreamReader.read(InputStreamReader.java:244)
D/StrictMode( 2921): 	at java.io.BufferedReader.fillBuf(BufferedReader.java:130)
D/StrictMode( 2921): 	at java.io.BufferedReader.readLine(BufferedReader.java:354)
D/StrictMode( 2921): 	at com.example.strictmodedemo.MainActivity.testReadContentOfFile(MainActivity.java:65)
D/StrictMode( 2921): 	at com.example.strictmodedemo.MainActivity.onCreate(MainActivity.java:28)
D/StrictMode( 2921): 	at android.app.Activity.performCreate(Activity.java:4543)
```

从上面的stacktrace可以看出testReadContentOfFile方法中包含了文件读取IO操作，至于是否为31毫秒，我们可以利用秒表的原理计算一下，即在方法调用的地方如下记录
```java
long startTime = System.currentTimeMillis();
testReadContentOfFile();
long cost = System.currentTimeMillis() - startTime;
Log.d(LOGTAG, "cost = " + cost);
```
得到的日志中上述操作耗时9毫秒，非31毫秒。
```bash
D/MainActivity(20996): cost = 9
```
注：通常情况下StrictMode给出的耗时相对实际情况偏高，并不是真正的耗时数据。

##注意
  * 在线上环境即Release版本不建议开启严格模式。
  * 严格模式无法监控JNI中的磁盘IO和网络请求。
  * 应用中并非需要解决全部的违例情况，比如有些IO操作必须在主线程中进行。

{% include post/book_copyright.html %}
