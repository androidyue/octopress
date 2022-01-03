---
layout: post
title: "Mac 终端下 实现 安装 ipa 包到 iPhone 真机"
date: 2022-01-03 21:54
comments: true
categories: Mac Terminal 终端 iOS iPhone iPad 正版软件 Android Flutter 
---
 

最近处理 Flutter 的开发工作，开始尝试使用 iOS 作为日常的真机调试工作。对于一个原技术栈为 Android的人来说，发现 iOS 有很多不太方便的地方。比如如何在 Mac 电脑上安装 ipa包到 iPhone 上。

相比来说，Android 提供了adb 可以很快捷的在 终端上执行安装。而iOS 我也希望有一个可以在终端上实现安装ipa的方式，摸索了一下，终于发现了一个可行的技术方案。

<!--more--> 

这个可行的技术方案就是 ideviceinstaller，它是一个终端管理 iOS 设备上app 和存档的工具。

## 进行安装
Mac 下使用 HomeBrew 安装
```
brew install ideviceinstaller
```


## 安装一个app
```
ideviceinstaller -i ~/Downloads/hahaha.ipa
WARNING: could not locate iTunesMetadata.plist in archive!
WARNING: could not locate Payload/Runner.app/SC_Info/Runner.sinf in archive!
Copying '~/Downloads/hahaha.ipa' to device... DONE.
Installing 'com.hahaha.app'
Install: CreatingStagingDirectory (5%)
Install: ExtractingPackage (15%)
Install: InspectingPackage (20%)
Install: TakingInstallLock (20%)
Install: PreflightingApplication (30%)
Install: InstallingEmbeddedProfile (30%)
Install: VerifyingApplication (40%)
Install: CreatingContainer (50%)
Install: InstallingApplication (60%)
Install: PostflightingApplication (70%)
Install: SandboxingApplication (80%)
Install: GeneratingApplicationMap (90%)
Install: Complete
```


## 列举当前设备上的 apps
```
➜  /tmp ideviceinstaller --list-apps

CFBundleIdentifier, CFBundleVersion, CFBundleDisplayName
com.google.Authenticator, "3.3.6000", "Authenticator"
com.apple.Numbers, "7357.0.149", "Numbers"
com.apple.mobilegarageband, "5189", "GarageBand"
com.apple.clips, "5405.83", "Clips"
com.apple.iMovie, "5177", "iMovie"
com.apple.store.Jolly, "5.14.0.761", "Apple Store"
com.apple.Pages, "7357.0.149", "Pages"
com.apple.Keynote, "7357.0.149", "Keynote"
com.tencent.xin, "8.0.16.35", "WeChat"
```

## 移除一个app
```
ideviceinstaller --uninstall com.hahaha.app
Uninstalling 'com.hahaha.app'
Uninstall: RemovingApplication (50%)
Uninstall: GeneratingApplicationMap (90%)
Uninstall: Complete
```

## Github 地址
  * https://github.com/libimobiledevice/ideviceinstaller 

一条小广告：这里有一个软件，让你的 Mac 就能轻松读写常见 NTFS 硬盘 / U 盘，点击这个链接 https://droidyue.com/blog/2021/03/07/mac-ntfs-assistant-to-write-files-to-disk/