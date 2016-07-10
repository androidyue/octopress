---
layout: post
title: "读懂 Android 中的代码混淆"
date: 2016-07-10 20:19
comments: true
categories: Android Proguard
---
在Android开发工作中，我们都或多或少接触过代码混淆。比如我们想要集成某个SDK，往往需要做一些排除混淆的操作。

本文为本人的一些实践总结，介绍一些混淆的知识和注意事项。希望可以帮助大家更好的学习和使用代码混淆。

<!--more-->

##什么是混淆

关于混淆维基百科上该词条的解释为
>代码混淆（Obfuscated code）亦称花指令，是将计算机程序的代码，转换成一种功能上等价，但是难于阅读和理解的形式的行为。

代码混淆影响到的元素有

  * 类名
  * 变量名
  * 方法名
  * 包名
  * 其他元素

##混淆的目的
混淆的目的是为了**加大反编译的成本**,但是并不能彻底防止反编译.

##如何开启混淆
  * 通常我们需要找到项目路径下app目录下的build.gradle文件
  * 找到minifyEnabled这个配置,然后设置为true即可.

一个简单的示例如下
```java
buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
```

## proguard是什么
Java官网对Proguard的定义
>ProGuard is a free Java class file shrinker, optimizer, obfuscator, and preverifier. It detects and removes unused classes, fields, methods, and attributes. It optimizes bytecode and removes unused instructions. It renames the remaining classes, fields, and methods using short meaningless names. Finally, it preverifies the processed code for Java 6 or higher, or for Java Micro Edition.

  * Proguard是一个集文件压缩,优化,混淆和校验等功能的工具
  * 它检测并删除无用的类,变量,方法和属性
  * 它优化字节码并删除无用的指令.
  * 它通过将类名,变量名和方法名重命名为无意义的名称实现混淆效果.
  * 最后它还校验处理后的代码

##混淆的常见配置
###-keep
Keep用来保留Java的元素不进行混淆. keep有很多变种,他们一般都是

  * -keep
  * -keepclassmembers
  * -keepclasseswithmembers


####一些例子
保留某个包下面的类以及子包
```
-keep public class com.droidyue.com.widget.**
```

保留所有类中使用otto的public方法
```
# Otto
-keepclassmembers class ** {
    @com.squareup.otto.Subscribe public *;
    @com.squareup.otto.Produce public *;
}
```

保留Contants类的BOOK_NAME属性
```
-keepclassmembers class com.example.admin.proguardsample.Constants {
     public static java.lang.String BOOK_NAME;
}
```

