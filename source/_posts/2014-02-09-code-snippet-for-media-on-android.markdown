---
layout: post
title: "Code Snippet For Media on Android"
date: 2014-02-09 19:37
comments: true
categories: Media MediaScanner Android
---
A few days ago,I have wrote down this post [http://androidyue.github.io/blog/2014/01/19/scan-media-files-in-android/](http://androidyue.github.io/blog/2014/01/19/scan-media-files-in-android/). Now I will paste my code snippet.
<!--more-->
###MediaUtils.java
```java
package com.mx.browser.utils;

import java.io.File;
import java.util.Locale;

import com.mx.utils.FileUtils;
import com.mx.utils.Log;

import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.media.MediaScannerConnection;
import android.media.MediaScannerConnection.OnScanCompletedListener;
import android.net.Uri;
import android.provider.MediaStore.Audio;
import android.provider.MediaStore.Images;
import android.provider.MediaStore.Video;
import android.text.TextUtils;

/**
 * Utility Methods for Media Library Operations
 * @author androidyue
 * Referrer  http://androidyue.github.io/blog/2014/01/19/scan-media-files-in-android/
 */
public class MediaUtils {
	
	private static final String LOGTAG = "MediaUtils";

	/**
	 * Scan a media file by sending a broadcast.This is the easiest way.
	 * 对方成功接收广播并处理条件  文件必须存在，文件路径必须以Environment.getExternalStorageDirectory().getPath() 的返回值开头
	 */
	public static void sendScanFileBroadcast(Context context, String filePath) {
			File file = new File(filePath);
			Intent intent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, Uri.fromFile(file));
			context.sendBroadcast(intent);
	}
	
	
	/**
	 * 
	 * @param context
	 * @param paths File paths to scan 
	 * @param mimeTypes mimeTypes in array;it could be null;then 
	 * @param callback
	 */
	public static void scanFiles(Context context, String[] paths, String[] mimeTypes, OnScanCompletedListener callback) {
		if (null != paths && paths.length != 0) {
			MediaScannerConnection.scanFile(context, paths, mimeTypes, callback);
		} else {
			Log.i(LOGTAG, "scanFiles paths = null or paths.length=0 paths=" + paths);
		}
	}
	
	public static void scanFiles(Context context, String[] paths, String[] mimeTypes) {
		scanFiles(context, paths, mimeTypes, null);
	}
	
	public static void scanFiles(Context context, String[] paths) {
		scanFiles(context, paths, null);
	}
	
	public static int removeImageFromLib(Context context, String filePath) {
		ContentResolver resolver = context.getContentResolver();
	    return resolver.delete(Images.Media.EXTERNAL_CONTENT_URI, Images.Media.DATA + "=?", new String[]{filePath});
	}
	
	public static int removeAudioFromLib(Context context, String filePath) {
		return context.getContentResolver().delete(Audio.Media.EXTERNAL_CONTENT_URI, 
				Audio.Media.DATA + "=?", new String[] {filePath});
	}
	
	public static int removeVideoFromLib(Context context, String filePath) {
		return context.getContentResolver().delete(Video.Media.EXTERNAL_CONTENT_URI, 
				Video.Media.DATA + "=?", new String[] {filePath});
		
	}
	
	public static int removeMediaFromLib(Context context, String filePath) {
		String mimeType = FileUtils.getFileMimeType(filePath);
		int affectedRows = 0;
		if (null != mimeType) {
			mimeType = mimeType.toLowerCase(Locale.US);
			if (isImage(mimeType)) {
				affectedRows = removeImageFromLib(context, filePath);
			} else if (isAudio(mimeType)) {
				affectedRows = removeAudioFromLib(context ,filePath);
			} else if (isVideo(mimeType)) {
				affectedRows = removeVideoFromLib(context, filePath);
			}
		}
		return affectedRows;
	}
	
	public static boolean isAudio(String mimeType) {
		return mimeType.startsWith("audio");
	}
	
	public static boolean isImage(String mimeType) {
		return mimeType.startsWith("image");
	}
	
	public static boolean isVideo(String mimeType) {
		return mimeType.startsWith("video");
	}
	
	
	public static boolean isMediaFile(String filePath) {
		String mimeType = FileUtils.getFileMimeType(filePath);
		return isMediaType(mimeType);
	}
	
	public static boolean isMediaType(String mimeType) {
		boolean isMedia = false;
		if (!TextUtils.isEmpty(mimeType)) {
			mimeType = mimeType.toLowerCase(Locale.US);
			isMedia = isImage(mimeType) || isAudio(mimeType) || isVideo(mimeType);
		}
		return isMedia;
	}
	
	
	/**
	 * Before using it,please do have a media type check.
	 * @param context
	 * @param srcPath
	 * @param destPath
	 * @return
	 */
	public static int renameMediaFile(Context context, String srcPath, String destPath) {
		removeMediaFromLib(context, srcPath);
		sendScanFileBroadcast(context, destPath);
		return 0;
	}
	
	
	
}

```


###FileUtils.java
```java
	public static String getFileMimeType(String filename) {
		if (TextUtils.isEmpty(filename)) {
			return null;
		}
		int lastDotIndex = filename.lastIndexOf('.');
		String mimetype = MimeTypeMap.getSingleton().getMimeTypeFromExtension(
				filename.substring(lastDotIndex + 1).toLowerCase());
		Log.i(LOGTAG, "getFileMimeType mimeType = " + mimetype);
		return mimetype;
	}

```

###Others
  * <a href="http://www.amazon.cn/gp/product/B007H4NZEK/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B007H4NZEK&linkCode=as2&tag=droidyue-23">Android多媒体开发高级编程:为智能手机和平板电脑开发图形、音乐、视频和富媒体应用</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B007H4NZEK" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

