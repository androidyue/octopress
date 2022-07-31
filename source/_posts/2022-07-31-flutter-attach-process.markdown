---
layout: post
title: "使用 flutter attach 实现代码与应用进程关联"
date: 2022-07-31 17:04
comments: true
categories: 
---
当我们使用 flutter run 调试 App 时，假如数据线接触不良或者断开，当我们想要继续调试的时候，可能就需要再次执行 `flutter run`。 

但其实，还有一个命令叫做 flutter attach. 它可以实现如下的功能

  * attach 到一个现在运行的 app  
  * 支持指定设备 id 进行 attach  
  * 支持指定端口进行 attach  
  * 支持设置超时时间  
  * 支持传递 key-value 键值对设置  

<!--more-->

使用起来也很简单
```bash
flutter attach
```


## 多设备可用时
首先使用 `flutter devices` 查看目标设备 id
```
 flutter devices
2 connected devices:

SM G9730 (mobile) • RA2TQ6PN • android-arm64  • Android 11 (API 30)
Chrome (web)      • chrome      • web-javascript • Google Chrome 100.0.4896.60
```

然后执行设备id 执行即可。
```
flutter attach -d RA2TQ6PN --verbose
```
