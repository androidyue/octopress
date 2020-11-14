---
layout: post
title: "如何自定义一个 Gradle 任务"
date: 2020-11-14 20:28
comments: true
categories:  gradle groovy kotlin android java 
---
很多的项目是基于 gradle 构建，而且依托 gradle 的强大能力，我们可以实现更多的功能。比如像今天这样，我们会介绍如何创建一个自定义的 gradle 任务。


## 修改文件
  * （Android 项目）app 模块下的 build.gradle 为例

<!--more-->

## 增加PrintInfoTask

增加自定义的Task 分为两步

  * 增加Class声明 `PrintInfoTask`
  * 创建task `printInfo`

具体实施代码如下

```java
// 定义类
class PrintInfoTask extends DefaultTask {

    @TaskAction
    def printInfo() {
        println "printInfoTask"
    }
}

//声明 task
task printInfo(type: PrintInfoTask) {

}
```

其中
  
  * `@TaskAction` 注解的方法，会在任务执行的时候，被自动调用。


## 如何执行

使用我们上面创建的 `printInfo` 作为任务名执行就可以了。

```java
./gradlew printInfo
```


## 引入变量

为了让定义的任务可以配置，我们往往需要引入变量来实现。


## 外部变量无法直接使用
我们尝试在 `printInfo` 中引入`rootProject`，如下修改

```java
class PrintInfoTask extends DefaultTask {

    @TaskAction
    def printInfo() {
        println "printInfoTask ${rootProject}"
    }
}


task printInfo(type: PrintInfoTask) {

}
```

但是当我们在执行的时候，发现有问题，如下的错误信息。

```java
➜  GradleTaskSample ./gradlew printInfo
> Task :app:printInfo FAILED

FAILURE: Build failed with an exception.

* Where:
Build file '/Users/androidyue/AndroidStudioProjects/GradleTaskSample/app/build.gradle' line: 31

* What went wrong:
Execution failed for task ':app:printInfo'.
> Could not get unknown property 'rootProject' for task ':app:printInfo' of type PrintInfoTask.

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output. Run with --scan to get full insights.

* Get more help at https://help.gradle.org

BUILD FAILED in 607ms
1 actionable task: 1 executed
```

## 外部变量传入才能用

上面部分提示找不到`rootProject`属性，因为对于外部的属性，需要以传入属性的方式来实现，如下修改。


```java
class PrintInfoTask extends DefaultTask {

    @Input
    Project project = null

    @TaskAction
    def printInfo() {
        println "printInfoTask ${project}"
    }
}


task printInfo(type: PrintInfoTask) {
    project = rootProject
}
```

我们的修改是

  * `PrintInfoTask`中增加 `project` 属性，用来接收外部传入的对应值，使用`@Input` 表明 Task中需要输入的属性
  * 在`task printInfo` 中增加赋值语句 `project = rootProject`，其中`rootProject`为根项目的内容。




再次执行，就没有问题了。

```java
➜  GradleTaskSample ./gradlew printInfo

> Task :app:printInfo
printInfoTask root project 'GradleTaskSample'

BUILD SUCCESSFUL in 592ms
1 actionable task: 1 executed
```



## References
  * https://docs.gradle.org/current/userguide/custom_tasks.html


