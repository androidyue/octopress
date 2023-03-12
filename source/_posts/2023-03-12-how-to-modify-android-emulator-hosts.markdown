---
layout: post
title: "Android 模拟器实现 hosts 修改"
date: 2023-03-12 20:50
comments: true
categories: Android hosts 模拟器
---
有时候我们需要使用 Android 模拟器来 绑定一下 hosts 来实现功能的开发与验证，刚好最近遇到了这样的需求，处理完成，简单记录一下。

<!--more-->

## 替换m1 实现（针对 苹果 M1 芯片才需要处理）
下载这个文件 https://github.com/google/android-emulator-m1-preview/releases/download/0.2/emulator-darwin-aarch64-0.2-engine-only.zip

解压，然后将 `emulator` 和 `emulator-check` 替换掉这里面的文件 `~/Library/Android/sdk/tools/` （原有的可以备份为 xxx_backup）

## 查看 avd_id
```bash
~/Library/Android/sdk/tools/emulator -list-avds
Pixel6ProAPI33
Pixel_3a_API_33_arm64-v8a
Pixel_6_API_22
Pixel_6_API_28
Pixel_6_Pro_API_23
Pixel_6_Pro_API_30_X86
```


## 启动 avd，可写入状态
```bash 
~/Library/Android/sdk/tools/emulator -avd Pixel_3a_API_33_arm64-v8a  -writable-system
```

## 新起终端tab 执行
1. adb root
2. adb remount
3. adb push your_hosts_on_mac /etc/hosts

## 验证ping
假设上面的 hosts 我们新增了 `127.0.0.1	baidu.com`
```bash
adb shell

ping baidu.com
PING baidu.com (127.0.0.1) 56(84) bytes of data.
64 bytes from baidu.com (127.0.0.1): icmp_seq=1 ttl=64 time=1.55 ms
64 bytes from baidu.com (127.0.0.1): icmp_seq=2 ttl=64 time=0.180 ms

```

注意： hosts 修改建议在 mac 上进行处理，然后使用`adb push your_hosts_on_mac /etc/hosts` 替换手机内的hosts。手机内置的 vi 很弱，可能无法编辑。

以上。