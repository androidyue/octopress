---
layout: post
title: "腾讯云分析问题"
date: 2014-10-12 09:47
comments: true
categories: Java 吐槽
---


今天使用腾讯云分析按照给出的文档开始集成，遇到了一个问题。

```bash
E/AndroidRuntime( 4606): FATAL EXCEPTION: pool-1-thread-1
E/AndroidRuntime( 4606): java.lang.NoClassDefFoundError: com.tencent.mid.api.MidService
E/AndroidRuntime( 4606): 	at com.tencent.stat.j.run(Unknown Source)
E/AndroidRuntime( 4606): 	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1076)
E/AndroidRuntime( 4606): 	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:569)
E/AndroidRuntime( 4606): 	at java.lang.Thread.run(Thread.java:864)
```
<!--more-->
##原因
其实原因就是腾讯云分析的文档严重过时了，解决方法就是**在Build Path 除了加入mta-sdk-x.x.x.jar,还要加入mid-sdk-x.x.jar**。

但是腾讯的文档只介绍说集成mta-sdk-x.x.x.jar，我想可能那是大概0.x版本SDK的教程吧。


##吐个槽吧
###霸王条款
据说想要知道应用宝的下载数据（下载次数）必须集成腾讯云分析。这是在扛KPI，还是一贯的本性呢？

###过时冗余的文档
前面提到了文档的严重过时失效，而且其文档存在严重的冗余，据我所知有三处文档，SDK下载包中一份，帮助中心一份，应用管理页面一份。如此这样，一旦修改，成本还是比较大的。


###其他
  * <a href="http://www.amazon.cn/gp/product/B00BSXRLR8/ref=as_li_qf_sp_asin_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00BSXRLR8&linkCode=as2&tag=droidyue-23">Android讲义哪家强</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00BSXRLR8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00LVHTI9U/ref=as_li_qf_sp_asin_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00LVHTI9U&linkCode=as2&tag=droidyue-23">每个人的第一行代码</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00LVHTI9U" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B0052VL2WC/ref=as_li_qf_sp_asin_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0052VL2WC&linkCode=as2&tag=droidyue-23">谁说菜鸟不会数据分析</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0052VL2WC" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
 
