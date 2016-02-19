---
layout: post
title: "关于Android Log的一些思考"
date: 2015-11-01 17:09
comments: true
categories: Android Log
---
在日常的Android开发中，日志打印是一项必不可少的操作，我们通过分析打印的日志可以分析程序的运行数据和情况。然而使用日志打印的正确姿势又是怎样呢，如何屏蔽日志信息输出呢，本文将逐一进行回答。
<!--more-->
##哪些形式
###System.out.println
这是标准的Java输出方法，相信很多公司都不提倡使用，这里进行列举，目的是为了提醒大家不用。

###Android Log
Android自身提供了一个日志工具类，那就是android.util.Log。使用很简单，如下
```java
Log.i(LOGTAG, "onCreate");
```


##TAG选取
###选用人名
关于TAG的选取，很多人都曾采用人名的形式，比如
```
Log.i("andy", "onCreate");
```
这样做的目标一是为了过滤方便，当一个人在写一个模块多个文件时，使用这个形式，过滤起来很容易帮助理解程序的执行情况。另外的目的就是为了表明日志周围代码的作者姓甚名谁。

然而，我却不推荐这种人名作为TAG的形式。原因如下
  
  * 以人名作为关键字过滤，不易确定产生日志的类文件
  * 随着某个人模块实现的增加，过滤人名易产生来自其他模块的干扰信息。

###动态选取
还有一种选取LOGTAG的方式，就是
```
private static final String LOGTAG = DroidSettings.class.getSimpleName();
```
这样使用，得到的LOGTAG的值就是DroidSettings，然而并非如此，当DroidSettings这个类进行了混淆之后，类名变成了类似a,b,c这样的名称，LOGTAG则不再是DroidSettings这个值了。这样可能造成的问题就是，内部混淆有日志的包，我们去过滤DroidSettings 却永远得不到任何信息。

###推荐的记录形式
推荐的形式就是以字符串字面量形式去设置LOGTAG。如下，在DroidSettings类中
```java
private static final String LOGTAG = "DroidSettings";
```

###优雅打印日志的姿势
什么才是打印日志的优雅姿势是，我认为一条好的日志需要包含以下三点

  * 这条日志所在的类，我们通过LOGTAG可以表示
  * 这条日志所在的方法，需要加入方法名的字符串
  * 必要的其他信息，比如参数或者局部变量。

结合三点，下面是一个符合规则的简单示例
```java
private String  getBookName(int bookId) {
    String bookName = mBooks.get(bookId);
    DroidLog.i(LOGTAG, "getBookName bookId=" + bookId + ";bookName=" + bookName);
    return bookName;
}
```
上面的代码，包含了所在类（LOGTAG），方法名(getBookName)， 参数(bookId)，局部变量(bookName)。必要的信息都展示了出来，对于了解程序运行很有帮助。
##屏蔽日志输出
在Android中进行屏蔽日志，有两种实现形式，一种是在编译期屏蔽，另一种则是从运行时进行屏蔽，后者相对比较常见，从后向前介绍。

###运行时屏蔽
在运行时屏蔽日志，通常的做法是创建一个自定义的类，比如叫做DroidLog
```java
public class DroidLog {
    private static final boolean ENABLE_LOG = true;


    public static void i(String tag, String message) {
        if (ENABLE_LOG) {
            android.util.Log.i(tag, message);
        }
    }
}
```
在编码时，我们调用DroidLog.i方法来记录日志，然后在打包时，修改ENABLE_LOG的值为false，这样就能屏蔽了日志输出。

然后运行时屏蔽的方案实际上有一点小问题，比如
```java
private void dumpDebugInfo() {
    DroidLog.i(LOGTAG, "sdkVersion=" + Build.VERSION.SDK_INT + "; Locale=" + Locale.getDefault());
}
```
虽然上面的日志不会打印，但是`"sdkVersion=" + Build.VERSION.SDK_INT + "; Locale=" + Locale.getDefault()`这段字符串拼接语句却实实在在执行了。总的来说，还是会产生一些影响。

关于字符串拼接的细节，可以阅读[Java细节：字符串的拼接](http://droidyue.com/blog/2014/08/30/java-details-string-concatenation/)

##编译期屏蔽
既然运行时屏蔽存在问题，那么是否可以提前到编译期进行屏蔽呢，答案是肯定的。这里我们就使用了Proguard的一个小功能。

assumenosideeffects从英文单词上去理解，意思为 假设没有副作用。该功能属于优化的一种方式，该功能常常用来处理日志打印，比如我们想要屏蔽掉来自DroidLog的日志打印。
在混淆的配置文件中，加入下列代码

```
-assumenosideeffects class com.droidyue.logdemo.DroidLog {
        public static *** i(...);
}
```

然而仅仅处理DroidLog是不够的，因为我们无法保证团队其他成员是否使用了原生的android.utils.Log来进行日志打印（尽管有编码约束）

```
-assumenosideeffects class android.util.Log {
        public static *** d(...);
        public static *** e(...);
        public static *** i(...);
        public static *** v(...);
        public static *** println(...);
        public static *** w(...);
        public static *** wtf(...);
}
```

一般写到这里，基本可以结束，但是我们还需要探究一下，编译期屏蔽是否和运行时屏蔽一样有着同样的问题呢？ 我们接下来证明  
首先，我们选用这段代码作为例子
```java
public class MainActivity extends Activity {
    private static final String LOGTAG = "MainActivity" ;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        dumpDebugInfo();
    }

    private void dumpDebugInfo() {
        Locale defaultLocale = Locale.getDefault();
        DroidLog.i(LOGTAG, "sdkVersion=" + Build.VERSION.SDK_INT + "; Locale=" + defaultLocale);
    }


}
```
然后修改混淆文件proguard-project.txt，启用混淆处理。
```
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** i(...);
    public static *** v(...);
}

-assumenosideeffects class com.droidyue.logdemo.DroidLog {
        public static *** i(...);
}
```

然后使用Eclipse的导出功能，生成指定签名的APK包，运行必然没有日志输出。

接下来对生成的APK包进行反编译，得到的smali文件。查看MainActivity.smali。

注意：Proguard进行优化，发生了内联操作，讲dumpDebugInfo的方法体实现提取到onCreate方法中。

onCreate方法体中没有任何关于`DroidLog.i`方法的调用，但是`"sdkVersion=" + Build.VERSION.SDK_INT + "; Locale=" + defaultLocale`对应的字符串拼接操作依然存在。
```
# virtual methods
.method protected onCreate(Landroid/os/Bundle;)V
    .locals 3

    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    const v0, 0x7f030017

    invoke-virtual {p0, v0}, Lcom/droidyue/logdemo/MainActivity;->setContentView(I)V

    invoke-static {}, Ljava/util/Locale;->getDefault()Ljava/util/Locale;

    move-result-object v0

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "sdkVersion="

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    sget v2, Landroid/os/Build$VERSION;->SDK_INT:I

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v2, "; Locale="

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    return-void
.end method
```
因此，无论是运行时日志屏蔽还是编译期，message参数上发生的字符串拼接都依然存在。但是编译期屏蔽减少了方法调用（即方法进出栈操作），理论上编译期屏蔽日志更优。


























