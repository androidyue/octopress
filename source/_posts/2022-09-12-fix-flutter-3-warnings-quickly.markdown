---
layout: post
title: "Flutter 3 迁移后编译 warnings 一键修复"
date: 2022-09-12 22:15
comments: true
categories: Flutter Flutter3 Dart Null 
---

当我们的 app 支持 flutter 3 后，无论是编译速度，还是运行效率，方方面面会有很大的提升。但是在我们编译的时候，会有类似下面的这些警告。 


```bash
../../../your_pub/lib/src/framework.dart:275:26: Warning: Operand of null-aware operation '!' has type 'SchedulerBinding' which excludes null.
[        ]  - 'SchedulerBinding' is from 'package:flutter/src/scheduler/binding.dart' ('../../../code/flutter_3/packages/flutter/lib/src/scheduler/binding.dart').
[        ]     if (SchedulerBinding.instance!.schedulerPhase ==

```

上面的警告虽然不会影响应用的编译，但是长久来看，还是需要解决的。 
<!--more-->

## 原因为何
原因是从 flutter 3 开始, `SchedulerBinding.instance`返回的是一个 非 null 实例，当我们使用`SchedulerBinding.instance!.schedulerPhase` 会得到这样的警告`Warning: Operand of null-aware operation '!' has type 'SchedulerBinding' which excludes null.
`

## 如何解决
解决起来很简单，按照下面的处理，将`!`去掉即可。 
```bash
SchedulerBinding.instance.schedulerPhase
```

## 都有哪些场景
flutter3 开始，下面这些都会有编译警告问题

```bash
SchedulerBinding.instance!.xxx
SchedulerBinding.instance?.xxx

WidgetsBinding.instance!.xxxx
WidgetsBinding.instance?.xxxx

PaintingBinding.instance?.xxx
PaintingBinding.instance!.xxx


RendererBinding.instance!.xxx
RendererBinding.instance?.xxxx

GestureBinding.instance!.xxx
GestureBinding.instance?.xxx

```


## 一键解决
那这么多内容需要解决，有没有一键处理的办法呢？

如果你接触过 终端脚本，答案是肯定的。我们可以使用下面的shell 脚本处理。


```bash
#!/usr/bin/env bash

function sedReplaceFile() {
	echo $1
	sed -i "" -e "s/SchedulerBinding.instance!/SchedulerBinding.instance/g" $1
	sed -i "" -e "s/SchedulerBinding.instance?/SchedulerBinding.instance/g" $1
	sed -i "" -e "s/WidgetsBinding.instance!/WidgetsBinding.instance/g" $1
	sed -i "" -e "s/WidgetsBinding.instance?/WidgetsBinding.instance/g" $1
	sed -i "" -e "s/PaintingBinding.instance?/PaintingBinding.instance/g" $1
	sed -i "" -e "s/PaintingBinding.instance!/PaintingBinding.instance/g" $1
	sed -i "" -e "s/RendererBinding.instance!/RendererBinding.instance/g" $1
	sed -i "" -e "s/RendererBinding.instance?/RendererBinding.instance/g" $1
	sed -i "" -e "s/GestureBinding.instance!/GestureBinding.instance/g" $1
	sed -i "" -e "s/GestureBinding.instance?/GestureBinding.instance/g" $1
	
}

export -f sedReplaceFile
find . -name "*.dart"  | xargs -I {} bash -c 'sedReplaceFile {}'

```

### 执行
```bash
cd your_project
f3_fix.sh 
```

## 注
  * 上面的脚本仅在 mac 系统验证， Linux 可能需要自行做简易修改。
  * 如果是 三方pub 包含警告问题，可以选择对应适配 flutter 3 的版本升级即可。

