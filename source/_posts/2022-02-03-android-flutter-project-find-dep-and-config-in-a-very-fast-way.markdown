---
layout: post
title: "Android/Flutter 工程快速查找依赖和配置的脚本"
date: 2022-02-03 20:52
comments: true
categories: Android Flutter Gradle IDE YAML Shell Bash Linux Mac 
---

进行文件内容查找也是我们比较常做的事情，这里介绍两个比较常用的指定扩展名查找内容的脚本。

以上两个脚本均用于终端，非IDE，超级轻量快捷。

<!--more-->

## 查找 gradle 
对于 Gradle 文件中，我们可以用来过滤查询某个以来的内容，这可能最适合 Android 程序员了。


脚本内容（保存为gradleSearch.sh ）
```
#!/bin/bash
find . -name "*.gradle" | xargs grep -E -n --color=always "$1"
```

执行
```
 gradleSearch.sh kotlin
./android/app/build.gradle:25:apply plugin: 'kotlin-android'
./android/app/build.gradle:53:    kotlinOptions {
./android/app/build.gradle:216:    resolutionStrategy.force "org.jetbrains.kotlin:kotlin-stdlib-jdk8:$kotlin_version"
./android/build.gradle:2:    ext.kotlin_version = '1.5.31'
./android/build.gradle:13:        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
grep: ./android/.gradle: Is a directory
```



## 查找yaml
对于 Flutter 工程来说，它使用了yaml 管理一些配置和依赖存放。我们使用下面的脚本可以精准地过滤我们想要的内容。

```
#!/bin/bash
find . -name "*.yaml" | xargs grep -E -n --color=always "$1"
```

执行


``` 
yamlSearch.sh bloc
./pubspec.yaml:297:  bloc:
./pubspec.yaml:299:      name: bloc
```


