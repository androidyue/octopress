---
layout: post
title: "Vs Code 快速实现 重写 方法"
date: 2023-02-12 20:20
comments: true
categories: VsCode AndroidStudio Intellij
---
作为一个从 Android Studio/IntelliJ 切到 VS code 的开发者，一开始会遇到各种不适应的情况。 比如快捷键不一样，使用习惯不一样等。

这里将简单记录一下 个人遇到的一些痛点，比如如何重写方法。

<!--more-->

在 Android Studio/ IntelliJ 中，使用起来很简单，比如弹出这个菜单，选择 `Override Methods` 即可，实现重写 `initState` 方法

![https://asset.droidyue.com/image/2023/h1/as_intellij_override_methods.png](https://asset.droidyue.com/image/2023/h1/as_intellij_override_methods.png)


但是切到 Vs Code 后，发现找不到快捷键，后来经过一些摸索，还是找到了 如何快速实现方法重写的方法。

如下图，只需要输入待重写的方法的首字母，即可弹出提示。


![https://asset.droidyue.com/image/2023/h1/vscode_override_method.png](https://asset.droidyue.com/image/2023/h1/vscode_override_method.png)

VS Code 的方式显得会更加的简单。（后来才发现同样的方式 在 Android Studio/Intellij 也支持，Orz）