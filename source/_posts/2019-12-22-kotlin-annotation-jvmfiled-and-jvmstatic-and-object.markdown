---
layout: post
title: "Kotlin 注解 第三篇 @JvmField 与 @JvmStatic"
date: 2019-12-22 20:44
comments: true
categories: Kotlin 注解 Java Jvm
---


本文是既 [JvmName 注解在 Kotlin 中的应用](https://droidyue.com/blog/2019/09/01/jvm-name-annotations-kotlin/)和[JvmMultifile 注解在 Kotlin 中的应用](https://droidyue.com/blog/2019/09/08/jvmmultifile-annotation-in-kotlin/)的第三篇关于 Kotlin的注解文章。

介绍的内容比较简单，主要是包含了JvmField和JvmStatic两个。

<!--more-->

### @JvmField
示例代码声明
```kotlin
package com.example.jvmannotationsample

class Developer (@JvmField val name: String, val ide: String)
```

使用@JvmField，我们在Java中调用的时候，可以直接使用属性名，而不是对应的getter方法。

调用代码对比
```java
//test jvmField
Developer developer = new Developer("Andy", "Android Studio");
System.out.println(developer.getIde());// not using JvmField
System.out.println(developer.name);// using JvmField
```




### @JvmStatic
除此之外，对于静态属性和静态方法的实现，我们也可以使用@JvmStatic实现，
```kotlin
package com.example.jvmannotationsample

class Sample {
    companion object {
        @JvmStatic
        val TAG_NAME = "Sample"

        val NON_STATIC_VALUE = "non_static_value"

        @JvmStatic fun callStatic() {

        }

        fun callNonStatic() {

        }
    }
}
```
调用代码如下
```java
//JVM static method
Sample.callStatic();
Sample.Companion.callNonStatic();

Sample.getTAG_NAME();
Sample.Companion.getNON_STATIC_VALUE();
```


### Companion
Kotlin中我们可以借助`object`实现静态的形式，比如下面的代码
```kotlin
package com.example.jvmannotationsample

class SomeClass {
    companion object {
        fun getCommonProperties(): List<String> {
            return emptyList()
        }
    }
}
```
其实除此之外，我们还能命名companion的名称,如下代码
```kotlin
package com.example.jvmannotationsample

class AnotherClass {
    companion object Assistant {
        fun scheduleSomething() {

        }
    }
}
```
调用代码示例
```java
//test companion
SomeClass.Companion.getCommonProperties();
AnotherClass.Assistant.scheduleSomething();
```

### 相关文章推荐
  * [JvmName注解](https://droidyue.com/blog/2019/09/01/jvm-name-annotations-kotlin/)
  * [JvmMultifile注解](https://droidyue.com/blog/2019/09/08/jvmmultifile-annotation-in-kotlin/)
  * [Kotlin编译调校](https://droidyue.com/blog/2019/07/21/configure-kotlin-compiler-options/)
  * [更多Kotlin文章](https://droidyue.com/blog/categories/kotlin/)