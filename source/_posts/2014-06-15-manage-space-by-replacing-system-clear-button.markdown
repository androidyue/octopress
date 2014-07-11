---
layout: post
title: "程序实现自己管理数据清理工作"
date: 2014-06-15 18:03
comments: true
categories: Android ManageSpace clear data manageSpaceActivity Activity
---
How to disable system clear button and replace it with self application Manage Space?    

Android在处理清楚数据时，会在系统的设置选项应用中，有一个清除数据的按钮，点下这个按钮之后，该应用的几乎所有数据都会被清除。具体清除了哪些数据，请参考这篇文章。[http://droidyue.com/blog/2014/06/15/what-will-be-removed-if-you-click-clear-data-button-in-system-application-item/](http://droidyue.com/blog/2014/06/15/what-will-be-removed-if-you-click-clear-data-button-in-system-application-item/)
<!-- more -->
但是有些情况下，我们不希望将应用的数据全部清除，或者是我们来接管系统的清理操作，其实是可以。并且实现也很简单.
>android:manageSpaceActivity
>The fully qualified name of an Activity subclass that the system can launch to let users manage the memory occupied by the application on the device. The activity should also be declared with an <activity> element.

开发者文档如是说，自己实现一个Activity的字类，在manifest中声明这个activity,然后将Application的android:manageSpaceActivity的值设置为这个activity即可。如：
```xml
<application
        android:allowBackup="true"
        android:icon="@drawable/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme" 
        android:manageSpaceActivity="ps.androidyue.demo.mangagespace.ManageSpaceActivity"
        >
        <activity
            android:name="ps.androidyue.demo.mangagespace.MainActivity"
            android:label="@string/app_name" >
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        <activity android:name="ps.androidyue.demo.mangagespace.ManageSpaceActivity">
            
        </activity>
    </application>
```
然后是ManageSpaceActivity 就是点击空间管理进入的Activity，用来处理清除数据的自定义功能，常见的逻辑是，清除完数据后自动退出。以下为超简单的实现。
```java
protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		Button btnClearData = new Button(this);
		btnClearData.setText("Clear Data");
		btnClearData.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				PreferenceManager.getDefaultSharedPreferences(getApplicationContext())
					.edit().clear().commit();
				finish();
			}
			
		});
		setContentView(btnClearData);
	}
```
当然为了更好的实现，我们在LauncherActivity即MainActivity，创造一些测试数据。否则，系统应用中的管理空间不可用！
```java
    private void createTestData() {
		PreferenceManager.getDefaultSharedPreferences(getApplicationContext())
			.edit().putString("test", "test_data").commit();
	}
```
demo程序下载：http://pan.baidu.com/s/1ntJnttZ

延伸阅读：http://developer.android.com/guide/topics/manifest/application-element.html#space 

##Others
  * <a href="http://www.amazon.cn/gp/product/B00J4DXWDG/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00J4DXWDG&linkCode=as2&tag=droidyue-23">Android编程权威指南</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00J4DXWDG" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

