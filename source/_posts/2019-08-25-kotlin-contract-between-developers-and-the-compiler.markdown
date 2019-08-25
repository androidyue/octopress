---
layout: post
title: "Contract，开发者和 Kotlin 编译器之间的契约"
date: 2019-08-25 16:09
comments: true
categories: Contract Kotlin kotlinc compiler 编译器  
---

相比 Java，使用 Kotlin 编程的时候，我们和kotlin编译器的交互行为会更多一些，比如我们可以通过`inline`来控制字节码的输出结果，使用注解也可以修改编译输出的class文件。

这里介绍一个和kotlin编译器更加好玩的特性，contract。可以理解成中文里面的契约。

<!--more-->

## 不够智能的 Kotlin 编译器
Kotlin编译器向来是比较智能的，比如做类型推断和`smart cast`等。但是有些时候，显得不是那么智能，比如下面的这段代码

```kotlin
data class News(val publisherId: Int, val title: String)

//检查标题是否合法，如果title为null或者内容为空返回false
fun News?.isTitleValid(): Boolean {
    return this != null && title.isNotEmpty()
}

fun testNewsTitleValid(news: News?) {
    if (news.isTitleValid()) {	
        news.title //编译失败 并报错  //Only safe (?.) or non-null asserted (!!.) calls 
        //are allowed on a nullable receiver of type News?
    }
}
```

上面的代码会让我们觉得Kotlin编译器很不智能，甚至是有些笨拙。

  * `news.isTitleValid()`返回true，我们可以推测出`news.title`不为null，也能推断出news不为null
  * 但是即使这样，我们使用`news.title`会导致编译报错 `Only safe (?.) or non-null asserted (!!.) calls are allowed on a nullable receiver of type News?`
  * 所以，想要编译通过，我们要么继续使用`news?.title`或者是`news!!.title`，但无论哪一种都不够优雅

所以不争的结论就是，Kotlin编译器在`if`语句内部无法推断`news`是非null的。

### 为什么 Kotlin编译器不能推断出来呢
可能有人会想，我觉得挺简单的啊，应该可以推断出来吧。

是的，如果仅仅以例子中如此简单的实现，大家都会觉得可以推断出来

但是

  * 现实中的实践代码往往会比上面的复杂，比如涉及到多个调用和更加复杂的方法体实现等等
  * 纵使可以做到，编译器也需要花费资源和时间来分析上下文，这其中随着层级加深，资源消耗和编译耗时也会增加。

所以，不能推断也是有对应的考虑的。

## 契约是什么

所以我们面临的现实情况是

  * 作为开发者，我们了解较多的情况，比如`News?.isTitleValid`返回true，代表News实例不为null
  * 而编译器，由于上面的原因或者其他原因，不知道足够的信息，无法做到和开发者一样做相同的推断

于是，开发者和编译器之间可以建立一个这样的契约

  * 开发者将关于方法的额外信息提供给编译器，还是以`News?.isTitleValid`返回true，代表News实例不为null为例
  * 编译器在编译的时候，发现`News?.isTitleValid`为true后，按照开发者预期，转换成非空的News实例，让开发者可以直接调用

而 Kotlin 从1.3版本引入了Contract(契约)，用来解决我们刚刚提到的问题。

## 应用契约
```kotlin
@ExperimentalContracts
fun News?.isTitleValid(): Boolean {
	//contract 开始
    contract {
        returns(true) implies (this@isTitleValid is News)
    }
    //contract 结束
    return this != null && title.isNotEmpty()
}

@ExperimentalContracts
fun testNewsTitleValid(news: News?) {
    if (news?.isTitleValid() == true) {
        news.title
    }
}
```

关于上面代码的一些简单解释

  * contract 采用DSL方式声明
  * `returns(true) implies (this@isTitleValid is News)` 代表如果方法返回(returns) true，表明(implies) `this@isTitleValid` 是News实例，而不是News?的实例，即`this@isTitleValid`为非null
  * 声明使用Contract的方法和其被调用的方法都需要使用`@ExperimentalContracts`（后面章节会提到）


## 其他的契约实现
上面的契约为`returns(true) implies`，除此之外，还有

  * returns(false) implies
  * returns(null) implies
  * returns implies
  * returnsNotNull implies
  * callsInPlace


