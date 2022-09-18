---
layout: post
title: "Android Some runtime JAR files in the classpath have an incompatible version Kotlin 问题解决"
date: 2022-09-18 21:17
comments: true
categories: Android Kotlin Jar Gradle 
---

在 Android 工程中，随着依赖包的引入，也会出现 多个 Kotlin 版本的问题，比如会有下面这样的警告信息

```
 ] > Task :app:lintVitalAnalyzeRelease
[        ] w: Runtime JAR files in the classpath should have the same version. These files were found in the classpath:
[        ]     /Users/xxxxxxxxx/.gradle/caches/modules-2/files-2.1/org.jetbrains.kotlin/kotlin-stdlib-jdk8/1.6.10/e80fe6ac3c3573a80305f5ec43f86b829e8ab53d/kotlin-stdlib-jdk8-1.6.10.jar (version 1.6)
[        ]     /Users/xxxxxxxxx/.gradle/caches/modules-2/files-2.1/org.jetbrains.kotlin/kotlin-stdlib-jdk7/1.7.10/1ef73fee66f45d52c67e2aca12fd945dbe0659bf/kotlin-stdlib-jdk7-1.7.10.jar (version 1.7)
[        ]     /Users/xxxxxxxxx/.gradle/caches/modules-2/files-2.1/org.jetbrains.kotlin/kotlin-stdlib/1.7.10/d2abf9e77736acc4450dc4a3f707fa2c10f5099d/kotlin-stdlib-1.7.10.jar (version 1.7)
[        ]     /Users/xxxxxxxxx/.gradle/caches/modules-2/files-2.1/org.jetbrains.kotlin/kotlin-stdlib-common/1.7.10/bac80c520d0a9e3f3673bc2658c6ed02ef45a76a/kotlin-stdlib-common-1.7.10.jar (version 1.7)
[        ] w: Some runtime JAR files in the classpath have an incompatible version. Consider removing them from the classpath
[  +98 ms] timber.lint.TimberIssueRegistry in /Users/xxxxxxxxx/.gradle/caches/transforms-3/d91983d38205de71b5c5d645c8d4eb47/transformed/jetified-timber-4.7.1/jars/lint.jar does not specify a vendor; see
IssueRegistry#vendor
[  +96 ms] e:
/Users/xxxxxxxxx/.gradle/caches/modules-2/files-2.1/org.jetbrains.kotlin/kotlin-stdlib-jdk7/1.7.10/1ef73fee66f45d52c67e2aca12fd945dbe0659bf/kotlin-stdlib-jdk7-1.7.10.jar!/META-INF/kotlin-stdlib-jdk7.kotlin_modul
e: Module was compiled with an incompatible version of Kotlin. The binary version of its metadata is 1.7.1, expected version is 1.5.1.
[        ] e:
/Users/xxxxxxxxx/.gradle/caches/modules-2/files-2.1/org.jetbrains.kotlin/kotlin-stdlib/1.7.10/d2abf9e77736acc4450dc4a3f707fa2c10f5099d/kotlin-stdlib-1.7.10.jar!/META-INF/kotlin-stdlib.kotlin_module: Module was
compiled with an incompatible version of Kotlin. The binary version of its metadata is 1.7.1, expected version is 1.5.1.
[        ] e:
/Users/xxxxxxxxx/.gradle/caches/modules-2/files-2.1/org.jetbrains.kotlin/kotlin-stdlib-common/1.7.10/bac80c520d0a9e3f3673bc2658c6ed02ef45a76a/kotlin-stdlib-common-1.7.10.jar!/META-INF/kotlin-stdlib-common.kotlin
_module: Module was compiled with an incompatible version of Kotlin. The binary version of its metadata is 1.7.1, expected version is 1.5.1.
```

<!--more-->

解决起来很简单，强制指定依赖为统一的版本即可。

在 build.gradle(app下) 增加这些配置即可。

```groovy

configurations.all {
   resolutionStrategy.force "org.jetbrains.kotlin:kotlin-stdlib-jdk8:$kotlin_version"
   resolutionStrategy.force "org.jetbrains.kotlin:kotlin-stdlib-jdk7:$kotlin_version"
   resolutionStrategy.force "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"
   resolutionStrategy.force "org.jetbrains.kotlin:kotlin-stdlib-common:$kotlin_version"
}

```

