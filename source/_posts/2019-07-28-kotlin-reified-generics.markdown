---
layout: post
title: "使用Kotlin reified 让泛型更简单安全"
date: 2019-07-28 18:59
comments: true
categories: Kotlin 泛型 reified 编译器 inline Java Generics Kotlinc
---


我们在编程中，出于复用和高效的目的，我们使用到了泛型。但是泛型在JVM底层采取了类型擦除的实现机制，Kotlin也是这样。然后这也带来了一些问题和对应的解决方案。这里我们介绍一个reified用法，来实现更好的处理泛型。

<!--more-->
## 类型擦除
如下面的代码，在编译成class文件后，就采用了类型擦除
```java
public class TestTypeErasure {
    public List<String> list = new ArrayList<>();

    public void test() {
        list.add("123");
        System.out.println(list.get(0));
    }
}
```

  * list实例真实的保存是多个`Object`
  * `list.add("123")`实际上是`"123"`作为`Object`存入集合中
  * `System.out.println(list.get(0));`是从`list`实例中读取出来`Object`然后转换成`String`才能使用的

辅助证明的字节码内容
```java
Compiled from "TestTypeErasure.java"
public class TestTypeErasure {
  //省略部分代码


  public void test();
    Code:
       0: aload_0
       1: getfield      #4                  // Field list:Ljava/util/List;
       4: ldc           #5                  // String 123
       6: invokeinterface #6,  2            // InterfaceMethod java/util/List.add:(Ljava/lang/Object;)Z
      11: pop
      12: getstatic     #7                  // Field java/lang/System.out:Ljava/io/PrintStream;
      15: aload_0
      16: getfield      #4                  // Field list:Ljava/util/List;
      19: iconst_0
      20: invokeinterface #8,  2            // InterfaceMethod java/util/List.get:(I)Ljava/lang/Object;
      25: checkcast     #9                  // class java/lang/String
      28: invokevirtual #10                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      31: return
}
```
其中

  * 第6行对应的`6: invokeinterface #6,  2            // InterfaceMethod java/util/List.add:(Ljava/lang/Object;)Z` 对应添加元素参数的类型为`Object`
  * 第20行对应的`20: invokeinterface #8,  2            // InterfaceMethod java/util/List.get:(I)Ljava/lang/Object;` 对应的获取元素的返回类型为`Object`
  * 第25行为进行类型转换操作


## 类型擦除带来的问题
### 安全问题:未检查的异常
```kotlin
//unchecked cast
fun <T> Int.toType(): T? {
    return (this as? T)
}
```

  * 上面的代码会导致编译器警告`unchecked cast`
  * 上面的代码由于在转换类型时，没有进行检查，所以有可能会导致运行时崩溃

当我们执行这样的代码时
```kotlin
fun testCast() {
    println(1.toType<String>()?.substring(0))
}
```
会得到`java.lang.Integer cannot be cast to java.lang.String`的类型错误。


### 显式传递Class
针对前面的问题，我们最常用的办法就是显式传递class信息
```kotlin
//need pass class explicitly
fun <T> Any.toType(clazz: Class<T>): T? {
    return if (clazz.isInstance(this)) {
        this as? T
    } else {
        null
    }
}
```

但是显式传递Class信息也会感觉有一些问题，尤其是下面这段代码
```kotlin
fun <T> Bundle.plus(key: String, value: T, clazz: Class<T>) {
    when(clazz) {
        Long::class.java -> putLong(key, value as Long)
        String::class.java -> putString(key, value as String)
        Char::class.java -> putChar(key, value as Char)
        Int::class.java -> putInt(key, value as Int)
    }
}
```

  * 上面的代码（传value值和clazz）我们会感觉到明显的有一些笨拙，不够智能。
  * 但是这也是基于Java的类型擦除机制导致无法再运行时得到`T`的类型信息，无法改进（至少在Java中）

### 可能导致更多方法的产生
同时，由于上面的显式传递Class信息比较麻烦和崩溃，我们有时候会增加更多的方法，比如下面的这样。
```kotlin
class Bundle {
    fun putInt(key: String, value: Int) {
        println("Bundle.putInt key=$key;value=$value")
    }

    fun putLong(key: String, value: Long) {

    }

    fun putString(key: String, value: String) {

    }

    fun putChar(key: String, value: Char) {

    }
}
```

  * 上面的`putInt`,`putLong`,`putString`和`putChar`没有泛型引入
  * 我们没有排除显式传递Class参数之外的优雅实现，比如我们只提供一个叫做`put(key: String,value: T)`

## reified 方式
不过，好在Kotlin有一个对应的解决方案，这就是我们今天文章标题提到的reified（中文意思：具体化）

使用reified很简单，主要分为两步

  * 在泛型类型前面增加`reified`  
  * 在方法前面增加`inline`（必需的）

接下来我们使用reified改进之前的方法

### 类型转换改进后的代码
```kotlin
//much better way using reified
inline fun <reified T> Any.asType(): T? {
    return if (this is T) {
        this
    } else {
        null
    }
}
```
### 方法传参不需要多余传递参数类型信息
```kotlin
inline fun <reified T> Bundle.plus(key: String, value: T) {
    when(value) {
        is Long -> putLong(key, value)
        is String -> putString(key, value)
        is Char -> putChar(key, value)
        is Int-> putInt(key, value)
    }
}
```

