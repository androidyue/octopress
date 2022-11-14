---
layout: post
title: "AAPT2 aapt2-7.2.2-7984345-osx Daemon #5: Idle daemon unexpectedly exit. This should not happen 问题解决"
date: 2022-11-14 21:28
comments: true
categories: 
---

CI 构建机，一直有概率出现构建失败的情况，查看了日志，得到了这样的相关错误信息


```bash
AAPT2 aapt2-7.2.2-7984345-osx Daemon #7: Idle daemon unexpectedly exit. This should not happen.
15:32:49 [        ] AAPT2 aapt2-7.2.2-7984345-osx Daemon #8: Idle daemon unexpectedly exit. This should not happen.
15:32:49 [        ] AAPT2 aapt2-7.2.2-7984345-osx Daemon #0: shutdown
15:32:49 [  +98 ms] AAPT2 aapt2-7.2.2-7984345-osx Daemon #6: Idle daemon unexpectedly exit. This should not happen.
15:32:49 [        ] AAPT2 aapt2-7.2.2-7984345-osx Daemon #4: Idle daemon unexpectedly exit. This should not happen.
15:32:49 [        ] AAPT2 aapt2-7.2.2-7984345-osx Daemon #3: Idle daemon unexpectedly exit. This should not happen.
15:32:49 [        ] AAPT2 aapt2-7.2.2-7984345-osx Daemon #5: Idle daemon unexpectedly exit. This should not happen.
15:32:49 [        ] AAPT2 aapt2-7.2.2-7984345-osx Daemon #1: Idle daemon unexpectedly exit. This should not happen.
15:32:49 [ +499 ms] The message received from the daemon indicates that the daemon has disappeared.
```
<!--more-->

## 解决方法
  * 看日志感觉是 Gradle 守护进程的问题
  * 想要既保持 Gralde 守护进程，又要解决这个问题，需要更多的时间
  * 比较简单的方式就是 禁用 Gradle 守护进程。

### 命令参数传递
  * 适用于能够直接使用`gradlew`
  * 也适用于不想全局应用配置的情况

```bash
./gradlew --no-daemon assembleXXX
```

### gradle.properties
  * 适用于 无法直接配置 `--no-daemon` 的情况，比如 flutter 执行 Android 构建。
  * 适用于全局配置

```bash
## 修改这个文件 ~/.gradle/gradle.properties 如果没有，直接创建即可
org.gradle.daemon=false
```

注意： 这里配置完成，最好执行一下`./gradlew --stop` 确保不适用已有的守护进程。
