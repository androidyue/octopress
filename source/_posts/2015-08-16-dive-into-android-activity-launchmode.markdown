---
layout: post
title: "深入讲解Android中Activity launchMode"
date: 2015-08-16 21:22
comments: true
categories: Android
---
Android系统中的Activity可以说一件很赞的设计，它在内存管理上良好的设计，使得多任务管理在Android系统中运行游刃有余。但是Activity绝非启动展示在屏幕而已，其启动方式也大有学问，本文讲具体介绍Activity的启动模式的诸多细节，纠正一些开发中可能错误的观点，帮助大家深入理解Activity。
<!--more-->
##行文之前
在正式行文之前，先介绍一些文章提到的概念

  * 文章后续会提到Task，这里的Task指的是与用户交互的Activity实例的集合。
  * Task中的Activity实例以栈的形式存放，这个栈就是Activity的回退栈。

**本文图片较多，在看图时，请注意观察Activity顶部的title，来区分具体Activity。**

##为何有启动模式
应用中的每一个Activity都是进行不同的事物处理。以邮件客户端为例，InboxActivity目的就是为了展示收件箱，这个Activity不建议创建成多个实例。而ComposeMailActivity则是用来撰写邮件，可以实例化多个此Activity对象。合理地设计Activity对象是否使用已有的实例还是多次创建，会使得交互设计更加良好，也能避免很多问题。至于想要达到前面的目标，就需要使用今天的Activity启动模式。


##如何使用
使用很简单，只需要在manifest中对应的Activity元素加入**android:launchMode**属性即可。如下述代码
```xml
<activity
    android:name=".SingleTaskActivity"
    android:label="singleTask launchMode"
    android:launchMode="singleTask">
</activity>
```

接下来就是介绍launchMode的四个值的时刻了。

##standard
这是launchMode的默认值，Activity不包含android:launchMode或者显示设置为standard的Activity就会使用这种模式。

一旦设置成这个值，**每当有一次Intent请求，就会创建一个新的Activity实例**。举个例子，如果有10个撰写邮件的Intent，那么就会创建10个ComposeMailActivity的实例来处理这些Intent。结果很明显，这种模式会创建某个Activity的多个实例。


###Android 5.0之前的表现
这种Activity新生成的实例会放入发送Intent的Task的栈的顶部。下图为启动同一程序内的Activity。

