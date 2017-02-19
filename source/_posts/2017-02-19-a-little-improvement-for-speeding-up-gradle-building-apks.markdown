---
layout: post
title: "一个关于打包提速的小改进"
date: 2017-02-19 20:19
comments: true
categories: Android Gradle 
---
作为App开发者，打包和发包是经常要进行的工作。鉴于国内的特殊情况，造就了不可胜举的应用市场。为了便于跟踪统计必要的数据信息，我们通常会针对每个市场都进行打包。这些包总的来说几乎是一致的，可能唯一的的差别就是渠道号信息不一样。
<!--more-->
Flipboard中国版本目前覆盖了大概10几个渠道，目前唯一不同的就是渠道号信息。

最早的实现方式为
```java
buildConfigField "String", "CHANNEL_ID", null == versionProps['CHANNEL_ID'] ? /""/ : '"' + versionProps['CHANNEL_ID'] + '"'
```

上述实现的缺点有

  * 无法在manifest中配置包含渠道号信息的meta数据
  * 会导致每次重新编译代码，以及后续的多次Proguard优化，相对很耗时。打包时间将近4分钟

后来改进的方式为
```java
resValue "string", "channel_id", null == versionProps['CHANNEL_ID'] ? /""/ : '"' + versionProps['CHANNEL_ID'] + '"'
```

新的实现解决了上面的两个问题

  * 可以在manifest中实现配置渠道号信息
  * 无需重新编译源码，也无需后续的proguard的代码优化。只更新resource资源即可。打包时间缩短到14秒左右。

经过如此一个小改动，从此我们不再需要漫长的等待和浪费机器性能。