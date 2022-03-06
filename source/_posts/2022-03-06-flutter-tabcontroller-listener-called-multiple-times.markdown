---
layout: post
title: "Flutter TabController 多次调用，导致切换异常问题"
date: 2022-03-06 22:13
comments: true
categories: Flutter Android iOS 
---
Flutter  中，TabController 是连接 TabBar 与 TabBarView 的纽带，处理选中状态时必不可少的内容。

但是当我们在监听 TabController 时，会发现又多次调用
```dart
@override
void initState() {
 super.initState();
 _tabController = TabController(vsync: this, length: myTabs.length);
 _tabController.addListener(() {
   debugPrint('initState currentIndex=${_tabController.index}');
 });
}

```
<!--more-->

对应的多次调用日志如下。

```bash
[ +153 ms] I/flutter (13788): initState currentIndex=2
[ +344 ms] I/flutter (13788): initState currentIndex=2
[+9932 ms] I/ViewRootImpl@9e6d4e6[MainActivity](13788): ViewPostIme pointer 0
[  +94 ms] I/ViewRootImpl@9e6d4e6[MainActivity](13788): ViewPostIme pointer 1
[   +5 ms] I/flutter (13788): initState currentIndex=0
[ +320 ms] I/flutter (13788): initState currentIndex=0

```

但是为什么会调用两次呢，是bug（重复调用）还是 feature（其他用途），我们需要增加一个额外的信息打印。
```dart
@override
void initState() {
 super.initState();
 _tabController = TabController(vsync: this, length: myTabs.length);
 _tabController.addListener(() {
   final currentIndex = _tabController.index;
   final isIndexChanging = _tabController.indexIsChanging;
   debugPrint('initState currentIndex=$currentIndex;isIndexChanging=$isIndexChanging');
 });
}

```
添加额外信息后的日志
```bash
[  +34 ms] I/flutter (13788): initState currentIndex=2;isIndexChanging=true
[ +308 ms] I/flutter (13788): initState currentIndex=2;isIndexChanging=false
```

Aha, 原来是这样。但是 isIndexChanging 是什么意思呢

```dart
/// True while we're animating from [previousIndex] to [index] as a
/// consequence of calling [animateTo].
///
/// This value is true during the [animateTo] animation that's triggered when
/// the user taps a [TabBar] tab. It is false when [offset] is changing as a
/// consequence of the user dragging (and "flinging") the [TabBarView].
bool get indexIsChanging => _indexIsChangingCount != 0;

```

注释比较简单，大概的意思是

  * 当调用 animateTo 从 previousIndex 到 index 时 会返回true
  * animateTo 触发是通过  用户点击 TabBar 的 tab 触发
  * 当TabBarView 处于 用户拖拽或者 flinging 后，返回false


然后我又再次做了一些验证，下面是一些现象

  * 点击 TabBar 的 Tab 会触发两条回调,indexIsChanging 第一次是true，第二次为false
  * 手势滑动TabBarView  只有一次回调，indexIsChanging 为 false
  * 手势滑动TabBarView 不松开，不易产生回调，松开后才会产生。


那我该怎么用

综合上面的现象和文档描述，我们在处理切换时，可以判断 indexIsChanging 为 false 后，使用index值。
```dart
@override
void initState() {
 super.initState();
 _tabController = TabController(vsync: this, length: myTabs.length);
 _tabController.addListener(() {
   if (!_tabController.indexIsChanging) {
     //do your work
   }
 });
}

```

在具体项目中，如果不进行indexIsChanging判断，可能回调至页面切换错乱，比如从第一个tab切到第三个tab，实际是切到了第二个tab。

按照上面的处理，进行indexIsChanging判断即可解决问题。


