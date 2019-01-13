---
layout: post
title: "解决Android手机连接Charles unknown问题"
date: 2019-01-13 20:59
comments: true
categories: Charles Android 
---

最近很多同事反馈使用Charles抓包出现了很多unknown的问题，现象如下图

![charles unknown](https://asset.droidyue.com/image/2019_first_half/charles_unknow_error.png)

查看右侧的原因，给出的结果是这样的

![Error detail](https://asset.droidyue.com/image/2019_first_half/failure_reason_charles_unknown.png)

这里将讲解如何解决这个问题，但是开始阅读之前，请确认符合如下的条件

  * 本文仅适用于Android 7及之后设备
  * 待抓包的应用设置了targetSDK 为24及其以上
  * 已经配置好了charles的证书

好的，开始了。

<!--more-->

## 原因

  * 我们在设备上安装的charles证书，属于用户添加的证书
  * 出于应用安全的目的，Android 7及之后默认不信任用户添加的证书(Android 7 之前是默认信任用户添加的证书)
  * 当我们将App的编译目标提到24及其以上，系统就会激活这一安全限制。

##如何解决
### 创建App网络安全配置文件
在应用xml目录下新建一个名为`network_security_config.xml`，内容为
```xml
<network-security-config>
    <debug-overrides>
        <trust-anchors>
            <!-- Trust user added CAs while debuggable only -->
            <certificates src="user" />
        </trust-anchors>
    </debug-overrides>
</network-security-config>
```
上面的代码仅仅在debug编译包，信任用户添加的CA证书
### 应用配置
在AndroidManifest Application节点增加属性
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest ... >
    <application android:networkSecurityConfig="@xml/network_security_config"
                    ... >
        ...
    </application>
</manifest>
```

建议重启应用，就能解决问题了。

## 注意
考虑到安全问题，上面的实现

  * 仅仅对debug类型的安装包有效（参考值为application节点的android:debuggable属性值）
  * Release类型的安装包不会有额外的安全影响


