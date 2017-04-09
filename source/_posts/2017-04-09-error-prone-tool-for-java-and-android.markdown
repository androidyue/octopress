---
layout: post
title: "Error-prone,Google出品的Java和Android Bug分析利器"
date: 2017-04-09 20:19
comments: true
categories: Android Java Google
---
## 是什么
  * 静态的Java和Android bug分析利器
  * 由Google出品
  * 由error-prone接管compiler,在代码编译时进行检查，并抛出错误中断执行
  * 在抛出错误的同时给出具体的原因和相应方案
  * error-prone github 地址为 [https://github.com/google/error-prone](https://github.com/google/error-prone)

<!--more-->

## 举几个例子
```java
private void testCollectionIncompatibleType() {
    Set<Short> set = new HashSet<>();
    set.add(Short.valueOf("1"));
    set.remove(0);
}
```

上面的代码中

  * set是一个接受Short类型的集合
  * 我们想通过类似从List.remove(index)方式删除一个元素
  * 但是Set没有remove(index)方法，有的只是remove(Object)方法，普通编译器不会报错，而error-prone则会发现

报出的错误信息为
```java
/Users/jishuxiaoheiwu/github/ErrorProneSample/app/src/main/java/com/example/jishuxiaoheiwu/errorpronesample/MainActivity.java:24: 
error: [CollectionIncompatibleType] Argument '0' should not be passed to this method; its type int is not compatible with its collection's type argument Short
        set.remove(0);
                  ^
    (see http://errorprone.info/bugpattern/CollectionIncompatibleType)
```


再举一个例子
```java
"hello World".getBytes().toString();
```
报出的错误是
```java
/Users/jishuxiaoheiwu/github/ErrorProneSample/app/src/main/java/com/example/jishuxiaoheiwu/errorpronesample/MainActivity.java:16: 
error: [ArrayToString] Calling toString on an array does not provide useful information
        "hello World".getBytes().toString();
                                         ^
    (see http://errorprone.info/bugpattern/ArrayToString)
```
提示上面的byte[].toString()方法打印没有有用信息。

## BugPattern
Error-prone是基于BugPattern来发现问题的，覆盖范围不仅限于Java还包含Android代码。一些比较常见的BugPattern有如下这些

  * ArrayToString 直接调用数组的toString方法打印不出有用信息
  * DivZero 0不能做除数，即分母
  * DefaultCharset 调用系统默认的Charset
  * MissingDefault switch中缺少default
  * MislabeledAndroidString Android中的字符串命名和内容不匹配，具有误导性
  * HardCodedSdCardPath 硬编码sd卡路径
  * IsLoggableTagLength log tag字符数量过长
  * 其他
  * 更多的bug pattern请参考 [bugpatterns](https://github.com/google/error-prone/tree/master/core/src/main/java/com/google/errorprone/bugpatterns)

BugPattern有三种严重程度，如下


  * ERROR 
  * WARNING
  * SUGGESTION

只有ERROR的严重程度才会中断当前的编译，其他情况都会以日志输出形式展现。


## 如何配置
error-prone有对应的gradle插件，只需要应用即可。需要的操作很简单，只需要三步

  * 增加相应的maven repo
  * 在依赖中设置error-prone plugin classpath
  * 应用error-prone plugin

一个完整的代码示例如下，修改的文件为Project的build.gradle文件
```java
buildscript {
    repositories {
        jcenter()
        // error-prone相关配置
        maven {
            url "https://plugins.gradle.org/m2/"
        }
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:2.2.3'
        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
        // error-prone相关配置
        classpath "net.ltgt.gradle:gradle-errorprone-plugin:0.0.9"
    }
}

allprojects {
    repositories {
        jcenter()
    }
    //error-prone相关配置
    apply plugin: "net.ltgt.errorprone"
}
```  

  * 具体参考[net.ltgt.errorprone](https://plugins.gradle.org/plugin/net.ltgt.errorprone)
  * 其他配置方法[Maven, Ant等](http://errorprone.info/docs/installation)

## 开启/关闭部分检查
Error-prone plugin提供了方法允许我们配置bugpattern的处理方式。

基本的做法是
```java
tasks.withType(JavaCompile) {
  options.compilerArgs += [ '-Xep:<checkName>[:severity]' ]
}
```

比如我们想要将ArrayToString从ERROR转成WARNING，我们可以这样做
```java
tasks.withType(JavaCompile) {
    options.compilerArgs += [ '-Xep:ArrayToString:WARN' ]
}
```

除此之外还有一些特殊的参数

  * -XepAllErrorsAsWarnings 将全部的Error转成WARNING
  * -XepAllDisabledChecksAsWarnings 开启全部的check，之前禁止的作为WARNING级别处理
  * -XepDisableAllChecks  关闭所有的check

其他的参数可以具体参考[ErrorProneOptions.java](https://github.com/google/error-prone/blob/master/check_api/src/main/java/com/google/errorprone/ErrorProneOptions.java)

## 分条件开启error-prone插件
理论上，error-prone在编译时期进行代码分析并检查，会延长了编译时间，加之Gradle编译本来就很慢，为了不对我们日常的构建造成影响，我们可以分条件开启error-prone,即

  * 在日常开发构建，禁止应用error-prone插件，不对构建时间影响
  * 在特殊场景，比如持续集成时应用error-prone插件，用来发现问题。

具体的做法是通过想gradle传递参数来实现。简易代码如下。

```java
allprojects {
    repositories {
        jcenter()
    }
    //如果接受的参数有enableErrorProne则应用插件，否则不应用
    if (project.hasProperty("enableErrorProne")) {
        apply plugin: "net.ltgt.errorprone"
    }
}
```
使用如下，则会开启应用插件
```java
./gradlew assembleDebug -PenableErrorProne
```

## 注意
  * 由于是静态分析工具，即使问题代码不被执行也会检测出来。
  * 一次编译过程中，error-prone可以报出多个错误
  * Android Studio也有对应的error-prone插件，大家也可以使用。


以上就是关于error-prone的一些简单总结。Error-prone在Flipboard中已经应用很久，采用的方式为开发构建时不开启，在持续集成时开启。大家可根据自己和团队的需要选择并应用error-prone，来快速发现问题并改善代码的质量。
