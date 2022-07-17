---
layout: post
title: "Flutter 处理 Overlay 返回事件"
date: 2022-07-17 21:46
comments: true
categories: Flutter Overlay Android iOS 
---

在 Flutter 中，我们可以使用 OverlayEntry 实现一个位于顶层的遮罩层。

![https://asset.droidyue.com/image/2022/h2/WX20220717-214434%402x.png?v=111](https://asset.droidyue.com/image/2022/h2/WX20220717-214434%402x.png?v=111)


<!--more-->

比如上面的 Overlay 示例效果，可以通过 这段代码来实现
```dart
void _showOverlay(BuildContext context, {required String text}) async {
 OverlayState? overlayState = Overlay.of(context);
 OverlayEntry overlayEntry;
 overlayEntry = OverlayEntry(builder: (context) {
   return Positioned(
     left: MediaQuery.of(context).size.width * 0.1,
     top: MediaQuery.of(context).size.height * 0.80,
     child: ClipRRect(
       borderRadius: BorderRadius.circular(10),
       child: Material(
         child: Container(
           alignment: Alignment.center,
           color: Colors.yellowAccent,
           padding:
           EdgeInsets.all(MediaQuery.of(context).size.height * 0.02),
           width: MediaQuery.of(context).size.width * 0.8,
           height: MediaQuery.of(context).size.height * 0.06,
           child: Text(
             text,
             style: const TextStyle(color: Colors.black),
           ),
         ),
       ),
     ),
   );
 });

 // inserting overlay entry
 overlayState!.insert(overlayEntry);

```

看起来一切都很正常，但是如果我们点击一下系统的返回按键，我们看到的结果是

  * Overlay 并没有优先消失
  * 而是当前的底层界面会退出了。


## WillPopScope 管用么
经过验证，WillPopScope 其实也无法拦截 Overlay 的返回事件。因为所处层级不同。

## 那怎么办
可以借助系统的 `SystemChannels.navigation` 来实现，在 popRoute 层面去做拦截。

这里有一个库可以解决
```bash
dependencies:
 flutter:
   sdk: flutter


 back_button_interceptor: 5.0.2

```

注意：如果你的 Flutter 适配到了 Flutter 3.0，可以使用最新的back_button_interceptor(6.0.0)，否则使用上面的5.0.2版本。

## 导入包
```dart
import 'package:back_button_interceptor/back_button_interceptor.dart';
```

## 接入拦截代码
```dart
void _showOverlay(BuildContext context, {required String text}) async {
 OverlayState? overlayState = Overlay.of(context);
 OverlayEntry overlayEntry;
 overlayEntry = OverlayEntry(builder: (context) {
   return Positioned(
    …… some code omitted .
 });

 // inserting overlay entry
 overlayState!.insert(overlayEntry);
 BackButtonInterceptor.add((bool stopDefaultButtonEvent, RouteInfo info) {
   overlayEntry.remove();
   BackButtonInterceptor.removeByName('my_back_button');
   return true;
 }, name: 'my_back_button');
}

```

其中

  * BackButtonInterceptor.add 用来添加一个拦截器，通常还是需要增加一个 name 用作后续的移除做标识  
  * 当拦截之后，我们需要添加`overlayEntry.remove();`用作移除OverlayEntry。 添加 `BackButtonInterceptor.removeByName('my_back_button');` 移除当前的拦截器， ` return true;` 表明拦截器处理了该事件。


## 内部核心代码逻辑实现
```dart
/// 添加逻辑
static void add(
 InterceptorFunction interceptorFunction, {
 bool ifNotYetIntercepted = false,
 int? zIndex,
 String? name,
 BuildContext? context,
}) {
 _interceptors.insert(
     0,
     _FunctionWithZIndex(
       interceptorFunction,
       ifNotYetIntercepted,
       zIndex,
       name,
       context == null ? null : getCurrentNavigatorRoute(context),
     ));
 stableSort(_interceptors);
 SystemChannels.navigation.setMethodCallHandler(_handleNavigationInvocation);
}

/// hook 回掉逻辑
static Future<dynamic> _handleNavigationInvocation(MethodCall methodCall) async {
 // POP.
 if (methodCall.method == 'popRoute')
   return popRoute();

 // PUSH.
 else if (methodCall.method == 'pushRoute')
   return _pushRoute(methodCall.arguments);

 // OTHER.
 else
   return Future<dynamic>.value();
}

/// 弹出拦截逻辑

static Future popRoute() async {
 bool stopDefaultButtonEvent = false;

 results.clear();

 List<_FunctionWithZIndex> interceptors = List.of(_interceptors);

 for (var i = 0; i < interceptors.length; i++) {
   bool? result;

   try {
     var interceptor = interceptors[i];

     if (!interceptor.ifNotYetIntercepted || !stopDefaultButtonEvent) {
       FutureOr<bool> _result = interceptor.interceptionFunction(
         stopDefaultButtonEvent,
         RouteInfo(routeWhenAdded: interceptor.routeWhenAdded),
       );

       if (_result is bool)
         result = _result;
       else if (_result is Future<bool>)
         result = await _result;
       else
         throw AssertionError(_result.runtimeType);

       results.results.add(InterceptorResult(interceptor.name, result));
     }
   } catch (error) {
     errorProcessing(error);
   }

   if (result == true) stopDefaultButtonEvent = true;
 }

 if (stopDefaultButtonEvent)
   return Future<dynamic>.value();
 else {
   results.ifDefaultButtonEventWasFired = true;
   return handlePopRouteFunction();
 }
}

```




## 完整的示例代码
```dart
import 'package:flutter/material.dart';
import 'package:back_button_interceptor/back_button_interceptor.dart';

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
       // This is the theme of your application.
       //
       // Try running your application with "flutter run". You'll see the
       // application has a blue toolbar. Then, without quitting the app, try
       // changing the primarySwatch below to Colors.green and then invoke
       // "hot reload" (press "r" in the console where you ran "flutter run",
       // or simply save your changes to "hot reload" in a Flutter IDE).
       // Notice that the counter didn't reset back to zero; the application
       // is not restarted.
       primarySwatch: Colors.blue,
     ),
     home: const MyHomePage(title: 'Flutter Demo Home Page'),
   );
 }
}

class MyHomePage extends StatefulWidget {
 const MyHomePage({Key? key, required this.title}) : super(key: key);

 // This widget is the home page of your application. It is stateful, meaning
 // that it has a State object (defined below) that contains fields that affect
 // how it looks.

 // This class is the configuration for the state. It holds the values (in this
 // case the title) provided by the parent (in this case the App widget) and
 // used by the build method of the State. Fields in a Widget subclass are
 // always marked "final".

 final String title;

 @override
 State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
 int _counter = 0;

 void _incrementCounter() {
   setState(() {
     // This call to setState tells the Flutter framework that something has
     // changed in this State, which causes it to rerun the build method below
     // so that the display can reflect the updated values. If we changed
     // _counter without calling setState(), then the build method would not be
     // called again, and so nothing would appear to happen.
     _counter++;
   });
   _showOverlay(context, text: 'overlay');
 }

 void _showOverlay(BuildContext context, {required String text}) async {
   OverlayState? overlayState = Overlay.of(context);
   OverlayEntry overlayEntry;
   overlayEntry = OverlayEntry(builder: (context) {
     return Positioned(
       left: MediaQuery.of(context).size.width * 0.1,
       top: MediaQuery.of(context).size.height * 0.80,
       child: ClipRRect(
         borderRadius: BorderRadius.circular(10),
         child: Material(
           child: Container(
             alignment: Alignment.center,
             color: Colors.yellowAccent,
             padding:
             EdgeInsets.all(MediaQuery.of(context).size.height * 0.02),
             width: MediaQuery.of(context).size.width * 0.8,
             height: MediaQuery.of(context).size.height * 0.06,
             child: Text(
               text,
               style: const TextStyle(color: Colors.black),
             ),
           ),
         ),
       ),
     );
   });

   // inserting overlay entry
   overlayState!.insert(overlayEntry);
   BackButtonInterceptor.add((bool stopDefaultButtonEvent, RouteInfo info) {
     overlayEntry.remove();
     BackButtonInterceptor.removeByName('my_back_button');
     return true;
   }, name: 'my_back_button');
 }

 @override
 Widget build(BuildContext context) {
   // This method is rerun every time setState is called, for instance as done
   // by the _incrementCounter method above.
   //
   // The Flutter framework has been optimized to make rerunning build methods
   // fast, so that you can just rebuild anything that needs updating rather
   // than having to individually change instances of widgets.
   return Scaffold(
     appBar: AppBar(
       // Here we take the value from the MyHomePage object that was created by
       // the App.build method, and use it to set our appbar title.
       title: Text(widget.title),
     ),
     body: Center(
       // Center is a layout widget. It takes a single child and positions it
       // in the middle of the parent.
       child: Column(
         // Column is also a layout widget. It takes a list of children and
         // arranges them vertically. By default, it sizes itself to fit its
         // children horizontally, and tries to be as tall as its parent.
         //
         // Invoke "debug painting" (press "p" in the console, choose the
         // "Toggle Debug Paint" action from the Flutter Inspector in Android
         // Studio, or the "Toggle Debug Paint" command in Visual Studio Code)
         // to see the wireframe for each widget.
         //
         // Column has various properties to control how it sizes itself and
         // how it positions its children. Here we use mainAxisAlignment to
         // center the children vertically; the main axis here is the vertical
         // axis because Columns are vertical (the cross axis would be
         // horizontal).
         mainAxisAlignment: MainAxisAlignment.center,
         children: <Widget>[
           const Text(
             'You have pushed the button this many times:',
           ),
           Text(
             '$_counter',
             style: Theme.of(context).textTheme.headline4,
           ),
         ],
       ),
     ),
     floatingActionButton: FloatingActionButton(
       onPressed: _incrementCounter,
       tooltip: 'Increment',
       child: const Icon(Icons.add),
     ), // This trailing comma makes auto-formatting nicer for build methods.
   );
 }
}

```
