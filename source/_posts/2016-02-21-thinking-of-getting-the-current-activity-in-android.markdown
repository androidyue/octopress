---
layout: post
title: "关于获取当前Activity的一些思考"
date: 2016-02-21 20:53
comments: true
categories: Android 思考
---
在Android开发过程中，我们有时候需要获取当前的Activity实例，比如弹出Dialog操作，必须要用到这个。关于如何实现由很多种思路，这其中有的简单，有的复杂，这里简单总结一下个人的一些经验吧。

<!--more-->
##反射
反射是我们经常会想到的方法，思路大概为

  1 获取ActivityThread中所有的ActivityRecord   
  2 从ActivityRecord中获取状态不是`pause`的Activity并返回


一个使用反射来实现的代码大致如下
```java
	public static Activity getActivity() {
        Class activityThreadClass = null;
        try {
            activityThreadClass = Class.forName("android.app.ActivityThread");
            Object activityThread = activityThreadClass.getMethod("currentActivityThread").invoke(null);
            Field activitiesField = activityThreadClass.getDeclaredField("mActivities");
            activitiesField.setAccessible(true);
            Map activities = (Map) activitiesField.get(activityThread);
            for (Object activityRecord : activities.values()) {
                Class activityRecordClass = activityRecord.getClass();
                Field pausedField = activityRecordClass.getDeclaredField("paused");
                pausedField.setAccessible(true);
                if (!pausedField.getBoolean(activityRecord)) {
                    Field activityField = activityRecordClass.getDeclaredField("activity");
                    activityField.setAccessible(true);
                    Activity activity = (Activity) activityField.get(activityRecord);
                    return activity;
                }
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        }
        return null;
    }
```

然而这种方法并不是很推荐，主要是有以下的不足：
  
  * 反射通常会比较慢
  * 不稳定性，这个才是不推荐的原因，Android框架代码存在修改的可能性，谁要无法100%保证`mActivities`，`paused`固定不变。所以可靠性不是完全可靠。


##Activity基类
既然反射不是很可靠，那么有一种比较可靠的方式，就是使用Activity基类。

在Activity的`onResume`方法中，将当前的Activity实例保存到一个变量中。
```java
public class BaseActivity extends Activity{

    @Override
    protected void onResume() {
        super.onResume();
        MyActivityManager.getInstance().setCurrentActivity(this);
    }
}
```

然而，这一种方法也不仅完美，因为这种方法是基于约定的，所以必须每个Activity都继承BaseActivity，如果一旦出现没有继承BaseActivity的就可能有问题。

##回调方法
介绍了上面两种不是尽善尽美的方法，这里实际上还是有一种更便捷的方法，那就是通过Framework提供的回调来实现。

Android自 API 14开始引入了一个方法，即Application的`registerActivityLifecycleCallbacks`方法，用来监听所有Activity的生命周期回调，比如`onActivityCreated`,`onActivityResumed`等。

So，一个简单的实现如下
```java
public class MyApplication extends Application {


    @Override
    public void onCreate() {
        super.onCreate();
        registerActivityLifecycleCallbacks(new ActivityLifecycleCallbacks() {
            @Override
            public void onActivityCreated(Activity activity, Bundle savedInstanceState) {

            }

            @Override
            public void onActivityStarted(Activity activity) {

            }

            @Override
            public void onActivityResumed(Activity activity) {
                MyActivityManager.getInstance().setCurrentActivity(activity);
            }

            @Override
            public void onActivityPaused(Activity activity) {

            }

            @Override
            public void onActivityStopped(Activity activity) {

            }

            @Override
            public void onActivitySaveInstanceState(Activity activity, Bundle outState) {

            }

            @Override
            public void onActivityDestroyed(Activity activity) {

            }
        });
    }
}
```

然而，金无足赤人无完人，这种方法唯一的遗憾就是只支持API 14即其以上。不过还在现在大多数设备都满足了这个要求。

###为什么是弱引用
可能有人会带着疑问看到这里，MyActivityManager是个什么鬼，好，我们现在看一下这个类的实现
```java
public class MyActivityManager {
    private static MyActivityManager sInstance = new MyActivityManager();
    private WeakReference<Activity> sCurrentActivityWeakRef;


    private MyActivityManager() {

    }

    public static MyActivityManager getInstance() {
        return sInstance;
    }

    public Activity getCurrentActivity() {
        Activity currentActivity = null;
        if (sCurrentActivityWeakRef != null) {
            currentActivity = sCurrentActivityWeakRef.get();
        }
        return currentActivity;
    }

    public void setCurrentActivity(Activity activity) {
        sCurrentActivityWeakRef = new WeakReference<Activity>(activity);
    }


}
```

这个类，实现了当前Activity的设置和获取。

那么为什么要使用弱引用持有Activity实例呢？

其实最主要的目的就是避免内存泄露，因为使用默认的强引用会导致Activity实例无法释放，导致内存泄露的出现。详细了解弱引用，请参考本文[译文：理解Java中的弱引用](http://droidyue.com/blog/2014/10/12/understanding-weakreference-in-java/)


##Demo源码
  * [GetCurrentActivityDemo](https://github.com/androidyue/GetCurrentActivityDemo)
