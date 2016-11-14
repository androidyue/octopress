---
layout: post
title: "Android内存泄漏：谨慎使用getSystemService"
date: 2016-11-14 20:58
comments: true
categories: Android 内存泄漏
---

Android中有很多服务，比如PowerManager,AlarmManager，NotificationManager等，通常使用起来也很方便，就是使用Context.getSystemService方法来获得。

一次在公司开发项目开发中，突然LeakCanary弹出了一个内存泄漏的通知栏，不好，内存泄漏发生了。原因竟是和getSystemService有关。

为了排除干扰因素，我们使用一个简单的示例代码
```java
public class MainActivity extends AppCompatActivity {
    private static PowerManager powerManager;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        powerManager = (PowerManager)getSystemService(Context.POWER_SERVICE);
    }
}
```

<!--more-->

当退出MainActivity时，得到了LeakCanary的内存泄漏报告。如下图。
![http://7jpolu.com1.z0.glb.clouddn.com/device-2016-11-04-081558_compressed.png](http://7jpolu.com1.z0.glb.clouddn.com/device-2016-11-04-081558_compressed.png)

奇怪了，为什么PowerManager会持有Activity的实例呢，按照理解，PowerManager应该是持有Application的Context对象的。

因此，我们有必要对PowerManager的源码分析一下

1.PowerManager会持有一个Context实例，具体使用Activity还是Application的Context取决于调用者。
```java
final Context mContext;
    final IPowerManager mService;
    final Handler mHandler;

    /**
     * {@hide}
     */
    public PowerManager(Context context, IPowerManager service, Handler handler) {
        mContext = context;
        mService = service;
        mHandler = handler;
    }
```

2.负责缓存服务的实现在ContextImpl.java文件中
```
// The system service cache for the system services that are cached per-ContextImpl.
    final Object[] mServiceCache = SystemServiceRegistry.createServiceCache();
```
而Activity通过ContextImpl提供的setOuterContext方法设置mOuterContext
```java
final void setOuterContext(Context context) {
    mOuterContext = context;
}
```
因此Activity与ContextImpl的关系如下图
![http://7jpolu.com1.z0.glb.clouddn.com/QQ20161108-0.png](http://7jpolu.com1.z0.glb.clouddn.com/QQ20161108-0.png)

SystemServiceRegistry.java中获取PowerManager的实现。
```java
registerService(Context.POWER_SERVICE, PowerManager.class,
                new CachedServiceFetcher<PowerManager>() {
            @Override
            public PowerManager createService(ContextImpl ctx) {
                IBinder b = ServiceManager.getService(Context.POWER_SERVICE);
                IPowerManager service = IPowerManager.Stub.asInterface(b);
                if (service == null) {
                    Log.wtf(TAG, "Failed to get power manager service.");
                }
                return new PowerManager(ctx.getOuterContext(),
                        service, ctx.mMainThread.getHandler());
            }});
```

创建具体的服务的实现为core/java/android/app/SystemServiceRegistry.java


##如何解决
###不使用静态持有PowerManager

因为static是一个很容易和内存泄漏产生关联的因素

  * static变量与类的生命周期相同
  * 类的生命周期等同于类加载器
  * 类加载器通常和进程的生命周期一致
  
所以通过去除static可以保证变量周期和Activity实例相同。这样就不会产生内存泄漏问题。  

###使用ApplicationContext
除了上面的方法之外，传入Application的Context而不是Activity Context也可以解决问题。
```java
PowerManager powerManager = (PowerManager)getApplicationContext().getSystemService(Context.POWER_SERVICE);
```

##是不是都要使用Application Context？
然而并非如此

以Activity为例，一些和UI相关的服务已经优先进行了处理
```java
    @Override
    public Object getSystemService(@ServiceName @NonNull String name) {
        if (getBaseContext() == null) {
            throw new IllegalStateException(
                    "System services not available to Activities before onCreate()");
        }

        if (WINDOW_SERVICE.equals(name)) {
            return mWindowManager;
        } else if (SEARCH_SERVICE.equals(name)) {
            ensureSearchManager();
            return mSearchManager;
        }
        return super.getSystemService(name);
    }
```
ContextThemeWrapper也优先处理了LayoutManager服务
```java
    @Override
    public Object getSystemService(String name) {
        if (LAYOUT_INFLATER_SERVICE.equals(name)) {
            if (mInflater == null) {
                mInflater = LayoutInflater.from(getBaseContext()).cloneInContext(this);
            }
            return mInflater;
        }
        return getBaseContext().getSystemService(name);
    }
```

##那到底改用哪个Context
  * 如果服务和UI相关，则用Activity
  * 如果是类似ALARM_SERVICE,CONNECTIVITY_SERVICE建议有限选用Application Context
  * 如果出现出现了内存泄漏，排除问题，可以考虑使用Application Context
  

如需了解更多关于Context的内存泄漏，请阅读

  * [避免Android中Context引起的内存泄露](http://droidyue.com/blog/2015/04/12/avoid-memory-leaks-on-context-in-android/)
  
所以，当我们再次使用getSystemService时要慎重考虑这样的问题。