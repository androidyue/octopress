---
layout: post
title: "货物崇拜编程"
date: 2019-03-24 19:59
comments: true
categories: 编程 
---

读到这个标题，多数人会有疑惑，什么是货物崇拜编程，其实最根本的问题可能是什么是货物崇拜。想要了解这些就不得不说货物崇拜(Cargo Cults，又译货物运动)的起源

> 第二次世界大战太平洋战争时，美军于塔纳岛建立一临时基地。当时岛上的原住民看见美军于“大铁船”（军舰）内出来，皆觉得十分惊讶；他们也看到，有一些“大铁鸟”（军用飞机）运送穿着美军军服的人及许多物资。这些原住民看见这种情况均感到很惊讶，并觉得这些“大铁船”及“大铁鸟”十分厉害。加上美军也提供部分物资给原住民，而这些物资对原住民来说十分有用，结果这些原住民将美军当作神。

> 第二次世界大战结束后，美军离开塔纳岛，只留下一些美军军服及一些货物。塔纳岛原住民便认为这些货物具有神奇力量，又相信“神”（美军）他日会回来并带来更多货物，使他们展开一个幸福新时代。但是美军当然再也没有回来塔纳岛，因此这些原住民便自己发展出一套敬拜仪式，崇拜美军军服及货物；表现形式是原住民会穿着美军军服、升起美国国旗，图腾则是木刻的飞机。

<!--more-->

货物崇拜编程则是上面的货物崇拜的引申，维基百科对其定义如下

> 货物崇拜编程（Cargo Cult Programming）是一种计算机程序设计中的反模式，其特征为不明就里地、仪式性地使用代码或程序架构。货物崇拜编程通常是程序员既没理解他要解决的bug、也没理解表面上的解决方案的典型表现。

## 现象
 * 从网络上看到一些 看似有道理却不起作用的内容
 * 为了用设计模式而用设计模式等刻意使用
 * 复制Stack Overflow上的内容，只要运行OK即可

这里以代码为例，列举几处违例

### 设置变量为null 释放内存

可能很多人都听过，类似手动设置变量为null，可以释放内存，缓解内存压力。于是就有人奉其为金科玉律，写出了类似下面的代码

```java
public class ViewHolder {
    private View view;
    private String message = "message";

    public ViewHolder(View view) {
        this.view = view;
    }

    public void clean() {
        //解除引用关系，释放内存
        view = null;
        message = null;
    }
}

```
上面的代码         

  * 我们在clean方法中，手动设置view和message为null以期待可以释放内存  
  * 由于Java是自动垃圾回收，只要ViewHolder示例不被持有，view就可以释放，`view = null`显然是画蛇添足  
  * 更复杂的情况，message对应的字符串内容回收，还需要考虑[字符串常量池](https://droidyue.com/blog/2014/12/21/string-literal-pool-in-java/)的存在。`message = null`无法释放字符串内容


### 使用弱引用防止内存泄露

同样，很多人都听说过 弱引用(WeakReference) ，它可以避免内存泄露，于是写出了下面的代码

```java
private void initWebView() {
        try {
            //使用弱引用防止程序webview导致内存泄漏
            webView = new WebView(new WeakReference<Context>(this).get());
            ....
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
```

上面的代码

  * 仅仅听说了弱引用，但是不知道强引用，更不知道他们阻止GC回收的能力
  * WebView构造方法接收强引用的Context，`new WeakReference<Context>(this)`试图构造一个Context的弱引用，但是`new WeakReference<Context>(this).get()`又从构建的弱引用中得出了原始的强引用
  * 上面的代码，只会是事与愿违。

### 处理SSLError引发安全问题
```java
@Override

public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error){
	handler.proceed();
}
```

上面的代码是Webview加载遇到SSL证书问题出错时的回调，网上很多人告诉我们，像上面的方式处理就能解决网页加载出错的问题，殊不知这回引发更大的风险漏洞问题。


## 货物崇拜的问题
  * 不熟悉内部原理，无法预期会发生什么，这是很危险的


## 易出现人群
  * 新手或者经验不足的人，对很多东西和技术不熟悉
  * 缺乏思考，思想懒惰的人


## 如何避免

如下，简单谈一些我认为能够规避货物崇拜编程的方式与方法

### 自身学习和思考，怀疑

  * 这是从内部驱动的解决方法，通过学习，我们可以把对一项技术的掌握从0变为1，进而变成100。在这个过程中，我们自然能规避那些货物崇拜的问题。
  * 保持思考，切忌懒惰，对于技术和代码，我们在会使用的情况下，更要研究和思考并了解其内部的机制和原理。
  * 保持怀疑，科学精神的精髓就是“怀疑”，在既不能证实也不能证伪的情况下那就存疑

### 结对编程与代码审核

  * 这是外部驱动的解决方法
  * 找一个有经验的人来结对编程，或代码审核，能够在代码上线之前发现潜在的问题并更正。

拒绝货物崇拜编程，学习，思考，怀疑。

## References
  * [货物崇拜](https://zh.wikipedia.org/wiki/%E8%B2%A8%E7%89%A9%E5%B4%87%E6%8B%9C)
  * [货物崇拜编程](https://zh.wikipedia.org/wiki/%E8%B4%A7%E7%89%A9%E5%B4%87%E6%8B%9C%E7%BC%96%E7%A8%8B)

