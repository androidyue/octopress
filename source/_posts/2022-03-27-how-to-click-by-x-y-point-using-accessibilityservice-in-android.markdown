---
layout: post
title: "Android 中 利用 AccessibilityService 辅助服务 模拟点击事件"
date: 2022-03-27 20:52
comments: true
categories: Android AccessibilityService adb 
---


在 Android 中想要执行一些模拟点击操作，在无法修改页面源码的情况下，通常只能使用 adb 和借助辅助功能两种方式。


## Adb 方式
借助 adb shell 的命令，我们可以使用下面的方式模拟一个执行点击坐标的操作。

```bash
adb shell input tap x y 
```

但是 adb 操作有一些门槛

  * 需要一台电脑执行adb 命令（终端执行）
  * 需要一个数据线
  * 目标设备（手机）需要开启开发者模式

所有 adb 操作的问题就是无法借助一台设备独立完成。所以可以借助辅助服务来实现单一设备独立完成。
<!--more-->

## 辅助功能
Android中的辅助功能是一个极具黑科技的技术。借助下面的代码，我们可以实现 对于 基于坐标的点击。

```kotlin

@RequiresApi(Build.VERSION_CODES.N)

fun AccessibilityService.dispatchClick(rect: Rect?) {
   rect ?: return
   val x = rect.middleVertically()
   val y = rect.middleHorizontally()
   dispatchClick(x, y)
}

@RequiresApi(Build.VERSION_CODES.N)
fun AccessibilityService.dispatchClick(x: Float, y: Float) {
   val path = Path()
   path.moveTo(x, y)
   smartLogD {
       "dispatchClick x=$x y=$y"
   }

   path.lineTo(x + 1, y)

   val builder = GestureDescription.Builder()
   builder.addStroke(GestureDescription.StrokeDescription(path, 0,
       ViewConfiguration.getTapTimeout().toLong()
   ))

   this.dispatchGesture(builder.build(), null, null)
}
```

上面的代码如果无法找到对应的引用，可以引用这个库  https://github.com/androidyue/coobox  

## 开始使用

1.在项目根目录下的 build.gradle 增加仓库配置
```bash
allprojects {
    repositories {
        jcenter()
        maven { url "https://jitpack.io" }
    }
}
```

2.在模块下的 build.gradle 增加依赖引用
```bash
dependencies {
    implementation 'com.github.androidyue:coobox:0.8.5'
}
```
注: 请手动替换 x.y.z 为最新的版本信息



