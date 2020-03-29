---
layout: post
title: "KotlinTips asType 快捷转换"
date: 2020-03-29 17:15
comments: true
categories: KotlinTips Kotlin 技巧 Java
---
### 作用
  * 更加流畅地，一气呵成进行类型转换


<!--more-->
### 代码
```kotlin
/**
 * 将一种类型转换为另一种类型,如果类型转换不允许，返回null
 * */
inline fun <reified T> Any.asType(): T? {
    return if (this is T) {
        this
  } else {
        null
  }
}



fun testAsType(charSequence: CharSequence?) {
    //书写不流畅，需要回到开始出增加()
  (charSequence as? String)?.length
  //一气呵成书写
  charSequence?.asType<String>()?.length
}
```

### reified
  * [使用Kotlin Reified 让泛型更简单安全](https://droidyue.com/blog/2019/07/28/kotlin-reified-generics/)
