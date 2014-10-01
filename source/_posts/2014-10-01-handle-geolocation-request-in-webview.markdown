---
layout: post
title: "WebView处理网页位置请求"
date: 2014-10-01 17:23
comments: true
categories: WebView Geolocation HTML5 Android
---

随着移动设备的激增，LBS（Location Based Service）已然成为趋势，其最关键的还是获取设备的位置信息。native代码获取位置信息轻轻松松可以搞定，实际上网页获取位置信息也不是那么困难。

在HTML5中，提供了一套定位用户信息的接口，当然这个位置信息是通过客户端，准确说是浏览器获取的。
<!--more-->
注意，位置信息属于个人隐私的范围，只有经过用户同意之后才能获取到信息。

##网页如何实现请求位置信息
使用getCurrentPosition()方法来请求位置信息。  
下面是一个很简单的示例，来展示用户位置信息的经度和纬度。
```html lineos:false
<!DOCTYPE html>
<html>
    <body>
	<p id="demo">Click the button to get your coordinates:</p>
	<button onclick="getLocation()">Try It</button>

	<script>
		var x = document.getElementById("demo");

		function getLocation() {
    		console.info("getLocation working")
        	if (navigator.geolocation) {
        		navigator.geolocation.getCurrentPosition(showPosition,showError);
			} else { 
        		x.innerHTML = "Geolocation is not supported by this browser.";
            }
		}

		function showPosition(position) {
    		x.innerHTML="Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
		}
		
		function showError(error) {
    		switch(error.code) {
        	case error.PERMISSION_DENIED:
            	x.innerHTML = "User denied the request for Geolocation."
            	break;
        	case error.POSITION_UNAVAILABLE:
            	x.innerHTML = "Location information is unavailable."
            	break;
        	case error.TIMEOUT:
            	x.innerHTML = "The request to get user location timed out."
            	break;
        	case error.UNKNOWN_ERROR:
            	x.innerHTML = "An unknown error occurred."
            	break;
    	}
}
    </script>

    </body>
</html>
```

###示例阐述
  *  检测getLocation方法是否可用
  *  如果可以调用getCurrentPosition方法，否则提示浏览器不支持
  *  如果getCurrentPosition获取信息成功，返回一个坐标系的对象，并将这个对象作为参数传递到showPosition方法,如果失败，调用showError方法，并将错误码作为showError方法的参数。
  *  showPosition方法展示经度和纬度信息 
  *  showError方法用来处理请求错误

上述部分参考自[html5_geolocation w3cschool](http://www.w3schools.com/HTML/html5_geolocation.asp)，更多高级操作请访问左侧链接。


##WebView如何返回给网页
###大致操作步骤
  * 在manifest中申请android.permission.ACCESS_FINE_LOCATION 或 android.permission.ACCESS_COARSE_LOCATION 权限。两者都有更好。
  * 设置webivew开启javascript功能，地理定位功能，设置物理定位数据库路径
  * 在onGeolocationPermissionsShowPrompt处理物理位置请求，常用的是提示用户，让用户决定是否允许。

###使用的API
  * android.permission.ACCESS_FINE_LOCATION 通过GPS，基站，Wifi等获取**精确的**位置信息。
  * android.permission.ACCESS_COARSE_LOCATION 通过基站，Wifi等获取**错略的**位置信息。
  * onGeolocationPermissionsShowPrompt 位置信息请求回调，通常在这里弹出选择是否赋予权限的对话框
  * GeolocationPermissions.Callback.invoke(String origin, boolean allow, boolean remember)决定是否真正提供给网页信息，可根据用户的选择结果选择处理。
###实现代码
```java lineos:false
final WebView webView = new WebView(this);
addContentView(webView,  new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)  );
WebSettings settings = webView.getSettings();
settings.setJavaScriptEnabled(true);
settings.setGeolocationEnabled(true);
settings.setGeolocationDatabasePath(getFilesDir().getPath());
		
webView.setWebChromeClient(new WebChromeClient() {
	@Override
	public void onGeolocationPermissionsHidePrompt() {
		super.onGeolocationPermissionsHidePrompt();
		Log.i(LOGTAG, "onGeolocationPermissionsHidePrompt");
	}

	@Override
	public void onGeolocationPermissionsShowPrompt(final String origin,
					final Callback callback) {
		AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
		builder.setMessage("Allow to access location information?");
		OnClickListener dialogButtonOnClickListener = new OnClickListener() {

			@Override
			public void onClick(DialogInterface dialog, int clickedButton) {
				if (DialogInterface.BUTTON_POSITIVE == clickedButton) {
					callback.invoke(origin, true, true);
				} else if (DialogInterface.BUTTON_NEGATIVE == clickedButton) {
					callback.invoke(origin, false, false);
				}
			}
		};
		builder.setPositiveButton("Allow", dialogButtonOnClickListener);
		builder.setNegativeButton("Deny", dialogButtonOnClickListener);
		builder.show();
		super.onGeolocationPermissionsShowPrompt(origin, callback);
		Log.i(LOGTAG, "onGeolocationPermissionsShowPrompt");
	}
});
webView.loadUrl("file:///android_asset/geolocation.html");
```


##疑问解答
###I/SqliteDatabaseCpp(21863): sqlite returned: error code = 14
原因是你没有设置setGeolocationDatabasePath，按照上面例子设置即可。

###点击之后没有任何变化
  * 检查代码是否按照上面一样，是否有错误。
  * 在第一次请求的是否，需要的反应时间比较长。

###检测定位服务是否可用
当GPS_PROVIDER和NETWORK_PROVIDER有一者可用，定位服务就可以用，当两者都不能用时，即定位服务不可以用。  
注意PASSIVE_PROVIDER不能作为定位服务可用的标志。因为这个provider只会返回其他Provider提供的位置信息，自己无法定位。
```java lineos:false
private void testGeolocationOK() {
		LocationManager manager = (LocationManager)getSystemService(Context.LOCATION_SERVICE);
		boolean gpsProviderOK = manager.isProviderEnabled(LocationManager.GPS_PROVIDER);
		boolean networkProviderOK = manager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
		boolean geolocationOK = gpsProviderOK && networkProviderOK;
		Log.i(LOGTAG, "gpsProviderOK = " + gpsProviderOK + "; networkProviderOK = " + networkProviderOK + "; geoLocationOK=" + geolocationOK);
}
```
###跳转到位置设置界面
我们只需要发送一个简单的隐式intent即可启动位置设置界面
```java lineos:false
Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
startActivity(intent);
```

##示例代码
[百度云盘](http://pan.baidu.com/s/1gdrHIin)

###其他
  * <a href="http://www.amazon.cn/gp/product/B007RSKTXQ/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B007RSKTXQ&linkCode=as2&tag=droidyue-23">程序员装B必备：黑轴机械键盘</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B007RSKTXQ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00E7XVAZA/ref=as_li_qf_sp_asin_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00E7XVAZA&linkCode=as2&tag=droidyue-23">位置信息服务(LBS)关键技术及应用</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00E7XVAZA" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00KHG1006/ref=as_li_qf_sp_asin_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00KHG1006&linkCode=as2&tag=droidyue-23">基于语义Web的LBS服务架构及其服务发现算法研究</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00KHG1006" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
