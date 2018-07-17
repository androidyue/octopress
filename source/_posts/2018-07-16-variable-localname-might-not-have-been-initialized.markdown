---
layout: post
title: "为什么局部变量需要显式设置初始化值"
date: 2018-07-16 08:40
comments: true
categories: Java 变量
---

我们在编程中，无时无刻地都在于方法打交道，而在方法中，我们很难不使用局部变量，比如我们有下面的这样一段很简单的代码
```java
public void dump() {
    String localName;
    System.out.println("dump localName=" + localName);
}
```
<!--more-->

随着我们敲打出上面的代码，IDE也会同时抛给我们一个错误，就是
`Variable 'localName' might not have been initialized`

这是什么错误，localName没有初始化？为什么成员变量是可以的的，不信你看
```java
public class Test {
    public String name;

    public  void dumpField() {
        System.out.println("dumpField name=" + name);
    }
}
```
是的，上面的成员变量是没有问题，也没有警告的。

这就奇怪了，这是为什么呢，javac怎么这么蠢呢？

答案是否定的。javac足够有能力推断出局部变量并初始化默认值。然而它并没有这样做。

想要弄清楚为什么这样做就，就需要搞清楚局部变量和成员变量的关于赋值和取值的顺序的差异。

对于成员变量而言，其赋值和取值访问的先后顺序具有不确定性。还是以这段代码为例。
```java
public class Test {
    public String name;

    public  void dumpField() {
        System.out.println("dumpField name=" + name);
    }
}
```
name的赋值可以发生在dumpField之前，也可以发生在dumpField之后。这是在运行时发生的，在编译器来看确定不了的。对于没把握的事情，javac是不会去做的，这种事情交给运行时的JVM就可以了。

而对于成员变量而言，其赋值和取值访问顺序是确定的。比如这段代码
```java
public void dump() {
    String localName;
    System.out.println("dump localName=" + localName);
}
```
因为localName的作用范围只限定于dump方法中，必然的顺序就是先赋值（声明），再进行访问。

说了半天还没有说局部变量为什么显式设置初始值呢？

其实之所以这样做就是一种对程序员的约束限制。因为程序员（人）是（有些情况下）是靠不住的，假使局部变量可以使用默认值，我们总会无意间忘记赋值，进而导致不可预期的情况出现。这

“之所以设计成这样完全是一种策略决定，并非是我力不能及，年轻人，我只能帮你到这里了。”，Javac如是说。
