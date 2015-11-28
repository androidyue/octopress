---
layout: post
title: "深入探索Java 8 Lambda表达式"
date: 2015-11-28 19:05
comments: true
categories: Java JVM
---
##版权说明
本文为 InfoQ 中文站特供稿件，首发地址为：[http://www.infoq.com/cn/articles/Java-8-Lambdas-A-Peek-Under-the-Hood](http://www.infoq.com/cn/articles/Java-8-Lambdas-A-Peek-Under-the-Hood)。如需转载，请与 InfoQ 中文站联系。

## 正文

2014年3月，Java 8发布，Lambda表达式作为一项重要的特性随之而来。或许现在你已经在使用Lambda表达式来书写简洁灵活的代码。比如，你可以使用Lambda表达式和新增的流相关的API，完成如下的大量数据的查询处理：
```
int total = invoices.stream()
                    .filter(inv -> inv.getMonth() == Month.JULY)
                    .mapToInt(Invoice::getAmount)
                    .sum();
```
上面的示例代码描述了如何从一打发票中计算出7月份的应付款总额。其中我们使用Lambda表达式过滤出7月份的发票，使用方法引用来提取出发票的金额。
<!--more-->
到这里，你可能会对Java编译器和JVM内部如何处理Lambda表达式和方法引用比较好奇。可能会提出这样的问题，Lambda表达式会不会就是匿名内部类的语法糖呢？毕竟上面的示例代码可以使用匿名内部类实现，将Lambda表达式的方法体实现移到匿名内部类对应的方法中即可，但是我们并不赞成这样做。如下为匿名内部类实现版本：
```
int total = invoices.stream()
                    .filter(new Predicate<Invoice>() {
                        @Override
                        public boolean test(Invoice inv) {
                            return inv.getMonth() == Month.JULY;
                        }
                    })
                    .mapToInt(new ToIntFunction<Invoice>() {
                        @Override
                        public int applyAsInt(Invoice inv) {
                            return inv.getAmount();
                        }
                    })
                    .sum();
```

本文将会介绍为什么Java编译器没有采用内部类的形式处理Lambda表达式，并解密Lambda表达式和方法引用的内部实现。接着介绍字节码生成并简略分析Lambda表达式理论上的性能。最后，我们将讨论一下实践中Lambda表达式的性能问题。

##为什么匿名内部类不好？
实际上，匿名内部类存在着影响应用性能的问题。

首先，编译器会为每一个匿名内部类创建一个类文件。创建出来的类文件的名称通常按照这样的规则 ClassName$1， 其中ClassName就是匿名内部类定义所属的类的名称，ClassName后面需要接上$符合和数字。生成如此多的文件就会带来问题，因为类在使用之前需要加载类文件并进行验证，这个过程则会影响应用的启动性能。类文件的加载很有可能是一个耗时的操作，这其中包含了磁盘IO和解压JAR文件。

假设Lambda表达式翻译成匿名内部类，那么每一个Lambda表达式都会有一个对应的类文件。随着匿名内部类进行加载，其必然要占用JVM中的元空间（从Java 8开始永久代的一种替代实现）。如果匿名内部类的方法被JIT编译成机器代码，则会存储到代码缓存中。同时，匿名内部类都需要实例化成独立的对象。以上关于匿名内部类的种种会使得应用的内存占用增加。因此我们有必要引入新的缓存机制减少过多的内存占用，这也就意味着我们需要引入某种抽象层。

最重要的，一旦Lambda表达式使用了匿名内部类实现，就会限制了后续Lambda表达式实现的更改，降低了其随着JVM改进而改进的能力。

我们看一下下面的这段代码：
```
import java.util.function.Function;
public class AnonymousClassExample {
    Function<String, String> format = new Function<String, String>() {
        public String apply(String input){
            return Character.toUpperCase(input.charAt(0)) + input.substring(1);
        }
    };
}
```
使用这个命令我们可以检查任何类文件生成的字节码
```
javap -c -v ClassName 
```
示例中使用Function创建的匿名内部类对应的字节码如下：
```
0: aload_0       
1: invokespecial #1 // Method java/lang/Object."<init>":()V
4: aload_0       
5: new           #2 // class AnonymousClassExample$1
8: dup           
9: aload_0       
10: invokespecial #3 // Method AnonymousClass$1."<init>":(LAnonymousClassExample;)V
13: putfield      #4 // Field format:Ljava/util/function/Function;
16: return  
```
上述字节码的含义如下：

  * 第5行，使用字节码操作new创建了类型AnonymousClassExample$1的一个对象，同时将新创建的对象的的引用压入栈中。
  * 第8行，使用dup操作复制栈上的引用。
  * 第10行，上面的复制的引用被指令invokespecial消耗使用，用来初始化匿名内部类实例。
  * 第13行，栈顶依旧是创建的对象的引用，这个引用通过putfield指令保存到AnonymousClassExample类的format属性中。

AnonymousClassExample$1就是由编译器生成的匿名内部类的名称。如果想更加验证的话，你可以检查AnonymousClassExample$1这个类文件，你会发现这个类就是Function接口的实现。

将Lambda表达式翻译成匿名内部类会限制以后可能进行的优化（比如缓存）。因为一旦使用了翻译成匿名内部类形式，那么Lambda表达式则和匿名内部类的字节码生成机制绑定。因而，Java语言和JVM工程师需要设计一个稳定并且具有足够信息的二进制表示形式来支持以后的JVM实现策略。下面的部分将介绍不使用匿名内部类机制，Lambda表达式是如何工作的。


##Lambdas表达式和invokedynamic
为了解决前面提到的担心，Java语言和JVM工程师决定将翻译策略推迟到运行时。利用Java 7引入的invokedynamic字节码指令我们可以高效地完成这一实现。将Lambda表达式转化成字节码只需要如下两步：

1.生成一个invokedynamic调用点，也叫做Lambda工厂。当调用时返回一个Lambda表达式转化成的[函数式接口](http://docs.oracle.com/javase/8/docs/api/java/lang/FunctionalInterface.html)实例。

2.将Lambda表达式的方法体转换成方法供invokedynamic指令调用。

为了阐明上述的第一步，我们这里举一个包含Lambda表达式的简单类：
```
import java.util.function.Function;

public class Lambda {
    Function<String, Integer> f = s -> Integer.parseInt(s);
}
```
查看上面的类经过编译之后生成的字节码：
```
0: aload_0
1: invokespecial #1 // Method java/lang/Object."<init>":()V
4: aload_0
5: invokedynamic #2, 0 // InvokeDynamic
                  #0:apply:()Ljava/util/function/Function;
10: putfield #3 // Field f:Ljava/util/function/Function;
13: return
```
需要注意的是，方法引用的编译稍微有点不同，因为javac不需要创建一个合成的方法，javac可以直接访问该方法。

Lambda表达式转化成字节码的第二步取决于Lambda表达式是否为对变量捕获。Lambda表达式方法体需要访问外部的变量则为对变量捕获，反之则为对变量不捕获。

对于不进行变量捕获的Lambda表达式，其方法体实现会被提取到一个与之具有相同签名的静态方法中，这个静态方法和Lambda表达式位于同一个类中。比如上面的那段Lambda表达式会被提取成类似这样的方法：
```
static Integer lambda$1(String s) {
    return Integer.parseInt(s);
}
```
需要注意的是，这里的$1并不是代表内部类，这里仅仅是为了展示编译后的代码而已。

对于捕获变量的Lambda表达式情况有点复杂，同前面一样Lambda表达式依然会被提取到一个静态方法中，不同的是被捕获的变量同正常的参数一样传入到这个方法中。在本例中，采用通用的翻译策略预先将被捕获的变量作为额外的参数传入方法中。比如下面的示例代码：
```
int offset = 100;
Function<String, Integer> f = s -> Integer.parseInt(s) + offset; 
```
对应的翻译后的实现方法为：
```
static Integer lambda$1(int offset, String s) {
    return Integer.parseInt(s) + offset;
}
```

需要注意的是编译器对于Lambda表达式的翻译策略并非固定的，因为这样invokedynamic可以使编译器在后期使用不同的翻译实现策略。比如，被捕获的变量可以放入数组中。如果Lambda表达式用到了类的实例的属性，其对应生成的方法可以是实例方法，而不是静态方法，这样可以避免传入多余的参数。

##性能分析
Lambda表达式最主要的优势表现在性能方面，虽然使用它很轻松的将很多行代码缩减成一句，但是其内部实现却不这么简单。下面对内部实现的每一步进行性能分析。

第一步就是连接，对应的就是我们上面提到的Lambda工厂。这一步相当于匿名内部类的类加载过程。来自Oracle的Sergey Kuksenko发布过相关的[性能报告](http://www.google.com/url?q=http%3A%2F%2Fwww.oracle.com%2Ftechnetwork%2Fjava%2Fjvmls2013kuksen-2014088.pdf&sa=D&sntz=1&usg=AFQjCNEvk_uT2Gf5fi6oU2cBm29FJ9X0ZA)，并且他也在2013 [JVM语言大会](https://www.google.com/url?q=https%3A%2F%2Fmedianetwork.oracle.com%2Fvideo%2Fplayer%2F2623576348001&sa=D&sntz=1&usg=AFQjCNHq8XfMibI94INM3Zl8UGzk-kKbew)就该话题做过[分享](http://www.oracle.com/technetwork/java/jvmls2013kuksen-2014088.pdf)。报告表明，Lambda工厂的预热准备需要消耗时间，并且这个过程比较慢。伴随着更多的调用点连接，代码被频繁调用后（比如被JIT编译优化）性能会提升。另一方面如果连接处于不频繁调用的情况，那么Lambda工厂方式也会比匿名内部类加载要快，最高可达100倍。

第二步就是捕获变量。正如我们前面提到的，如果是不进行捕获变量，这一步会自动进行优化，避免在基于Lambda工厂实现下额外创建对象。对于匿名内部类而言，这一步对应的是创建外部类的实例，为了优化内部类这一步的问题，我们需要手动的修改代码，如创建一个对象，并将它设置给一个静态的属性。如下述代码：
```java
// Hoisted Function
public static final Function<String, Integer> parseInt = new Function<String, Integer>() {
    public Integer apply(String arg) {
        return Integer.parseInt(arg);
    }
}; 

// Usage:
int result = parseInt.apply(“123”);
```

第三部就是真实方法的调用。在这一步中匿名内部类和Lambda表达式执行的操作相同，因此没有性能上的差别。不进行捕获的Lambda表达式要比进行static优化过的匿名内部类较优。进行变量捕获的Lambda表达式和匿名内部类表达式性能大致相同。

在这一节中，我们明显可以看到Lambda表达式的实现表现良好，匿名内部类通常需要我们手动的进行优化来避免额外对象生成，而对于不进行变量捕获的Lambda表达式，JVM已经为我们做好了优化。

##实践中的性能分析
理解了Lambda的性能模型很是重要，但是实际应用中的总体性能如何呢？我们在使用Java 8 编写了一些软件项目，一般都取得了很好的效果。非变量捕获的Lambda表达式给我们带来了很大的帮助。这里有一个很特殊的例子描述了关于优化方向的一些有趣的问题。

这个例子的场景是代码需要运行在一个要求GC暂定时间越少越好的系统上。因而我们需要避免创建大量的对象。在这个工程中，我们使用了大量的Lambda表达式来实现回调处理。然而在这些使用Lambda实现的回调中很多并没有捕获局部变量，而是需要引用当前类的变量或者调用当前类的方法。然而目前仍需要对象分配。下面就是我们提到的例子的代码：
```java
public MessageProcessor() {} 

public int processMessages() {
    return queue.read(obj -> {
        if (obj instanceof NewClient) {
            this.processNewClient((NewClient) obj);
        } 
        ...
    });
}
```

有一个简单的办法解决这个问题，我们将Lambda表达式的代码提前到构造方法中，并将其赋值给一个成员属性。在调用点我们直接引用这个属性即可。下面就是修改后的代码：
```java
private final Consumer<Msg> handler; 

public MessageProcessor() {
    handler = obj -> {
        if (obj instanceof NewClient) {
            this.processNewClient((NewClient) obj);
        }
        ...
    };
} 

public int processMessages() {
    return queue.read(handler);
}
```
然而上面的修改后代码给却给整个工程带来了一个严重的问题：性能分析表明，这种修改产生很大的对象申请，其产生的内存申请在总应用的60%以上。

类似这种无关上下文的优化可能带来其他问题。

  1.纯粹为了优化的目的，使用了非惯用的代码写法，可读性会稍差一些。  
  2.内存分配方面的问题，示例中为MessageProcessor增加了一个成员属性，使得MessageProcessor对象需要申请更大的内存空间。Lambda表达式的创建和捕获位于构造方式中，使得MessageProcessor的构造方法调用缓慢一些。

我们遇到这种情况，需要进行内存分析，结合合理的业务用例来进行优化。有些情况下，我们使用成员属性确保为经常调用的Lambda表达式只申请一个对象，这样的缓存策略大有裨益。任何性能调优的科学的方法都可以进行尝试。

上述的方法也是其他程序员对Lambda表达式进行优化应该使用的。书写整洁，简单，函数式的代码永远是第一步。任何优化，如上面的提前代码作为成员属性，都必须结合真实的具体问题进行处理。变量捕获并申请对象的Lambda表达式并非不好，就像我们我们写出`new Foo()`代码并非一无是处一样。

除此之外，我们想要写出最优的Lambda表达式，常规书写很重要。如果一个Lambda表达式用来表示一个简单的方法，并且没有必要对上下文进行捕获，大多数情况下，一切以简单可读即可。

##总结
在这片文章中，我们研究了Lambda表达式不是简单的匿名内部类的语法糖，为什么匿名内部类不是Lambda表达式的内部实现机制以及Lambda表达式的具体实现机制。对于大多数情况来说，Lambda表达式要比匿名内部类性能更优。然而现状并非完美，基于测量驱动优化，我们仍然有很大的提升空间。

Lambda表达式的这种实现形式并非Java 8 所有。Scala曾经通过生成匿名内部类的形式支持Lambda表达式。在Scala 2.12版本，Lambda的实现形式替换为Java 8中的Lambda 工厂机制。后续其他可以在JVM上运行的语言也可能支持Lambda的这种机制。

##关于作者 
Richard Warburton是一位资深专家，善于技术攻坚。最近，他写了一个关于[Java 8 Lambda表达式](http://tinyurl.com/java8lambdas)的书，由O'Reilly出版，同时他也在[java8training](http://java8training.com/)网站为Java程序员教授函数式编程。他涉猎的领域相当广泛，如数据分析，静态分析，编译器和网络协议等领域。他是伦敦Java协会的Leader，并举办OpenJdk hack活动。他进行了多次演讲，曾在Devoxx, JavaOne, JFokus, Devoxx UK, Geecon, Oredev, JAX London 和 Codemotion等会议做分享。除上述之外，他还是Warwick大学的计算机科学博士。

Raoul-Gabriel Urma是剑桥大学计算机科学的博士生。他也是Manning出版社出版的[Java 8 in Action: Lambdas, streams, and functional-style programming](http://manning.com/urma/)的联合作者。他发表过10多篇论文，也在国际会议做过20多场分享。他既在诸如Google，eBay，Oracle和Goldman Sachs这样的大公司工作过，也参与过小的创业公司。Raoul也是皇家艺术协会的一员。他的Twitter是@raoulUK。

Mario Fusco是来自Red Hat的高级软件工程师，他的工作是开发Drools核心开发和JBoss规则引擎。他有着相当丰富的Java经验，参与并领导了很多业界企业级的项目。他的兴趣是函数式编程和领域专用语言。由于对着两项的热爱，他创建了一个叫做lambdaj的开源库，目的是提供一个管理集合的Java DSL实现，使得使用更加函数式编码化。他的Twitter ID是@mariofusco。


**查看英文原文：**[Java 8 Lambdas - A Peek Under the Hood](http://www.infoq.com/articles/Java-8-Lambdas-A-Peek-Under-the-Hood)
