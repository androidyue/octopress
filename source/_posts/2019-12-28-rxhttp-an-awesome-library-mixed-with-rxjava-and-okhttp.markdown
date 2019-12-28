---
layout: post
title: "RxHttp 一款让你眼前一亮的 Http 请求框架"
date: 2019-12-28 15:15
comments: true
categories: rxjava okhttp github retrofit http get post 
---

> 本文系 RxHttp作者不怕天黑 向本博客投稿，并授权在本站发表。

# 1、前言

RxHttp在今年4月份一经推出，就受到了广大Android 开发者的喜爱，截止本文发表在github上已有[1100+star](https://github.com/liujingxing/RxHttp)，为此，我自己也建个RxHttp&RxLife 的群（群号：378530627）目前群里也有将近120号人，里面有不少小伙伴提了很多有价值的创意，才使得RxHttp一直坚持走到了现在，在此，感谢大家的喜爱。

<!--more-->


这期间，一直有人问我，retrofit不香吗？之前不知道该如何回答这个问题，现在我想说，香！！retrofit无疑是目前综合得分最高的选手，但它也有它的不足。

RxHttp相较于retrofit，功能上，两者均能实现，并无多大差异，更多的差异体现功能的使用上，也就是易用性，如对文件上传/下载/进度监听的操作上，RxHttp用及简的API，可以说碾压retrofit；另外在baseUrl、公共参数/请求头、请求加解密等功能上的易用性都要优于retrofit；然而这些，个人觉得都不算什么，个人觉得RxHttp最大的优势在于它近乎为0的上手成本、及简的API以及高扩展性，看完这篇文章，相信你会有同感。

那RxHttp就没有缺点吗？有，那就是它的稳定性目前还不如retrofit，毕竟RxHttp刚出道8个月，且全部是我一个人在维护，当然，并不是说RxHttp不稳定，RxHttp未开源前，在我司的项目已经使用了近2年，接着今年4月份将其开源，至今大大小小已迭代20多个版本，目前用的人也不在少数，可以说很稳定了。

# 2、简介

RxHttp是基于OkHttp的二次封装，并与RxJava做到无缝衔接，一条链就能发送任意请求。主要优势如下：

  **1. 支持Gson、Xml、ProtoBuf、FastJson等第三方数据解析工具**

  **2. 支持Get、Post、Put、Delete等任意请求方式，可自定义请求方式**

  **3. 支持在Activity/Fragment/View/ViewModel/任意类中，自动关闭请求**

  **4. 支持统一加解密，且可对单个请求设置是否加解密**

  **5. 支持添加公共参数/头部，且可对单个请求设置是否添加公共参数/头部**

  **6. 史上最优雅的实现文件上传/下载及进度的监听，且支持断点下载**

  **7. 史上最优雅的对错误统一处理，且不打破Lambda表达式**

  **8. 史上最优雅的处理多个BaseUrl及动态BaseUrl**

  **9. 史上最优雅的处理网络缓存**

  **10. 30秒即可上手，学习成本极低**

**gradle依赖**

```java
implementation 'com.rxjava.rxhttp:rxhttp:1.3.6'
//注解处理器，生成RxHttp类，即可一条链发送请求
annotationProcessor 'com.rxjava.rxhttp:rxhttp-compiler:1.3.6'
//管理RxJava及生命周期，Activity/Fragment 销毁，自动关闭未完成的请求
implementation 'com.rxjava.rxlife:rxlife:1.1.0'

//非必须 根据自己需求选择Converter  RxHttp默认内置了GsonConverter
implementation 'com.rxjava.rxhttp:converter-jackson:1.3.6'
implementation 'com.rxjava.rxhttp:converter-fastjson:1.3.6'
implementation 'com.rxjava.rxhttp:converter-protobuf:1.3.6'
implementation 'com.rxjava.rxhttp:converter-simplexml:1.3.6'
```

`注：kotlin用户，请使用kapt替代annotationProcessor`

缓存功能，请查看：[RxHttp 全网Http缓存最优解](https://juejin.im/post/5dff3c2de51d45582c27cea6)

# 3、使用

## 3.1、准备工作

RxHttp 要求项目使用Java 8，请在 app 的 build.gradle 文件中添加以下代码

```java
compileOptions {
    sourceCompatibility JavaVersion.VERSION_1_8
    targetCompatibility JavaVersion.VERSION_1_8
}
```

此时，再Rebuild一下项目（通过Rebuild生成RxHttp类），就可以开始RxHttp的入坑之旅

## 3.2、配置默认的BaseUrl

通过`@DefaultDomain`注解配置默认域名，如下：

```java
public class Url {
    @DefaultDomain //设置为默认域名
    public static String baseUrl = "https://www.wanandroid.com/";
}
```

此步骤是非必须的，这里先介绍`@DefaultDomain`注解的用法，更多有关域名的介绍，请查看本文3.6章节----多域名/动态域名

## 3.3、请求三部曲

先来看看如何发送一个最简单的请求，如下

```java
RxHttp.get("http://...")  //第一步, 通过get、postXxx、putXxx等方法，确定请求类型         
    .asString()           //第二步, 通过asXxx系列方法，确定返回数据类型    
    .subscribe(s -> {     //第三步, 订阅回调(此步骤同RxJava订阅观察者)
        //请求成功                                         
    }, throwable -> {                                  
        //请求失败                                         
    });                                                
```

是的，不用怀疑，就是这么简单，重要的事情说3遍

**任意请求，任意返回数据类型，皆遵循请求三部曲**

**任意请求，任意返回数据类型，皆遵循请求三部曲**

**任意请求，任意返回数据类型，皆遵循请求三部曲**

到这，你已经掌握了[RxHttp](https://github.com/liujingxing/RxHttp)的精髓，我们只需牢记请求三部曲，使用RxHttp就会得心应手。

### 3.3.1、第一部曲：确定请求类型

RxHttp内部共提供了14个请求方法，如下：

```java
RxHttp.get(String)              //get请求    参数拼接在url后面
RxHttp.head(String)             //head请求   参数拼接在url后面
RxHttp.postForm(String)         //post请求   参数以{application/x-www-form-urlencoded}形式提交
RxHttp.postJson(String)         //post请求   参数以{application/json; charset=utf-8}形式提交，发送Json对象
RxHttp.postJsonArray(String)    //post请求   参数以{application/json; charset=utf-8}形式提交，发送Json数组
RxHttp.putForm(String)          //put请求    参数以{application/x-www-form-urlencoded}形式提交
RxHttp.putJson(String)          //put请求    参数以{application/json; charset=utf-8}形式提交，发送Json对象
RxHttp.putJsonArray(String)     //put请求    参数以{application/json; charset=utf-8}形式提交，发送Json数组
RxHttp.patchForm(String)        //patch请求  参数以{application/x-www-form-urlencoded}形式提交
RxHttp.patchJson(String)        //patch请求  参数以{application/json; charset=utf-8}形式提交，发送Json对象
RxHttp.patchJsonArray(String)   //patch请求  参数以{application/json; charset=utf-8}形式提交，发送Json数组
RxHttp.deleteForm(String)       //delete请求 参数以{application/x-www-form-urlencoded}形式提交
RxHttp.deleteJson(String)       //delete请求 参数以{application/json; charset=utf-8}形式提交，发送Json对象
RxHttp.deleteJsonArray(String)  //delete请求 参数以{application/json; charset=utf-8}形式提交，发送Json数组
```

以上14个请求方法你会发现，其实就6个类型，分别对应是Get、Head、Post、Put、Patch、Delete方法，只是其中Post、Put、Patch、Delete各有3个方法有不同形式的提交方式，只需要根据自己的需求选择就好。

如以上方法还不能满足你的需求，我们还可以通过`@Param`注解自定义请求方法，有关注解的使用，本文后续会详细介绍。

`注：当调用xxxForm方法发送请求时，通过setMultiForm()方法或者调用addFile(String, File)添加文件时，内部会自动将参数以{multipart/form-data}方式提交`

**添加参数/请求头**

确定请求方法后，我们就可以调用一系列`addXxx()`方法添加参数/请求头，如下：

```java
RxHttp.get("/service/...")       //发送get请求
    .add("key", "value")         //添加参数
    .addAll(new HashMap<>())     //通过Map添加多个参数
    .addHeader("deviceType", "android")     //添加请求头
    ...
```

任意请求，都可调用以上3个方法添加参数/请求头，当然，在不同的请求方式下，也会有不同的addXxx方法供开发者调用。如下：

```java
//postJson请求方法下会有更多addAll等方法可供调用
RxHttp.postJson("/service/...") //发送post Json请求
    .addAll(new JsonObject())   //通过json对象添加多个参数
    .addAll("{\"height\":180,\"weight\":70}") //通过json字符串添加多个参数
    ...

//postForm请求方法下会有一系列addFile方法可供调用
RxHttp.postForm("/service/...")  //发送post表单请求
    .addFile("file", new File("xxx/1.png")) //添加单个文件
    .addFile("fileList", new ArrayList<>()) //添加多个文件
    ...
```

以上只列出了几个常用的addXxx方法，更多方法请下载源码体验。

### 3.3.2、第二部曲：确定返回数据类型

添加好参数/请求头后，正式进入第二部曲，确定返回数据类型，我们通过`asXxx`方法确定返回类型，比如，我们要返回一个Student对象，就可以通过`asObject(Class<T>)`方法，如下：

```java
RxHttp.postForm("/service/...")  //发送post表单请求
    .add("key", "value")         //添加参数，可调用多次
    .asObject(Student.class)    //返回Student类型
    .subscribe(student -> {   
        //请求成功，这里就能拿到 Student对象               
    }, throwable -> {         
        //请求失败                
    });    
```

如果要返回Student对象列表，则可以通过`asList(Class<T>)`方法，如下：

```java
RxHttp.postForm("/service/...")  //发送post表单请求
    .add("key", "value")         //添加参数，可调用多次
    .asList(Student.class)       //返回List<Student>类型
    .subscribe(students -> {   
        //请求成功，这里就能拿到 Student对象列表               
    }, throwable -> {         
        //请求失败                
    });    
```

**解析`Response<T>`类型数据**

然而，现实开发中，大多数人的接口，返回的数据结构都类似下面的这个样子

```java
public class Response<T> {
    private int    code;
    private String msg;
    private T      data;
    //这里省略get、set方法
}
```

对于这种数据结构，按传统的写法，每次都要对code做判断，如果有100个请求，就要判断100次，真的会逼死强迫症患者。

RxHttp对于这种情况，给出完美的答案，比如`Response<T>`里面的T代表一个Student对象，则可以通过`asResponse(Class<T>)`方法获取，如下：

```java
RxHttp.postForm("/service/...")   //发送post表单请求
    .add("key", "value")          //添加参数，可调用多次
    .asResponse(Student.class)    //返回Student类型
    .subscribe(student -> {   
        //请求成功，这里能拿到 Student对象               
    }, throwable -> {         
        //请求失败                
    });    
```

如果`Response<T>`里面的T代表一个`List<Student>`列表对象，则可以通过`asResponseList(Class<T>)`方法获取，如下

```java
RxHttp.postForm("/service/...")   //发送post表单请求
    .add("key", "value")          //添加参数，可调用多次
    .asResponseList(Student.class)    //返回List<Student>类型
    .subscribe(students -> {   
        //请求成功，这里能拿到List<Student>列表对象               
    }, throwable -> {         
        //请求失败                
    });    
```

更多时候，我们的列表数据是分页的，类似下面的数据结构

```java
{
    "code": 0,
    "msg": "",
    "data": {
        "totalPage": 0,
        "list": []
    }
}
```

此时，调用RxHttp的`asResponsePageList(Class<T>)`方法依然可以完美解决，如下：

```java
RxHttp.postForm("/service/...")   //发送post表单请求
    .add("key", "value")          //添加参数，可调用多次
    .asResponsePageList(Student.class)    //返回PageList<Student>类型
    .subscribe(pageList -> {   
        //请求成功，这里能拿到PageList<Student>列表对象 
       int totalPage = pageList.getTotalPage();   //总页数
       List<Student> students = pageList.getData();  //单页列表数据        
    }, throwable -> {         
        //请求失败                
    });    
```

到这，估计很多人会问我：

- 你的code在哪里判断的？
- 我的code是100或者其它值才代表正确，怎么改？
- 我的`Response<T>`类里面的字段名，跟你的都不一样，怎么该？
- 你这成功的时候直接返回`Response<T>`里面的T，那我还要拿到code做其他的判断，执行不同业务逻辑，怎么办？

这里可以先告诉大家，`asResponse(Class<T>)`、`asResponseList(Class<T>)`、`asResponsePageList(Class<T>)`这3个方法并不是RxHttp内部提供的，而是通过自定义解析器生成，里面的code判断、`Response<T>`类都是开发者自定义的，如何自定义解析器，请查看本文5.1章节----自定义Parser。

接着回答第4个问题，如何拿到code做其他的业务逻辑判断，很简单，我们只需用`OnError`接口处理错误回调即可，如下：

```java
RxHttp.postForm("/service/...")   //发送post表单请求
    .add("key", "value")          //添加参数，可调用多次
    .asResponse(Student.class)    //返回Student类型
    .subscribe(student -> {   
        //请求成功，这里能拿到 Student对象               
    }, (OnError) error -> {     //注意，这里要用OnError接口，其中error是一个ErrorInfo对象  
        //失败回调
        //拿到code字段，此时就可以对code做判断，执行不同的业务逻辑 
        int code = error.getErrorCode();     
        String errorMsg = error.getErrorMsg()  //拿到msg字段             
    });    
```

`注：上面的OnError接口并非是RxHttp内部提供的，而是自定义的，在Demo里可以找到`

以上介绍的5个asXxx方法，可以说基本涵盖80%以上的业务场景，接下来我们看看RxHttp都提供了哪些asXxx方法，如下：![](https://asset.droidyue.com/image/2019_12/rxhttp_as_methods.png)
RxHttp内部共提供了`23`个`asXXX`方法，其中：

- 有7个是返回基本类型的包装类型，如：asInteger、asBoolean、asLong等等；
- 还有7个是返回对象类型，如：asString、asBitmap、asList、asMap(3个)以及最常用`asObject`方法；
- 剩下9个是`asParser(Parser<T>)`、    `asUpload`系列方法及`asDownload`系列方法。

duang、duang、duang !!! 划重点，这里我可以告诉大家，其实前面的14个方法，最终都是通过`asParser(Parser<T>)`方法实现的，具体实现过程，这里先跳过，后续会详细讲解。

### 3.3.3、第三部曲：订阅回调

这一步就很简单了，在第二部曲中，asXxx方法会返回`Observable<T>`对象，没错，就是RxJava内部的`Observable<T>`对象，此时我们便可通过`subscribe`系列方法订阅回调，如下：

```java
//不处理任何回调
RxHttp.postForm("/service/...")   //发送post表单请求
    .add("key", "value")          //添加参数，可调用多次
    .asResponseList(Student.class)    //返回List<Student>类型
    .subscribe();    //不订阅任何回调

//仅订阅成功回调
RxHttp.postForm("/service/...")   //发送post表单请求
    .add("key", "value")          //添加参数，可调用多次
    .asResponseList(Student.class)    //返回List<Student>类型
    .subscribe(students -> {   
        //请求成功，这里能拿到List<Student>列表对象               
    });    

//订阅成功与失败回调
RxHttp.postForm("/service/...")   //发送post表单请求
    .add("key", "value")          //添加参数，可调用多次
    .asResponseList(Student.class)    //返回List<Student>类型
    .subscribe(students -> {   
        //请求成功，这里能拿到List<Student>列表对象               
    }, throwable -> {         
        //请求失败                
    });

//等等，省略
```

另外，我们还可以订阅请求开始/结束的回调，如下：

```java
RxHttp.get("/service/...")
    .asString()
    .observeOn(AndroidSchedulers.mainThread())
    .doOnSubscribe(disposable -> {
        //请求开始，当前在主线程回调
    })
    .doFinally(() -> {
        //请求结束，当前在主线程回调
    })
    .as(RxLife.as(this))  //感知生命周期
    .subscribe(pageList -> {
        //成功回调，当前在主线程回调
    }, (OnError) error -> {
        //失败回调，当前在主线程回调
    });
```

到这，请求三部曲介绍完毕，接着，将介绍其它常用的功能

## 3.4、初始化

```java
//设置debug模式，默认为false，设置为true后，发请求，过滤"RxHttp"能看到请求日志
RxHttp.setDebug(boolean debug)
//非必须,只能初始化一次，第二次将抛出异常
RxHttp.init(OkHttpClient okHttpClient)
//或者，调试模式下会有日志输出
RxHttp.init(OkHttpClient okHttpClient, boolean debug)
```

此步骤是非必须的，如需要添加拦截器等其他业务需求，则可调用`init`方法进行初始化，不初始化或者传入`null`即代表使用默认OkHttpClient对象，建议在Application中初始化，默认的OkHttpClient对象在HttpSender类中可以找到，如下：

```java
private static OkHttpClient getDefaultOkHttpClient() {                              
    X509TrustManager trustAllCert = new X509TrustManagerImpl();                     
    SSLSocketFactory sslSocketFactory = new SSLSocketFactoryImpl(trustAllCert);     
    return new OkHttpClient.Builder()                                               
        .connectTimeout(10, TimeUnit.SECONDS)                                       
        .readTimeout(10, TimeUnit.SECONDS)                                          
        .writeTimeout(10, TimeUnit.SECONDS)                                         
        .sslSocketFactory(sslSocketFactory, trustAllCert) //添加信任证书                  
        .hostnameVerifier((hostname, session) -> true) //忽略host验证                   
        .build();                                                                   
}                                                                                   
```

虽然初始化是非必须的，但是建议大家传入自定义的OkHttpClient对象，一来，自定义的OkHttpClient能最大化满足自身的业务；二来，随着RxHttp版本的升级，默认的OkHttpClient可能会发生变化(虽然可能性很小)，故建议自定义OkHttpClient对象传入RxHttp。

## 3.5、公共参数/请求头

RxHttp支持为所有的请求添加公共参数/请求头，当然，如果你希望某个请求不添加公共参数/请求头，也是支持的，而且非常简单。如下：

```java
RxHttp.setOnParamAssembly(new Function() {
    @Override
    public Param apply(Param p) { //此方法在子线程中执行，即请求发起线程
        Method method = p.getMethod();
        if (method.isGet()) {     //可根据请求类型添加不同的参数
        } else if (method.isPost()) {
        }
        return p.add("versionName", "1.0.0")//添加公共参数
                .addHeader("deviceType", "android"); //添加公共请求头
    }
});
```

我们需要调用`RxHttp.setOnParamAssembly(Function)`方法，并传入一个Function接口对象，每次发起请求，都会回调该接口。

当然，如果希望某个请求不回调该接口，即不添加公共参数/请求头，则可以调用`setAssemblyEnabled(boolean)`方法，并传入false即可，如下：

```java
RxHttp.get("/service/...")       //get请求 
    .setAssemblyEnabled(false)   //设置是否添加公共参数/头部，默认为true    
    .asString()                  //返回字符串数据    
    .subscribe(s -> {            //这里的s为String类型
        //请求成功                                         
    }, throwable -> {                                  
        //请求失败                                         
    });                                                
```

## 3.6、多域名/动态域名

**3.6.1、多域名**

现实开发中，我们经常会遇到多个域名的情况，其中1个为默认域名，其它为非默认域名，对于这种情况，RxHttp提供了`@DefaultDomain()`、`@Domain()`这两个注解来标明默认域名和非默认域名，如下：

```java
public class Url {
    @DefaultDomain() //设置为默认域名
    public static String baseUrl = "https://www.wanandroid.com/"

    @Domain(name = "BaseUrlBaidu") //非默认域名，并取别名为BaseUrlBaidu
    public static String baidu = "https://www.baidu.com/";

    @Domain(name = "BaseUrlGoogle") //非默认域名，并取别名为BaseUrlGoogle
    public static String google = "https://www.google.com/";
}
```

通过`@Domain()`注解标注非默认域名，就会在RxHttp类中生成`setDomainToXxxIfAbsent()`方法，其中Xxx就是注解中取的别名。

上面我们使用了两个`@Domain()`注解，此时(需要Rebuild一下项目)就会在RxHttp类中生成`setDomainToBaseUrlBaiduIfAbsent()`、`setDomainToBaseUrlGoogleIfAbsent()`这两方法，此时发请求，我们就可以使用指定的域名，如下：

```java
//使用默认域名，则无需添加任何额外代码
//此时 url = "https://www.wanandroid.com/service/..." 
RxHttp.get("/service/...")
    .asString()  
    .subscribe();

//手动输入域名，此时 url = "https://www.mi.com/service/..."
RxHttp.get("https://www.mi.com/service/...")
    .asString()  
    .subscribe();

//手动输入域名时，若再次指定域名，则无效
//此时 url = "https://www.mi.com/service/..."
RxHttp.get("https://www.mi.com/service/...")
    .setDomainToBaseUrlBaiduIfAbsent()  //此时指定Baidu域名无效
    .asString()  
    .subscribe();

//使用谷歌域名，此时 url = "https://www.google.com/service/..."       
RxHttp.get("/service/...")
    .setDomainToBaseUrlGoogleIfAbsent() //指定使用Google域名
    .asString()  
    .subscribe();
```

通过以上案例，可以知道，RxHttp共有3种指定域名的方式，按优先级排名分别是：手动输入域名 > 指定非默认域名 > 使用默认域名。

**3.6.2、动态域名**

现实开发中，也会有动态域名切换的需求，如域名被封、或者需要根据服务端下发的域名去配置，这对于RxHttp来说简直就是 so easy !!! 我们只需要对BaseUrl重新赋值，此时发请求便会立即生效，如下：

```java
//此时 url = "https://www.wanandroid.com/service/..."
RxHttp.get("/service/...")
    .asString()  
    .subscribe();

Url.baseUrl = "https://www.qq.com"; //动态更改默认域名，改完立即生效，非默认域名同理
//此时 url = "https://www.qq.com/service/..."
RxHttp.get("/service/...")
    .asString()  
    .subscribe();
```

## 3.7、关闭请求

我们知道，在Activity/Fragment中发起请求，如果页面销毁时，请求还未结束，就会有内存泄漏的危险，因此，我们需要在页面销毁时，关闭一些还未完成的请求，RxHttp提供了两种关闭请求的方式，分别是自动+手动。

**3.7.1、自动关闭请求**

自动关闭请求，需要引入本人开源的另一个库[RxLife](https://github.com/liujingxing/RxLife)，先来看看如何用：

```java
//以下代码均在FragmentActivty/Fragment中调用

RxHttp.postForm("/service/...")
    .asString()
    .as(RxLife.as(this)) //页面销毁、自动关闭请求
    .subscribe();
    //或者
RxHttp.postForm("/service/...")
    .asString()
    .as(RxLife.asOnMain(this)) //页面销毁、自动关闭请求 并且在主线程回调观察者
    .subscribe();

//kotlin用户，请使用life或lifeOnMain方法，如下：
RxHttp.postForm("/service/...")
    .asString()
    .life(this) //页面销毁、自动关闭请求
    .subscribe();
    //或者
RxHttp.postForm("/service/...")
    .asString()
    .lifeOnMain(this) //页面销毁、自动关闭请求 并且在主线程回调观察者
    .subscribe();
```

上面的`this`为`LifecycleOwner`接口对象，我们的FragmentActivity/Fragment均实现了这个接口，所有我们在FragmentActivity/Fragment中可以直接传`this`。
对`RxLife`不了解的同学请查看[RxLife 史上最优雅的管理RxJava生命周期](https://juejin.im/post/5cf3e1235188251c064815f1)，这里不详细讲解。

**3.7.2、手动关闭请求**

手动关闭请求，我们只需要在订阅回调的时候拿到Disposable对象，通过该对象可以判断请求是否结束，如果没有，就可以关闭请求，如下：

```java
//订阅回调，可以拿到Disposable对象
Disposable disposable = RxHttp.get("/service/...")
    .asString()  
    .subscribe(s -> { 
       //成功回调
    }, throwable -> {
       //失败回调
    });

if (!disposable.isDisposed()) {  //判断请求有没有结束
    disposable.dispose();       //没有结束，则关闭请求
}                              
```

## 3.8、文件上传/下载/进度监听

RxHttp可以非常优雅的实现上传/下载及进度的监听，是骡子是马，拉出来溜溜

**3.8.1上传**

通过addFile系列方法添加文件，如下：

```java
RxHttp.postForm("/service/...") //发送Form表单形式的Post请求  
    .addFile("file1", new File("xxx/1.png"))  //添加单个文件      
    .addFile("fileList", new ArrayList<>())   //通过List对象，添加多个文件     
    .asString()                                      
    .subscribe(s -> {                              
        //上传成功                                     
    }, throwable -> {                              
        //上传失败                                     
    });                                            
```

通过asUpload系列方法监听上传进度，如下:

```java
RxHttp.postForm("/service/...") //发送Form表单形式的Post请求                                    
    .addFile("file1", new File("xxx/1.png"))                                         
    .addFile("file2", new File("xxx/2.png"))                                         
    .asUpload(progress -> {                                                          
        //上传进度回调,0-100，仅在进度有更新时才会回调                                                  
        int currentProgress = progress.getProgress(); //当前进度 0-100                   
        long currentSize = progress.getCurrentSize(); //当前已上传的字节大小                   
        long totalSize = progress.getTotalSize();     //要上传的总字节大小                    
    }, AndroidSchedulers.mainThread())   //指定回调(进度/成功/失败)线程,不指定,默认在请求所在线程回调                                           
    .subscribe(s -> {                                                                
        //上传成功                                                                       
    }, throwable -> {                                                                
        //上传失败                                                                       
    });                                                                              
```

可以看到，跟上传的代码相比，我们仅仅是使用了`asUpload(Consumer, Scheduler)`方法替换`asString()`方法，第一个参数是进度监听接口，每当进度有更新时，都会回调该接口，第二个参数是指定回调的线程，这里我们指定了在UI线程中回调。

**3.8.2、下载**

下载使用`asDownload(String)`方法，传入本地路径即可

```java
  //文件存储路径
String destPath = getExternalCacheDir() + "/" + System.currentTimeMillis() + ".apk";
RxHttp.get("http://update.9158.com/miaolive/Miaolive.apk")
    .asDownload(destPath) //注意这里使用asDownload操作符，并传入本地路径
    .subscribe(s -> {
        //下载成功,回调文件下载路径
    }, throwable -> {
        //下载失败
    });
```

**3.8.3、带进度下载**

带进度下载使用`asDownload(String,Consumer,Scheduler)`方法

```java
  //文件存储路径
String destPath = getExternalCacheDir() + "/" + System.currentTimeMillis() + ".apk";
RxHttp.get("http://update.9158.com/miaolive/Miaolive.apk")
    .asDownload(destPath, progress -> {
        //下载进度回调,0-100，仅在进度有更新时才会回调，最多回调101次，最后一次回调文件存储路径
        int currentProgress = progress.getProgress(); //当前进度 0-100
        long currentSize = progress.getCurrentSize(); //当前已下载的字节大小
        long totalSize = progress.getTotalSize();     //要下载的总字节大小
    }, AndroidSchedulers.mainThread()) //指定主线程回调
    .subscribe(s -> {//s为String类型，这里为文件存储路径
        //下载完成，处理相关逻辑
    }, throwable -> {
        //下载失败，处理相关逻辑
    });
```

**3.8.4、断点下载**

`断点下载`相较于`下载`，仅需要调用`setRangeHeader(long startIndex, long endIndex)`方法传入开始及结束位置即可（结束位置不传默认为文件末尾），其它没有任何差别

```java
String destPath = getExternalCacheDir() + "/" + "Miaobo.apk";
long length = new File(destPath).length(); //已下载的文件长度
RxHttp.get("http://update.9158.com/miaolive/Miaolive.apk")
    .setRangeHeader(length)  //设置开始下载位置，结束位置默认为文件末尾
    .asDownload(destPath)
    .subscribe(s -> { //s为String类型
        //下载成功，处理相关逻辑
    }, throwable -> {
        //下载失败，处理相关逻辑
    });
```

**3.8.5、带进度断点下载**

`带进度断点下载`相较于`带进度下载`仅需要调用`setRangeHeader`方法传入开始及结束位置即可（结束位置不传默认为文件末尾），其它没有任何差别

```java
String destPath = getExternalCacheDir() + "/" + "Miaobo.apk";
long length = new File(destPath).length(); //已下载的文件长度
RxHttp.get("http://update.9158.com/miaolive/Miaolive.apk")
    .setRangeHeader(length)  //设置开始下载位置，结束位置默认为文件末尾
    .asDownload(destPath, progress -> {
        //下载进度回调,0-100，仅在进度有更新时才会回调
        int currentProgress = progress.getProgress(); //当前进度 0-100
        long currentSize = progress.getCurrentSize(); //当前已下载的字节大小
        long totalSize = progress.getTotalSize();     //要下载的总字节大小
    }, AndroidSchedulers.mainThread()) //指定主线程回调
    .subscribe(s -> { //s为String类型
        //下载成功，处理相关逻辑
    }, throwable -> {
        //下载失败，处理相关逻辑
    });
```

`注：`上面带进度断点下载中，返回的进度会从0开始，如果需要衔接上次下载的进度，则调用`asDownload(String,long,Consumer,Scheduler)`方法传入上次已经下载好的长度(第二个参数)，如下：

```java
String destPath = getExternalCacheDir() + "/" + "Miaobo.apk";
long length = new File(destPath).length(); //已下载的文件长度
RxHttp.get("http://update.9158.com/miaolive/Miaolive.apk")
    .setRangeHeader(length)  //设置开始下载位置，结束位置默认为文件末尾
    .asDownload(destPath, length, progress -> {
        //下载进度回调,0-100，仅在进度有更新时才会回调
        int currentProgress = progress.getProgress(); //当前进度 0-100
        long currentSize = progress.getCurrentSize(); //当前已下载的字节大小
        long totalSize = progress.getTotalSize();     //要下载的总字节大小
    }, AndroidSchedulers.mainThread()) //指定主线程回调
    .subscribe(s -> { //s为String类型
        //下载成功，处理相关逻辑
    }, throwable -> {
        //下载失败，处理相关逻辑
    });
```

## 3.9、超时设置

**3.9.1、设置全局超时**

RxHttp内部默认的读、写、连接超时时间均为10s，如需修改，请自定义OkHttpClient对象，如下：

```java
//设置读、写、连接超时时间为15s
OkHttpClient client = new OkHttpClient.Builder()
    .connectTimeout(15, TimeUnit.SECONDS)
    .readTimeout(15, TimeUnit.SECONDS)
    .writeTimeout(15, TimeUnit.SECONDS)
    .build();
RxHttp.init(client);
```

**3.9.2、为单个请求设置超时**

为单个请求设置超时，使用的是RxJava的`timeout(long timeout, TimeUnit timeUnit)`方法，如下：

```java
RxHttp.get("/service/...")
    .asString()
    .timeout(5, TimeUnit.SECONDS)//设置总超时时间为5s
    .as(RxLife.asOnMain(this))  //感知生命周期，并在主线程回调
    .subscribe(pageList -> {
        //成功回调
    }, (OnError) error -> {
        //失败回调
    });
```

**注：这里设置的总超时时间要小于全局读、写、连接超时时间之和，否则无效**

## 3.10、设置Converter

**3.10.1、设置全局Converter**

```java
IConverter converter = FastJsonConverter.create();
RxHttp.setConverter(converter)
```

**3.10.2、为请求设置单独的Converter**

首先需要在任意public类中通过@Converter注解声明Converter，如下：

```java
public class RxHttpManager {
    @Converter(name = "XmlConverter") //指定Converter名称
    public static IConverter xmlConverter = XmlConverter.create();
}
```

然后，rebuild 一下项目，就在自动在RxHttp类中生成`setXmlConverter()`方法，随后就可以调用此方法为单个请求指定Converter，如下：

```java
RxHttp.get("/service/...")
    .setXmlConverter()   //指定使用XmlConverter，不指定，则使用全局的Converter
    .asObject(NewsDataXml.class)
    .as(RxLife.asOnMain(this))  //感知生命周期，并在主线程回调
    .subscribe(dataXml -> {
        //成功回调
    }, (OnError) error -> {
        //失败回调
    });
```

## 3.11、请求加解密

**3.11.1、加密**

请求加密，需要自定义Param，非常简单，详情请查看本文5.2章节----自定义Param

**3.11.2、解密**

有些时候，请求会返回一大串的密文，此时就需要将密文转化为明文，直接来看代码，如下：

```java
//设置数据解密/解码器                                               
RxHttp.setResultDecoder(new Function<String, String>() {
    //每次请求成功，都会回调这里，并传入请求返回的密文   
    @Override                                              
    public String apply(String s) throws Exception {   
        String plaintext = decode(s);   //将密文解密成明文，解密逻辑自己实现
        return plaintext;    //返回明文                                   
    }                                                      
});                                                        
```

很简单，通过`RxHttp.setResultDecoder(Function<String, String>)`静态方法，传入一个接口对象，此接口会在每次请求成功的时候被回调，并传入请求返回的密文，只需要将密文解密后返回即可。

然而，有些请求是不需求解密的，此时就可以调用`setDecoderEnabled(boolean)`方法，并传入false即可，如下：

```java
RxHttp.get("/service/...")
    .setDecoderEnabled(false)  //设置本次请求不需要解密，默认为true
    .asString()
    .subscribe(pageList -> {
        //成功回调
    }, (OnError) error -> {
        //失败回调
    });
```

## 3.12、指定请求/回调线程

RxHttp默认在Io线程执行请求，也默认在Io线程回调，即默认在同一Io线程执行请求并回调，当然，我们也可以指定请求/回调所在线程。

**3.12.1、指定请求所在线程**

我们可以调用一些列subscribeXxx方法指定请求所在线程，如下：

```java
//指定请求所在线程，需要在第二部曲前任意位置调用，第二部曲后调用无效
RxHttp.get("/service/...")
    .subscribeOnCurrent() //指定在当前线程执行请求，即同步执行，
    .asString()  
    .subscribe();

//其它subscribeXxx方法
subscribeOnIo()   //RxHttp默认的请求线程
subscribeOnSingle()
subscribeOnNewThread()
subscribeOnComputation()
subscribeOnTrampoline()
subscribeOn(Scheduler) //自定义请求线程
```

以上使用的皆是RxJava的线程调度器，不熟悉的请自行查阅相关资料，这里不做详细介绍。

**3.12.2、指定回调所在线程**

指定回调所在线程，依然使用RxJava的线程调度器，如下：

```java
//指定回调所在线程，需要在第二部曲后调用
RxHttp.get("/service/...")
    .asString()  
    .observeOn(AndroidSchedulers.mainThread()) //指定在主线程回调
    .subscribe(s -> { //s为String类型，主线程回调
        //成功回调
    }, throwable -> {
        //失败回调
    });
```

## 3.13、 Retrofit用户

时常会有童鞋问我，我是Retrofit用户，喜欢把接口写在一个类里，然后可以直接调用，RxHttp如何实现？其实，这个问题压根就不是问题，在介绍第二部曲的时候，我们知道，使用asXxx方法后，就会返回`Observable<T>`对象，因此，我们就可以这样实现：

```java
public class HttpWrapper {

    public static Observable<List<Student>> getStudent(int page) {
        return RxHttp.get("/service/...")
            .add("page", page)
            .asList(Student.class);
    }
}

//随后在其它地方就可以直接调用
HttpWrapper.getStudent(1)
    .as(RxLife.asOnMain(this))  //主线程回调，并在页面销毁自动关闭请求(如果还未关闭的话)
    .subscribe(students -> { //学生列表
        //成功回调
    }, throwable -> {
        //失败回调
    });
```

很简单，封装的时候返回`Observable<T>`对象即可。

还有的同学问，我们获取列表的接口，页码是和url拼接在一起的，Retrofit可以通过占位符，那RxHttp又如何实现？简单，如下：

```java
public class HttpWrapper {

    //单个占位符
    public static Observable<Student> getStudent(int page) {
        return RxHttp.get("/service/%d/...", page)  //使用标准的占位符协议
            .asObject(Student.class);
    }

    //多个占位符
    public static Observable<Student> getStudent(int page, int count) {
        return RxHttp.get("/service/%1$d/%2$d/...", page, count)  //使用标准的占位符协议
            .asObject(Student.class);
    }
}
```

这一点跟Retrofit不同，Retrofit是通过注解指定占位符的，而RxHttp是使用标准的占位符，我们只需要在url中声明占位符，随后在传入url的后面，带上对应的参数即可。

# 4、原理剖析

## 4.1、工作流程

在RxHttp有4个重要的角色，分别是：

- Param：RxHttp类中所有添加的参数/请求头/文件都交由它处理，它最终目的就是为了构建一个Request对象
- HttpSender ：它负责从Param对象中拿到Request对象，从而执行请求，最终返回Response对象
- Parser：它负责将HttpSender返回的Response对象，解析成我们期望的实体类对象，也就是泛型T
- RxHttp：它像一个管家，指挥前面3个角色做事情，当然，它也有自己的事情要做，比如：请求线程的调度，BaseUrl的处理、允许开发者自定义API等等

为此，我画了一个流程图，可以直观的了解到RxHttp的大致工作流程
![在这里插入图片描述](https://asset.droidyue.com/image/2019_12/rxhttp_workflow.png)

我想应该很好理解，RxHttp要做的事情，就是把添加的参数/请求头等全部丢给Param处理，自己啥事也不敢；随后将Param交给HttpSender，让它去执行请求，执行完毕，返回Response对象；接着又将Response对象丢给Parser去做数据解析工作，并返回实体类对象T；最后，将T通过回调传给开发者，到此，一个请求就处理完成。

## 4.2、Param

首先，附上一张Param类的继承关系图
![](https://asset.droidyue.com/image/2019_12/rxhttp_class_hierachy.png)
下面将从上往下对上图中的类做个简单的介绍：

- IHeaders：接口类，里面定义了一系列addHeader方法
- IParam：接口类，里面定义了add(String,Object)、addAll(Map)等方法，
- IRequest：接口类，里面定义了一系列getXxx方法，通过这些方法最终构建一个Request对象
- Param：接口类，是一个空接口，继承了前面3个接口，里面有一系列静态方法可以获取到Param的具体实现类
- AbstractParam：Param接口的抽象实现类，实现了Param接口的所有方法
- IFile：接口类，里面定义了一系列addFile方法
- IUploadLengthLimit：接口类，里面就定义了一个checkLength()方法，用于限制文件上传大小
- NoBodyParam：Param的具体实现类，Get、Head请求就是通过该类去实现的
- JsonParam：Param的具体实现类，调用RxHttp.xxxJson(String)请求方法时，内部就是通过该类去实现的
- JsonArrayParam：Param的具体实现类，调用RxHttp.xxxJsonArray(String)请求方法时，内部就是通过该类去实现的
- FormParam：Param的具体实现类，同时又实现了IFile、IUploadLengthLimit两个接口，调用RxHttp.xxxForm(String)请求方法时，内部就是通过该类去实现的

## 4.3、HttpSender

HttpSender可以把它理解为请求发送者，里面声明OkHttpClient对象和一系列静态方法，我们来简单看下：

```java
public final class HttpSender {

    private static OkHttpClient mOkHttpClient; //只能初始化一次,第二次将抛出异常
    //处理化OkHttpClient对象
    public static void init(OkHttpClient okHttpClient) {
        if (mOkHttpClient != null)
            throw new IllegalArgumentException("OkHttpClient can only be initialized once");
        mOkHttpClient = okHttpClient;
    }

    //通过Param对象同步执行一个请求
    public static Response execute(@NonNull Param param) throws IOException {
        return newCall(param).execute();
    }

    static Call newCall(Param param) throws IOException {
        return newCall(getOkHttpClient(), param);
    }
    //所有的请求，最终都会调此方法拿到Call对象，然后执行请求
    static Call newCall(OkHttpClient client, Param param) throws IOException {
        param = RxHttpPlugins.onParamAssembly(param);
        if (param instanceof IUploadLengthLimit) {
            ((IUploadLengthLimit) param).checkLength();
        }
        Request request = param.buildRequest();  //通过Param拿到Request对象
        LogUtil.log(request);
        return client.newCall(request);
    }

    //省略了部分方法
}
```

这里我们重点看下`newCall(OkHttpClient, Param)`方法，该方法第一行就是为Param添加公共参数；然后判断Param有没有实现IUploadLengthLimit接口，有的话，检查文件上传大小，超出大小，则抛出IO异常；接着就是通过Param拿到Request对象；最后拿到Call对象，就可以发送一个请求。

## 4.4、Parser

先看下Parser继承结构图
![在这里插入图片描述](https://asset.droidyue.com/image/2019_12/rxhttp_parser.png)
这里对上图中的类做个简单的介绍

- Parser：接口类，里面定义了一个`T onParse(Response)`方法，输入Response对象，输出实体类对象T
- AbstractParser：抽象类，里面没有任何具体实现，主要作用是在构造方法内获取泛型类型
- SimpleParser：是一个万能的解析器，可以解析任意数据结构，RxHttp内置的大部分asXxx方法，内部就是通过该解析器实现的
- ListParser：是一个列表解析器，可以解析任意列表数据，内置`asList(Class<T>)`方法，就是通过该解析器实现的
- MapParser：是一个Map解析器，可以解析任意Map数据类型，内置的asMap系列方法，就是通过该解析器实现的
- BitmapParser：是一个Bitmap解析器，通过该解析器可以获得一个Bitmap对象，asBitmap()方法内部就是通过该解析器实现的
- DownloadParser：文件下载解析器，用于文件下载，内置的一系列asDownload方法就是通过该解析器实现的

# 5、扩展

## 5.1、自定义Parser

前面第二部曲中，我们介绍了一系列asXxx方法，通过该系列方法可以很方便的指定数据返回类型，特别是自定义的`asResponse(Class<T>)`、`asResponseList(Class<T>)`、`asResponsePageList(Class<T>)`这3个方法，将`Reponse<T>`类型数据，处理的简直不要太完美，下面我们就来看看如何自定义Parser。

源码永远是最好的学习方式，在学习自定义Parser前，我们不妨先看看内置的Parser是如何实现的

**SimPleParser**

```java
public class SimpleParser<T> extends AbstractParser<T> {

    //省略构造方法
    @Override
    public T onParse(Response response) throws IOException {
        return convert(response, mType);
    }
}
```

可以看到，SimpleParser除了构造方法，就剩一个onParser方法，该方法是在Parser接口中定义的，再来看看具体的实现`convert(Response, Type)`，这个方法也是在Parser接口中定义的，并且有默认的实现，如下：

```java
public interface Parser<T> {

    //输入Response 输出T
    T onParse(@NonNull Response response) throws IOException;

    //对Http返回的结果，转换成我们期望的实体类对象
    default <R> R convert(Response response, Type type) throws IOException {
        ResponseBody body = ExceptionHelper.throwIfFatal(response);  //这里内部会判断code<200||code>=300 时，抛出异常
        boolean onResultDecoder = isOnResultDecoder(response); //是否需要对返回的数据进行解密
        LogUtil.log(response, onResultDecoder, null);
        IConverter converter = getConverter(response);        //取出转换器
        return converter.convert(body, type, onResultDecoder); //对数据进场转换
    }
    //省略若干方法
}
```

可以看到，非常的简单，输入Response对象和泛型类型Type，内部就通过IConverter接口转换为我们期望的实体类对象并返回。

到这，我想大家应该就多少有点明白了，自定义Parser，无非就是继承AbstractParser，然后实现onParser方法即可，那我们来验证一下，我们来看看内置ListParser是不是这样实现的，如下：

```java
public class ListParser<T> extends AbstractParser<List<T>> {

    //省略构造方法
    @Override
    public List<T> onParse(Response response) throws IOException {
        final Type type = ParameterizedTypeImpl.get(List.class, mType); //拿到泛型类型
        return convert(response, type);
    }
}
```

可以看到，跟SimpleParser解析器几乎是一样的实现，不同是的，这里将我们输入的泛型T与List组拼为一个新的泛型类型，最终返回`List<T>`对象。

现在，我们就可以来自定义Parser了，先来自定义ResponseParser，用来处理`Response<T>`数据类型，先看看数据结构:

```java
public class Response<T> {
    private int    code;
    private String msg;
    private T      data;
    //这里省略get、set方法
}
```

自定义ResponseParser代码如下：

```java
//通过@Parser注解，为解析器取别名为Response，此时就会在RxHttp类生成asResponse(Class<T>)方法
@Parser(name = "Response") 
public class ResponseParser<T> extends AbstractParser<T> {

    //省略构造方法
    @Override
    public T onParse(okhttp3.Response response) throws IOException {
        final Type type = ParameterizedTypeImpl.get(Response.class, mType); //获取泛型类型
        Response<T> data = convert(response, type);
        T t = data.getData(); //获取data字段
        if (data.getCode() != 0 || t == null) {//这里假设code不等于0，代表数据不正确，抛出异常
            throw new ParseException(String.valueOf(data.getCode()), data.getMsg(), response);
        }
        return t;
    }
}
```

可以看到，非常的简单，首先将我们输入泛型和自定义的`Response<T>`类组拼成新的泛型类型，随后通过`convert(Response, Type)`方法得到`Response<T>`对象，接着又对code及T做了判断，如果不正确就抛出异常，最后返回T。

估计这里有人会问，我怎么用这个解析器呢？相信不少小伙伴以及发现了，我们在ResponseParser类名上面用了`@Parser`注解，只要用了该注解，就会在RxHttp自动生成`asXxx(Class<T>)`方法，其中Xxx就是我们在`@Parser`注解中为解析器取的别名，这里取别名为Response，所以便会在RxHttp类中自动生成`asResponse(Class<T>)`方法，如下：

```java
  public <T> Observable<T> asResponse(Class<T> type) {
    return asParser(new ResponseParser(type));
  }
```

可以看到，该方法内部又调用了`asParser(Parser<T>)`方法，并传入了ResponseParser，因此，我们有两种方式使用自定义的ResponseParser，如下：

```java
//第一种方式，使用@parser注解生成的asResponse方法
RxHttp.postForm("/service/...")   //发送post表单请求
    .add("key", "value")          //添加参数，可调用多次
    .asResponse(Student.class)    //返回Student类型
    .subscribe(student -> {   
        //请求成功，这里能拿到 Student对象               
    }, throwable -> {         
        //请求失败                
    });   

//第二种方式，直接使用asParser(Parser<T>)方法
RxHttp.postForm("/service/...")   //发送post表单请求
    .add("key", "value")          //添加参数，可调用多次
    .asParser(new ResponseParser<Student>(){})    //返回Student类型
    .subscribe(student -> {   
        //请求成功，这里能拿到 Student对象               
    }, throwable -> {         
        //请求失败                
    });  
```

以上两种方式，除了写法上的区别，其它都一样，用哪种，看个人喜好，但还是建议使用第一种方式，不仅写法简单，也降低了耦合。

这里最后再贴上ResponseListParser、ResponsePageListParser的源码，原理都是一样的，代码实现也差不多，就不再详解
**ResponseListParser**

```java
@Parser(name = "ResponseList")
public class ResponseListParser<T> extends AbstractParser<List<T>> {

    //省略构造方法
    @Override
    public List<T> onParse(okhttp3.Response response) throws IOException {
        final Type type = ParameterizedTypeImpl.get(Response.class, List.class, mType); //获取泛型类型
        Response<List<T>> data = convert(response, type);
        List<T> list = data.getData(); //获取data字段
        if (data.getCode() != 0 || list == null) {  //code不等于0，说明数据不正确，抛出异常
            throw new ParseException(String.valueOf(data.getCode()), data.getMsg(), response);
        }
        return list;
    }
}
```

**ResponsePageListParser**

```java
@Parser(name = "ResponsePageList")
public class ResponsePageListParser<T> extends AbstractParser<PageList<T>> {

    //省略构造方法
    @Override
    public PageList<T> onParse(okhttp3.Response response) throws IOException {
        final Type type = ParameterizedTypeImpl.get(Response.class, PageList.class, mType); //获取泛型类型
        Response<PageList<T>> data = convert(response, type);
        PageList<T> pageList = data.getData(); //获取data字段
        if (data.getCode() != 0 || pageList == null) {  //code不等于0，说明数据不正确，抛出异常
            throw new ParseException(String.valueOf(data.getCode()), data.getMsg(), response);
        }
        return pageList;
    }
}
```

## 5.2、自定义Param

自定义Param，想较于自定义Parser，要更加的简单，我们只需根据自己的需求，继承NoBodyParam、FormParam、JsonParam等，增加或者重写方法即可，比如我们有以下3种情况，需要自定义Param，如下：

- postForm请求，需要将所有添加的参数，拼接在一起，随后加密，最后将加密的字符串添加到请求头中
- postJson请求，需要将所有的参数，也就是json字符串加密后再发送出去
- FormParam里面的API不够用，我要自定义API

#### 5.2.1、postForm请求加密

这种情况，我们需要继承FormParam，并重写getRequestBody()方法，如下：

```java
@Param(methodName = "postEncryptForm")
public class PostEncryptFormParam extends FormParam {

    public PostEncryptFormParam(String url) {
        super(url, Method.POST);  //Method.POST代表post请求
    }

    @Override
    public RequestBody getRequestBody() {
        //这里拿到你添加的所有参数
        List<KeyValuePair> keyValuePairs = getKeyValuePairs();
        String encryptStr = "加密后的字符串";  //根据上面拿到的参数，自行实现加密逻辑
        addHeader("encryptStr", encryptStr);
        return super.getRequestBody();
    }
}
```

#### 5.2.2、postJson请求加密

这种情况，我们需要继承JsonParam，也重写getRequestBody()方法，如下：

```java
@Param(methodName = "postEncryptJson")
public class PostEncryptJsonParam extends JsonParam {

    public PostEncryptFormParam(String url) {
        super(url, Method.POST);
    }

    @Override
    public RequestBody getRequestBody() {
        //这里拿到你添加的所有参数
        Map<String, Object> params = getParams();
        String encryptStr = "加密后的字符串";  //根据上面拿到的参数，自行实现解密逻辑
        return RequestBody.create(MEDIA_TYPE_JSON, encryptStr);  //发送加密后的字符串
    }
}
```

#### 5.2.3、自定义API

我们继承FormParam，并新增两个test方法`，如下：

```java
@Param(methodName = "postTestForm")
public class PostTestFormParam extends FormParam {

    public PostEncryptFormParam(String url) {
        super(url, Method.POST);
    }

    public PostEncryptFormParam test(long a, float b) {
        //这里的业务逻辑自行实现
        return this;
    }

    public PostEncryptFormParam test1(String s, double b) {
        //这里的业务逻辑自行实现
        return this;
    }
}
```

#### 5.2.4、使用自定义的Param

同样的问题，我们怎么用这3个自定义的Param呢？我想大多数人在类名前发现类`@Param`注解，并为Param取了别名。那这个又有什么作用呢？
答案揭晓，只要在自定的Param上使用了`@Param`注解，并取了别名，就会在RxHttp类自动生成一个跟别名一样的方法，在上面我们自定义了3个Param，并分别取别名为postEncryptForm、postEncryptJson、postTestForm，此时就会在RxHttp类中生成`postEncryptForm(String)`、`postEncryptJsonString)`、`postTestForm(String)`这3个方法，我们在RxHttp这个类中来看下：

```java
  public static RxHttp$PostEncryptFormParam postEncryptForm(String url) {
    return new RxHttp$PostEncryptFormParam(new PostEncryptFormParam(url));
  }

  public static RxHttp$PostEncryptJsonParam postEncryptJson(String url) {
    return new RxHttp$PostEncryptJsonParam(new PostEncryptJsonParam(url));
  }

  public static RxHttp$PostTestFormParam postTestForm(String url) {
    return new RxHttp$PostTestFormParam(new PostTestFormParam(url));
  }
```

发请求时，只需要调用对应的方法就好，如：

```java
//发送加密的postForm请求
RxHttp.postEncryptForm("/service/...")   
    .add("key", "value")          //添加参数，可调用多次
    .asString()                  //返回String类型
    .subscribe(s-> {   
        //请求成功    
    }, throwable -> {         
        //请求失败                
    });  

//发送加密的postJson请求
RxHttp.postEncryptJson("/service/...")   
    .add("key", "value")          //添加参数，可调用多次
    .asString()                  //返回String类型
    .subscribe(s-> {   
        //请求成功    
    }, throwable -> {         
        //请求失败                
    });  
```

那我自定义的API如何调用呢，so easy!!!!，选择对应的请求方法后，就可以直接调用，如下:

```java
//发送加密的postJson请求
RxHttp.postTestJson("/service/...")   
    .test(100L, 99.99F)          //调用自定义的API
    .test1("testKey", 88.88D)    //调用自定义的API
    .add("key", "value")         //添加参数，可调用多次
    .asString()                  //返回String类型
    .subscribe(s-> {   
        //请求成功    
    }, throwable -> {         
        //请求失败                
    });  
```

## 5.3、自定义Converter

RxHttp内部默认使用来GsonConverter，并且额外提供了4个Converter，如下：

```java
//非必须 根据自己需求选择Converter  RxHttp默认内置了GsonConverter
implementation 'com.rxjava.rxhttp:converter-jackson:1.3.6'
implementation 'com.rxjava.rxhttp:converter-fastjson:1.3.6'
implementation 'com.rxjava.rxhttp:converter-protobuf:1.3.6'
implementation 'com.rxjava.rxhttp:converter-simplexml:1.3.6'
```

#### 5.3.1、自定义TestConverter

即使这样，RxHttp也无法保证满足所有的业务需求，为此，我们可以选择自定义Converter，自定义Converter需要继承IConverter接口，如下:

```java
public class TestConverter implements IConverter {

    /**
     * 请求成功后会被回调
     * @param body             ResponseBody
     * @param type             泛型类型
     * @param onResultDecoder  是否需要对结果进行解码/解密
     */
    @Override
    public <T> T convert(ResponseBody body, Type type, boolean onResultDecoder) throws IOException {
        //自行实现相关逻辑
        return null;
    }

    /**
     * json请求前会被回调，需要自行根据泛型T创建RequestBody对象，并返回
     */
    @Override
    public <T> RequestBody convert(T value) throws IOException {
        //自行实现相关逻辑
        return null;
    }
}
```

以上两个convert方法根据自身业务需求自行实现，可以参考RxHttp提供FastJsonConverter、SimpleXmlConverter等Converter

#### 5.3.2、怎么用Converter

请查看本文3.10章节----设置Converter

# 6、小技巧

在这教大家一个小技巧，由于使用RxHttp发送请求都遵循请求三部曲，故我们可以在android studio 设置代码模版,如下![在这里插入图片描述](https://asset.droidyue.com/image/2019_12/rxhttp_android_studio.png)
如图设置好后，写代码时，输入rp,就会自动生成模版，如下：
![在这里插入图片描述](https://asset.droidyue.com/image/2019_12/rxhttp_coding.gif)

# 7、小结

到这，RxHttp常用功能介绍完毕，你会发现，一切都是那么的美好，无论你是get、post、加密请求、自定义解析器，还是文件上传/下载/进度监听等等，皆遵循请求三部曲。特别是对`Response<T>`类型数据处理，可以说是天衣无缝，我们无需每次都判断code，直接就可以拿到T，简直了。。。

最后，喜欢的，请给本文点个赞，如果可以，还请给个[star](https://github.com/liujingxing/RxHttp)，创作不易，感激不尽。🙏🙏🙏
