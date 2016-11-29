---
layout: post
title: "关于Java中枚举Enum的深入剖析"
date: 2016-11-29 07:15
comments: true
categories: Android
---
在编程语言中我们，都会接触到枚举类型，通常我们进行有穷的列举来实现一些限定。Java也不例外。Java中的枚举类型为Enum，本文将对枚举进行一些比较深入的剖析。


## 什么是Enum
Enum是自Java 5 引入的特性，用来方便Java开发者实现枚举应用。一个简单的Enum使用如下。
```java
// ColorEnum.java
public enum ColorEmun {
    RED,
    GREEN,
    YELLOW
}

public void setColorEnum(ColorEmun colorEnum) {
    //some code here
}

setColorEnum(ColorEmun.GREEN);
```
<!--more-->

## 为什么会有Enum
在Enum之前的我们使用类似如下的代码实现枚举的功能.
```java
public static final int COLOR_RED = 0;
public static final int COLOR_GREEN = 1;
public static final int COLOR_YELLOW = 2;

public void setColor(int color) {
    //some code here
}
//调用
setColor(COLOR_RED)
```
然而上面的还是有不尽完美的地方

  * setColor(COLOR_RED)与setColor(0)效果一样,而后者可读性很差,但却可以正常运行
  * setColor方法可以接受枚举之外的值,比如setColor(3),这种情况下程序可能出问题

概括而言,传统枚举有如下两个弊端

  * 安全性
  * 可读性,尤其是打印日志时

因此Java引入了Enum,使用Enum,我们实现上面的枚举就很简单了，而且还可以轻松避免传入非法值的风险.

## 枚举原理是什么
Java中Enum的本质其实是在编译时期转换成对应的类的形式。

首先,为了探究枚举的原理,我们先简单定义一个枚举类,这里以季节为例,类名为`Season`,包含春夏秋冬四个枚举条目.
```java
public enum Season {
    SPRING,
    SUMMER,
    AUTUMN,
    WINTER
}
```
然后我们使用javac编译上面的类,得到class文件.
```java
javac Season.java
```
然后,我们利用反编译的方法来看看字节码文件究竟是什么.这里使用的工具是javap的简单命令,先列举一下这个Season下的全部元素.
```java
➜  company javap Season
Warning: Binary file Season contains com.company.Season
Compiled from "Season.java"
public final class com.company.Season extends java.lang.Enum<com.company.Season> {
  public static final com.company.Season SPRING;
  public static final com.company.Season SUMMER;
  public static final com.company.Season AUTUMN;
  public static final com.company.Season WINTER;
  public static com.company.Season[] values();
  public static com.company.Season valueOf(java.lang.String);
  static {};
}
```
从上反编译结果可知

  * java代码中的Season转换成了继承自的java.lang.enum的类
  * 既然隐式继承自java.lang.enum,也就意味java代码中,Season不能再继承其他的类
  * Season被标记成了final,意味着它不能被继承
 

### static代码块

