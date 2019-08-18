---
layout: post
title: "简单几招提速 Kotlin kapt编译"
date: 2019-08-18 10:18
comments: true
categories: Kotlin katp 编译 优化 Gradle 注解处理器 cache Android 
---


应用Kotlin之后，涉及到注解的注解处理器依赖也会由`annotationProcessor`替换成`kapt`，和最初应用Kotlin一样，总会让人一种感觉，一番应用Kotlin和Kapt之后，编译耗时更长了，不过好在Kotlin和Google 在这一方面做了很多的优化和改进，本文将简单介绍一些配置，来实现项目编译关于kapt这方面的加速。
<!--more-->

## 开启Gradle 构建缓存支持(Gradle build cache support)

默认情况下，kapt注解处理任务并没有利用开启gradle的构建缓存，需要我们手动增加配置开启

开启方式：在项目的app module下的 build.gradle 文件增加如下代码
```java
kapt {
    useBuildCache = true
}
``` 

注意：

  * `kapt`配置和`android`配置同一层级。
  * 该特性支持从Kotlin 1.2.20开始。
  * 上述配置生效需Gradle为4.3及以上，且开启build-cache。（增加--build-cache 选项或在gradle.properties文件添加`org.gradle.caching=true`）

## 并行执行kapt任务
为了加快构建速度，我们可以利用`Gradle worker API`实现并行执行kapt任务。

开启方式，在`gradle.properties`文件中增加
```bash
kapt.use.worker.api=true
```

注意：

  * `Gradle worker API`需依赖`Gradle`4.10.3及以上。
  * 该特性支持自Kotlin 1.2.60
  * 启用并行执行，会引发更高的内存占用

## 启用kapt编译规避
除此之外，我们可以利用`Gradle compile avoidance`（编译规避）来避免执行注解处理。

注解处理被略过的场景有

  * 项目的源文件没有改变
  * 依赖的改变是ABI(Application Binary Interface)兼容的，比如仅仅修改某个方法的方法体。

开启方式：
  
  * 对于注解依赖需要使用`kapt`显式声明
  * 在`gradle.properties`文件中增加`kapt.include.compile.classpath=false`

注意：

  * 该特性需 Kotlin 1.3.20 及以上

## 增量注解处理
Kotlin 自1.3.30引入了一个实验功能，即支持注解增量处理。

开启需要很简单，在`gradle.properties`中加入
```bash
kapt.incremental.apt=true
```

但是还需要有一个前提，就是开启Gradle的增量编译（Kotlin 1.1.1已默认开启）。

除此之外，关键的因素还是需要开依赖的注解处理器是否支持增量处理。

### 如何查看注解处理器是否支持增量编译
```bash
./gradlew aDeb -Pkapt.verbose=true | grep KAPT

[INFO] Incremental KAPT support is disabled. Processors that are not incremental:
	com.bumptech.glide.annotation.compiler.GlideAnnotationProcessor, 
	dagger.internal.codegen.ComponentProcessor, 
	android.arch.lifecycle.LifecycleProcessor.
[INFO] Incremental KAPT support is disabled. Processors that are not incremental: 
	butterknife.compiler.ButterKnifeProcessor, 
	com.alibaba.android.arouter.compiler.processor.AutowiredProcessor, 
	com.alibaba.android.arouter.compiler.processor.InterceptorProcessor, 
	com.alibaba.android.arouter.compiler.processor.RouteProcessor, 
	dagger.internal.codegen.ComponentProcessor, 
	com.google.auto.service.processor.AutoServiceProcessor.
```

### 更新依赖至最新版
上面我们看到了`glide`,`butterknife`等依赖，我们都可以通过将这些依赖更新到最新版来解决

  * Glide在v4.9.0版本增加了增量处理支持，对应的github commit为 https://github.com/bumptech/glide/commit/a16a1baa140c9b87b9a68a2a3b91047fd60ba5d8
  * google/auto 也在较早的时候进行了支持，对应的github commit为 https://github.com/google/auto/commit/a5673d06f687e1354f1f069cce36136538cf532c

### 更新加手动配置
以Dagger为例，除了更新到最新版之外，还需要增加如下的配置
```java
android {
   defaultConfig {
      javaCompileOptions {
         annotationProcessorOptions {
            arguments << ["dagger.gradle.incremental": "true"]
         }
      }
   }
]
```
参考链接[https://github.com/google/dagger/issues/1120](https://github.com/google/dagger/issues/1120)
## Troubleshooting
  * 如果启用上面的方案导致问题，可以找到对应的配置，关闭该特性。

## 最后的建议
  * 积极保持依赖为最新(稳定)版，否则时间越长升级成本越大。

## References
  * https://kotlinlang.org/docs/reference/kapt.html
  * https://medium.com/avast-engineering/making-incremental-kapt-work-speed-up-your-kotlin-projects-539db1a771cf

## 相关内容
  * [一些关于加速Gradle构建的个人经验](https://droidyue.com/blog/2017/04/16/speedup-gradle-building/)
  * [关于应用Kotlin后的编译速度问题](https://droidyue.com/blog/2018/01/31/how-to-speed-up-kotlin-compilation/)  
