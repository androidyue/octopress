---
layout: post
title: "Android内存泄漏检测利器：LeakCanary"
date: 2016-03-28 07:02
comments: true
categories: Android
---

##是什么？

一言以蔽之：LeakCanary是一个**傻瓜化**并且可视化的内存泄露分析工具

##为什么需要LeakCanary？
因为它简单，易于发现问题，人人可参与。

  * 简单：只需设置一段代码即可，打开应用运行一下就能够发现内存泄露。而MAT分析需要Heap Dump，获取文件，手动分析等多个步骤。
  * 易于发现问题：在手机端即可查看问题即引用关系，而MAT则需要你分析，找到Path To GC Roots等关系。
  * 人人可参与：开发人员，测试测试，产品经理基本上只要会用App就有可能发现问题。而传统的MAT方式，只有部分开发者才有精力和能力实施。

<!--more-->
##如何集成
尽量在app下的build.gradle中加入以下依赖
```
 dependencies {
   debugCompile 'com.squareup.leakcanary:leakcanary-android:1.3.1' // or 1.4-beta1
   releaseCompile 'com.squareup.leakcanary:leakcanary-android-no-op:1.3.1' // or 1.4-beta1
   testCompile 'com.squareup.leakcanary:leakcanary-android-no-op:1.3.1' // or 1.4-beta1
 }
```

在Application中加入类似如下的代码
```java
public class ExampleApplication extends Application {

  @Override public void onCreate() {
    super.onCreate();
    LeakCanary.install(this);
  }
}
```

到这里你就可以检测到Activity的内容泄露了。其实现原理是设置Application的ActivityLifecycleCallbacks方法监控所有Activity的生命周期回调。内部实现代码为
```java
public final class ActivityRefWatcher {
    private final ActivityLifecycleCallbacks lifecycleCallbacks = new ActivityLifecycleCallbacks() {
        public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
        }

        public void onActivityStarted(Activity activity) {
        }

        public void onActivityResumed(Activity activity) {
        }

        public void onActivityPaused(Activity activity) {
        }

        public void onActivityStopped(Activity activity) {
        }

        public void onActivitySaveInstanceState(Activity activity, Bundle outState) {
        }

        public void onActivityDestroyed(Activity activity) {
            ActivityRefWatcher.this.onActivityDestroyed(activity);
        }
    };
    private final Application application;
    private final RefWatcher refWatcher;

    public static void installOnIcsPlus(Application application, RefWatcher refWatcher) {
        if(VERSION.SDK_INT >= 14) {
            ActivityRefWatcher activityRefWatcher = new ActivityRefWatcher(application, refWatcher);
            activityRefWatcher.watchActivities();
        }
    }
....
}
```

##想要检测更多?
首先我们需要获得一个RefWatcher，用来后续监控可能发生泄漏的对象
```
public class MyApplication extends Application {
    private static RefWatcher sRefWatcher;


    @Override
    public void onCreate() {
        super.onCreate();
        sRefWatcher = LeakCanary.install(this);
    }

    public static RefWatcher getRefWatcher() {
        return sRefWatcher;
    }
}
```

监控某个可能存在内存泄露的对象
```
MyApplication.getRefWatcher().watch(sLeaky);
```
##哪些需要进行监控
默认情况下，是对Activity进行了检测。另一个需要监控的重要对象就是Fragment实例。因为它和Activity实例一样可能持有大量的视图以及视图需要的资源（比如Bitmap）即在Fragment onDestroy方法中加入如下实现
```java
public class MainFragment extends Fragment {
    @Override
    public void onDestroy() {
        super.onDestroy();
        MyApplication.getRefWatcher().watch(this);
    }
}
```

其他也可以监控的对象

  * BroadcastReceiver
  * Service
  * 其他有生命周期的对象
  * 直接间接持有大内存占用的对象（即Retained Heap值比较大的对象）

##何时进行监控
首先，我们需要明确什么是内存泄露，简而言之，某个对象在该释放的时候由于被其他对象持有没有被释放，因而造成了内存泄露。

