---
layout: post
title: "Kotlin 处理位操作Flag 快捷方法"
date: 2020-01-05 20:44
comments: true
categories: Kotlin Flag 位操作 Java 
---

一般涉及到标记位相关的操作，我们都会使用位运算，无论你是从Java转到Kotlin，还是全新使用Kotlin，进行位运算处理Flag都会感到疑问，该怎么处理呢。

<!--more-->

这里简单整理了几个方法，文件名为(FlagExt.kt)
```kotlin
@file:JvmName("FlagUtil")
/**
 * 添加flag
 */
fun Int.addFlag(flag: Int): Int {
    return this or flag
}

/**
 * 移除flag
 */
fun Int.removeFlag(flag: Int): Int {
    return this and flag.inv()
}

/**
 * 检查是否包含flag
 */
fun Int.hasFlag(flag: Int): Boolean {
    return this and flag == flag
}
```

如下是验证代码
```kotlin
fun main() {
    var flags = 0
    val FLAG_AUTO_REBOOT = 1
    println("flags.hasAutoRebootFlag=${flags.hasFlag(FLAG_AUTO_REBOOT)}")
    flags = flags.addFlag(FLAG_AUTO_REBOOT)
    println("flags.hasAutoRebootFlag(afterAdded)=${flags.hasFlag(FLAG_AUTO_REBOOT)}")
    flags = flags.removeFlag(FLAG_AUTO_REBOOT)
    println("flags.hasAutoRebootFlag(afterRemoved)=${flags.hasFlag(FLAG_AUTO_REBOOT)}")

    /**
     * result:
     * flags.hasAutoRebootFlag=false
     * flags.hasAutoRebootFlag(afterAdded)=true
     * flags.hasAutoRebootFlag(afterRemoved)=false
     */
}
```

结果如下
```java
flags.hasAutoRebootFlag=false
flags.hasAutoRebootFlag(afterAdded)=true
flags.hasAutoRebootFlag(afterRemoved)=false
```


以上。