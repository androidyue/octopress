---
layout: post
title: "Kotlin Kapt error: identifier expected 问题记录"
date: 2021-09-28 21:28
comments: true
categories: Kotlin Kapt Android Java Gradle 
---
在工作中，小伙伴说他遇到了一个 kapt的问题，在使用 gradle 构建的时候出现了如下的错误。

```java

Kapt worker classpath: []
/Users/androidyue/Documents/SecooComponentMaster/module-xxxx/build/tmp/kapt3/stubs/debug/com/xxxxx/xxxxx/util/PlayerCommandStateManager.java:7: error: <identifier> expected
    private static final java.util.Map<java.lang.String, com.xxxxxx.xxxxxxx.util.const.PlayerCommandState> recordMap = null;
                                                                                    ^/Users/androidyue/Documents/xxxxxxx/module-xxxxxx/build/tmp/kapt3/stubs/debug/com/xxxxx/xxxxxx/util/PlayerCommandStateManager.java:7: error: <identifier> expected
    private static final java.util.Map<java.lang.String, com.xxxxxx.xxxxxxxx.util.const.PlayerCommandState> recordMap = null;
                                                                                                            ^/Users/androidyue/Documents/xxxxxxx/module-xxxxxx/build/tmp/kapt3/stubs/debug/com/xxxxx/xxxxxxx/util/PlayerCommandStateManager.java:7: error: <identifier> expected
    private static final java.util.Map<java.lang.String, com.xxxxxx.xxxxxxx.util.const.PlayerCommandState> recordMap = null;

```

对应的实际代码为
```java
object PlayerCommandStateManager {
    private val recordMap = mutableMapOf<String, PlayerCommandState>()
}
```

```java
package com.secoo.gooddetails.util.const

enum class PlayerCommandState {
    PAUSE_BY_USER,
    PAUSE_NORMAL,
    PLAY,
    INITIAL,
    ENDED,
    IDLE
}
```

<!--more-->


## 奇怪的解决方法

  * 将`PlayerCommandState`所在的包名由`com.secoo.gooddetails.util.const`，修改为其他不包含`const`的包名即可正常编译。


## 原因推测
  * 可能是kapt的识别包名的一些bug。可能的相关链接 `https://youtrack.jetbrains.com/issue/KT-16153`

## 环境信息
```java
------------------------------------------------------------
Gradle 5.4.1
------------------------------------------------------------

Build time:   2019-04-26 08:14:42 UTC
Revision:     261d171646b36a6a2xxxxxxx4c19d

Kotlin:       1.3.21
Groovy:       2.5.4
Ant:          Apache Ant(TM) version 1.9.13 compiled on July 10 2018
JVM:          1.8.0_281 (Oracle Corporation 25.281-b09)
OS:           Mac OS X 10.16 x86_64

```