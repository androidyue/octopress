---
layout: post
title: "编写地道的 Kotlin 代码"
date: 2019-05-19 21:04
comments: true
categories: Kotlin Java 
---

Kotlin 以其简洁实用的语法，赢得了很多Java 开发者，尤其是 Android 开发者的喜爱与应用。然而，虽然我们使用 Kotlin 进行编码，可能并没有书写出地道的 Kotlin 代码，亦或者是遵照写Java的思维，用Kotlin的语法 来编码。

本文将通过多出代码示例，分为`Do not`（不建议）和`Do`（建议）两部分，分别代表着不太好的实现和推荐的实现方式，来展示地道的 Kotlin 编码方式。

<!--more-->

## 进行非null判断
```kotlin
//Do not
fun dumpBook(book: Book?) {
    if (book != null) {
        book.dumpContent()
    }
}

//Do
fun dumpBook1(book: Book?) {
    book?.dumpContent()
}
```

## 进行类型转换并访问一些属性
```kotlin
// avoid if type checks
//Do not
fun testTypeCheck(any: Any) {
    if (any is Book) {
        println(any.isbn)
    }
}

//Do
fun testTypeCheck0(any: Any) {
    (any as? Book)?.let {
        println(it.isbn)
    }
}
```

## 避免使用`!!`非空断言
```kotlin
//Do not
fun testNotNullAssertion(feed: Feed) {
    feed.feedItemList.first().author!!.title
}

//Do
fun testNotNullAssertion0(feed: Feed) {
    feed.feedItemList.first().author?.title ?: "fallback_author_title"
}
```

补充：

  * 使用`!!`断言，一旦断言条件出错，会发生运行时异常。


## 判断可能为null的boolean值
```kotlin
// Do not
fun comsumeNullableBoolean() {
    var isOK: Boolean? = null
    if (isOK != null && isOK) {
        //do something
    }
}


//Do
fun comsumeNullableBoolean0() {
    var isOK: Boolean? = null
    if (isOK == true) {
        //do something
    }
}
```

## 利用`if-else`,`when`,`try-catch` 的返回值
```kotlin
//Do not
fun testIfElse(success: Boolean) {
    var message: String
    if (success) {
        message = "恭喜，成功了"
    } else {
        message = "再接再厉"
    }
    println(message)
}

//Do
fun testIfElse1(success: Boolean) {
    val message = if (success)  {
        "恭喜，成功了"
    } else {
        "再接再厉"
    }
}


//Do
fun testWhen0(type: Int) {
    val typeString = when(type) {
        1 -> "post"
        2 -> "status"
        else -> "page"
    }
    //can't reassign value to typeString
}

fun getWebContent(url: String): String = TODO()

//Do
fun testTryCatch() {
    val content = try {
        getWebContent("https://droidyue.com")
    } catch(e: IOException) {
        null
    }
    //can’t reassign value to content
}
```

## 善用 `apply`/`also`/`with`
```kotlin
//Do not
fun composeIntent(): Intent {
    val intent = Intent(Intent.ACTION_VIEW)
    intent.data = Uri.parse("https://droidyue.com")
    intent.`package` = "com.android.chrome"
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    return intent
}

//Do
fun composeIntent1(): Intent {
    return Intent(Intent.ACTION_VIEW).apply {
        data = Uri.parse("https://droidyue.com")
        `package` = "com.android.chrome"
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    }
}
```


```kotlin
data class Request(val uri: String)
//use also

//Do not
fun handleRequest(request: Request) : Boolean {
    return when {
       request.uri.startsWith("https") -> {
           handleHttpsRequest(request)
           true
       }

       request.uri.startsWith("http") -> {
           handleHttpRequest(request)
           true
       }

       else -> false
    }
}

//Do
fun handleRequest1(request: Request): Boolean {
    return when {
        request.uri.startsWith("https") -> true.also {
            handleHttpsRequest(request)
        }

        request.uri.startsWith("http") -> true.also {
            handleHttpRequest(request)
        }

        else -> false
    }
}
```

```kotlin
class Navigator {
    fun turnLeft() = Unit
    fun turnRight() = Unit
    fun forward() = Unit
    fun backward() = Unit
}

//use with
//Do not
fun navigate(navigator: Navigator) {
    navigator.forward()
    navigator.turnRight()
    navigator.backward()
    navigator.turnLeft()
}

//Do
fun navigate1(navigator: Navigator) {
    with(navigator) {
        forward()
        turnRight()
        backward()
        turnLeft()
    }
}
```
## 直接使用top-level方法，而不是Object里的方法
```kotlin
//Do not
object AppUtil {
    fun isAppEnabled(packageName: String): Boolean {
        TODO()
    }
}

//Do
//AppUtil.kt file
fun isAppEnabled(packageName: String): Boolean {
    TODO()
}
```

## 使用Kotlin的默认参数特性，而不是方法重载
```kotlin
//Do not
class BadPizza {
    constructor(size: Float)

    constructor(size: Float, hasCheese: Boolean)

    constructor(size: Float, hasCheese: Boolean, hasBacon: Boolean)
}

//Do
class GoodPizza {
    constructor(size: Float, hasCheese: Boolean = false, hasBacon: Boolean = false)
}
```

## 优先定义并使用扩展方法，而不是Util方法
```kotlin
//Do not
fun isStringPhoneNumber(value: String): Boolean {
    TODO()
}

//Do
fun String.isPhoneNumber(): Boolean = TODO()
```

