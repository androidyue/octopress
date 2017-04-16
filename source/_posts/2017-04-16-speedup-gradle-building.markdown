---
layout: post
title: "一些关于加速Gradle构建的个人经验"
date: 2017-04-16 20:52
comments: true
categories: Gradle Android
---


目前绝大多数的Android项目都是基于Grale了，因为Gradle确实给我们带来了很多便利，然而，在使用了Gradle后，最大的不满就是编译起来太慢了。解决慢的问题无非有两种方法

   * 提升硬件配置，选择CPU和内存和硬盘等更优的硬件
   * 在软件方面，减少不必要的耗时，充分利用现有机器的性能。

本文的主要经验围绕着如何减少不必要的耗时操作和如何充分利用机器性能展开。

<!--more-->

## 调整gradle配置
### 开启daemon
相比没有开启daemon，开启daemon有如下好处

  * 不需要每次启动gradle进程（JVM实例），减少了初始化相关的工作
  * daemon可以缓存项目结构，文件，task等，尽可能复用之前的编译成果，缩短编译过程

开启daemon很简单，以Mac为例，在家目录下的.gradle/gradle.properties文件（如没有，可需要新建文件），加上如下的代码即可。
```
org.gradle.daemon=true
```
或者传递gradle参数
```java
./gradlew task --daemon
```

为了确保gradle配置生效，建议使用gradle --stop停止已有的daemon。
```java
./gradlew --stop
```

再次执行gradle任务就可以应用daemon了，留意的话，可以看到类似这样的日志输出。
```java
Starting a Gradle Daemon (subsequent builds will be faster)
```

## 设置heap大小
为Gradle分配足够大的内存，则可以同样加速编译。如下修改文件gradle.properties
```java
org.gradle.jvmargs=-Xmx5120m -XX:MaxPermSize=2048m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
```
由于Flipboard依赖繁多，且文件也多，并结合自身设备8G内存，这里为Gradle分配最大5G。效果目前看起来不错，大家可以根据自己的情况不断调整得到一个最优的值。

## 开启offline
开启offline之后，可以强制Gradle使用本地缓存的依赖，避免了网络读写操作，即使是需要从网络进行检查这些依赖。
```java
./gradlew --offline taskName
```
如上使用时，加上--offline参数即可。

注意，如果是某个依赖在本地不存在，则会编译出错，解决方法，只需要暂时关闭offline,等依赖下载到本地后，在后续的执行中加入offline即可。

## 设置并行构建
现在的工程往往使用了很多模块，默认情况下Gradle处理多模块时，往往是挨个按顺序处理。可以想象，这种编译起来会有多慢。好在Gradle提供了并行构建的功能，可以让我们充分利用机器的性能，减少编译构建的时间。

修改gradle.properties文件
```java
org.gradle.parallel=true
```
或向gradle传递参数
```java
./gradlew task --parallel
```

当我们配置完成，再次执行gradle task，会得到类似这样的信息，信息标明了开启Parallel以及每个task使用的线程信息。
```java
./gradlew clean --info

Parallel execution is an incubating feature.
.......
:libs:x:clean (Thread[Task worker Thread 3,5,main]) completed. Took 0.005 secs.
:libs:xx:clean (Thread[Daemon worker Thread 3,5,main]) started.
:libs:xxx:clean (Thread[Task worker Thread 2,5,main]) completed. Took 0.003 secs.
:libs:xxxx:clean (Thread[Task worker Thread 3,5,main]) started.
:libs:xxxxx:clean (Thread[Task worker Thread 2,5,main]) started.
:libs:xxxxxx:clean (Thread[Task worker,5,main]) completed. Took 0.004 secs.
:libs:json-gson:clean (Thread[Task worker,5,main]) started.
```

## 多modules工程优化
现在的一个Project往往有很多modules，导致我们的编译会变慢。使用—configure-on-demand会在执行任务时仅仅会配置相关的modules，而不是左右的modules。尤其是对于多模块的project来说，使用起来会有不小的提升。
```java
./gradlew assembleChinaFastDebug --configure-on-demand
```

