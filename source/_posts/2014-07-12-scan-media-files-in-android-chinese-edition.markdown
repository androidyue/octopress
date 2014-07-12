---
layout: post
title: "Android扫描多媒体文件剖析"
date: 2014-07-12 19:59
comments: true
categories: Android
---
这篇文章从系统源代码分析，讲述如何将程序创建的多媒体文件加入系统的媒体库，如何从媒体库删除，以及大多数程序开发者经常遇到的无法添加到媒体库的问题等。本人将通过对源代码的分析，一一解释这些问题。
<!--more-->
##Android中的多媒体文件扫描机制
Android提供了一个很棒的程序来处理将多媒体文件加入的媒体库中。这个程序就是MediaProvider，现在我们简单看以下这个程序。首先看一下它的Receiver
```xml
        <receiver android:name="MediaScannerReceiver">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
            </intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.MEDIA_MOUNTED" />
                <data android:scheme="file" />
            </intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.MEDIA_UNMOUNTED" />
                <data android:scheme="file" />
            </intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.MEDIA_SCANNER_SCAN_FILE" />
                <data android:scheme="file" />
            </intent-filter>
        </receiver>
```

MediaScannerReceiver只接收符合action和数据规则正确的intent。

###MediaScannerReciever如何处理Intent
  * 当且仅当接收到**action android.intent.action.BOOT_COMPLETED**才扫描内部存储（非内置和外置sdcard）
  * 除了action为**android.intent.action.BOOT_COMPLETED** 的以外的intent都必须要有数据传递。
  * 当收到 **Intent.ACTION_MEDIA_MOUNTED** intent，扫描Sdcard 
  * 当收到 **Intent.ACTION_MEDIA_SCANNER_SCAN_FILE** intent，检测没有问题，将扫描单个文件。


###MediaScannerService如何工作
实际上MediaScannerReceiver并不是真正处理扫描工作，它会启动一个叫做MediaScannerService的服务。我们继续看MediaProvider的manifest中关于service的部分。
```xml
       <service android:name="MediaScannerService" android:exported="true">
            <intent-filter>
                <action android:name="android.media.IMediaScannerService" />
            </intent-filter>
        </service>
```

###MediaScannerService中的scanFile方法
```java
    private Uri scanFile(String path, String mimeType) {
        String volumeName = MediaProvider.EXTERNAL_VOLUME;
        openDatabase(volumeName);
        MediaScanner scanner = createMediaScanner();
        return scanner.scanSingleFile(path, volumeName, mimeType);
    }
```

###MediaScannerService中的scan方法
```java
    private void scan(String[] directories, String volumeName) {
        // don't sleep while scanning
        mWakeLock.acquire();

        ContentValues values = new ContentValues();
        values.put(MediaStore.MEDIA_SCANNER_VOLUME, volumeName);
        Uri scanUri = getContentResolver().insert(MediaStore.getMediaScannerUri(), values);

        Uri uri = Uri.parse("file://" + directories[0]);
        sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_STARTED, uri));
        
        try {
            if (volumeName.equals(MediaProvider.EXTERNAL_VOLUME)) {
                openDatabase(volumeName);
            }

            MediaScanner scanner = createMediaScanner();
            scanner.scanDirectories(directories, volumeName);
        } catch (Exception e) {
            Log.e(TAG, "exception in MediaScanner.scan()", e);
        }

        getContentResolver().delete(scanUri, null, null);

        sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_FINISHED, uri));
        mWakeLock.release();
    }
```

###MediaScannerService中的createMediaScanner方法
```java
private MediaScanner createMediaScanner() {
        MediaScanner scanner = new MediaScanner(this);
        Locale locale = getResources().getConfiguration().locale;
        if (locale != null) {
            String language = locale.getLanguage();
            String country = locale.getCountry();
            String localeString = null;
            if (language != null) {
                if (country != null) {
                    scanner.setLocale(language + "_" + country);
                } else {
                    scanner.setLocale(language);
                }
            }    
        }
        
        return scanner;
}
```
从上面可以发现，真正工作的其实是<a href="https://android.googlesource.com/platform/frameworks/base/+/cd92588/media/java/android/media/MediaScanner.java" target="_blank">android.media.MediaScanner.java</a> 具体扫描过程就请点击左侧链接查看。

##如何扫描一个刚创建的文件
这里介绍两种方式来实现将新创建的文件加入媒体库。

###最简单的方式
只需要发送一个正确的intent广播到MediaScannerReceiver即可。
```java
    String saveAs = "Your_Created_File_Path"
    Uri contentUri = Uri.fromFile(new File(saveAs));
    Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE,contentUri);
    getContext().sendBroadcast(mediaScanIntent);
```
上面的极简方法大多数情况下正常工作，但是有些情况下是不会工作的，稍后的部分会介绍。即使你使用上述方法成功了，还是建议你继续阅读稍后的为什么发广播不成功的部分。  

###使用MediaScannerConnection
```java
    public void mediaScan(File file) {
        MediaScannerConnection.scanFile(getActivity(),
                new String[] { file.getAbsolutePath() }, null,
                new OnScanCompletedListener() {
                    @Override
                    public void onScanCompleted(String path, Uri uri) {
                        Log.v("MediaScanWork", "file " + path
                                + " was scanned seccessfully: " + uri);
                    }
                });
    }
```
MediaScannerConnection的scanFile方法从2.2（API 8）开始引入。

