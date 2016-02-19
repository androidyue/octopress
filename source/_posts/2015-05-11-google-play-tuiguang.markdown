---
layout: post
title: "Google Play商店推广那些事"
date: 2015-05-11 21:43
comments: true
categories: Android
---
Play商店是Android的官方商店，虽然在大陆无法访问，但是这里依旧是重要的版本发布市场，尤其是对于那些国际化的产品。对于拓宽海外市场，付费推广就是一部分不可忽视的措施。而Android付费推广必然就是Play商店推广。本文主要从技术方面讲解，如何统计推广数据，以及在开发过程中遇到的一些疑问和困惑。
<!--more-->
##生成推广链接
想要进行推广，必须有推广链接。Google提供了生成推广链接的地址[Google Play URL Builder](https://developers.google.com/analytics/devguides/collection/android/v2/campaigns#google-play-url-builder),遗憾的是这个地址被墙了，不过可以使用[这个地址](http://www.digitangle.co.uk/toolsandresources/google-play-url-builder/#sthash.HLdt4vXJ.dpbs)，可能稍微慢一点。

{%img http://7jpolu.com1.z0.glb.clouddn.com/play_url_builder.png %}
###简单描述
  * Package Name 必填  应用的包名，如com.example.application
  * Campaign Source 必填 推广的来源，比如google, citysearch, newsletter4
  * Campaign Medium 选填  推广的媒介，比如cpc, banner, email
  * Campaign Term   选填 推广的关键字 比如 running+shoes
  * Campaign Content 选填 推广内容描述
  * Campaign Name  选填 可以填写 产品名，推广代号或者是推广口号

生成的推广地址就是https://play.google.com/store/apps/details?id=com.mx.browser&referrer=utm_source%3Ddroidyue.com%26utm_medium%3Dadlink%26utm_term%3Dandroid%252Bbrowser%26utm_content%3DBest%2520and%2520Fast%2520Browser%26utm_campaign%3Dandroidyue_123

##推广如何工作的
有了上面的推广链接，我们有必要了解一下Play商店的推广是如何工作的。

  1.用户从网页或者应用中点击Play商店推广链接跳转到Play商店应用的页面下载。  
  2.应用下载完成并安装后，Google Play商店会发送一个**INSTALL_REFERRER**的Intent广播，该Intent中包含了推广链接中的参数。  
  3.应用收到**INSTALL_REFERRER**广播之后，从Intent中读取参数，上报推广数据。  

##统计推广数据
###1.manifest声明receiver，接收**INSTALL_REFERRER**广播
```xml
<receiver android:name=".PlayCampaignReceiver" android:exported="true">
	<intent-filter>
	    		<action android:name="com.android.vending.INSTALL_REFERRER" />
	  		</intent-filter>	   
</receiver>
```
###2.实现PlayCampaignReceiver，处理**INSTALL_REFERRER**广播
```java
package com.droidyue.playstorereferrertester;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class PlayCampaignReceiver extends BroadcastReceiver {
	private static final String LOGTAG = "PlayCampaignReceiver";
	@Override
	public void onReceive(Context context, Intent intent) {
		Log.i(LOGTAG, "onReceive intent=" + intent);
		//处理referrer参数
		String referrer = intent.getStringExtra("referrer");
		//some other code
	}
}
```

##多个Receiver
有些时候我们可能有这样的需求，我们需要多个Receiver监听**INSTALL_REFERRER**广播，其实是可以的。
###代码调用
这一种是比较推荐的实现方式，比较简单，就是在一个Receiver的onReceive中，实例化另一个Receiver并调用其onReceive方法。
```java

public class PlayCampaignReceiver extends BroadcastReceiver {
	private static final String LOGTAG = "PlayCampaignReceiver";
	@Override
	public void onReceive(Context context, Intent intent) {
		Log.i(LOGTAG, "onReceive intent=" + intent);
		//调用另一个Receiver实例的onReceive方法
		new AnotherPlayCampaignReceiver().onReceive(context, intent);
	}
}
```
###manifest声明
通过manifest的增加另一个监听**INSTALL_REFERRER**广播的Receiver的形式理论上也可以，但是之前的Google文档中说这种方式有问题，不建议使用。之前Google统计关于市场推广的描述为
>Note: Only one BroadcastReceiver class can be specified per application. Should you need to incorporate two or more BroadcastReceivers from different SDKs, you will need to create your own BroadcastReceiver class that will receive all broadcasts and call the appropriate BroadcastReceivers for each type of Broadcast.


##何时收到推广数据
关于何时收到推广数据的问题争论颇多，基本上又两个答案：安装完成之后和打一次打开程序时。这两个答案可以说是都对或者都错。

在3.1之前，**INSTALL_REFERRER**广播 确实是在程序安装之后发送的。   
在3.1之后，**INSTALL_REFERRER**广播 就变成了在程序第一次启动的时候进行的。

那么这又是作何原因呢，其真实的原因就是在3.1 API 12之后，Android系统引入了停止状态，也就是说一个刚下载的程序，在用户手动点击图标启动之前，是收不到正常的广播的。只有当处于非停止状态的应用才能收到**INSTALL_REFERRER**广播。所以广播的发送就选择在程序第一次启动时。  更多关于[Android中的停止状态](http://droidyue.com/blog/2014/07/14/look-inside-android-package-stop-state-since-honeycomb-mr1/)

为了进一步验证这个发送广播实际，我在Play Store上传了一个测试程序，可以使用这个地址[https://play.google.com/store/apps/details?id=com.droidyue.playstorereferrertester&referrer=utm_source%3Ddroidyue.com%26utm_medium%3Dblog%26utm_term%3Dtest%252Bapp%26utm_content%3Dtest%252Bapp%26utm_campaign%3Dandroidyue_123456](https://play.google.com/store/apps/details?id=com.droidyue.playstorereferrertester&referrer=utm_source%3Ddroidyue.com%26utm_medium%3Dblog%26utm_term%3Dtest%252Bapp%26utm_content%3Dtest%252Bapp%26utm_campaign%3Dandroidyue_123456)从Play Store下载测试一下，过滤日志`adb logcat | grep PlayCampaignReceiver`测试。


注意：这里的第一次安装可以是从Play Store 应用中点打开按钮，也可以是从Launcher中点击应用图标。前面两种情况都是可以接收到广播的。

##别的包也会收到么
这也是一个被争论的问题，当然我也是通过上面的包验证了，答案就是不会的。**INSTALL_REFERRER**只会发给那个推广安装的程序。

##例外情况
从网页到客户端的安装是无法发送**INSTALL_REFERRER**广播的。

##奇怪问题
###协议为哪个
其实有人会奇怪，究竟推广链接是market还是https协议，答案是都可以，但是推荐使用https协议的链接，首先的既定事实是Google Play URL Builder默认生成的就是https协议链接，另外https是一个被广泛采用的协议，设想如果一个market协议链接在PC浏览器上被点击是怎样的一种体验呢？答案不言自明。

##参考文章
  * [Campaign Measurement ](https://developers.google.com/analytics/devguides/collection/android/v2/campaigns#overview)






















