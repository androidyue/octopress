---
layout: post
title: "修复 Flutter 项目中 xxx.kt: (19, 8): Redeclaration: xxxManager"
date: 2022-10-04 21:21
comments: true
categories: Flutter Kotlin Android 
---
在我们日常构建 Android app 包时，多少会遇到这样的问题
```
[        ] e: /Users/xxxxxxxxx/.pub-cache/hosted/unpub.xxxxx.com/gogogo-1.0.3/android/src/main/kotlin/com/example/gogogo/xxxManager.kt: (19, 8): Redeclaration: xxxManager
[        ] e: /Users/xxxxxxxxx/.pub-cache/hosted/unpub.xxxxx.com/gogogo-1.0.3/android/src/main/kotlin/com/example/gogogo/xxxManager.kt: (79, 12): Redeclaration: gogogoResult
[        ] e: /Users/xxxxxxxxx/.pub-cache/hosted/unpub.xxxxx.com/gogogo-1.0.3/android/src/main/kotlin/com/example/gogogo/xxxManager.kt: (82, 12): Redeclaration: gogogoListResult
[        ] e: /Users/xxxxxxxxx/.pub-cache/hosted/unpub.xxxxx.com/gogogo-1.0.4/android/src/main/kotlin/com/example/gogogo/xxxManager.kt: (21, 8): Redeclaration: xxxManager
[        ] e: /Users/xxxxxxxxx/.pub-cache/hosted/unpub.xxxxx.com/gogogo-1.0.4/android/src/main/kotlin/com/example/gogogo/xxxManager.kt: (94, 12): Redeclaration: gogogoResult
[        ] e: /Users/xxxxxxxxx/.pub-cache/hosted/unpub.xxxxx.com/gogogo-1.0.4/android/src/main/kotlin/com/example/gogogo/xxxManager.kt: (97, 12): Redeclaration: gogogoListResult
```
<!--more-->

## 问题的原因
  * 因为 Kotlin 增量编译的bug。当你关闭增量编译时，该问题不会出现。

## 常用的解决办法
* flutter clean
* 但是这个方法可能会比较重，因为它会清理掉一些多余的缓存，影响构建速度

## 更加轻量的解决办法
* 该方法只删除对应的pub 缓存，不删除其他的内容。
```bash
#!/bin/bash
find ~/.pub-cache/hosted  -name "$1-*" -type d -maxdepth 2 | xargs rm -rfv
```
保存上述命令为脚本。   

比如我们出问题的 pub 名称为 gogogo 我们只需要清除它的版本缓存就可以了。
```bash

removePubCache.sh gogogo
/Users/xxxxxxxxx/.pub-cache/hosted/unpub.xxxxx.com/gogogo-1.0.4/LICENSE
/Users/xxxxxxxxx/.pub-cache/hosted/unpub.xxxxx.com/gogogo-1.0.4/test/gogogo_test.dart
/Users/xxxxxxxxx/.pub-cache/hosted/unpub.xxxxx.com/gogogo-1.0.4/test
/Users/xxxxxxxxx/.pub-cache/hosted/unpub.xxxxx.com/gogogo-1.0.4/CHANGELOG.md
/Users/xxxxxxxxx/.pub-cache/hosted/unpub.xxxxx.com/gogogo-1.0.4/example/test/widget_test.dart
/Users/xxxxxxxxx/.pub-cache/hosted/unpub.xxxxx.com/gogogo-1.0.4/example/test
```


然后执行一下` flutter pub get --verbose`即可（需要）。


