---
layout: post
title: "修复Gradle因代理设置导致的超时问题"
date: 2020-04-11 14:58
comments: true
categories: gradle proxy bintray jcenter network android 
---

之前在项目中增加了一个项目依赖，可是配置的时候，怎么也无法下载下来。中终端执行gradle得到的错误日志如下
```java

org.gradle.internal.resource.transport.http.HttpRequestException: Could not HEAD 'https://jcenter.bintray.com/com/google/code/findbugs/jsr305/2.0.1/jsr305-2.0.1-sources.jar'.
at org.gradle.internal.resource.transport.http.HttpClientHelper.performRequest(HttpClientHelper.java:96)
at org.gradle.internal.resource.transport.http.HttpClientHelper.performRawHead(HttpClientHelper.java:72)
```
<!--more-->

怀疑是网络的问题，先后开启了***工具都无法下载。后来摸索了一段时间，才发现了问题的所在。我在gradle.properties的代理错误设置有问题

```java
systemProp.https.proxyPort=1080
systemProp.http.proxyHost=127.0.0.1
org.gradle.jvmargs=-Xmx10240m -XX\:MaxPermSize\=4096m -XX\:+HeapDumpOnOutOfMemoryError -Dfile.encoding\=UTF-8
org.gradle.daemon=true
systemProp.https.proxyHost=127.0.0.1
org.gradle.parallel=true
systemProp.http.proxyPort=1080
```

## 解决方法
  * 删除或者更正相关的http和https的host和端口，问题即可解决。

以上。