## reified实现原理
不是说，泛型是使用了类型擦除么，为什么运行时能得到`T`的类型信息呢？

是的，采用类型擦除没有错，至于能在运行时得到`T`的类型信息是如何做到的，就需要了解`reified`的内部机制了。

其原理为
  
  * Kotlin编译器会将reified方法`asType`内联(inline)到调用的地方(call-site)
  * 方法被内联到调用的地方后，泛型T会被替换成具体的类型

所以 **reified 使得泛型的方法假装在运行时能够获取泛型的类信息**

为了便于理解，我们举个例子，如下是我们的代码
```kotlin
fun testCast2() {
    println(1.asType<String>()?.substring(0))
}
```
对应的反编译后的java代码
```java
public static final void testCast2() {
      Object $this$asType$iv = 1;
      int $i$f$asType = false;
      String var10000 = (String)($this$asType$iv instanceof String ? $this$asType$iv : null);
      String var3;
      /**
	  * 后续的代码对应的Kotlin代码(也包含了部分call-site的逻辑，比如substring)
	  return if (this is T) {
        this
      } else {
        null
      }
      */

      //inline和reified替换开始
      if ((String)($this$asType$iv instanceof String ? $this$asType$iv : null) != null) {
         var3 = var10000;
         byte var4 = 0;
         boolean var2 = false;
         if (var3 == null) {
            throw new TypeCastException("null cannot be cast to non-null type java.lang.String");
         }

         var10000 = var3.substring(var4);
         Intrinsics.checkExpressionValueIsNotNull(var10000, "(this as java.lang.String).substring(startIndex)");
      } else {
         var10000 = null;
      }
      //inline和reified替换结束
      var3 = var10000;
      $i$f$asType = false;
      System.out.println(var3);
   }
```

## all in(lined)?
既然是inline，应该是把被inline的方法全部提取到调用处(call-site)吧？

  * 是的，通常是这样，不过reified可能有一些差异
  * reified方法并不会完全inline所有的方法实现，而是更加智能一些的类型匹配中断提取。


```kotlin
fun testBundlePlusLong() {
    Bundle().plus("hello", 1000L)
}

fun testBundlePlusString() {
    Bundle().plus("hello", "World")
}

fun testBundlePlusChar() {
    Bundle().plus("hello", 'h')
}

fun testBundlePlusInt() {
    Bundle().plus("hello", 1)
}
```
再次贴一些Bundle.plus实现
```kotlin
inline fun <reified T> Bundle.plus(key: String, value: T) {
    when(value) {
        is Long -> putLong(key, value)
        is String -> putString(key, value)
        is Char -> putChar(key, value)
        is Int-> putInt(key, value)
    }
}
```
上面的when表达式的类型检查次序依次为

  * Long
  * String
  * Char
  * Int

反编译后的方法如下(类型不同，提取的方法体也不同)
```java
public static final void testBundlePlusLong() {
      Bundle $this$plus$iv = new Bundle();
      String key$iv = "hello";
      long value$iv = 1000L;
      int $i$f$plus = false;
      //第一个就是Long类型，无需包含后面的检查代码
      $this$plus$iv.putLong(key$iv, value$iv);
   }

   public static final void testBundlePlusString() {
      Bundle $this$plus$iv = new Bundle();
      String key$iv = "hello";
      Object value$iv = "World";
      int $i$f$plus = false;
      //不是Long类型，需要继续匹配，找到String类型，终止inline后续代码
      if (value$iv instanceof Long) {
         $this$plus$iv.putLong(key$iv, ((Number)value$iv).longValue());
      } else {
         $this$plus$iv.putString(key$iv, value$iv);
      }

   }

   public static final void testBundlePlusChar() {
      Bundle $this$plus$iv = new Bundle();
      String key$iv = "hello";
      Object value$iv = 'h';
      int $i$f$plus = false;
      //不是Long类型，需要继续匹配，
      if (value$iv instanceof Long) {
         $this$plus$iv.putLong(key$iv, ((Number)value$iv).longValue());
      	//不是String类型，需要继续匹配，
      } else if (value$iv instanceof String) {
         $this$plus$iv.putString(key$iv, (String)value$iv);
      } else {
         //找到String类型，终止inline后续代码
         $this$plus$iv.putChar(key$iv, value$iv);
      }

   }

   public static final void testBundlePlusInt() {
      Bundle $this$plus$iv = new Bundle();
      String key$iv = "hello";
      Object value$iv = 1;
      int $i$f$plus = false;
      //最差的一种情况，inline全部的方法体实现
      if (value$iv instanceof Long) {
         $this$plus$iv.putLong(key$iv, ((Number)value$iv).longValue());
      } else if (value$iv instanceof String) {
         $this$plus$iv.putString(key$iv, (String)value$iv);
      } else if (value$iv instanceof Character) {
         $this$plus$iv.putChar(key$iv, (Character)value$iv);
      } else {
         $this$plus$iv.putInt(key$iv, ((Number)value$iv).intValue());
      }

   }
```

以上就是关于reified的内容，其实在Kotlin中有很多的特性是依赖于编译器的工作来实现的。
