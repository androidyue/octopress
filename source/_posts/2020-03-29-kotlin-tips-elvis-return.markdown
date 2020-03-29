---
layout: post
title: "KotlinTips elvis 快速返回"
date: 2020-03-29 17:11
comments: true
categories: KotlinTips kotlin  技巧 
---
### 作用
  * 在方法初始部分，对于值不符合预期，快速返回不再继续执行

<!--more-->

### 代码
```kotlin
private fun testElvisReturn(commands: List<String>?) {
    //如果值不符合预期(null)，直接返回
    val firstCommand = commands?.firstOrNull() ?: return

    when(firstCommand) {
        "ADD" -> "Add something"
        "DELETE" -> "Delete something"
        "UPDATE" -> "Update something"
        else -> "Find something"
    }
}
```
