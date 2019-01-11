---
layout: post
title: "关于应用Kotlin后的编译速度问题"
date: 2018-01-31 22:10
comments: true
categories: Kotlin Java Android Gradle
---

2017年 Kotlin 被 Google 钦定为 Android 开发官方语言之一后，便如火如荼。很多团队开始应用了Kotlin，可谓是收益良多，可是也有一些问题，一个比较明显的就是Kotlin应用后编译速度会比较慢。这种感觉就像我们从Eclipse迁移到Android Studio变慢差不多。本文将尝试介绍一些方法来改善这一问题。

关于项目编译慢有很多原因，在Android项目中，通常会和Kotlin和Gradle有关系。首先我们通过一组图就能发现这其中的问题。其中

  * 红色代表Java,青色代表Kotlin
  * X轴代表编译次数数据，Y轴达标消耗的时间
  * Java的项目和Kotlin的项目实现功能一致，无其他额外差别

<!--more-->
下图的测试为10次连续的未修改的编译，两个项目均没有启动Gradle daemon。可以看出Kotlin耗时确实要耗时多一些。

![Ten consecutive clean build without gradle daemon](https://asset.droidyue.com/image/2019/01/Ten.Consecutive.clean.build.without.gradle.daemon.png)

接下来我们尝试开启Gradle daemon，下图即为新的测试数据（连续10次开启gradle daemon编译）。

我们可以发现开启gradle daemon后，Java的编译耗时和Kotlin明显减少，但是总的来看，Kotlin还是要耗时一些。
![Ten consecutive clean build with gradle daemon](https://asset.droidyue.com/image/2019/01/Ten.consecutive.clean.builds.with.gradle.daemon.png)

Kotlin在1.0.2后，增加了增量编译，那么我们看一下开启增量编译后的效果呢，如下图（启用增量编译后，连续10次没有文件变化的编译）

我们可以发现，除了第一次编译差距大一些的情况外（因为增量编译对第一次编译不起作用），后续的Java和Kotlin编译时间几乎一样，甚至Kotlin耗时更少。
![TenXconsecutiveincrementalbuildswithnofileschanged.png](https://asset.droidyue.com/image/2019/01/Tensecutive.increament.builds.with.no.files.changed.png)

一个文件不修改的增量编译现实中很少，很多时候我们都会进行文件的修改。当我们尝试修改一个独立的文件，再次执行测试，看一看有什么效果，如下图。

真的不可思议，Kotlin耗时这下已经和Java拉开了更大的差距，表现的更加优秀。

![Ten.consecutive.increamental.builds.with.one.isolated.file.changed.png](https://asset.droidyue.com/image/2019/01/Ten.consecutive.increamental.builds.with.one.isolated.file.changed.png)


然而项目中，我们的修改往往可能是针对一块核心的代码，很多的地方都调用它，当我们在尝试修改一个核心代码，连续10次进行测试（kotlin开启增量编译），数据又是如何呢？

如下图所示，Kotlin表现依然优秀于Java。

![Tenconsecutiveincrementalbuildswithonecorefilechanged.png](https://asset.droidyue.com/image/2019/01/Ten.consecutive.incremental.buids.with.one.core.file.changed.png)


通过上面的图例说明，我们发现其实Kotlin在某些情况下编译并不慢。同样我们也发现了一些加速Kotlin编译的方法，即


  * 开启gradle daemon，即在~/.gradle/gradle.properties文件中，增加org.gradle.daemon=true
  * 在项目的gradle.properties中增加kotlin.incremental=true  开启kotlin的增量编译。
  * 尝试使用最新的kotlin版本，增加编译速度是Kotlin团队一直努力的目标
  * 更多的加速编译的方法，请参考[一些关于加速Gradle构建的个人经验](http://droidyue.com/blog/2017/04/16/speedup-gradle-building/)


## 引用资料
  * 文中的测试数据图引用出为[Kotlin vs Java: Compilation speed](https://medium.com/keepsafe-engineering/kotlin-vs-java-compilation-speed-e6c174b39b5d)


