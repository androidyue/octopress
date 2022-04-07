---
layout: post
title: "Android 添加 Overlay View （覆盖视图）"
date: 2022-04-07 07:55
comments: true
categories: Android 黑科技 
---

在 Android 中，有一种黑科技，就是能够过在 Window 上添加一个视图，然后这个视图，会覆盖在所有的 应用视图的上面（包括桌面）。比如下面的视图。

![https://asset.droidyue.com/image/2022/h1/android_overlay_view_sample.png](https://asset.droidyue.com/image/2022/h1/android_overlay_view_sample.png)


想要利用上面的黑科技，很简单。大概分为如下的步骤。
<!--more-->

## 检测权限
  * `Settings.canDrawOverlays(aContext)` 可以检测 当前的 App 是否可以添加悬浮窗视图。
  * 如果返回为true，则表明已经获取了添加悬浮视图的权限。
  * 如果返回为false，则需要按照下方的内容获取权限。

## 获取权限

SYSTEM_ALERT_WINDOW，设置悬浮窗权限，是 Android 中一个比较特殊的权限。

关于获取权限，可以使用下面的代码处理。
```kotlin

private static final int REQUEST_CODE = 1;
private  void requestAlertWindowPermission() {
    Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
    intent.setData(Uri.parse("package:" + getPackageName()));
    startActivityForResult(intent, REQUEST_CODE);
}

@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode == REQUEST_CODE) {
        if (Settings.canDrawOverlays(this)) {
          Log.i(LOGTAG, "onActivityResult granted");
        }
    }
}
```


## 添加悬浮窗视图
```java
fun addOverlay() {
    val windowManager = getSystemService(Context.WINDOW_SERVICE) as? WindowManager
    val params = WindowManager.LayoutParams()
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        //8.0新特性
        params.type = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
    } else {
        params.type = WindowManager.LayoutParams.TYPE_SYSTEM_ALERT;
    }

    params.format = PixelFormat.RGBA_8888;
    //设置flags
    //设置flags
    params.flags =
        (WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL //设置flags.不可聚焦及不可使用按钮对悬浮窗进行操控.
                or WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                or WindowManager.LayoutParams.FLAG_FULLSCREEN //窗口被虚拟按键遮挡问题
                or WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION)
    //设置flags.不可聚焦及不可使用按钮对悬浮窗进行操控.
    //设置窗口坐标参考系
    //设置flags.不可聚焦及不可使用按钮对悬浮窗进行操控.
    //设置窗口坐标参考系
    params.gravity = Gravity.LEFT or Gravity.TOP
    params.x = 0
    params.y = 0
    params.width = 200
    params.height = 200
    val container = TextView(this)
    overlayContainer = container
    container.setBackgroundColor(Color.parseColor("#cce8cf"))
    windowManager?.addView(container, params)
}
```


## 完整的代码

```kotlin
class MainActivity : AppCompatActivity() {
	var overlayContainer: TextView? = null

	@RequiresApi(Build.VERSION_CODES.M)
	override fun onCreate(savedInstanceState: Bundle?) {
    	super.onCreate(savedInstanceState)
    	setContentView(R.layout.activity_main)
    	if (Settings.canDrawOverlays(this)) {
        	addOverlay()
    	} else {
        	val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION)
        	intent.data = Uri.parse("package:$packageName")
        	startActivity(intent)
    	}
    	
    	findViewById<View>(R.id.textview_hello).setOnClickListener {
        	overlayContainer?.text = "${System.currentTimeMillis()}"
    	}
}

	fun addOverlay() {
    	val windowManager = getSystemService(Context.WINDOW_SERVICE) as? WindowManager
    	val params = WindowManager.LayoutParams()
    	if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        	//8.0新特性
        	params.type = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
    	} else {
        	params.type = WindowManager.LayoutParams.TYPE_SYSTEM_ALERT;
    	}

    	params.format = PixelFormat.RGBA_8888;
    	//设置flags
    	//设置flags
    	params.flags =
        	(WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL //设置flags.不可聚焦及不可使用按钮对悬浮窗进行操控.
                or WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                or WindowManager.LayoutParams.FLAG_FULLSCREEN //窗口被虚拟按键遮挡问题
                or WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION)
	    //设置flags.不可聚焦及不可使用按钮对悬浮窗进行操控.
	    //设置窗口坐标参考系
	    //设置flags.不可聚焦及不可使用按钮对悬浮窗进行操控.
	    //设置窗口坐标参考系
	    params.gravity = Gravity.LEFT or Gravity.TOP
	    params.x = 0
	    params.y = 0
	    params.width = 200
	    params.height = 200
	    val container = TextView(this)
	    overlayContainer = container
	    container.setBackgroundColor(Color.parseColor("#cce8cf"))
	    windowManager?.addView(container, params)
	}
}
```

以上。
