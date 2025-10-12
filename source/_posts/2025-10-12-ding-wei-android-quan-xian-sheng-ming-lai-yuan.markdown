---
layout: post
title: "定位 Android 权限声明来源"
date: 2025-10-12 08:00
comments: true
categories: Android Gradle Permission Debug
---

开发中经常需要排查某个权限是由哪个依赖库引入的，本文记录通过 Gradle daemon 日志快速定位权限来源的方法。

<!--more-->

## 查询方法

使用以下命令在 Gradle daemon 日志中搜索权限声明：

```bash
grep -n -C 2 "android.permission.INTERNET" --include="*.out.log" -R ~/.gradle/daemon/ .
```

### 参数说明

- `-n`：显示行号
- `-C 2`：显示匹配行前后各 2 行上下文（关于 grep 上下文参数的详细用法见[这篇文章](https://droidyue.com/blog/2025/06/24/use-grep-with-context/)）
- `--include="*.out.log"`：只搜索 `.out.log` 文件
- `-R`：递归搜索目录
- `~/.gradle/daemon/`：Gradle daemon 日志目录

---

## daemon 日志文件说明

### 什么是 daemon*.out.log

Gradle daemon 是 Gradle 构建系统的后台进程，用于加速构建过程。`daemon-*.out.log` 文件记录了 daemon 进程的详细输出信息，包括：

- **依赖解析过程**：库的下载、合并信息
- **Manifest 合并日志**：权限、组件的合并来源
- **构建任务执行**：编译、打包等任务的详细输出
- **错误堆栈信息**：构建失败时的完整日志

### 文件位置

```
~/.gradle/daemon/
├── 5.4.1/
│   ├── daemon-77407.out.log
│   └── daemon-77408.out.log
├── 7.0.2/
│   └── daemon-88901.out.log
└── ...
```

每个 Gradle 版本对应一个目录，每次 daemon 启动会生成新的日志文件，文件名中的数字为进程 ID。

---

## 结果分析

### 查询结果示例

```log
/daemon/5.4.1/daemon-77407.out.log:132336:Merging uses-permission#android.permission.INTERNET 
with lower [net.butterflytv.utils:rtmp-client:3.0.1] AndroidManifest.xml:11:5-67
```

### 信息解读

从日志可以看出：

- **权限名称**：`android.permission.INTERNET`
- **来源依赖**：`net.butterflytv.utils:rtmp-client:3.0.1`
- **声明位置**：该依赖的 `AndroidManifest.xml` 第 11 行
- **日志文件**：`daemon-77407.out.log` 第 132336 行

### 处理方式

使用 `<uses-permission tools:node="remove">` 在主 Manifest 中显式移除。

---

## 注意事项

- daemon 日志会随着构建次数增多而变大，定期清理 `~/.gradle/daemon/` 目录
- 不同 Gradle 版本的日志格式可能略有差异
- 查询结果可能包含多个匹配项，需根据依赖关系判断实际来源

## 延伸阅读

- [Gradle Daemon 官方文档](https://docs.gradle.org/current/userguide/gradle_daemon.html)
- [Android Manifest 合并机制](https://developer.android.com/studio/build/manifest-merge)