###创建一个MediaScannerConnection对象然后调用scanFile方法
很简单，参考<a href="http://developer.android.com/reference/android/media/MediaScannerConnection.html" target="_blank">http://developer.android.com/reference/android/media/MediaScannerConnection.html</a>

###如何扫描多个文件
  * 发送多个Intent.ACTION_MEDIA_SCANNER_SCAN_FILE广播
  * 使用MediaScannerConnection，传入要加入的路径的数组。

##为什么发送MEDIA_SCANNER_SCAN_FILE广播不生效
关于为什么有些设备上不生效，很多人认为是API原因，其实不是的，这其实和你传入的文件路径有关系。看一下接收者Receiver的onReceive代码。
```java
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        Uri uri = intent.getData();
        if (action.equals(Intent.ACTION_BOOT_COMPLETED)) {
            // scan internal storage
            scan(context, MediaProvider.INTERNAL_VOLUME);
        } else {
            if (uri.getScheme().equals("file")) {
                // handle intents related to external storage
                String path = uri.getPath();
                String externalStoragePath = Environment.getExternalStorageDirectory().getPath();

                Log.d(TAG, "action: " + action + " path: " + path);
                if (action.equals(Intent.ACTION_MEDIA_MOUNTED)) {
                    // scan whenever any volume is mounted
                    scan(context, MediaProvider.EXTERNAL_VOLUME);
                } else if (action.equals(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE) &&
                        path != null && path.startsWith(externalStoragePath + "/")) {
                    scanFile(context, path);
                }
            }
        }
    }
```

所有的部分都正确除了传入的路径。因为你可能硬编码了文件路径。因为有一个这样的判断`path.startsWith(externalStoragePath + "/")`,这里我举一个简单的小例子。
```java
    final String saveAs = "/sdcard/" + System.currentTimeMillis() + "_add.png";
    Uri contentUri = Uri.fromFile(new File(saveAs));
    Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE,contentUri);
    getContext().sendBroadcast(mediaScanIntent);
    Uri uri = mediaScanIntent.getData();
    String path = uri.getPath();
    String externalStoragePath = Environment.getExternalStorageDirectory().getPath();
    Log.i("LOGTAG", "Androidyue onReceive intent= " + mediaScanIntent 
                            + ";path=" + path + ";externalStoragePath=" +
                            externalStoragePath);
```
我们看一下输出日志，分析原因。
```bash
LOGTAG Androidyue onReceive intent= Intent { act=android.intent.action.MEDIA_SCANNER_SCAN_FILE dat=file:///sdcard/1390136305831_add.png };path=/sdcard/1390136305831_add.png;externalStoragePath=/mnt/sdcard
```
上述输出分析，你发送的广播，action是正确的，数据规则也是正确的，而且你的文件路径也是存在的，**但是**，文件的路径**/sdcard/1390136305831_add.png**并不是以外部存储根路径**/mnt/sdcard/**开头。所以扫描操作没有开始，导致文件没有加入到媒体库。所以，请检查文件的路径。

##如何从多媒体库中移除 
如果我们删除一个多媒体文件的话，也就意味我们还需要将这个文件从媒体库中删除掉。

###能不能简简单单发广播？
仅仅发一个广播能解决问题么？我倒是希望可以，但是实际上是不工作的，查看如下代码即可明白。
```java
    // this function is used to scan a single file
    public Uri scanSingleFile(String path, String volumeName, String mimeType) {
        try {
            initialize(volumeName);
            prescan(path, true);

            File file = new File(path);
            if (!file.exists()) {
                return null;
            }

            // lastModified is in milliseconds on Files.
            long lastModifiedSeconds = file.lastModified() / 1000;

            // always scan the file, so we can return the content://media Uri for existing files
            return mClient.doScanFile(path, mimeType, lastModifiedSeconds, file.length(),
                    false, true, MediaScanner.isNoMediaPath(path));
        } catch (RemoteException e) {
            Log.e(TAG, "RemoteException in MediaScanner.scanFile()", e);
            return null;
        }
    }
```
正如上述代码，会对文件是否存在进行检查，如果文件不存在，直接停止向下执行。所以这样是不行的。那怎么办呢？
```java
    public void testDeleteFile() {
        String existingFilePath = "/mnt/sdcard/1390116362913_add.png";
        File  existingFile = new File(existingFilePath);
        existingFile.delete();
        ContentResolver resolver = getActivity().getContentResolver();
        resolver.delete(Images.Media.EXTERNAL_CONTENT_URI, Images.Media.DATA + "=?", new String[]{existingFilePath});
       
    }
```
上述代码是可以工作的，直接从MediaProvider删除即可。
具体的删除代码请参考<a href="http://droidyue.com/blog/2014/02/09/code-snippet-for-media-on-android/" target="_blank">Code Snippet for Media on Android</a>

##One More Thing
  * 你可以通过查看/data/data/com.android.providers.media/的external.db文件可以了解更多的信息。

###Others
  * <a href="http://www.amazon.cn/gp/product/B009OLU8EE/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B009OLU8EE&linkCode=as2&tag=droidyue-23">Android系统源代码情景分析</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B009OLU8EE" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