### returns(false) implies
```kotlin
@ExperimentalContracts
fun News?.isFake(): Boolean {
    contract {
        returns(false) implies (this@isFake is News)
    }
    return this == null || this.publisherId == 1980
}

@ExperimentalContracts
fun testNewsIsFake(news: News?) {
    if (news.isFake()) {
        news?.title
    } else {
        news.title
    }
}
```

  * 当方法`News?.isFake`返回false，则表明`this@isFake`是`News`实例，非null


### return(null) implies
```kotlin
@ExperimentalContracts
fun News?.copy(): Any? {
    contract {
        returns(null) implies (this@copy is News)
    }

    return if (this == null) {
        "EMPTY"
    } else {
        null
    }
}

@ExperimentalContracts
fun testNewsCopy(news: News?) {
    if (news.copy() == null) {
        news.title
    } else {
        news?.title
    }
}
```
  * 当方法`News?.copy`返回null时，`this@copy`是`News`实例，非null

### returns implies
```kotlin
@ExperimentalContracts
fun News?.validate() {
    contract {
        returns() implies (this@validate is News)
    }

    if (this == null) {
        throw IllegalStateException("null instance")
    }

    if (publisherId < 0) {
        throw IllegalStateException("publisherId is less than 0")
    }

    if (title.isEmpty()) {
        throw IllegalStateException("title is empty")
    }
}

@ExperimentalContracts
fun testNewsValidate(news: News?) {
    news.validate()
    news.title
}
```
  * 如果方法`News?.validate()`顺利执行完毕，不抛出异常，则`this@validate`是`News`实例，非null

### returnsNotNull implies
```kotlin
@ExperimentalContracts
fun News?.getTitleHashCode(): Int? {
    contract {
        returnsNotNull() implies (this@getTitleHashCode is News)
    }
    return this?.title?.hashCode()
}

@ExperimentalContracts
fun testNewsGetTitleHashCode(news: News?) {
    if (news.getTitleHashCode() != null) {
        news.title
    } else {
        news?.title
    }
}
```

  * 如果`News?.getTitleHashCode()`返回为非null，则`this@getTitleHashCode `是`News`实例，非null

## callsInPlace 原地调用
callsInPlace(lambda, kind)和之前的契约不同，它让我们有能力告知编译器，lambda在什么时候，什么地方，以及执行次数等信息。

同样，我们继续看这样一段代码
```kotlin
package com.example.androidcontractsample

fun getAppVersion() {
    val appVersion: Int
    safeRun {
        appVersion = 50
    }
}

//安全运行runFunction,捕获异常
inline fun safeRun(runFunction: () -> Unit) {
    try {
        runFunction.invoke()
    } catch(t: Throwable) {
        t.printStackTrace()
    }
}
```
当我们执行编译的时候，会得到这样的错误信息`Captured values initialization is forbidden due to possible reassignment`

因为上面的代码，也存在这里开发者知道一些信息，而编译器不知道的情况

### 对于编译器来说
  * 无法确定`runFunction`实参是否会执行
  * 无法确定`runFunction`实参是否只执行一次还是多次(val赋值多次会出错)
  * 无法确定`runFunction`实参执行时，是否getappVersion已经执行完毕

### 可能的结果
  * `runFunction`没有执行，`appVersion`处于未初始化状态
  * `runFunction`执行多次，`appVersion`被多次赋值，对于val是禁止的。

### 改进方案
```kotlin
import kotlin.contracts.ExperimentalContracts
import kotlin.contracts.InvocationKind
import kotlin.contracts.contract

@ExperimentalContracts
fun getAppVersion() {
    val appVersion: Int
    safeRun {
        appVersion = 50
    }
}

@ExperimentalContracts
fun safeRun(runFunction: () -> Unit) {
    contract {
    	//使用EXACTLY_ONCE
        callsInPlace(runFunction, InvocationKind.EXACTLY_ONCE)
    }
    try {
        runFunction()
    } catch (t: Throwable) {
        t.printStackTrace()
    }
}

```
通过契约上面的代码实现了

  * `safeRun`会在`getAppVersion`执行的过程中执行，不会等到`getAppVersion`执行完毕后执行
  * `safeRun`会确保`runFunction`只会执行一次，不会多次执行

注意：官方说使用callsInPlace作用的方法必须inline(A function declaring the callsInPlace effect must be inline.)。但是经过验证不inline也没有问题，只是对应的实现方式不同。

除此之外，上面提到的InvocationKind 有这样几个变量

  * AT_MOST_ONCE 做多调用一次
  * EXACTLY_ONCE 只调用一次
  * AT_LEAST_ONCE 最少执行一次
  * UNKNOWN (the default). 未知，默认值


