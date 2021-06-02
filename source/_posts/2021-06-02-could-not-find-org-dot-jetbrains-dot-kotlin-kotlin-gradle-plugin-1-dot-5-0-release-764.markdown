---
layout: post
title: "Could not find org.jetbrains.kotlin:kotlin-gradle-plugin:1.5.0-release-764 问题解决"
date: 2021-06-02 11:52
comments: true
categories: Android Kotlin Gradle maven 
---
最近新创建的 Android Studio 项目，都报这样的问题。

### 问题日志
```java
A problem occurred configuring root project 'TooLargeToolSample'.
> Could not resolve all artifacts for configuration ':classpath'.
   > Could not find org.jetbrains.kotlin:kotlin-gradle-plugin:1.5.0-release-764.
     Searched in the following locations:
       - https://dl.google.com/dl/android/maven2/org/jetbrains/kotlin/kotlin-gradle-plugin/1.5.0-release-764/kotlin-gradle-plugin-1.5.0-release-764.pom
       - https://repo.maven.apache.org/maven2/org/jetbrains/kotlin/kotlin-gradle-plugin/1.5.0-release-764/kotlin-gradle-plugin-1.5.0-release-764.pom
     Required by:
         project :

Possible solution:
 - Declare repository providing the artifact, see the documentation at https://docs.gradle.org/current/userguide/declaring_repositories.html
```

<!--more-->

### 解决方法
将build.gradle 中的文件内容
```java
buildscript {
    ext.kotlin_version = "1.5.0-release-764"
```

修改为如下即可。
```java
buildscript {
    ext.kotlin_version = "1.5.0"
```