![pre_lollipop_standard_activity_in_same_app](https://asset.droidyue.com/broken_images_2015/standard_same_app_same_task.jpg)


下面的图片展示跨程序之间调用，新生成的Activity实例会放入发送Intent的Task的栈的顶部，尽管它们属于不同的程序。

![pre_lollipop cross app](https://asset.droidyue.com/broken_images_2015/standard_cross_app.jpg)

但是当我们打开任务管理器，则会有一点奇怪，应为显示的任务是Gallery，展示的界面确实另一个程序的Activity（因为其位于Task的栈顶）。  

![pre_lollipop_task_manager_across_app](https://asset.droidyue.com/broken_images_2015/pre_lollipop_task_manager_across_app.jpg)

这时候如果我们从Gallery应用切换到拨号应用，再返回到Gallery，看到的还是这个非Gallery的Activity，如果我们想要对Gallery进行操作，必须按Back键返回到Gallery界面才可以。确实有点不太合理。


###Android 5.0及之后表现
对于同一应用内部Activity启动和5.0之前表现一样，变化的就是不同应用之间Activity启动变得合理了。

跨应用之间启动Activity，会创建一个新的Task，新生成的Activity就会放入刚创建的Task中。如下图

![lollipop_across_app_new_task](https://asset.droidyue.com/broken_images_2015/lollipop_across_app_new_task.jpg)


同时任务管理器查看任务也显得更加合理了。

![lollipop_task_manager_standard](https://asset.droidyue.com/broken_images_2015/lollipop_task_manager_standard.jpg)

假设之前存在我们的测试程序，然后从Gallery又分享文件到我们的测试程序，则对应的任务管理器展示效果如下。  

![lollipop_standard_across_app_alread_exists.jpg](https://asset.droidyue.com/broken_images_2015/lollipop_standard_across_app_alread_exists.jpg)

使用场景：standard这种启动模式适合于撰写邮件Activity或者社交网络消息发布Activity。如果你想为每一个intent创建一个Activity处理，那么就是用standard这种模式。


##singleTop
singleTop其实和standard几乎一样，使用singleTop的Activity也可以创建很多个实例。唯一不同的就是，**如果调用的目标Activity已经位于调用者的Task的栈顶，则不创建新实例，而是使用当前的这个Activity实例，并调用这个实例的onNewIntent方法**。

![singletop](https://asset.droidyue.com/broken_images_2015/singletop.jpg)

在singleTop这种模式下，我们需要处理应用这个模式的Activity的onCreate和onNewIntent两个方法，确保逻辑正常。

###使用场景 
关于singleTop一个典型的使用场景就是搜索功能。假设有一个搜索框，每次搜索查询都会将我们引导至SearchActivity查看结果，为了更好的交互体验，我们在结果页顶部也放置这样的搜索框。

假设一下，SearchActivity启动模式为standard，那么每一个搜索都会创建一个新的SearchActivity实例，10次查询就是10个Activity。当我们想要退回到非SearchActivity，我们需要按返回键10次，这显然太不合理了。

但是如果我们使用singleTop的话，如果SearchActivity在栈顶，当有了新的查询时，不再重新创建SearchAc实例，而是使用当前的SearchActivity来更新结果。当我们需要返回到非SearchActivity只需要按一次返回键即可。使用了singleTop显然比之前要合理。

###总结
  * 只有在调用者和目标Activity在同一Task中，并且目标Activity位于栈顶，才使用现有目标Activity实例，否则创建新的目标Activity实例。
  * 如果是外部程序启动singleTop的Activity，在Android 5.0之前新创建的Activity会位于调用者的Task中，5.0及以后会放入新的Task中。


##singleTask
singleTask这个模式和前面提到的standard和singleTop截然不同。**使用singleTask启动模式的Activity在系统中只会存在一个实例**。如果这个实例已经存在，intent就会通过onNewIntent传递到这个Activity。否则新的Activity实例被创建。

###同一程序内
如果系统中不存在singleTask Activity的实例，那么就需要创建这个Activity的实例，并且将这个实例放入和调用者相同的Task中并位于栈顶。

![singletask_inapp_create_new_instance](https://asset.droidyue.com/broken_images_2015/singletask_inapp_create_new_instance.jpg)


如果singleTask Activity实例已然存在，那么在Activity回退栈中，所有位于该Activity上面的Activity实例都将被销毁掉（销毁过程会调用Activity生命周期回调），这样使得singleTask Activity实例位于栈顶。与此同时，Intent会通过onNewIntent传递到这个SingleTask Activity实例。

![singletask_inapp_instance_exists](https://asset.droidyue.com/broken_images_2015/singletask_inapp_instance_exists.jpg)


然而在Google关于singleTask的[文档](http://developer.android.com/guide/components/tasks-and-back-stack.html)有这样一段描述
>The system creates a new task and instantiates the activity at the root of the new task.

意思为 系统会创建一个新的Task，并创建Activity实例放入这个新的Task的底部。

然而实际并非如此，在我的例子中，singleTask Activity并创建并放入了调用者所在的Task，而不是放入新的Task，使用`adb shell dumpsys activity`便可以进行验证。
```java
Task id #239
  TaskRecord{428efe30 #239 A=com.thecheesefactory.lab.launchmode U=0 sz=2}
  Intent { act=android.intent.action.MAIN cat=[android.intent.category.LAUNCHER] flg=0x10000000 cmp=com.thecheesefactory.lab.launchmode/.StandardActivity }
    Hist #1: ActivityRecord{429a88d0 u0 com.thecheesefactory.lab.launchmode/.SingleTaskActivity t239}
      Intent { cmp=com.thecheesefactory.lab.launchmode/.SingleTaskActivity }
      ProcessRecord{42243130 18965:com.thecheesefactory.lab.launchmode/u0a123}
    Hist #0: ActivityRecord{425fec98 u0 com.thecheesefactory.lab.launchmode/.StandardActivity t239}
      Intent { act=android.intent.action.MAIN cat=[android.intent.category.LAUNCHER] flg=0x10000000 cmp=com.thecheesefactory.lab.launchmode/.StandardActivity }
      ProcessRecord{42243130 18965:com.thecheesefactory.lab.launchmode/u0a123}
```
然而想要实现文档的描述也并非不可能，我们需要在设置launchMode为singleTask的同时，再加上taskAffinity属性即可。
```xml
<activity
    android:name=".SingleTaskActivity"
    android:label="singleTask launchMode"
    android:launchMode="singleTask"
    android:taskAffinity="">
</activity>
```
完成上面的修改，我们看一下效果，Task的变化如下图

![singleTaskTaskAffinity](https://asset.droidyue.com/broken_images_2015/singleTaskTaskAffinity.jpg)

同时，系统中的任务管理器效果也会相应变化

![singletask_task_affinity_task_manger](https://asset.droidyue.com/broken_images_2015/singletask_task_affinity_task_manger.jpg)

###跨应用之间
在跨应用Intent传递时，如果系统中不存在singleTask Activity的实例，那么讲创建一个新的Task，然后创建SingleTask Activity的实例，将其放入新的Task中。Task变化如下。

![singletask_across_app_no_instance](https://asset.droidyue.com/broken_images_2015/singletask_across_app_no_instance.jpg)

系统的任务管理器也会如下变化

![singletask_acrossapp_no_instance_taskmanager](https://asset.droidyue.com/broken_images_2015/singletask_acrossapp_no_instance_taskmanager.jpg)

如果singleTask Activity所在的应用进程存在，但是singleTask Activity实例不存在，那么从别的应用启动这个Activity，新的Activity实例会被创建，并放入到所属进程所在的Task中，并位于栈顶位置。

![]()

{%img http://7jpolu.com1.z0.glb.clouddn.com/singletask_acrossapp_application_exists_activity_nonexists.jpg %}


更复杂的一种情况，如果singleTask Activity实例存在，从其他程序被启动，那么这个Activity所在的Task会被移到顶部，并且在这个Task中，位于singleTask Activity实例之上的所有Activity将会被正常销毁掉。如果我们按返回键，那么我们首先会回退到这个Task中的其他Activity，直到当前Task的Activity回退栈为空时，才会返回到调用者的Task。

{%img http://7jpolu.com1.z0.glb.clouddn.com/singletask_acrossapp_instance_exists_and_back.jpg %}

在上图中，当Task2中的相册启动分享调用Task1中的singleTask Activity，而该Activity实例存在，并位于Task1中回退栈中的第三个位置（从上到下顺序），那么位于该Activity上面的两个Activity实例将会被销毁掉，使得该Activity实例位于栈顶。此时Task1中的回退栈只剩两个Activity，如果点击返回，那么会退到的不是相册应用，而是singleTask Activity栈位置下面的Activity，再次点击返回方可返回相册应用。

###使用场景
该模式的使用场景多类似于邮件客户端的收件箱或者社交应用的时间线Activity。上述两种场景需要对应的Activity只保持一个实例即可，但是也要谨慎使用这种模式，因为它可以在用户未感知的情况下销毁掉其他Activity。


##singleInstance
这个模式和singleTask差不多，因为他们在系统中都只有一份实例。唯一不同的就是存放singleInstance Activity实例的Task只能存放一个该模式的Activity实例。如果从singleInstance Activity实例启动另一个Activity，那么这个Activity实例会放入其他的Task中。同理，如果singleInstance Activity被别的Activity启动，它也会放入不同于调用者的Task中。

{%img http://7jpolu.com1.z0.glb.clouddn.com/singleInstance_new_instance.jpg %}
虽然是两个task，但是在系统的任务管理器中，却始终显示一个，即位于顶部的Task中。

{%img http://7jpolu.com1.z0.glb.clouddn.com/singleInstances_taskmanager.jpg %}

另外当我们从任务管理器进入这个应用，是无法通过返回键会退到Task1的。

好在有办法解决这个问题，就是之前提到的`taskAffinity=""`，为launchMode为singleInstance的Activity加入这个属性即可。
```xml
<activity
    android:name=".SingleInstanceActivity"
   	android:label="singleInstance launchMode"
    android:launchMode="singleInstance"
    android:taskAffinity="">
</activity>
```
再次运行修改的代码，查看任务管理器，这样的结果就合理了。

{%img http://7jpolu.com1.z0.glb.clouddn.com/singleinstance_task_affinity.jpg %}

###使用情况
这种模式的使用情况比较罕见，在Launcher中可能使用。或者你确定你需要使Activity只有一个实例。建议谨慎使用。


##Intent Flags
除了在manifest文件中设置launchMode之外，还可以在Intnet中设置flag达到同样的效果。如下述代码就可以让StandardActivity已singleTop模式启动。
```java
Intent intent = new Intent(StandardActivity.this, StandardActivity.class);
intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
startActivity(intent);
```

关于Intent Flags这里暂不做重点介绍，具体可以参考[官方文档](http://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_BROUGHT_TO_FRONT)


##原文信息
  * [Understand Android Activity's launchMode: standard, singleTop, singleTask and singleInstance](http://inthecheesefactory.com/blog/understand-android-activity-launchmode/en)
  
##One More Thing
为了更深刻理解，建议多读几次。如果文章有问题，请在下方评论指出。
