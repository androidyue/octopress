---
layout: post
title: "一个事半功倍的Java反射库"
date: 2017-01-09 19:02
comments: true
categories: Java Android
---

在Java和Android中，我们常常会使用反射来达到一些兼容的目的。Java原生提供的反射很是麻烦，使用起来很是不方便。比如我们想要调UserManager的静态方法get，使用原生的实现如下
```java
try {
    final Method m = UserManager.class.getMethod("get", Context.class);
    m.setAccessible(true);
    m.invoke(null, this);
} catch (NoSuchMethodException e) {
    e.printStackTrace();
} catch (IllegalAccessException e) {
    e.printStackTrace();
} catch (InvocationTargetException e) {
    e.printStackTrace();
}
```
<!--more-->

实现起来好不麻烦。这其中

  * 需要确定方法名和参数来获取对应的Method对象
  * 设置Method对象的assessible为true
  * 调用invoke方法，并且传入对应的参数
  * 捕获其中可能抛出来的一连串异常

那么反射能简单点么，当然，而且还会简单很多。

这就是本文想要介绍的，jOOR(Java Object Oriented Reflection)，它是一个对java.lang.reflect包的简单封装，使得我们使用起来更加直接和方便。

使用jOOR，上面的代码可以缩短成一行。
```java
Reflect.on(UserManager.class).call("get", getApplicationContext());
```

## 依赖
  * jOOR没有依赖。
  * 使用jOOR只需要将这两个文件([Reflect.java](https://github.com/jOOQ/jOOR/blob/master/jOOR/src/main/java/org/joor/Reflect.java)，[ReflectException.java](https://github.com/jOOQ/jOOR/blob/master/jOOR/src/main/java/org/joor/ReflectException.java))，加入工程即可。

## API介绍
### Reflect
  * Reflect.on 包裹一个类或者对象，表示在这个类或对象上进行反射，类的值可以使Class,也可以是完整的类名（包含包名信息）
  * Reflect.create 用来调用之前的类的构造方法，有两种重载，一种有参数，一种无参数
  * Reflect.call  方法调用，传入方法名和参数，如有返回值还需要调用get
  * Reflect.get  获取（field和method返回）值相关，会进行类型转换，常与call和field组合使用
  * Reflect.field 获取属性值相关，需要调用get获取该值
  * Reflect.set 设置属性相关。


### ReflectException
引入ReflectException避免了我们去catch过多的异常，也减少了纵向代码量，使得代码简洁不少。ReflectException抛出，可能是发生了以下异常。

  * ClassNotFoundException
  * IllegalAccessException
  * IllegalArgumentException
  * InstantiationException
  * InvocationTargetException
  * NoSuchMethodException
  * NoSuchFieldException
  * SecurityException

除此之外，ReflectException属于unchecked 异常，语法上不需要显式进行捕获，但是也需要根据实际情况，斟酌是否进行显式捕获该异常。

## 使用示例
###创建实例
```java
String string = Reflect.on(String.class).create("Hello World").get();
```

###访问属性（public,protected,package,private均可）
```java
char pathSeparatorChar = Reflect.on(File.class).create("/sdcard/droidyue.com").field("pathSeparatorChar").get();
```

###修改属性(final属性也可以修改)
```java
String setValue = Reflect.on(File.class).create("/sdcard/drodiyue.com").set("path", "fakepath").get("path");
```

###调用方法（public,protected,package,private均可）
```java
ArrayList arrayList = new ArrayList();
arrayList.add("Hello");
arrayList.add("World");
int value = Reflect.on(arrayList).call("hugeCapacity", 12).get();
```

## 实现原理
> Reflect实际是对原生java reflect进行封装，屏蔽了无关细节。

以fields方法为例，其内部实现可以看出是调用了java原生提供的反射相关的代码。
```java
public Map<String, Reflect> fields() {
    Map<String, Reflect> result = new LinkedHashMap<String, Reflect>();
    Class<?> type = type();

    do {
        for (Field field : type.getDeclaredFields()) {
            if (!isClass ^ Modifier.isStatic(field.getModifiers())) {
                String name = field.getName();

            if (!result.containsKey(name))
              result.put(name, field(name));
            }
        }

        type = type.getSuperclass();
    } while (type != null);

    return result;
}
```


## 库地址
  * [jOOR](https://github.com/jOOQ/jOOR)


以上就是这些，希望jOOR可以对大家的开发日常有所帮助。
