---
layout: post
title: "一个小技巧提升 OkHttp 请求稳定性"
date: 2019-10-07 19:56
comments: true
categories: OkHttp IOException Interceptor 稳定性 崩溃 请求
---

OkHttp是可以说是Android开发中，每个项目都必需依赖的网络库，我们可以很便捷高效的处理网络请求，极大的提升了编码效率。但是有时候，我们使用OkHttp也会遇到这样的问题

## 崩溃的stacktrace
```bash
 E AndroidRuntime: FATAL EXCEPTION: OkHttp Dispatcher
 E AndroidRuntime: Process: com.example.okhttpexceptionsample, PID: 13564
 E AndroidRuntime: java.lang.NullPointerException: blablabla
 E AndroidRuntime: 	at com.example.okhttpexceptionsample.MainActivity$createNPEInterceptor$1.intercept(MainActivity.kt:61)
 E AndroidRuntime: 	at okhttp3.internal.http.RealInterceptorChain.proceed(RealInterceptorChain.kt:112)
 E AndroidRuntime: 	at okhttp3.internal.http.RealInterceptorChain.proceed(RealInterceptorChain.kt:87)
 E AndroidRuntime: 	at okhttp3.RealCall.getResponseWithInterceptorChain(RealCall.kt:184)
 E AndroidRuntime: 	at okhttp3.RealCall$AsyncCall.run(RealCall.kt:136)
 E AndroidRuntime: 	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1167)
 E AndroidRuntime: 	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:641)
 E AndroidRuntime: 	at java.lang.Thread.run(Thread.java:784)
```
<!--more-->

## 为什么会崩溃

从上面的stacktrace，我们可以分析到，发生了NullPointerException。发生了崩溃。

等等，我记得OkHttp有处理异常的情况呢。

嗯，确实，OkHttp有处理异常的情况，比如发生异常会调用`onFailure`。比如下面的Callback的内容介绍。

```kotlin
interface Callback {
  /**
   * Called when the request could not be executed due to cancellation, a connectivity problem or
   * timeout. Because networks can fail during an exchange, it is possible that the remote server
   * accepted the request before the failure.
   */
  fun onFailure(call: Call, e: IOException)

  /**
   * Called when the HTTP response was successfully returned by the remote server. The callback may
   * proceed to read the response body with [Response.body]. The response is still live until its
   * response body is [closed][ResponseBody]. The recipient of the callback may consume the response
   * body on another thread.
   *
   * Note that transport-layer success (receiving a HTTP response code, headers and body) does not
   * necessarily indicate application-layer success: `response` may still indicate an unhappy HTTP
   * response code like 404 or 500.
   */
  @Throws(IOException::class)
  fun onResponse(call: Call, response: Response)
}
```

是的，

  * OkHttp只处理了IOException的情况，
  * NullPointerException不是IOException的子类

所以没有被处理,发生了崩溃。


那么有没有办法解决，让这种崩溃不发生，对用户不进行干扰呢？其实是可以的。

## 使用Interceptor
```kotlin
package com.example.okhttpexceptionsample

import okhttp3.Interceptor
import okhttp3.Response
import java.io.IOException

/**
 * 对于Interceptor的intercept中可能出现的Throwable包裹成IOExceptionWrapper，转成网络请求失败，而不是应用崩溃
 */
class SafeGuardInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        try {
            return chain.proceed(chain.request())
        } catch (t: Throwable) {
            throw IOExceptionWrapper("SafeGuarded when requesting ${chain.request().url}", t)
        }
    }
}

/**
 * 将chain.proceed处理中发生的Throwable包装成IOExceptionWrapper
 */
class IOExceptionWrapper(message: String?, cause: Throwable?) : IOException(message, cause)
```

上面的代码，我们将任何`Throwable`的转成`IOExceptionWrapper`（伪装成IOException），然后添加到OkHttpClient中
```kotlin
fun createOKHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .addInterceptor(SafeGuardInterceptor())
            .build()
    }
```
当我们再次执行有NPE的代码，日志就发生了改变(不再是崩溃的日志，而是异常的日志)
```bash
  W System.err: com.example.okhttpexceptionsample.IOExceptionWrapper: SafeGuarded=blablabla
  W System.err: 	at com.example.okhttpexceptionsample.SafeGuardInterceptor.intercept(SafeGuardInterceptor.kt:12)
  W System.err: 	at okhttp3.internal.http.RealInterceptorChain.proceed(RealInterceptorChain.kt:112)
  W System.err: 	at okhttp3.internal.http.RealInterceptorChain.proceed(RealInterceptorChain.kt:87)
  W System.err: 	at okhttp3.RealCall.getResponseWithInterceptorChain(RealCall.kt:184)
  W System.err: 	at okhttp3.RealCall$AsyncCall.run(RealCall.kt:136)
  W System.err: 	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1167)
  W System.err: 	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:641)
  W System.err: 	at java.lang.Thread.run(Thread.java:784)
  W System.err: Caused by: java.lang.NullPointerException: blablabla
  W System.err: 	at com.example.okhttpexceptionsample.MainActivity$createNPEInterceptor$1.intercept(MainActivity.kt:61)
  W System.err: 	at okhttp3.internal.http.RealInterceptorChain.proceed(RealInterceptorChain.kt:112)
  W System.err: 	at okhttp3.internal.http.RealInterceptorChain.proceed(RealInterceptorChain.kt:87)
  W System.err: 	at com.example.okhttpexceptionsample.SafeGuardInterceptor.intercept(SafeGuardInterceptor.kt:10)
  W System.err: 	... 7 more
```

上述需要注意两点

  * 添加的是Interceptor,而不是NetworkInterceptor   
  * 顺序很重要,一定要放在第一个位置

## 这么做有什么问题

这么做，当然可以明显增强请求的稳定性和应用的崩溃率。但是是不是也有一些问题呢？比如

  * 将问题情况吞掉，不利于发现问题呢

是的，确实可能存在上述的问题，但是我们可以利用下面的方式减轻或者解决问题

  * 只针对release情况应用SafeGuardInterceptor,这样便于debug情况下更容易发现   
  * 针对不同的build variants进行配置，便于尽可能的小范围发现问题   
  * 实行更加智能的动态开启策略。

在软件工程中，很多决定都是trade-off的体现，具体的实施方案大家可以自行平衡选择。
