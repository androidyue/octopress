---
layout: post
title: "KotlinTips: getValueSafely 安全取值"
date: 2020-03-22 18:52
comments: true
categories: Kotlin KotlinTips 异常 null 
---

### 作用
  * 安全取值，增加稳定性
  * 规避繁琐的显式try-catch处理

<!--more-->

### 代码
```kotlin
/**
 * 安全的获取值的信息，其过程中发生异常会自动处理，返回null
 * getValueAction 取值操作，可能发生异常
 * */
inline fun <T> getValueSafely(getValueAction: () -> T?): T? {
    return try {
        getValueAction()
    } catch(t: Throwable) {
        t.printStackTrace()
        null
  }
}
```
### 验证一番
```kotlin
fun testGetValueSafely() {
    val value1 = getValueSafely {
		  1/ 0
	}

    val value2 = getValueSafely {
		  1 + 1
	}

	value1.printLog()
	value2.printLog()
}
```
#### 执行日志
```kotlin
03-21 16:55:05.649  5072  5072 I KotlinTips: null
03-21 16:55:05.649  5072  5072 I KotlinTips: 2
```

## 关于 KotlinTips
KotlinTips是一个关于Kotlin编码技巧的一个系列，希望通过轻量简单的形式介绍能对大家有帮助。
