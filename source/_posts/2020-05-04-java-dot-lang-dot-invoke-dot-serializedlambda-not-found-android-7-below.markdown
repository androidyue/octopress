---
layout: post
title: "解决Didn't find class java.lang.invoke.SerializedLambda 问题"
date: 2020-05-04 19:28
comments: true
categories: Android Gradle D8 java Lambda 
---

## 问题表现
  * 在低于 Android 7（Android Nougat）以下出现
  * 错误的崩溃日志信息如下

<!--more-->

```java
Caused by: java.lang.ClassNotFoundException: Didn't find class "java.lang.invoke.SerializedLambda" on path: DexPathList[[dex file "/data/user/0/com.example/.00000000000/A3AEECD8.dex", zip file "/data/app/com.example-1/base.apk"],nativeLibraryDirectories=[/data/app/com.example-1/lib/arm, /data/app/com.example-1/base.apk!/lib/armeabi-v7a, /vendor/lib, /system/lib]]
at dalvik.system.BaseDexClassLoader.findClass(BaseDexClassLoader.java:56)
at java.lang.ClassLoader.loadClass(ClassLoader.java:511)
at java.lang.ClassLoader.loadClass(ClassLoader.java:469)
at libcore.reflect.InternalNames.getClass(InternalNames.java:53)
at java.lang.Class.getDexCacheType(Class.java:476)
at java.lang.reflect.AbstractMethod.getParameterTypes(AbstractMethod.java:166)
at java.lang.reflect.Method.getParameterTypes(Method.java:170)
at java.lang.Class.getDeclaredMethods(Class.java:673)
```

## 解决方法
在项目的 gradle.properties 文件中增加如下一行
```bash
android.enableD8.desugaring=false
```


