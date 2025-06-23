---
layout: post
title: "Android 开发中的三个常见构建错误及解决方案"
date: 2025-06-23 08:33
comments: true
categories: Android Gradle TensorFlow BouncyCastle JDK Java 
---

最近在 Android 项目开发中遇到了几个构建错误，以下是解决方案，供遇到同样问题的开发者参考。

## 1. META-INF 文件冲突

### 错误信息
```bash
FAILURE: Build failed with an exception.
* What went wrong:
Execution failed for task ':app:mergeDebugJavaResource'.
> A failure occurred while executing com.android.build.gradle.internal.tasks.MergeJavaResWorkAction
   > 2 files found with path 'META-INF/versions/9/OSGI-INF/MANIFEST.MF' from inputs:
```
<!--more-->

### 解决方案
在 `app/build.gradle` 中添加以下配置：
```bash
android {
    packagingOptions {
        resources {
            excludes += "META-INF/versions/9/OSGI-INF/MANIFEST.MF"
        }
    }
}
```

### 说明
此错误通常由多个依赖包含相同的 META-INF 文件引起，通过 `excludes` 排除重复文件即可解决。

---

## 2. TensorFlow Lite 库冲突

### 错误信息
```bash
Caused by: java.lang.RuntimeException: Duplicate class org.tensorflow.lite.DataType found in
modules jetified-litert-api-1.0.1-runtime (com.google.ai.edge.litert:litert-api:1.0.1) and
jetified-tensorflow-lite-api-2.12.0-runtime (org.tensorflow:tensorflow-lite-api:2.12.0)
```

### 解决方案
在 `app/build.gradle` 中添加依赖替换规则：
```bash
configurations.all {
    resolutionStrategy.dependencySubstitution {
        substitute module("org.tensorflow:tensorflow-lite") with module("com.google.ai.edge.litert:litert:1.0.1")
    }
}
```

### 说明
Google 将 TensorFlow Lite 迁移到新包名 `com.google.ai.edge.litert`，若项目同时包含新旧包名，会导致类冲突。通过依赖替换强制使用新包解决。

---

## 3. Jetifier 与 BouncyCastle 兼容性问题

### 错误信息
```bash
Caused by: java.lang.RuntimeException: Failed to transform
'/Users/xxxxx/.gradle/caches/modules-2/files-2.1/org.bouncycastle/bcprov-jdk18on/1.78/619aafb92dc0b4c6c
c4cf86c487ca48ee2d67a8e/bcprov-jdk18on-1.78.jar' using Jetifier. 
Reason: IllegalArgumentException, message: Unsupported class file major version 65.
```

### 解决方案
在项目根目录的 `android/gradle.properties` 文件中添加：
```bash
android.jetifier.ignorelist=bcprov-jdk18on-1.78.jar,bcutil-jdk18on-1.78.jar
```

### 说明
BouncyCastle 1.78 版本使用 Java 21 编译（class file major version 65），而 Jetifier 不支持此版本字节码。将相关 jar 包加入 Jetifier 忽略列表可避免转换错误。

---

## 总结
以上三个问题是 Android 构建中常见的依赖冲突问题，解决思路包括：
- 排除重复文件
- 替换冲突依赖
- 跳过不兼容的处理

遇到类似问题时，仔细分析错误信息，通常能找到相应解决方案。
