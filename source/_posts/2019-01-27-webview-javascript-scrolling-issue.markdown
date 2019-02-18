---
layout: post
title: "处理 WebView 与 ViewPager 滑动冲突"
date: 2019-01-27 20:07
comments: true
categories: WebView ViewPager Android Javascript
---
问题场景
在项目的App中，有一个ViewPager，它内部包含了WebView，而内部的webview加载了一个可以滑动的网页。

当我们在网页滑动的时候，会直接切换到下一个viewpager的页面，而不是优先响应webview的滑动。

<!--more-->

具体的效果如视频

<video style="width:50%"   controls>
  <source src="https://asset.droidyue.com/video/web_scroll_bad.mp4" type="video/mp4">
</video>



期待的示例效果
<video style="width:50%"   controls>
  <source src="https://asset.droidyue.com/video/web_scroll_good.mp4" type="video/mp4">
</video>



## 解决思路
其实思路还是比较简单，大概如下

  * 优先响应webview内部滑动
  * 如果webview内部滑动完成，则响应外部的滑动

那么问题就来了，怎么判断webview内部滑动结束就是解决问题的关键了。

解决问题的关键就在于WebView.onOverScrolled方法

![WebView.onOverScrolled](https://asset.droidyue.com/image/overscrolled_webview.png)

看了上面的文档，我们可能还是有一些疑惑，到底什么是overScroll。正所谓一图胜千言，看一下下图就知道了。

![Webview overscrolled effect](https://asset.droidyue.com/image/overscroll_effect.png)

上面红框的内容就是overScroll的效果，其实就是划过了的意思（英语中over有过的意思）

了解了上面的信息，我们具体的实施办法也就有了。

  * 在WebView的onTouchEvent事件为ACTION_DOWN时，查找父视图是否是可以滑动的视图(如ViewPager)，如果是,则通过requestDisallowInterceptTouchEvent(true)调用，请求父视图不要拦截touchEvent
  * 如果WebView不再响应内部滑动（即onOverScrolled中clampedX或者clampedY值为true），我们再起调用requestDisallowInterceptTouchEvent(false)请求父视图恢复拦截处理touchEvent.


核心代码
```java
override fun onTouchEvent(event: MotionEvent): Boolean {
   if (event.action == MotionEvent.ACTION_DOWN) {
       val viewParent = findViewParentIfNeeds(this)
       viewParent?.requestDisallowInterceptTouchEvent(true)
   }
   return super.onTouchEvent(event)
}

override fun onOverScrolled(scrollX: Int, scrollY: Int, clampedX: Boolean, clampedY: Boolean) {
   dumpMessage("onOverScrolled scrollX=" + scrollX + ";scrollY=" + scrollY
           + ";clampedX=" + clampedX + ";clampedY=" + clampedY)
   if (clampedX) {
       val viewParent = findViewParentIfNeeds(this)
       viewParent?.requestDisallowInterceptTouchEvent(false)
   }
   super.onOverScrolled(scrollX, scrollY, clampedX, clampedY)
}

private fun findViewParentIfNeeds(tag: View): ViewParent? {
   val parent = tag.parent
   if (parent == null) {
       return parent
   }
   return if (parent is ViewPager ||
           parent is AbsListView ||
           parent is ScrollView ||
           parent is HorizontalScrollView ||
           parent is GridView) {
       parent
   } else {
       if (parent is View) {
           findViewParentIfNeeds(parent as View)
       } else {
           parent
       }
   }
}

```

利用上面的代码，我们就能完美的解决水平滑动的问题，对于垂直纵向的问题，大家可以参考本文方法做类似实现。

## 示例代码
  * [https://github.com/androidyue/WebViewViewPagerScrollingIssue](https://github.com/androidyue/WebViewViewPagerScrollingIssue)