## 应用Contract的问题
由于目前Contract还处于实验阶段，需要使用相关的注解来表明开发者明确这一特性（以后可能修改，并自愿承担相应的变动和后果）。

目前我们可以使用`UseExperimental`和`ExperimentalContracts`两种注解，以下为具体的使用示例。
```kotlin
@UseExperimental(ExperimentalContracts::class)
fun String?.isOK(): Boolean {
    contract {
        returns(true) implies(this@isOK is String)
    }
    return this != null && this.isNotEmpty()
}


@ExperimentalContracts
fun String?.isGood(): Boolean {
    contract {
        returns(true) implies(this@isGood is String)
    }
    return this != null && this.isNotEmpty()
}
```

### 非 Android项目
对于非 Android项目，会有另外一个非注解的方式，那就是为模块增加编译选项。如下图。
![https://asset.droidyue.com/image/2019_07/kotlin_contract_compiler_option.png](https://asset.droidyue.com/image/2019_07/kotlin_contract_compiler_option.png)

当然，你也可以在模块的配置文件，增加`-Xuse-experimental=kotlin.contracts.ExperimentalContracts`到`compilerSettings`的`additionalArguments`中。
```java
<module type="JAVA_MODULE" version="4">
  <component name="FacetManager">
    <facet type="kotlin-language" name="Kotlin">
      <configuration version="3" platform="JVM 1.8" useProjectSettings="false">
        <compilerSettings>
          <option name="additionalArguments" value="-version -Xuse-experimental=kotlin.contracts.ExperimentalContracts" />
        </compilerSettings>
        <compilerArguments>
          <option name="jvmTarget" value="1.8" />
          <option name="languageVersion" value="1.3" />
          <option name="apiVersion" value="1.3" />
        </compilerArguments>
      </configuration>
    </facet>
  </component>
  <component name="NewModuleRootManager" inherit-compiler-output="true">
    <exclude-output />
    <content url="file://$MODULE_DIR$">
      <sourceFolder url="file://$MODULE_DIR$/src" isTestSource="false" />
    </content>
    <orderEntry type="inheritedJdk" />
    <orderEntry type="sourceFolder" forTests="false" />
    <orderEntry type="library" name="KotlinJavaRuntime" level="project" />
  </component>
</module
```
## 当方法行为与契约不符

  * 这种情况是可能且容易出现的，因为Contract并没有校验机制处理。
  * 当这种情况出现，就意味着我们向编译器提供了虚假的辅助信息
  * 一旦问题出现，对应的结果结果就是导致应用运行时崩溃。

比如下面的例子，我们的方法与契约不符
```kotlin
@ExperimentalContracts
fun validateByMistake(news: News?): Boolean {
    contract {
        returns(true) implies (news is News)
    }
    return true
}

@ExperimentalContracts
fun testValidateByMistake(news: News?) {
    if (validateByMistake(news)) {
        news.title
    }
}
```
当然随之而来的就是运行时的崩溃
```bash
java.lang.NullPointerException: Attempt to invoke virtual method 'java.lang.String com.example.androidcontractsample.News.getTitle()' on a null object reference
 at com.example.androidcontractsample.NewsKt.testValidateByMistake(News.kt:91)
 at com.example.androidcontractsample.MainActivity.onCreate(MainActivity.kt:13)
 at android.app.Activity.performCreate(Activity.java:7698)
 at android.app.Activity.performCreate(Activity.java:7687)
 at android.app.Instrumentation.callActivityOnCreate(Instrumentation.java:1299)
 at android.app.ActivityThread.performLaunchActivity(ActivityThread.java:3096)
 ... 11 more
```

所以作为开发者，我们需要小心谨慎避免犯这种错误。

## 注意事项
  * Contract 自1.3才引入，而且是实验性的功能,未来的实现方式可能会有变动
  * Contract 目前只适用于top-level的方法，否则将会编译失败

## Contract 如今还是实验功能，用还是不用
  * 是的，正如前面提到的Contract属于实验阶段，后期的规划，可能是作为正式功能引入还是变更实施方案，还是相对未知的。
  * 但是仅以个人的观点来看，还是推荐使用的。因为我觉得有些技术不需要等到稳定或者正式阶段就可以应用。

## References
  * https://www.kotlindevelopment.com/help-yourself-and-the-compiler-with-contracts/
  * https://ncorti.com/blog/discovering-kotlin-contracts

