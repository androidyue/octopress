---
layout: post
title: "GapWorker导致RecyclerView视频播放声音残留问题"
date: 2019-11-11 20:59
comments: true
categories: GapWorker RecyclerView Fragment
---


场景描述

  * App 有两个tab，每一个都是Fragment,以FragmentA和FragmentB 代称.  
  * 切到FragmentA 视频播放（在RecyclerViewA 内部），然后切到FragmentB 视频暂停. 
  * 就在此刻，滑动FragmentB 的recyclerView B ，来自FragmentA的视频播放出声音，而且声音是下一条视频的声音。

<!--more-->

这确实是一个非常奇怪的问题，不滑动不会出现视频播放声音，必须滑动一下才能出现声音。


## 解决思路

  1.分析日志，查找播放业务相关的代码  
  2.增加logStackTrace("xxx")用来打印出调用的栈信息  

## 辅助方法
该方法用来查看调用的层级关系，实现原理很简单，就是生成一个Throwable，然后打印stacktrace。
```java
fun logStackTrace(tag: String) {
    if (BuildConfig.DEBUG) {
        Log.w("logStackTrace $tag", Throwable(tag))
    }
}
```

## 问题日志
于是我们得到了如下的日志

```java
 W logStackTrace :
 W logStackTrace : java.lang.Throwable: 
 W logStackTrace : 	at com.xxxxx.commonsdk.utils.ExtensionKt.logStackTrace(Extension.kt:99)
 W logStackTrace : 	at com.xxxxx.xxxxx.xxx.video.DiscoveryVideoPlayer.setUp(DiscoveryVideoPlayer.java:786)
 W logStackTrace : 	at com.shuyu.gsyvideoplayer.video.base.GSYVideoView.setUp(GSYVideoView.java:446)
 W logStackTrace : 	at com.shuyu.gsyvideoplayer.video.base.GSYVideoControlView.setUp(GSYVideoControlView.java:541)
 W logStackTrace : 	at com.xxxxx.xxxxx.xxx.ui.adapter.VideoFeedAdapter.initVideo(VideoFeedAdapter.java:211)
 W logStackTrace : 	at com.xxxxx.xxxxx.xxx.ui.adapter.VideoFeedAdapter.onBindViewHolder(VideoFeedAdapter.java:127)
 W logStackTrace : 	at com.xxxxx.xxxxx.xxx.ui.adapter.VideoFeedAdapter.onBindViewHolder(VideoFeedAdapter.java:34)
 W logStackTrace : 	at android.support.v7.widget.RecyclerView$Adapter.onBindViewHolder(RecyclerView.java:6673)
 W logStackTrace : 	at android.support.v7.widget.RecyclerView$Adapter.bindViewHolder(RecyclerView.java:6714)
 W logStackTrace : 	at android.support.v7.widget.RecyclerView$Recycler.tryBindViewHolderByDeadline(RecyclerView.java:5647)
 W logStackTrace : 	at android.support.v7.widget.RecyclerView$Recycler.tryGetViewHolderForPositionByDeadline(RecyclerView.java:5913)
 W logStackTrace : 	at android.support.v7.widget.GapWorker.prefetchPositionWithDeadline(GapWorker.java:285)
 W logStackTrace : 	at android.support.v7.widget.GapWorker.flushTaskWithDeadline(GapWorker.java:342)
 W logStackTrace : 	at android.support.v7.widget.GapWorker.flushTasksWithDeadline(GapWorker.java:358)
 W logStackTrace : 	at android.support.v7.widget.GapWorker.prefetch(GapWorker.java:365)
 W logStackTrace : 	at android.support.v7.widget.GapWorker.run(GapWorker.java:396)
 W logStackTrace : 	at android.os.Handler.handleCallback(Handler.java:891)
 W logStackTrace : 	at android.os.Handler.dispatchMessage(Handler.java:102)
 W logStackTrace : 	at android.os.Looper.loop(Looper.java:207)
 W logStackTrace : 	at android.app.ActivityThread.main(ActivityThread.java:7470)
 W logStackTrace : 	at java.lang.reflect.Method.invoke(Native Method)
 W logStackTrace : 	at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:524)
 W logStackTrace : 	at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:958)
```

## 问题症结
问题的症结就在GapWorker调用导致了RecyclerView的item预加载处理。

## 解决方法
```java
yourLayoutManager.setItemPrefetchEnabled(false);
```

## 为什么会这样
```java
		/**
         * Sets whether the LayoutManager should be queried for views outside of
         * its viewport while the UI thread is idle between frames.
         *
         * <p>If enabled, the LayoutManager will be queried for items to inflate/bind in between
         * view system traversals on devices running API 21 or greater. Default value is true.</p>
         *
         * <p>On platforms API level 21 and higher, the UI thread is idle between passing a frame
         * to RenderThread and the starting up its next frame at the next VSync pulse. By
         * prefetching out of window views in this time period, delays from inflation and view
         * binding are much less likely to cause jank and stuttering during scrolls and flings.</p>
         *
         * <p>While prefetch is enabled, it will have the side effect of expanding the effective
         * size of the View cache to hold prefetched views.</p>
         *
         * @param enabled <code>True</code> if items should be prefetched in between traversals.
         *
         * @see #isItemPrefetchEnabled()
         */
```
上述是`setItemPrefetchEnabled`的注释，item prefetch是一种用来减少滑动时卡顿的一种预加载方式。这种对于普通的RecyclerView的item没有问题，但是对于视频有声音的，就显得问题明显了。所以这里的解决方法就是关闭这个预取的设置。

以上。