使用javap具体反编译class文件,得到静态代码块相关的结果为
```java
static {};
    Code:
       0: new           #4                  // class com/company/Season
       3: dup
       4: ldc           #7                  // String SPRING
       6: iconst_0
       7: invokespecial #8                  // Method "<init>":(Ljava/lang/String;I)V
      10: putstatic     #9                  // Field SPRING:Lcom/company/Season;
      13: new           #4                  // class com/company/Season
      16: dup
      17: ldc           #10                 // String SUMMER
      19: iconst_1
      20: invokespecial #8                  // Method "<init>":(Ljava/lang/String;I)V
      23: putstatic     #11                 // Field SUMMER:Lcom/company/Season;
      26: new           #4                  // class com/company/Season
      29: dup
      30: ldc           #12                 // String AUTUMN
      32: iconst_2
      33: invokespecial #8                  // Method "<init>":(Ljava/lang/String;I)V
      36: putstatic     #13                 // Field AUTUMN:Lcom/company/Season;
      39: new           #4                  // class com/company/Season
      42: dup
      43: ldc           #14                 // String WINTER
      45: iconst_3
      46: invokespecial #8                  // Method "<init>":(Ljava/lang/String;I)V
      49: putstatic     #15                 // Field WINTER:Lcom/company/Season;
      52: iconst_4
      53: anewarray     #4                  // class com/company/Season
      56: dup
      57: iconst_0
      58: getstatic     #9                  // Field SPRING:Lcom/company/Season;
      61: aastore
      62: dup
      63: iconst_1
      64: getstatic     #11                 // Field SUMMER:Lcom/company/Season;
      67: aastore
      68: dup
      69: iconst_2
      70: getstatic     #13                 // Field AUTUMN:Lcom/company/Season;
      73: aastore
      74: dup
      75: iconst_3
      76: getstatic     #15                 // Field WINTER:Lcom/company/Season;
      79: aastore
      80: putstatic     #1                  // Field $VALUES:[Lcom/company/Season;
      83: return
}
```
其中

  * 0~52为实例化SPRING, SUMMER, AUTUMN, WINTER
  * 53~83为创建`Season[]`数组`$VALUES`,并将上面的四个对象放入数组的操作.

### values方法
values方法的的返回值实际上就是上面`$VALUES`数组对象

## swtich中的枚举
在Java中,switch-case是我们经常使用的流程控制语句.当枚举出来之后,switch-case也很好的进行了支持.

比如下面的代码是完全正常编译,正常运行的.
```java
public static void main(String[] args) {
        Season season = Season.SPRING;
        switch(season) {
            case SPRING:
                System.out.println("It's Spring");
                break;

            case WINTER:
                System.out.println("It's Winter");
                break;

            case SUMMER:
                System.out.println("It's Summer");
                break;
            case AUTUMN:
                System.out.println("It's Autumn");
                break;
        }
    }
```
不过,通常情况下switch-case支持类似int的类型,那么它是怎么做到对Enum的支持呢,我们反编译上述方法看一下字节码的真实情况.

```java
public static void main(java.lang.String[]);
    Code:
       0: getstatic     #2                  // Field com/company/Season.SPRING:Lcom/company/Season;
       3: astore_1
       4: getstatic     #3                  // Field com/company/Main$1.$SwitchMap$com$company$Season:[I
       7: aload_1
       8: invokevirtual #4                  // Method com/company/Season.ordinal:()I
      11: iaload
      12: tableswitch   { // 1 to 4
                     1: 44
                     2: 55
                     3: 66
                     4: 77
               default: 85
          }
      44: getstatic     #5                  // Field java/lang/System.out:Ljava/io/PrintStream;
      47: ldc           #6                  // String It's Spring
      49: invokevirtual #7                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      52: goto          85
      55: getstatic     #5                  // Field java/lang/System.out:Ljava/io/PrintStream;
      58: ldc           #8                  // String It's Winter
      60: invokevirtual #7                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      63: goto          85
      66: getstatic     #5                  // Field java/lang/System.out:Ljava/io/PrintStream;
      69: ldc           #9                  // String It's Summer
      71: invokevirtual #7                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      74: goto          85
      77: getstatic     #5                  // Field java/lang/System.out:Ljava/io/PrintStream;
      80: ldc           #10                 // String It's Autumn
      82: invokevirtual #7                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      88: return
```
注意上面代码块有这样的一段代码
```java
8: invokevirtual #4                  // Method com/company/Season.ordinal:()I
```
事实果真如此,在switch-case中,还是将Enum转成了int值(通过调用Enum.oridinal()方法)


## 枚举与混淆
在Android开发中,进行混淆是我们在发布前必不可少的工作,混下后,我们能增强反编译的难度,在一定程度上保护了增强了安全性.

而开发人员处理混淆更多的是将某些元素加入不混淆的名单,这里枚举就是需要排除混淆的.

在默认的混淆配置文件中,已经加入了关于对枚举混淆的处理
```java
# For enumeration classes, see http://proguard.sourceforge.net/manual/examples.html#enumerations
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}
```

