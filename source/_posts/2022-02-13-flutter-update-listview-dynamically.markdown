---
layout: post
title: "Flutter 轻松实现动态更新 ListView"
date: 2022-02-13 22:24
comments: true
categories: Flutter Dart Android iOS
---
在 App 开发过程中，ListView 是 比较很常见的控件，用来处理 列表类的数据展示。当然 Flutter 也是支持的，由于 Flutter 是归属于声明式 UI 编程，其处理起来要更加的简单与便捷。

<!--more-->

本文将通过一个极简单的例子来说明一下 如何 实现动态更新数据。 在贴代码之前，先介绍一些概念和内容


### 数据集
```dart
final _names = ['Andrew', 'Bob', 'Charles'];
int _counter = 0;
```

新的数据Item `'Someone($_counter)'` 会被触发加入到 _names 数组中。

### 触发器
通常触发加载数据是分页数据加载完成，这里我们使用一个 `FloatingActionButton` 的点击操作等价模拟。

```dart
floatingActionButton: FloatingActionButton(
 onPressed: () {
   setState(() {
     _names.add('Someone($_counter)');
     _counter ++;
   });
 },
 tooltip: 'Add TimeStamp',
 child: const Icon(Icons.add),

```

### 展示视图
```dart
Expanded(
 child: ListView.builder(
     itemCount: _names.length,
     itemBuilder: (BuildContext context, int index) {
       return Container(
           width: double.infinity,
           height: 50,
           alignment: Alignment.center,
           child: Text(_names[index]));
     }),
),

```

上述代码

需要Expanded 包裹 ListView 确保空间展示填充
使用 ListView.builder 方法实现 ListView


总体来说，Flutter 中实现 ListView 数据动态添加和展示，真的很便捷，少去了传统UI 编程中显式的 Adapter 等内容，编码效率提升不少。


完整代码
```dart
import 'package:flutter/material.dart';

void main() {
 runApp(const MyApp());
}

class MyApp extends StatelessWidget {
 const MyApp({Key? key}) : super(key: key);

 // This widget is the root of your application.
 @override
 Widget build(BuildContext context) {
   return MaterialApp(
     title: 'Flutter Demo',
     theme: ThemeData(
       primarySwatch: Colors.blue,
     ),
     home: const MyHomePage(title: 'Flutter Demo Home Page'),
   );
 }
}

class MyHomePage extends StatefulWidget {
 const MyHomePage({Key? key, required this.title}) : super(key: key);

 final String title;

 @override
 State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
 final _names = ['Andrew', 'Bob', 'Charles'];
 int _counter = 0;

 @override
 Widget build(BuildContext context) {

   return Scaffold(
     appBar: AppBar(
       title: Text(widget.title),
     ),
     body: Column(
       children: [
         Expanded(
           child: ListView.builder(
               itemCount: _names.length,
               itemBuilder: (BuildContext context, int index) {
                 return Container(
                     width: double.infinity,
                     height: 50,
                     alignment: Alignment.center,
                     child: Text(_names[index]));
               }),
         ),
       ],

     ),
     floatingActionButton: FloatingActionButton(
       onPressed: () {
         setState(() {
           _names.add('Someone($_counter)');
           _counter ++;
         });
       },
       tooltip: 'Add TimeStamp',
       child: const Icon(Icons.add),
     ), // This trailing comma makes auto-formatting nicer for build methods.
   );
 }
}
```
以上。
