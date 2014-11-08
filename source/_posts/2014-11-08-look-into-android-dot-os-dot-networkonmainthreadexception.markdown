---
layout: post
title: "啰嗦一下android中的NetworkOnMainThreadException"
date: 2014-11-08 15:26
comments: true
categories: Android
---
相信很多Android开发者很多都遇到过android.os.NetworkOnMainThreadException 这个异常，意思就是主线程进行网络操作异常。这个问题比较简单，但是网络上有着鱼龙混杂的答案，这里想花点时间做一个比较完整的啰嗦。
<!--more-->
##严格模式
在早期的Android版本（2.3之前）中，Google并没有提供一个很严格的程序编写要求，所以在那时我们可以在主线程中执行本地IO操作，网络操作等这些不规范的行为。后来在2.3的姜饼（GINGERBREAD）开始提供了一个开发者工具，这就是StrictMode严格模式。

严格模式可以帮助开发者发现主线程中的磁盘操作和网络操作，开发者根据严格模式的输出信息可以改善程序来更好地响应用户操作，来较少ANR（程序未响应）的问题。

android.os.NetworkOnMainThreadException这个异常从Android 3.0（API 11）引入，出现情况为主线程进行网络操作。

###代码开启StrictMode
```java
if (Build.VERSION.SDK_INT >= VERSION_CODES.GINGERBREAD) {
	ThreadPolicy.Builder threadPolicyBuilder = new StrictMode.ThreadPolicy.Builder();
	threadPolicyBuilder.detectDiskReads().detectDiskWrites().detectNetwork().penaltyLog();
	StrictMode.setThreadPolicy(threadPolicyBuilder.build());
	VmPolicy.Builder vmPolicyBuilder = new VmPolicy.Builder();
	vmPolicyBuilder.detectLeakedSqlLiteObjects().penaltyLog();
	if (Build.VERSION.SDK_INT >= VERSION_CODES.HONEYCOMB) {
		vmPolicyBuilder.detectLeakedClosableObjects();
    }
    StrictMode.setVmPolicy(vmPolicyBuilder.build());
}
```
###特别注意
  * 严格模式不应该在发布版本时开启
  
##治标不治本的办法
下面的这段代码会让严格模式允许所有的磁盘操作和网络操作。但是这并没有改变真正解决问题，主线程中照样还是有网络操作，可能导致程序出现未响应的情况。所以这是一个很糟糕的解决方法，问题的解决思路应该是将网络操作移到非主线程进行，而不是这种掩耳盗铃的做法。
```java
StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
StrictMode.setThreadPolicy(policy); 
```
p.s. 这个很笨的方法居然在Stackoverflow上有很多人认为有用，难以理解。

##AsyncTask也不好
先实现一个我们用来测试的请求网络的方法
```java
private void doGetRequest() {
		HttpGet method = new HttpGet("http://droidyue.com");
		AbstractHttpClient http = new DefaultHttpClient();
		try {
			HttpResponse response = http.execute(method);
			Log.i(LOGTAG, "doGetRequest responseCode=" + response.getStatusLine().getStatusCode() + "; ThreadInfo=" + Thread.currentThread());
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
```
使用AsyncTask可以将网络操作移到了AsyncTask的线程，可以避免NetworkOnMainThreadException异常。

```java
new AsyncTask<Void, Integer, Void>() {
	@Override
	protected Void doInBackground(Void... params) {
		doGetRequest();
		return null;
	}
}.execute();
```
###AsyncTask的弊端
  * 上述AsyncTask为一个匿名内部类的对象,由于Java中非static内部类实例会持有外部类实例的引用,AsyncTask实例持有Activity的引用,这样很容易引起内存泄露
  * 按照Android官方文档支出,AsyncTask被推荐为处理短时间(10秒以内)的操作,即本地的轻量IO操作.不适合使用网络这样时间不定的操作.

更详细的关于AsyncTask请参考[Android中糟糕的AsyncTask](http://droidyue.com/blog/2014/11/08/bad-smell-of-asynctask-in-android/)
##这样也不好
既然AsyncTask可能导致内存泄露并且不适用于长时间操作,那么这样呢
```java
new Thread() {
	@Override
	public void run() {
		super.run();
		doGetRequest();
	}
}.start();
```
这样还是不够好,虽然单独线程可以处理长时间的操作,但是问题还是依旧

  * 内存泄露问题依旧可能存在
  * 如果多次重复进行这样的操作,每次重新创建新的Thread不好.

##解决上述两处内部类可能引起的内存泄露问题
  * 将AsyncTask或者Thread的子类作为单独的文件,不持有Activity的强引用
  * 将AsyncTask或者Thread的子类使用static修饰,则不会隐式持有Activity的强引用
  * 如果是匿名内部类，则需要将其对象设置成成员属性，使用static修饰就不会隐式持有Activity的强引用。

##解决问题哪家强
解决了上述的内存泄露基本可以做到比较完美的实现,或者使用Loaders实现也不错。关于线程重用问题，可以使用Executors.newSingleThreadExecutor()来解决。具体方案因情况而定。