关于为什么要保留values()方法和valueOf()方法，请参考文章[读懂 Android 中的代码混淆](http://droidyue.com/blog/2016/07/10/understanding-android-obfuscated-code-by-proguard/) 关于枚举的部分


## 使用proguard优化
使用Proguard进行优化，可以将枚举尽可能的转换成int。配置如下
```
-optimizations class/unboxing/enum
```

确保上述代码生效，需要确proguard配置文件不包含`-dontoptimize`指令。

当我们使用gradlew打包是，看到类似下面的输出，即`Number of unboxed enum classes:1`代表已经将一个枚举转换成了int的形式。
```java
Optimizing...
  Number of finalized classes:                 0   (disabled)
  Number of unboxed enum classes:              1
  Number of vertically merged classes:         0   (disabled)
  Number of horizontally merged classes:       0   (disabled)
```


## 枚举单例
单例模式是我们在日常开发中可谓是最常用的设计模式.

然后要设计好单例模式,无非考虑一下几点

  * 确保只有唯一实例,不多创建多余实例
  * 确保实例按需创建.

因此传统的做法想要实现单例,大致有一下几种

  * 饿汉式加载
  * 懒汉式synchronize和双重检查
  * 利用java的静态加载机制

相比上述的方法,使用枚举也可以实现单例,而且还更加简单.
```java
public enum AppManager {
    INSTANCE;

    private String tagName;
    public void setTag(String tagName) {
        this.tagName = tagName;
    }

    public String getTag() {
        return tagName;
    }
}
```
调用起来也更加简单
```java
AppManager.INSTANCE.getTag();
```

### 枚举如何确保唯一实例
因为获得实例只能通过`AppManager.INSTANCE`

下面的方式是不可以的
```java
AppManager appManager = new AppManager(); //compile error
```

关于单例模式，可以阅读[单例这种设计模式](http://droidyue.com/blog/2015/01/11/looking-into-singleton/)了解更多。


## (Android中)该不该用枚举
既然上面提到了枚举会转换成类，这样理论上造成了下面的问题

  * 增加了dex包的大小，理论上dex包越大，加载速度越慢
  * 同时使用枚举，运行时的内存占用也会相对变大

关于上面两点的验证，秋百万已经做了详细的论证，大家可以参考这篇文章[《Android 中的 Enum 到底占多少内存？该如何用？》](https://www.liaohuqiu.net/cn/posts/android-enum-memory-usage/) 

关于枚举是否使用的结论，大家可以参考

  * 如果你开发的是Framework不建议使用enum
  * 如果是简单的enum，可以使用int很轻松代替，则不建议使用enum
  * 另外，如果是Android中，可以使用下面介绍的枚举注解来实现。
  * 除此之外，我们还需要对比可读性和易维护性来与性能进行衡量，从中进行做出折中


## 在Android中的替代
Android中新引入的替代枚举的注解有IntDef和StringDef,这里以IntDef做例子说明一下.
```java
public class Colors {
    @IntDef({RED, GREEN, YELLOW})
    @Retention(RetentionPolicy.SOURCE)
    public @interface LightColors{}

    public static final int RED = 0;
    public static final int GREEN = 1;
    public static final int YELLOW = 2;
}
```

  * 声明必要的int常量
  * 声明一个注解为LightColors
  * 使用@IntDef修饰LightColors,参数设置为待枚举的集合
  * 使用@Retention(RetentionPolicy.SOURCE)指定注解仅存在与源码中,不加入到class文件中


比如我们用来标注方法的参数
```java
private void setColor(@Colors.LightColors int color) {
        Log.d("MainActivity", "setColor color=" + color);
}
```

调用的该方法的时候
```java
setColor(Colors.GREEN);
```

关于Android中的枚举，可以参考[探究Android中的注解](http://droidyue.com/blog/2016/08/14/android-annnotation/)

以上就是我对Java中enum的一些深入的剖析，欢迎大家不吝赐教。

