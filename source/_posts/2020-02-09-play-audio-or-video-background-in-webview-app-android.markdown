---
layout: post
title: "Android Webview 后台播放音视频实现"
date: 2020-02-09 20:49
comments: true
categories: WebView Android 网页 视频 音频  后台 Background Audio Video 
---

## 问题
  * 我们使用WebView播放音乐或视频（比如油管视频）
  * 前台播放一直很正常，但是比较费电
  * 进入后台后就会暂停播放
  * 所以需求就是我们想要App在后台时同样播放音视频

<!--more-->

## 解决方法
  * 重写onWindowVisibilityChanged方法，让网页任然感觉像是在前台执行。


## 关键代码
```java
override fun onWindowVisibilityChanged(visibility: Int) {
        super.onWindowVisibilityChanged(View.VISIBLE)

        Log.i("BackgroundMediaWebView", "onWindowVisibilityChanged " +
                "visibility=${toReadableVisibility(visibility)}")
    }
```

  * 当App 进入后台（按Home键），visibility会变成Gone
  * 我们强制调用`super.onWindowVisibilityChanged(View.VISIBLE)`会保持WebView继续播放音视频


## 完整代码
```java
package com.example.webviewvisibilitychangedsample

import android.content.Context
import android.util.AttributeSet
import android.util.Log
import android.view.View
import android.webkit.WebView

class BackgroundMediaWebView @JvmOverloads constructor(
    context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : WebView(context, attrs, defStyleAttr) {

    override fun onWindowVisibilityChanged(visibility: Int) {
        super.onWindowVisibilityChanged(View.VISIBLE)

        Log.i("BackgroundMediaWebView", "onWindowVisibilityChanged " +
                "visibility=${toReadableVisibility(visibility)}")
    }

    private fun toReadableVisibility(visibility: Int): String {
        return when(visibility) {
            View.VISIBLE -> "Visible"
            View.INVISIBLE -> "Invisible"
            View.GONE -> "Gone"
            else -> "Unknown"
        }
    }
}
```

## 完整示例项目
  * [https://github.com/androidyue/WebViewVisibilityChangedSample](https://github.com/androidyue/WebViewVisibilityChangedSample)