更多关于Proguard keep使用,可以参考[官方文档](http://proguard.sourceforge.net/)
###-dontwarn
dontwarn是一个和keep可以说是形影不离,尤其是处理引入的library时.

引入的library可能存在一些无法找到的引用和其他问题,在build时可能会发出警告,如果我们不进行处理,通常会导致build中止.因此为了保证build继续,我们需要使用dontwarn处理这些我们无法解决的library的警告.

比如关闭Twitter sdk的警告,我们可以这样做
```java
-dontwarn com.twitter.sdk.**
```

其他混淆相关的介绍,都可以通过访问官方文档获取.

##哪些不应该混淆
###反射中使用的元素
如果一些被混淆使用的元素(属性,方法,类,包名等)进行了混淆,可能会出现问题,如NoSuchFiledException或者NoSuchMethodException等.

比如下面的示例源码
```java
//Constants.java
public class Constants {
    public static  String BOOK_NAME = "book_name";
}

//MainActivity.java
Field bookNameField = null;
try {
    String fieldName = "BOOK_NAME";
    bookNameField = Constants.class.getField(fieldName);
    Log.i(LOGTAG, "bookNameField=" + bookNameField);
} catch (NoSuchFieldException e) {
    e.printStackTrace();
}
```
如果上面的Constants类进行了混淆,那么上面的语句就可能抛出`NoSuchFieldException`.

想要验证,我们需要看一看混淆的映射文件,文件名为`mapping.txt`,该文件保存着混淆前后的映射关系.
```
com.example.admin.proguardsample.Constants -> com.example.admin.proguardsample.a:
    java.lang.String BOOK_NAME -> a
    void <init>() -> <init>
    void <clinit>() -> <clinit>
com.example.admin.proguardsample.MainActivity -> com.example.admin.proguardsample.MainActivity:
    void <init>() -> <init>
    void onCreate(android.os.Bundle) -> onCreate
```
从映射文件中,我们可以看到
  
  * `Constants`类被重命名为`a`.
  * Constants类的`BOOK_NAME`重命名了`a`

然后,我们对APK文件进行反编译一探究竟.推荐一下这个在线反编译工具 [http://www.javadecompilers.com/apk](http://www.javadecompilers.com/apk)

注意,使用jadx decompiler后,会重新命名,正如下面注释`/* renamed from: com.example.admin.proguardsample.a */`所示.
```java
package com.example.admin.proguardsample;

/* renamed from: com.example.admin.proguardsample.a */
public class C0314a {
    public static String f1712a;

    static {
        f1712a = "book_name";
    }
}
```
而MainActivity的翻译后的对应的源码为
```java
try {
    Log.i("MainActivity", "bookNameField=" + C0314a.class.getField("BOOK_NAME"));
} catch (NoSuchFieldException e) {
    e.printStackTrace();
}
```
MainActivity中反射获取的属性名称依然是`BOOK_NAME`,而对应的类已经没有了这个属性名,所以会抛出NoSuchFieldException.

**注意**，如果上面的filedName使用字面量或者字符串常量，即使混淆也不会出现NoSuchFieldException异常。因为这两种情况下，混淆可以感知外界对filed的引用，已经在调用出替换成了混淆后的名称。


###GSON的序列化与反序列化
GSON是一个很好的工具,使用它我们可以轻松的实现序列化和反序列化.但是当它一旦遇到混淆,就需要我们注意了.

一个简单的类Item,用来处理序列化和反序列化
```java
public class Item {
    public String name;
    public int id;
}
```

序列化的代码
```java
Item toSerializeItem = new Item();
toSerializeItem.id = 2;
toSerializeItem.name = "Apple";
String serializedText = gson.toJson(toSerializeItem);
Log.i(LOGTAG, "testGson serializedText=" + serializedText);
```
开启混淆之后的日志输出结果
```
I/MainActivity: testGson serializedText={"a":"Apple","b":2}
```
属性名已经改变了,变成了没有意思的名称,对我们后续的某些处理是很麻烦的.

反序列化的代码
```java
Gson gson = new Gson();
Item item = gson.fromJson("{\"id\":1, \"name\":\"Orange\"}", Item.class);
Log.i(LOGTAG, "testGson item.id=" + item.id + ";item.name=" + item.name);
```
对应的日志结果是
```java
I/MainActivity: testGson item.id=0;item.name=null
```
可见,混淆之后,反序列化的属性值设置都失败了.

####为什么呢?
  * 因为反序列化创建对象本质还是利用反射,会根据json字符串的key作为属性名称,value则对应属性值.
 
#### 如何解决
  * 将序列化和反序列化的类排除混淆
  * 使用`@SerializedName`注解字段

@SerializedName(parameter)通过注解属性实现了
  
  * 序列化的结果中,指定该属性key为parameter的值.
  * 反序列化生成的对象中,用来匹配key与parameter并赋予属性值.
 
一个简单的用法为
```
public class Item {
    @SerializedName("name")
    public String name;
    @SerializedName("id")
    public int id;
```
### 枚举也不要混淆
枚举是Java 5 中引入的一个很便利的特性,可以很好的替代之前的常量形式.

枚举使用起来很简单,如下
```java
public enum Day {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY
}
```
这里我们这样使用枚举
```
Day day = Day.valueOf("monday");
Log.i(LOGTAG, "testEnum day=" + day);
```
运行上面的的代码,通常情况下是没有问题的,是否说明枚举就可以混淆呢?

**其实不是**.

为什么没有问题呢,因为默认的[Proguard配置](https://android.googlesource.com/platform/sdk/+/android-4.1.2_r2/files/proguard-android.txt)已经处理了枚举相关的keep操作.
```
# For enumeration classes, see http://proguard.sourceforge.net/manual/examples.html#enumerations
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}
```
如果我们手动去掉这条keep配置,再次运行,一个这样的异常会从天而降.
```java
E AndroidRuntime: Process: com.example.admin.proguardsample, PID: 17246
E AndroidRuntime: java.lang.AssertionError: impossible
E AndroidRuntime: 	at java.lang.Enum$1.create(Enum.java:45)
E AndroidRuntime: 	at java.lang.Enum$1.create(Enum.java:36)
E AndroidRuntime: 	at libcore.util.BasicLruCache.get(BasicLruCache.java:54)
E AndroidRuntime: 	at java.lang.Enum.getSharedConstants(Enum.java:211)
E AndroidRuntime: 	at java.lang.Enum.valueOf(Enum.java:191)
E AndroidRuntime: 	at com.example.admin.proguardsample.a.a(Unknown Source)
E AndroidRuntime: 	at com.example.admin.proguardsample.MainActivity.j(Unknown Source)
E AndroidRuntime: 	at com.example.admin.proguardsample.MainActivity.onCreate(Unknown Source)
E AndroidRuntime: 	at android.app.Activity.performCreate(Activity.java:6237)
E AndroidRuntime: 	at android.app.Instrumentation.callActivityOnCreate(Instrumentation.java:1107)
E AndroidRuntime: 	at android.app.ActivityThread.performLaunchActivity(ActivityThread.java:2369)
E AndroidRuntime: 	at android.app.ActivityThread.handleLaunchActivity(ActivityThread.java:2476)
E AndroidRuntime: 	at android.app.ActivityThread.-wrap11(ActivityThread.java)
E AndroidRuntime: 	at android.app.ActivityThread$H.handleMessage(ActivityThread.java:1344)
E AndroidRuntime: 	at android.os.Handler.dispatchMessage(Handler.java:102)
E AndroidRuntime: 	at android.os.Looper.loop(Looper.java:148)
E AndroidRuntime: 	at android.app.ActivityThread.main(ActivityThread.java:5417)
E AndroidRuntime: 	at java.lang.reflect.Method.invoke(Native Method)
E AndroidRuntime: 	at com.android.internal.os.ZygoteInit$MethodAndArgsCaller.run(ZygoteInit.java:726)
E AndroidRuntime: 	at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:616)
E AndroidRuntime: Caused by: java.lang.NoSuchMethodException: values []
E AndroidRuntime: 	at java.lang.Class.getMethod(Class.java:624)
E AndroidRuntime: 	at java.lang.Class.getDeclaredMethod(Class.java:586)
E AndroidRuntime: 	at java.lang.Enum$1.create(Enum.java:41)
E AndroidRuntime: 	... 19 more
```
好玩的事情来了,我们看一看为什么会抛出这个异常

1.首先,一个枚举类会生成一个对应的类文件,这里是Day.class.
这里类里面包含什么呢,看一下反编译的结果
```java
➜  proguardsample javap  Day
Warning: Binary file Day contains com.example.admin.proguardsample.Day
Compiled from "Day.java"
public final class com.example.admin.proguardsample.Day extends java.lang.Enum<com.example.admin.proguardsample.Day> {
  public static final com.example.admin.proguardsample.Day MONDAY;
  public static final com.example.admin.proguardsample.Day TUESDAY;
  public static final com.example.admin.proguardsample.Day WEDNESDAY;
  public static final com.example.admin.proguardsample.Day THURSDAY;
  public static final com.example.admin.proguardsample.Day FRIDAY;
  public static final com.example.admin.proguardsample.Day SATURDAY;
  public static final com.example.admin.proguardsample.Day SUNDAY;
  public static com.example.admin.proguardsample.Day[] values();
  public static com.example.admin.proguardsample.Day valueOf(java.lang.String);
  static {};
}
```

  * 枚举实际是创建了一个继承自java.lang.Enum的类
  * java代码中的枚举类型最后转换成类中的static final属性
  * 多出了两个方法,values()和valueOf().
  * values方法返回定义的枚举类型的数组集合,即从MONDAY到SUNDAY这7个类型.

2.找寻崩溃轨迹
其中Day.valueOf(String)内部会调用Enum.valueOf(Class,String)方法
```java
  public static com.example.admin.proguardsample.Day valueOf(java.lang.String);
    Code:
       0: ldc           #4                  // class com/example/admin/proguardsample/Day
       2: aload_0
       3: invokestatic  #5                  // Method java/lang/Enum.valueOf:(Ljava/lang/Class;Ljava/lang/String;)Ljava/lang/Enum;
       6: checkcast     #4                  // class com/example/admin/proguardsample/Day
       9: areturn
```

而Enum的valueOf方法会间接调用Day.values()方法,具体步骤是

  * Enum.value调用Class.enumConstantDirectory方法获取String到枚举的映射
  * Class.enumConstantDirectory方法调用Class.getEnumConstantsShared获取当前的枚举类型
  * Class.getEnumConstantsShared方法使用反射调用values来获取枚举类型的集合.

混淆之后,values被重新命名,所以会发生`NoSuchMethodException`.

关于调用轨迹,感兴趣的可以自己研究一下源码,不难.

### 四大组件不建议混淆
Android中四大组件我们都很常用,这些组件不能被混淆的原因为
   
   * 四大组件声明必须在manifest中注册,如果混淆后类名更改,而混淆后的类名没有在manifest注册,是不符合Android组件注册机制的.
   * 外部程序可能使用组件的字符串类名,如果类名混淆,可能导致出现异常

### 注解不能混淆
注解在Android平台中使用的越来越多,常用的有ButterKnife和Otto.很多场景下注解被用作在运行时反射确定一些元素的特征.

为了保证注解正常工作,我们不应该对注解进行混淆.Android工程默认的混淆配置已经包含了下面保留注解的配置
```java
-keepattributes *Annotation*
```

关于注解,可以阅读这篇文章了解.[详解Java中的注解](http://droidyue.com/blog/2016/04/24/look-into-java-annotation/)

##其他不该混淆的
  * jni调用的java方法
  * java的native方法
  * js调用java的方法
  * 第三方库不建议混淆
  * 其他和反射相关的一些情况



##stacktrace的恢复
Proguard混淆带来了很多好处,但是也会导致我们收集到的崩溃的stacktrace变得更加难以读懂,好在有补救的措施,这里就介绍一个工具,retrace,用来将混淆后的stacktrace还原成混淆之前的信息.

### retrace脚本
Android 开发环境默认带着retrace脚本,一般情况下路径为`./tools/proguard/bin/retrace.sh`

### mapping映射表
Proguard进行混淆之后,会生成一个映射表,文件名为mapping.txt,我们可以使用find工具在Project下查找
```
find . -name mapping.txt
./app/build/outputs/mapping/release/mapping.txt
```

### 一个崩溃stacktrace信息
一个原始的崩溃信息是这样的.
```
E/AndroidRuntime(24006): Caused by: java.lang.NullPointerException: Attempt to invoke virtual method 'int android.graphics.Bitmap.getWidth()' on a null object reference
E/AndroidRuntime(24006):    at com.example.admin.proguardsample.a.a(Utils.java:10)
E/AndroidRuntime(24006):    at com.example.admin.proguardsample.MainActivity.onCreate(MainActivity.java:22)
E/AndroidRuntime(24006):    at android.app.Activity.performCreate(Activity.java:6106)
E/AndroidRuntime(24006):    at android.app.Instrumentation.callActivityOnCreate(Instrumentation.java:1123)
E/AndroidRuntime(24006):    at android.app.ActivityThread.performLaunchActivity(ActivityThread.java:2566)
E/AndroidRuntime(24006):    ... 10 more
```
对上面的信息处理,去掉`E/AndroidRuntime(24006):`这些字符串retrace才能正常工作.得到的字符串是
```
Caused by: java.lang.NullPointerException: Attempt to invoke virtual method 'int android.graphics.Bitmap.getWidth()' on a null object reference
at com.example.admin.proguardsample.a.a(Utils.java:10)
at com.example.admin.proguardsample.MainActivity.onCreate(MainActivity.java:22)
at android.app.Activity.performCreate(Activity.java:6106)
at android.app.Instrumentation.callActivityOnCreate(Instrumentation.java:1123)
at android.app.ActivityThread.performLaunchActivity(ActivityThread.java:2566)
... 10 more
```


将上面的stacktrace保存成一个文本文件,比如名称为`npe_stacktrace.txt`.

开搞
```
./tools/proguard/bin/retrace.sh   /Users/admin/Downloads/ProguardSample/app/build/outputs/mapping/release/mapping.txt /tmp/npe_stacktrace.txt
```
得到的易读的stacktrace是
```java
Caused by: java.lang.NullPointerException: Attempt to invoke virtual method 'int android.graphics.Bitmap.getWidth()' on a null object reference
at com.example.admin.proguardsample.Utils.int getBitmapWidth(android.graphics.Bitmap)(Utils.java:10)
at com.example.admin.proguardsample.MainActivity.void onCreate(android.os.Bundle)(MainActivity.java:22)
at android.app.Activity.performCreate(Activity.java:6106)
at android.app.Instrumentation.callActivityOnCreate(Instrumentation.java:1123)
at android.app.ActivityThread.performLaunchActivity(ActivityThread.java:2566)
... 10 more
```

注意:为了更加容易和高效分析stacktrace,建议保留SourceFile和LineNumber属性
```java
-keepattributes SourceFile,LineNumberTable
```

关于混淆,我的一些个人经验总结就是这些.希望可以对大家有所帮助.
