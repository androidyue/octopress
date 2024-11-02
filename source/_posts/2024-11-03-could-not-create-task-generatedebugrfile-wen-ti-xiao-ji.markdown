---
layout: post
title: "Could not create task ':generateDebugRFile' 问题小记"
date: 2024-11-03 00:49
comments: true
categories: Android Gradle Flutter 
---

前段时间，处理一个比较旧的 flutter plugin，涉及到 Android 的部分，一顿修改后，发现无法 gradle sync 成功。 报错如下，
```java
Could not create task ':generateDebugRFile'.
Cannot use @TaskAction annotation on method IncrementalTask.taskAction$gradle_core() because interface org.gradle.api.tasks.incremental.IncrementalTaskInputs is not a valid parameter to an action method.

* Try:
> Run with --debug option to get more log output.
> Run with --scan to get full insights.

* Exception is:
com.intellij.openapi.externalSystem.model.ExternalSystemException: Could not create task ':generateDebugRFile'.
Cannot use @TaskAction annotation on method IncrementalTask.taskAction$gradle_core() because interface org.gradle.api.tasks.incremental.IncrementalTaskInputs is not a valid parameter to an action method.
```

<!--more-->


根据分析上面的错误信息，判定与 gradle 有关，和修改的 kotlin 代码无关。

经过一些简短尝试，最终确定是 gradle 版本不匹配的问题（主要由这一句推断 because interface org.gradle.api.tasks.incremental.IncrementalTaskInputs is not a valid parameter to an action method.）。

## 原因与解法
* 原因为 Android Gradle Plugin 与 gradle 不匹配。
* 可以修改 gradle plugin 版本，也可以修改 gradle 版本。


### 修改 AGP 版本
classpath 'com.android.tools.build:gradle:7.1.2'    // The Android Gradle plugin.

### 修改 gradle 版本
修改gradle/wrapper/gradle-wrapper.properties

distributionUrl=https\://services.gradle.org/distributions/gradle-8.0-all.zip

修改成（或者对应的gradle 版本） 
distributionUrl=https\://services.gradle.org/distributions/gradle-7.4-all.zip


### 如何确定 AGP 与 gradle 对应关系
查询，请访问 这里 https://developer.android.com/build/releases/gradle-plugin?#updating-gradle




