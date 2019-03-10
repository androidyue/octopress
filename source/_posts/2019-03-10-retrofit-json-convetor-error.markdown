---
layout: post
title: "处理Retrofit MalformedJsonException报错"
date: 2019-03-10 20:25
comments: true
categories: Retrofit Android
---

使用Retrofit配合GsonConverter，我们能很好地将网络响应内容转换成对应的对象。比如像下面这样。

<!--more-->

Retrofit网络接口方法
```java
public interface DroidNetwork {
    @GET("/content/test.json")
    Call<DroidResponse> jsonData();

    @GET("/content/helloworld.txt")
    Call<String> plainText();
}
```

对应的应用方法
```java
		val retrofit = Retrofit.Builder()
                .baseUrl("https://asset.droidyue.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build()

        val droidNetwork = retrofit.create(DroidNetwork::class.java)

        droidNetwork.jsonData().enqueue(object : Callback<DroidResponse> {
            override fun onFailure(call: Call<DroidResponse>?, t: Throwable?) {
                t?.printStackTrace()
            }

            override fun onResponse(call: Call<DroidResponse>?, response: Response<DroidResponse>?) {
                dumpMessage("onResponse content=${response?.body()}")
            }
        })

        
```
上面的方法执行都很正常，可是执行这个方法的时候就会报错。

```java
droidNetwork.plainText().enqueue(object : Callback<String> {
            override fun onFailure(call: Call<String>?, t: Throwable?) {
                Exception("causedByPlainText", t)?.printStackTrace()
            }

            override fun onResponse(call: Call<String>?, response: Response<String>?) {
                dumpMessage("onResponse content=${response}")
            }

        })
```

崩溃的信息如下

```java
 W System.err: java.lang.Exception: causedByPlainText
 W System.err: 	at com.example.secoo.retrofitconvertor.MainActivity$doNetworkRequest$2.onFailure(MainActivity.kt:41)
 W System.err: 	at retrofit2.ExecutorCallAdapterFactory$ExecutorCallbackCall$1$2.run(ExecutorCallAdapterFactory.java:80)
 W System.err: 	at android.os.Handler.handleCallback(Handler.java:891)
 W System.err: 	at android.os.Handler.dispatchMessage(Handler.java:102)
 W System.err: 	at android.os.Looper.loop(Looper.java:207)
 W System.err: 	at android.app.ActivityThread.main(ActivityThread.java:7470)
 W System.err: 	at java.lang.reflect.Method.invoke(Native Method)
 W System.err: 	at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:524)
 W System.err: 	at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:958)
 W System.err: Caused by: com.google.gson.stream.MalformedJsonException: Use JsonReader.setLenient(true) to accept malformed JSON at line 1 column 1 path $
 W System.err: 	at com.google.gson.stream.JsonReader.syntaxError(JsonReader.java:1568)
 W System.err: 	at com.google.gson.stream.JsonReader.checkLenient(JsonReader.java:1409)
 W System.err: 	at com.google.gson.stream.JsonReader.doPeek(JsonReader.java:593)
 W System.err: 	at com.google.gson.stream.JsonReader.peek(JsonReader.java:425)
 W System.err: 	at com.google.gson.internal.bind.TypeAdapters$16.read(TypeAdapters.java:393)
 W System.err: 	at com.google.gson.internal.bind.TypeAdapters$16.read(TypeAdapters.java:390)
 W System.err: 	at retrofit2.converter.gson.GsonResponseBodyConverter.convert(GsonResponseBodyConverter.java:39)
 W System.err: 	at retrofit2.converter.gson.GsonResponseBodyConverter.convert(GsonResponseBodyConverter.java:27)
 W System.err: 	at retrofit2.OkHttpCall.parseResponse(OkHttpCall.java:223)
 W System.err: 	at retrofit2.OkHttpCall$1.onResponse(OkHttpCall.java:121)
 W System.err: 	at okhttp3.RealCall$AsyncCall.execute(RealCall.java:206)
 W System.err: 	at okhttp3.internal.NamedRunnable.run(NamedRunnable.java:32)
 W System.err: 	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1167)
 W System.err: 	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:641)
 W System.err: 	at java.lang.Thread.run(Thread.java:784)
```

原因其实很简单
 
   * http://asset.droidyue.com/content/test.json 是一个合法的json内容
   * https://asset.droidyue.com/content/helloworld.txt 是一个普通的文本，内容为`helloworld`
   * 因为上面的retrofit 对象 设置了GSONConvertor，会尝试默认将所有的内容转成对应的对象内容，故上面的普通文本就会失败报错。

解决方法有两个

  * 修改服务器端的https://asset.droidyue.com/content/helloworld.txt 为JSON内容
  * 调整客户端代码支持。


这里我们介绍后者的处理方法，这里我们使用ResponseBody而不是之前的String，然后按照如下代码应用即可。


接口代码
```java
@GET("/content/helloworld.txt")
Call<ResponseBody> plainTextAsResponseBody();
```
应用代码
```java
		droidNetwork.plainTextAsResponseBody().enqueue(object : Callback<ResponseBody> {
            override fun onFailure(call: Call<ResponseBody>?, t: Throwable?) {
                t?.printStackTrace()
            }

            override fun onResponse(call: Call<ResponseBody>?, response: Response<ResponseBody>?) {
                dumpMessage("onResponse of plainTextAsResponseBody content=${response?.body()?.string()}")
            }

        })
```


## 附加内容

如果在某种情况下，我们只关心请求操作，而不关心响应内容，我们可以这样使用
```java
@GET("/content/helloworld.txt")
Call<Void> ignoreResult();
```

上面的代码相对更加高效，因为这里省略了将响应内容转成内存对象的过程。



