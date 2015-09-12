---
layout: post
title: "你的Java代码对JIT编译友好么？"
date: 2015-09-12 18:16
comments: true
categories: JVM JIT
---

##版权说明

本文为 InfoQ 中文站特供稿件，首发地址为：[你的Java代码对JIT编译友好么？](http://www.infoq.com/cn/articles/Java-Application-Hostile-to-JIT-Compilation)。如需转载，请与 InfoQ 中文站联系。

##摘要
在JVM中，即时编译器（以下简称JIT）是很重要的一部分，可以帮助应用大幅度提升执行效率。但是很多程序却并不能很好地利用JIT的高性能优化能力。本文中，我们将通过研究一些简单的例子找出程序代码对JIT不友好的问题。
<!--more-->
JIT编译器是Java虚拟机（以下简称JVM）中效率最高并且最重要的组成部分之一。但是很多的程序并没有充分利用JIT的高性能优化能力，很多开发者甚至也并不清楚他们的程序有效利用JIT的程度。

在本文中，我们将介绍一些简单的方法来验证你的程序是否对JIT友好。这里我们并不打算覆盖诸如JIT编译器工作原理这些细节。只是提供一些简单基础的检测和方法来帮助你的代码对JIT友好，进而得到优化。

JIT编译的关键一点就是JVM会自动地监控正在被解释器执行的方法。一旦某个方法被视为频繁调用，这个方法就会被标记，进而编译成本地机器指令。这些频繁执行的方法的编译由后台的一个JVM线程来完成。在编译完成之前，JVM会执行这个方法的解释执行版本。一旦该方法编译完成，JVM会使用将方法调度表中该方法的解释的版本替换成编译后的版本。

Hotspot虚拟机有很多JIT编译优化的技术，但是其中最重要的一个优化技术就是内联。在内联的过程中，JIT编译器有效地将一个方法的方法体提取到其调用者中，从而减少虚方法调用。举个例子，看如下的代码：
```
public int add(int x, int y) {
	return x + y;
}
  
int result = add(a, b);
```
当内联发生之后，上述代码会变成
```
int result = a + b;
```

上面的变量a和b替换了方法的参数，并且add方法的方法体已经复制到了调用者的区域。使用内联可以为程序带来很多好处，比如
  * 不会引起额外的性能损失
  * 减少指针的间接引用
  * 不需要对内联方法进行虚方法查找

另外，通过将方法的实现复制到调用者中，JIT编译器处理的代码增多，使得后续的优化和更多的内联成为可能。

内联取决于方法的大小。缺省情况下，含有35个字节码或更少的方法可以进行内联操作。对于被频繁调用的方法，临界值可以达到325个字节。我们可以通过设置-XX:MaxInlineSize=# 选项来修改最大的临界值，通过设置‑XX:FreqInlineSize=#选项来修改频繁调用的方法的临界值。但是在没有正确的分析的情况下，我们不应该修改这些配置。因为盲目地修改可能会对程序的性能带来不可预料的影响。

由于内联会对代码的性能有大幅提升，因此让尽可能多的方法达到内联条件尤为重要。这里我们介绍一款叫做Jarscan的工具来帮助我们检测程序中有多少方法是对内联友好的。

Jarscan工具是分析JIT编译的JITWatch开源工具套件中的一部分。和在运行时分析JIT日志的主工具不同，Jarscan是一款静态分析jar文件的工具。该工具的输出结果格式为CSV，结果中包含了超过频繁调用方法临界值的方法等信息。JITWatch和Jarscan是AdoptOpenJDK工程的一部分，该工程由Chris Newland领导。

在使用Jarscan并得到分析结果之前，需要从AdoptOpenJDK Jenkins网站下载二进制工具（[Java 7 工具](https://adopt-openjdk.ci.cloudbees.com/job/jitwatch/jdk=JDK_1.7/ws/lastSuccessfulBuild/artifact/jitwatch-1.0.0-SNAPSHOT-JDK_1.7.tar.gz)，[Java 8 工具](https://adopt-openjdk.ci.cloudbees.com/job/jitwatch/jdk=OpenJDK8/ws/lastSuccessfulBuild/artifact/jitwatch-1.0.0-SNAPSHOT-OpenJDK8.tar.gz)）。

运行很简单，如下所示
```
./jarScan.sh <jars to analyse>
```
更多关于Jarscan的细节可以访问[AdoptOpenJDK wiki](https://github.com/AdoptOpenJDK/jitwatch/wiki/JarScan)进行了解。

上面产生的报告对于开发团队的开发工作很有帮助，根据报告结果，他们可以查找程序中是否包含了过大而不能JIT编译的关键路径方法。上面的操作依赖于手动执行。但是为了以后的自动化，可以开启Java的-XX:+PrintCompilation 选项。开启这个选项会生成如下的日志信息：
```
37    1      java.lang.String::hashCode (67 bytes)
124   2  s!  java.lang.ClassLoader::loadClass  (58 bytes)
```
其中，第一列表示从进程启动到JIT编译发生经过的时间，单位为毫秒。第二列表示的是编译id，表明该方法正在被编译（在Hotspot中一个方法可以多次去优化和再优化）。第三列表示的是附加的一些标志信息，比如s代表synchronized，！代表有异常处理。最后两列分别代表正在编译的方法名称和该方法的字节大小。


关于PrintCompilation输出的更多细节，Stephen Colebourne写过一篇博客文章详细介绍日志结果中各列的具体含义，感兴趣的可以访问[这里](http://blog.joda.org/2011/08/printcompilation-jvm-flag.html)阅读。

PrintCompilation的输出结果会提供运行时正在编译的方法的信息，Jarscan工具的输出结果可以告诉我们哪些方法不能进行JIT编译。结合两者，我们就可以清楚地知道哪些方法进行了编译，哪些没有进行。另外，PrintCompilation选项可以在线上环境使用，因为开启这个选项几乎不会影响JIT编译器的性能。

但是，PrintCompilation也存在着两个小问题，有时候会显得不是那么方便：

  1.输出的结果中未包含方法的签名，如果存在重载方法，区分起来则比较困难。  
  2.Hotspot虚拟机目前不能将结果输出到单独的文件中，目前只能是以标准输出的形式展示。

上述的第二个问题的影响在于PrintCompilation的日志会和其他常用的日志混在一起。对于大多数服务器端程序来说，我们需要一个过滤进程来将PrintCompilation的日志过滤到一个独立的日志中。最简单的判断一个方法否是JIT友好的途径就是遵循下面这个简单的步骤：

  1.确定程序中位于要处理的关键路径上的方法。  
  2.检查这些方法没有出现在Jarscan的输出结果中。  
  3.检查这些方法确实出现在了PrintCompilation的输出结果中。

如果一个方法超过了内联的临界值，大多数情况下最常用的方法就是讲这个重要的方法拆分成多个可以进行内联的小方法，这样修改之后通常会获取更好的执行效率。但是对于所有的性能优化而言，优化之前的执行效率需要测量记录，并且需要需要同优化后的数据进行对比之后，才能决定是否进行优化。为了性能优化而做出的改变不应该是盲目的。

几乎所有的Java程序都依赖大量的提供关键功能的库。Jarscan可以帮助我们检测哪些库或者框架的方法超过了内联的临界值。举一个具体的例子，我们这里检查JVM主要的运行时库 rt.jar文件。

为了让结果有点意思，我们分别比较Java 7 和Java 8，并查看这个库的变化。在开始之前我们需要安装Java 7 和 Java8 JDK。首先，我们分别运行Jarscan扫描各自的rt.jar文件，并得到用来后续分析的报告结果：
```
    $ ./jarScan.sh /Library/Java/JavaVirtualMachines/jdk1.7.0_71.jdk/Contents/Home/jre/lib/rt.jar
  > large_jre_methods_7u71.txt
    $ ./jarScan.sh /Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home/jre/lib/rt.jar
  > large_jre_methods_8u25.txt
```
上述操作结束之后，我们得到两个CSV文件，一个是JDK 7u71的结果，另一个是JDK 8u25。然后我们看一看不同的版本内联情况有哪些变化。首先，一个最简单的判断验证方式，看一看不同版本的JRE中有多少对JIT不友好的方法。
```
 $ wc -l large_jre_methods_*
 3684 large_jre_methods_7u71.txt
 3576 large_jre_methods_8u25.txt
```
我们可以看到，相比Java 7，Java 8 少了100多个内联不友好的方法。下面继续深入研究，看看一些关键的包的变化。为了便于理解如何操作，我们再次介绍一下Jarscan的输出结果。Jarscan的输出结果有如下3个属性组成：
```
 "<package>","<method name and signature>",<num of bytes>
```
了解了上述的格式，我们可以利用一些Unix文本处理的工具来研究报告结果。比如，我们想看一下Java 7 和 Java 8 这两个版本中java.lang包下哪些方法变得内联友好了：
```
 $ cat large_jre_methods_7u71.txt large_jre_methods_8u25.txt | grep -i
  ^\"java.lang | sort | uniq -c
```

上面的语句使用grep命令过滤出每份报告中以java.lang开头的行，即只显示位于包java.lang中的类的内联不友好的方法。sort | uniq -c 是一个比较老的Unix小技巧，首先将讲行信息进行排序（相同的信息将聚集到一起），然后对上面的排序数据进行去重操作。另外本命令还会统计一个当前行信息重复的次数，这个数据位于每一行信息的最开始部分。让我们看一下上述命令的执行结果：
```
$ cat large_jre_methods_7u71.txt large_jre_methods_8u25.txt | grep -i ^\"java.lang | sort | uniq -c
2 "java.lang.CharacterData00","int getNumericValue(int)",835
2 "java.lang.CharacterData00","int toLowerCase(int)",1339
2 "java.lang.CharacterData00","int toUpperCase(int)",1307
// ... skipped output
2 "java.lang.invoke.DirectMethodHandle","private static java.lang.invoke.LambdaForm makePreparedLambdaForm(java.lang.invoke.MethodType,int)",613
1 "java.lang.invoke.InnerClassLambdaMetafactory","private java.lang.Class spinInnerClass()",497
// ... more output ----
```

报告中，以2（这是使用了uniq -c 对相同的信息计算数量的结果）最为起始的条目说明这些方法在Java 7 和Java 8 中起字节码大小没有改变。虽然这并不能完全肯定地说明这些方法的字节码没有改变，但通常我们也可以视为没有改变。重复次数为1的方法有如下的情况：  
  a)方法的字节码已经改变。  
  b)这些方法为新的方法。

我们看一下以1开始的行数据
```
    1 "java.lang.invoke.AbstractValidatingLambdaMetafactory","void
validateMetafactoryArgs()",864
    1 "java.lang.invoke.InnerClassLambdaMetafactory","private
java.lang.Class spinInnerClass()",497
    1 "java.lang.reflect.Executable","java.lang.String
    sharedToGenericString(int,boolean)",329
```

上面三个对内联不友好的方法全部来自Java 8，因此这属于新方法的情况。前两个方法与lamda表达式实现相关，第三个方法和反射子系统中继承层级调整有关。在这里，这个改变就是在Java 8 中引入了方法和构造器可以继承的通用基类。

最后，我们看一看JDK核心库一些令人惊讶的特性：
```
  $ grep -i ^\"java.lang.String large_jre_methods_8u25.txt
  "java.lang.String","public java.lang.String[] split(java.lang.String,int)",326
  "java.lang.String","public java.lang.String toLowerCase(java.util.Locale)",431
  "java.lang.String","public java.lang.String toUpperCase(java.util.Locale)",439
```
从上面的日志我们可以了解到，即使是Java 8 中一些java.lang.String中一些关键的方法还是处于内联不友好的状态。尤其是toLowerCase和toUpperCase这两个方法居然过大而无法内联，着实让人感到奇怪。但是，这两个方法由于要处理UTF-8数据而不是简单的ASCII数据，进而增加了方法的复杂性和大小，因而超过了内联友好的临界值。

对于性能要求较高并且确定只处理ASCII数据的程序，通常我们需要实现一个自己的StringUtils类。该类中包含一些静态的方法来实现上述内联不友好的方法的功能，但这些静态方法既保持紧凑型又能到达内联的要求。

上述我们讨论的改进都是大部分基于静态分析。除此之外，使用强大的JITWatch工具可以帮助我们更好地优化。JITWatch工具需要设置-XX:+LogCompilation选项开启日志打印。其打印出来的日志为XML格式，而非PrintCompilation简单的文本输出，并且这些日志比较大，通常会到达几百MB。它会影响正在运行的程序（默认情况下主要来自日志输出的影响），因此这个选项不适合在线上的生产环境使用。

PrintCompilation和Jarscan结合使用并不困难，但却提供了简单且很有实际作用的一步，尤其是对于开发团队打算研究其程序中即时编译执行情况时。大多数情况下，在性能优化中，一个快速的分析可以帮助我们完成一些容易实现的目标。


##关于作者
Ben Evans是jClarity公司的CEO，jClarity是一家致力于Java和JVM性能分析研究的创业公司。除此之外他还是London Java Community的负责人之一并在Java Community Process Executive Committee有一席之地。他之前的项目有Google IPO性能测试，金融交易系统，90年代知名电影网站等。

**查看英文原文：**[Is Your Java Application Hostile to JIT Compilation?](Your Java Application Hostile to JIT Compilation?)