因此，我们监控也需要设置**在对象（很快）被释放的时候**，如Activity和Fragment的onDestroy方法。

一个错误示例，比如监控一个Activity，放在onCreate就会大错特错了，那么你每次都会收到Activity的泄露通知。

##如何解决
常用的解决方法思路如下

  * 尽量使用Application的Context而不是Activity的
  * 使用弱引用或者软引用
  * 手动设置null，解除引用关系
  * 将内部类设置为static，不隐式持有外部的实例
  * 注册与反注册成对出现，在对象合适的生命周期进行反注册操作。
  * 如果没有修改的权限，比如系统或者第三方SDK，可以使用反射进行解决持有关系




##加入例外
有些特殊情况，我们需要忽略一些问题，这时候就需要添加例外规则。比如ExampleClass.exampleField会导致内存泄漏，我们想要忽略，如下操作即可。
```
// ExampleApplication is defined in "Customizing and using the no-op dependency"
public class DebugExampleApplication extends ExampleApplication {
  protected RefWatcher installLeakCanary() {
    ExcludedRefs excludedRefs = AndroidExcludedRefs.createAppDefaults()
        .instanceField("com.example.ExampleClass", "exampleField")
        .build();
    return LeakCanary.install(this, DisplayLeakService.class, excludedRefs);
  }
}
```

##如何实现的
LeakCanary实际上就是在本机上自动做了Heap dump，然后对生成的hprof文件分析，进行结果展示。和手工进行MAT分析步骤基本一致。

##如何不影响对外版APK
是的，这个问题确实值得关注，因为LeakCanary确实是影响程序运行的，尤其是heap dump操作，不过好在这件事Square已经考虑了，即在我们增加依赖时
```java
debugCompile 'com.squareup.leakcanary:leakcanary-android:1.3.1' // or 1.4-beta1
releaseCompile 'com.squareup.leakcanary:leakcanary-android-no-op:1.3.1' // or 1.4-beta1
testCompile 'com.squareup.leakcanary:leakcanary-android-no-op:1.3.1' // or 1.4-beta1
```
其中releaseCompile和testCompile这两个的依赖明显不同于debugCompile的依赖。它们的依赖属于NOOP操作。

NOOP，即No Operation Performed，无操作指令。常用的编译器技术会检测无操作指令并出于优化的目的将无操作指令剔除。

因而，只要配置好releaseCompile和testCompile的依赖，就无需担心对外版本的性能问题了。



##实践中的问题
  * ~~如果targetSdkVersion为23，在6.0的机器上会存在问题，卡死，因为LeakCanary并没有很好支持[Marshmallow运行时权限](http://droidyue.com/blog/2016/01/17/understanding-marshmallow-runtime-permission/)，所以始终得不到sd卡权限，进而导致卡死。~~
  * 目前LeakCanary已经完美支持运行时权限，大家可以放心使用。

##注意
  * 目前LeakCanary一次只能报一个泄漏问题，如果存在内存泄漏但不是你的模块，并不能说明这个模块没有问题。建议建议将非本模块的泄漏解决之后，再进行检测。

##Anroid中内存泄漏相关文章
  * [避免Android中Context引起的内存泄露](http://droidyue.com/blog/2015/04/12/avoid-memory-leaks-on-context-in-android/)
  * [Android中Handler引起的内存泄露](http://droidyue.com/blog/2014/12/28/in-android-handler-classes-should-be-static-or-leaks-might-occur/)
  * [Google为何这样设计OnSharedPreferenceChangeListener](http://droidyue.com/blog/2014/11/29/why-onsharedpreferencechangelistener-was-not-called/)
  * [Google IO：Android内存管理主题演讲记录](http://droidyue.com/blog/2014/11/02/note-for-google-io-memory-management-for-android-chinese-edition/)
  * [译文：理解Java中的弱引用](http://droidyue.com/blog/2014/10/12/understanding-weakreference-in-java/)
  * [细话Java："失效"的private修饰符](http://droidyue.com/blog/2014/10/02/the-private-modifier-in-java/)

##参考
  * [LeakCanary](https://github.com/square/leakcanary)
