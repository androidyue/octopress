---
layout: post
title: "JvmName 注解在 Kotlin 中的应用"
date: 2019-09-01 20:45
comments: true
categories: Annotation 注解  Kotlin JVM 编译 
---
JvmName注解是Kotlin提供的一个可以变更编译器输出的注解，这里简单的介绍一下其使用规则。


## 应用在文件上
### 未应用@JvmName
```kotlin
package com.example.jvmannotationsample

import android.net.Uri


fun String.toUri(): Uri {
    return Uri.parse(this)
}
```
<!--more-->
当我们在Java中调用上面的toUri方法时
```java
StringExtKt.toUri("https://droidyue.com");
```
生成的 class 文件名称为
```bash
./app/build/tmp/kotlin-classes/debug/com/example/jvmannotationsample/StringExtKt.class
```
### 应用@JvmName
```kotlin
@file:JvmName("StringUtil")
package com.example.jvmannotationsample

import android.net.Uri


fun String.toUri(): Uri {
    return Uri.parse(this)
}

```
在Java中调用
```java
StringUtil.toUri("https://droidyue.com");
```
生成的 class 文件名为
```bash
./app/build/tmp/kotlin-classes/debug/com/example/jvmannotationsample/StringUtil.class
```

## 作用在方法上
```kotlin
package com.example.jvmannotationsample.jvm_name

@JvmName("isOK")
fun String.isValid(): Boolean {
    return isNotEmpty()
}
```
生成的对应的class 文件，我们可以看到方法名称已经修改了。

```bash
javap -c ./app/build/tmp/kotlin-classes/debug/com/example/jvmannotationsample/jvm_name/OnMethodSampleKt.class
Compiled from "OnMethodSample.kt"
public final class com.example.jvmannotationsample.jvm_name.OnMethodSampleKt {
  public static final boolean isOK(java.lang.String);
    Code:
       0: aload_0
       1: ldc           #11                 // String $this$isValid
       3: invokestatic  #17                 // Method kotlin/jvm/internal/Intrinsics.checkParameterIsNotNull:(Ljava/lang/Object;Ljava/lang/String;)V
       6: aload_0
       7: checkcast     #19                 // class java/lang/CharSequence
      10: astore_1
      11: iconst_0
      12: istore_2
      13: aload_1
      14: invokeinterface #23,  1           // InterfaceMethod java/lang/CharSequence.length:()I
      19: ifle          26
      22: iconst_1
      23: goto          27
      26: iconst_0
      27: ireturn
}
```
所以，我们在Java代码中，可以这样调用
```java
public static void testJvmNameOnMethod() {
    OnMethodSampleKt.isOK("");
}
```

但是，我们在Kotlin代码中，还是只能使用`isValid`而不是`isOK`
```kotlin
fun testJvmNameOnMethod() {
    "".isValid()
//    "".isOK() unresolved reference
}
```

那么问题就奇怪了，生成的class里面的方法是`isOK`，怎么还能调用`isValid`呢？


```bash
javap -c ./app/build/tmp/kotlin-classes/debug/com/example/jvmannotationsample/jvm_name/KotlinPlaygroundKt.class
Compiled from "KotlinPlayground.kt"
public final class com.example.jvmannotationsample.jvm_name.KotlinPlaygroundKt {
  public static final void testJvmNameOnMethod();
    Code:
       0: ldc           #8                  // String
       2: invokestatic  #14                 // Method com/example/jvmannotationsample/jvm_name/OnMethodSampleKt.isOK:(Ljava/lang/String;)Z
       5: pop
       6: return
}
```

是的，Kotlin编译器将`isValid`在字节码层面又替换成了`isOK`。


关于@JvmName作用到方法上，比较好的例子(来自Kotlin官网)是这样的
```kotlin
fun List<String>.filterValid(): List<String> {
    TODO()
}

fun List<Int>.filterValid(): List<Int> {
    TODO()
}
```

```bash
~/JVMAnnotationSample/app/src/main/java/com/example/jvmannotationsample/jvm_name/GenericList.kt: (3, 1): Platform declaration clash: The following declarations have the same JVM signature (filterValid(Ljava/util/List;)Ljava/util/List;):
    fun List<Int>.filterValid(): List<Int> defined in com.example.jvmannotationsample.jvm_name in file GenericList.kt
    fun List<String>.filterValid(): List<String> defined in com.example.jvmannotationsample.jvm_name in file GenericList.kt
```

上面的两个方法声明会导致Kotlin编译出错，因为
  

由于JVM对于泛型采取了类型擦除，`List<Int>.filterValid()`和`List<String>.filterValid()`实际上对应的都是`List.filterValid()`

所以，对应的解决方法

   * 修改两个的方法名称，比如`List<String>.filterValid()`修改成`List<String>.filterValidString()`等
   * 第二种就是使用@JvmName达到第一种方法的效果

具体修改如下所示
```kotlin
package com.example.jvmannotationsample.jvm_name

@JvmName("filterValidString")
fun List<String>.filterValid(): List<String> {
    TODO()
}

@JvmName("filterValidInt")
fun List<Int>.filterValid(): List<Int> {
    TODO()
}
``` 

## 作用在属性上
除此之外，@JvmName还可以作用在属性上。比如
```kotlin
package com.example.jvmannotationsample.jvm_name

@get:JvmName("x")
@set:JvmName("changeX")
var x: Int = 23
```
在Java中对应的调用
```java
public static void testJvmNameOnProperty() {
        OnPropertiesSampleKt.changeX(111);
        OnPropertiesSampleKt.x();
    }
```
在Kotlin中对应的调用
```kotlin
fun testJvmNameOnProperty() {
    x = 1111
    x
}
```
和作用在方法上一样，其实现原理一致，具体如下面的反编译代码可见一斑。

Java调用处的代码
```bash
javap -c ./app/build/tmp/kotlin-classes/debug/com/example/jvmannotationsample/jvm_name/OnPropertiesSampleKt.class
Compiled from "OnPropertiesSample.kt"
public final class com.example.jvmannotationsample.jvm_name.OnPropertiesSampleKt {
  public static final int x();
    Code:
       0: getstatic     #11                 // Field x:I
       3: ireturn

  public static final void changeX(int);
    Code:
       0: iload_0
       1: putstatic     #11                 // Field x:I
       4: return

  static {};
    Code:
       0: bipush        23
       2: putstatic     #11                 // Field x:I
       5: return
}
```
Kotlin调用处的代码
```bash
javap -c ./app/build/tmp/kotlin-classes/debug/com/example/jvmannotationsample/jvm_name/KotlinPlaygroundKt.class
Compiled from "KotlinPlayground.kt"
public final class com.example.jvmannotationsample.jvm_name.KotlinPlaygroundKt {


  public static final void testJvmNameOnProperty();
    Code:
       0: sipush        1111
       3: invokestatic  #36                 // Method com/example/jvmannotationsample/jvm_name/OnPropertiesSampleKt.changeX:(I)V
       6: invokestatic  #40                 // Method com/example/jvmannotationsample/jvm_name/OnPropertiesSampleKt.x:()I
       9: pop
      10: return
}
```

## 相关文章
  * [研究学习Kotlin的一些方法](https://droidyue.com/blog/2017/05/08/how-to-study-kotlin/)
  * [更多优质Kotlin文章](https://droidyue.com/blog/categories/kotlin/)