## 使用方法引用
```kotlin
//Do not

data class NewsItem(val content: String, val isFake: Boolean)

fun normalLambda() {
    arrayOf<NewsItem>().filter { it.isFake }.let { print(it) }
}

fun methodReference() {
    arrayOf<NewsItem>().filter(NewsItem::isFake).let(::print)
}
```

## 使用inline修饰高阶函数（参数为函数时）
```kotlin
//Do not
fun safeRun(block: () -> Unit) {
    try {
        block()
    } catch (t: Throwable) {
        t.printStackTrace()
    }
}
//Do
inline fun safeRun0(block: () -> Unit) {
    try {
        block()
    } catch (t: Throwable) {
        t.printStackTrace()
    }
}
```

备注：

  * 关于inline的问题，可以参考[Kotlin 中的 Lambda 与 Inline](https://droidyue.com/blog/2019/04/27/lambda-inline-noinline-crossinline/)

## 把函数参数尽可能放到最后
```kotlin
//Do not
fun delayTask(task: () -> Unit, delayInMillSecond: Long)  {
    TODO()
}

//Do 
fun delayTask0(delayInMillSecond: Long, task: () -> Unit) {
    TODO()
}

fun testDelayTasks() {
    delayTask({
        println("printing")
    }, 5000L)

    delayTask0(5000L) {
        println("printing")
    }
}
```

## 使用mapNotNull
```kotlin
//Do not
fun testMapNotNull(list: List<FeedItem>) {
    list.map { it.author }.filterNotNull()
}

//Do
fun testMapNotNull0(list: List<FeedItem>) {
    list.mapNotNull { it.author }
}
```

## 尽可能使用只读集合
```kotlin
fun parseArguments(arguments: Map<String, String>) {
    //do some bad things
    //try to clear if the argument is available to be cleared.
    (arguments as? HashMap)?.clear()
}

//use read-only collections as much as possible
//Do not
fun useMutableCollections() {
    val arguments = hashMapOf<String, String>()
    arguments["key"] = "value"
    parseArguments(arguments)
}

//Do 
fun useReadOnlyCollections() {
    val arguments = mapOf("key" to "value")
    parseArguments(arguments)
}
```

## 适宜情况下使用`Pair`或`Triple`
```kotlin
// Use Pair or Triple
fun returnValues(): Pair<Int, String> {
    return Pair(404, "File Not Found")
}

fun returnTriple(): Triple<String, String, String> {
    return Triple("6时", "6分", "60秒")
}
```

## 使用lazy 替代繁琐的延迟初始化
```kotlin
data class Config(val host: String, val port: Int)

fun loadConfigFromFile(): Config = TODO()

//Do not
object ConfigManager {
    var config: Config? = null

    fun getConfig0() : Config? {
        if (config == null) {
            config = loadConfigFromFile()
        }
        return config
    }
}

//Do
object ConfigManager1 {
    val config: Config by lazy {
        loadConfigFromFile()
    }
}
```

## 使用lateinit 处理无法再构造函数初始化的变量
```kotlin
//Do not
class FeedItem {
    var author: Feed.Author? = null
}

//Do
class FeedItem0 {
    lateinit var author: Feed.Author
}
```

## 善用Data class的copy方法
```kotlin
//Do not
class Car {
    private var engine: String? = null

    constructor(theEngine: String) {
        engine = theEngine
    }

    constructor(car: Car) {
        engine = car.engine
    }
}

//Do
data class Car0(val engine: String)


fun test() {
    val firstCar = Car("Honda")
    val secondCar = Car(firstCar)

    val thirdCar = Car0("Nissan")
    val fourthCar = thirdCar.copy()
    val fifthCar = thirdCar.copy(engine = "Ford")
}
```

## 针对函数类型和集合使用`typealias`
```kotlin
//Do not

interface OnValueChangedListener {
    fun onValueChanged(value: String)
}

//Do
typealias OnValueChangedListener0 = (String) -> Unit

val value : OnValueChangedListener0 = {
    println(it)
}

//Do
typealias BookSet = HashSet<Book>

val bookSet = BookSet().apply {
    add(Book("978-0131872486"))
}
```

## 使用含义更加清晰的`substringBefore`和`substringAfter`
```kotlin
//Do not
fun testSubstring() {
    val message = "user|password"
    Log.i("testSubstring.user=", message.substring(0, message.indexOf("|")))

    Log.i("testSubstring.password=", message.substring(message.indexOf("|") + 1))
}


fun testSubstring0() {
    val message = "user|password"
    Log.i("testSubstring.user=", message.substringBefore("|"))

    Log.i("testSubstring.password=", message.substringAfter("|"))
}
```

以上就是一些相对更加Kotlin style的代码示例，如有补充，请在下方评论指出。谢谢。


## 相关阅读
  * [研究学习Kotlin的一些方法](https://droidyue.com/blog/2017/05/08/how-to-study-kotlin/)
  * [Kotlin 中的 Lambda 与 inline](https://droidyue.com/blog/2019/04/27/lambda-inline-noinline-crossinline/)
  * [有点意思的Kotlin的默认参数与JVMOverloads](https://droidyue.com/blog/2018/10/14/dive-into-kotlin-default-arguments-and-jvmoverloads/)

{%include post/kotlin_hexin_biancheng.html %}