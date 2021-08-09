---
layout: post
title: "如何在 Android Studio(北极狐) 下增加仓库声明"
date: 2021-08-09 21:44
comments: true
categories: Android gradle App Maven Jcenter 
---

最近升级了 Android Studio，变成了 Arctic Fox 的版本了。于是当我们新建一个项目的时候，尝试添加一个新的仓库声明。

打开工程根目录下的 build.gradle
```java
// Top-level build file where you can add configuration options common to all sub-projects/modules.
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath "com.android.tools.build:gradle:7.0.0"
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:1.5.21"

        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}

```
<!--more-->

我们发现并没有像以往那样存在`allprojects`这个配置区间。


如果，强制在这个文件下，增加下面的内容
```java
allprojects {
    repositories {
        maven { url "https://jitpack.io" }
    }
}

```
 
会出现这样的错误
```java
Build file '/Users/androidyue/Documents/projects/ViewLifecycleSample2/build.gradle' line: 18

A problem occurred evaluating root project 'ViewLifecycleSample'.
> Build was configured to prefer settings repositories over project repositories but repository 'maven' was added by build file 'build.gradle'
```


那么该怎么办呢？


解决方法 也很简单，就是在`settings.gradle` 文件的下面区域，增加仓库声明就可以了,比如这里是增加了`maven { url "https://jitpack.io" }`
```
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        jcenter() // Warning: this repository is going to shut down soon
        maven { url "https://jitpack.io" } //add your repository declaration here

    }
}
rootProject.name = "ViewLifecycleSample"
include ':app'
```


看来是设置依赖仓库的文件更换了，修改起来也不难。