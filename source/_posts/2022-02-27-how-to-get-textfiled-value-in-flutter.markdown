---
layout: post
title: "Flutter 中获取 TextField 中 text 内容"
date: 2022-02-27 21:20
comments: true
categories: Flutter Android iOS 
---

在Flutter 中，TextField 是一个用来输入 文本的 控件。使用起来也很简单，比如这样，就可以轻松实现一个 TextField 来接收用户的输入内容。

```dart
TextField(
 decoration: const InputDecoration(
   border: OutlineInputBorder(),
   labelText: 'Contact Name',
 ),

)

```

但是 Flutter 是声明式 UI 编程，我们无法像 Android 里那样拿到 TextField 的实例，类似这样(`textFieldInstance.text`)获取到内部的输入内容。

不过，办法还是有的，只是略有不同而已。
<!--more-->

## onChange 监听，显式声明变量方式（不推荐）

这种方式的思路大概如下

通过外部显式声明一个String 变量  textFieldText 
利用 `TextField` 的 onChanged 回调接收变化后的输入内容

```dart
TextField(
 decoration: const InputDecoration(
   border: OutlineInputBorder(),
   labelText: 'Contact Name',
 ),
 onChanged: (text) {
   textFieldText = text;
 },
)

```

但是这种实现方式有着两个明显的问题

  * 如果 TextField 带有初始文本，没有经过任何修改，则无法获取到对应的内容。
  * 外部暴露 textFieldText 会使得业务侧有修改这个值的可能和风险。


所以，上面的方式是严重不推荐的，不要使用。

## 借助 TextEditingController 
这是官方文档推荐的方式，就是增加一个 TextEditingController. TextField 与 外部都通过这个 controller 进行连接。

### 声明一个 TextEditingController 实例
```dart
final TextEditingController _nameController = TextEditingController();

```

### 将TextEditingController 实例 传入到 TextField 中
```dart
TextField(
 controller: _nameController,
 decoration: const InputDecoration(
   border: OutlineInputBorder(),
   labelText: 'Contact Name',
 ),
)

```

### 通过 TextEditingController 获取 Text
```dart
floatingActionButton: FloatingActionButton(
 onPressed: () {
   
   debugPrint('textfield.value(TextEditingController)=${_nameController.text}');
 },
 tooltip: 'Increment',
 child: const Icon(Icons.print),

```

使用 TextEditingController 能够完美地处理 第一种 onChanged + 变量 的潜在的问题。这也是 Flutter 官方推荐的技术方案。




