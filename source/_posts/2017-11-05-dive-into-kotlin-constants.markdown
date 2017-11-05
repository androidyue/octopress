---
layout: post
title: "Kotlin中常量的探究"
date: 2017-11-05 20:53
comments: true
categories: Kotlin 
---
在我们尝试使用Kotlin作为开发语言的时候，应该会想到在Kotlin中如何定义一个常量，就像Java中这样的代码一样
<!--more-->

```java
public static final double PI = 3.14159265358979323846;
```

在Kotlin中，提供了两个简单的关键字，一个是var，另一个是val


  * var 表示普通的可变的变量，可读和可写
  * val 表示为只读的变量。相当于Java中用final修饰的变量

```java
var title: String? = null

val id: Long = 1L

fun test() {
    title = "Title set in test function"
    id = 111 //compile error
}
```


因而使用val修饰的就是Kotlin的常量了吧


相信很多人曾经误以为val就是Kotlin中的常量，然后并不是，比如下面的实现
```java
val currentTimeMillis: Long
    get() {return System.currentTimeMillis()}
```
上面当我们每次访问`currentTimeMillis`得到的值是变化的，因而不是常量。

## 为什么呢
这是因为在Kotlin中，一个var会对应生成两个方法,即getter和setter方法，比如
```
var title: String? = null
```
生成的字节码会包含如下的两个方法和一个backing field
```
private static String title;
@Nullable
public static final String getTitle() {
	return title;
}

public static final void setTitle(@Nullable String title) {
    title = title;
}
```

而对于val来说只会生成一个对应的get方法,比如
```java
val id: Long = 1L
```
生成的字节码会包含类似这样的方法
```java
private static final long id = 1L;
public static final long getId() {
    return id;
}
```

## 如何才能生成真正的常量呢
想要实现真正的常量其实不难，方法有两种，一种是const，另一个使用@JvmField注解

### const
const，顾名思义，就是常量的单词简写，使用它可以声明常量，不过仅限于在top-level和object中。

```
//top-level
const val name = "Kotlin"

//object中
class DemoConstant {
    companion object {
        const val subName = ""
    }
}
```

  * 所谓的top-level就是位于代码文件的最外部，比如常见的类（非内部类和嵌套类）就是在top-level。意思是在结构上常量不属于任何的类，而是属于文件。
  * object中可以指的是最外部的object也可以指的是companion object.


### @JvmField

  * 在val常量前面增加一个@JvmField就可以将它变成常量。
  * 其内部作用是抑制编译器生成相应的getter方法
  * 是用该注解修饰后则无法重写val的get方法

示例如下
```
@JvmField val NAME = "89757
```

关于Kotlin的常量研究，最有效的方法就是分析bytecode和反编译对比学习。关于如何学习Kotlin可以阅读本文  [研究学习Kotlin的一些方法](http://droidyue.com/blog/2017/05/08/how-to-study-kotlin/)