## 尝试停止已有的daemon
当我们开启了daemon有段时间后，会发现编译会变得慢了下来，这时候，我们可以尝试结束已有的daemon，确保后续的执行任务使用开启全新的daemon。如下停止已经存在的gradle daemon.
```java
./gradlew --stop
Stopping Daemon(s)
1 Daemon stopped
```

## debug构建关闭proguard
提到Proguard大家想到的都是代码混淆，其实除了代码混淆之外，Proguard还可以进行代码压缩，优化和预验证。这其中的代码优化可能会占据更多的时间。
比如一个开启了代码优化的配置如下
```java
-optimizationpasses 5
```
这就意味着这个代码优化会经过5次，即上一次的优化输出结果作为下一次的优化的输入。反反复复的分析，知道完成配置的次数。

在Android中，我们可以配置debug禁用Proguard即可。
```java
buildTypes {
    debug {
        minifyEnabled false
    }

    release {
        minifyEnabled true
    }
}
```
以Flipboard为例，当从设置`optimizationpasses=5`改成debug禁用proguard，编译时间减少了将近3分多钟。

## 进行profile分析
如果上面的所有配置可能到没有达到明显的效果，那么我们就应该使用profile功能来分析一下具体卡在哪里了。

gradle提供了性能分析的功能，就profile，使用很简单，执行任务时带上--profile参数即可。比如
```java
./gradlew assembleChinaRelease --profile
```
待到执行完毕，在project根目录下的build/reports/profile目录有对应的结果文件，如profile-2017-04-08-23-06-37.html，使用浏览器打开，看到的效果是这样的
![gradle profile summary](http://7jpolu.com1.z0.glb.clouddn.com/gradle_profile_summary.jpeg)

从上面的summary可知，上面的主要耗时表现在Task Execution上，于是我们切换到Task Execution这个tab
![Gradle profile task execution](http://7jpolu.com1.z0.glb.clouddn.com/gradle_profile_task_execution.png)

我们可以发现上面的`:apps:droidyue:crashlyticsUploadDeobsChinaRelease`居然耗费了4m26.26s，那么这是一个什么任务呢？

其实它是著名的bug收集工具crashlytics的上传混淆映射文件的操作，由于crashlytics的服务器在国外，导致这个网络操作会很慢。

解决方法是，我们可以选择性的应用crashlytics插件，具体可以参考[Error-prone,Google出品的Java和Android Bug分析利器](http://droidyue.com/newtab.html?url=http%3A%2F%2Fdroidyue.com%2Fblog%2F2017%2F04%2F09%2Ferror-prone-tool-for-java-and-android%2F)中关于选择开启error-prone的部分。

通过profile我们可以清晰地看出耗时的根源在哪里，并开始有的放矢地进行解决。


## 最后的话
上面关于如果在不提升硬件的条件下进行优化，当我们所有的配置都已经应用，并且仍然感觉编译时间很长的话，那么我们也应该从硬件的角度去思考了。

关于提升编译速度的通常主要有三个主要的影响硬件

  * CPU，建议CPU不要低于i5
  * 内存，建议内存不少于8G
  * 硬盘，建议为SSD

以上三者兼备的比较成熟的产品应该是MBP，如这个配置[Apple MacBook Pro 15.4英寸笔记本电脑(Core i7 处理器/16GB内存/256GB SSD闪存/Retina屏)](http://union-click.jd.com/jdc?e=0&p=AyIHZRprFQYaBVEbXCVGTV8LRGtMR1dGXgVFTUdGW0pADgpQTFtLG18dABYHUgQCUF5PNxQBGkx%2BWxkNe15VSkAFK1ktTF5nUSUXVyUAFA9WHVsWAxM3VxlbFQsWB1QeayUCEzcDdVsUAxMGVBpbFgQiAlUaXRwEFw9SK1sQChIAVh9dEAQXDlQrXCVSTVIWRQNASlZTZStrJQ%3D%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsRChADVRxETEdOWg%3D%3D)。

这所谓工欲善其事必先利其器，当我们从硬件和软件上都下功夫进行了优化，我们的开发效率也会得到很大的提高。

备注：就个人而言，应用上面的方法，日常的debug版本build时间由原来的一分钟左右降到了30秒左右。我的机器为15.4MBP,i7,8G,SSD.

