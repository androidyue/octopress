---
layout: post
title: "Android 以非销毁的方式隐藏 DialogFragment"
date: 2021-08-08 08:48
comments: true
categories: Android DialogFragment 
---

我们都知道使用`DialogFragment.dismiss` 可以关闭 DialogFragment（并销毁）。但是有时候，我们仅仅需要隐藏，不需要销毁。 使用下面的方法即可。

<!--more-->

### 隐藏 DialogFragment
```kotlin
myDialogFragment.dialog?.hide()
```

### 恢复 DialogFragment 
```kotlin
myDialogFragment.dialog?.show()
```
