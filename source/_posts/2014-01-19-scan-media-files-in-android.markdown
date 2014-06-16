---
layout: post
title: "Scan Media Files In Android"
date: 2014-01-19 19:39
comments: true
categories: Android MediaScanner MediaScannerReceiver MediaScannerService android.intent.action.MEDIA_SCANNER_SCAN_FILE MediaProvider MediaScannerConnection scanFile 
---
I once tried to use MediaScanner to resolve problems; however it turned out to be a failure. Now I make it.This post is to write down why I failed and how I work it out now. I think it could be deeper that other posts. 
<!--more-->
##Android Media Scanning Mechanism
Android provides a great application for developers to add created media files to add them into the library. The application is called MediaProvider. Now let's have a glance of MediaProvider.   
The receiver part of its  manifest
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
The MediaScannerReceiver will receive the above intents with right action and data scheme. 
###How the MediaScannerRecieve handles the intent  
*  It will scan internal storage only after receiving the **action android.intent.action.BOOT_COMPLETED** 
*  All intent but the **android.intent.action.BOOT_COMPLETED** intent should carry the file scheme data
*  It will scan external storage when receiving the **Intent.ACTION_MEDIA_MOUNTED** intent.
*  It will scan the single file when receiving the **Intent.ACTION_MEDIA_SCANNER_SCAN_FILE** intent.  
###How the MediaScannerService works
Actually receiver does not do scanning. It will start a service called MediaScannerService.
The service part of its manifest
```xml
       <service android:name="MediaScannerService" android:exported="true">
            <intent-filter>
                <action android:name="android.media.IMediaScannerService" />
            </intent-filter>
        </service>
```

scanFile Method
```java
    private Uri scanFile(String path, String mimeType) {
        String volumeName = MediaProvider.EXTERNAL_VOLUME;
        openDatabase(volumeName);
        MediaScanner scanner = createMediaScanner();
        return scanner.scanSingleFile(path, volumeName, mimeType);
    }
```
scan Method
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
Actually the scan code is not really in the MediaScannerService
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
It's using the android.media.MediaScanner
[https://android.googlesource.com/platform/frameworks/base/+/cd92588/media/java/android/media/MediaScanner.java](https://android.googlesource.com/platform/frameworks/base/+/cd92588/media/java/android/media/MediaScanner.java)

##How To Scan A Created File 
Now I am going to introduce two ways to add a created file into the media library. 
###The Simplest Method
Just send a broadcast, as we have posted above. Just send a broadcast intent to MediaScannerReceiver.
```java
    String saveAs = "Your_Created_File_Path"
    Uri contentUri = Uri.fromFile(new File(saveAs));
    Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE,contentUri);
    getContext().sendBroadcast(mediaScanIntent);
```
The above method maybe has been seen thousands of times. Actually it should work. However I failed and failed in sending broadcast intent. In the following section. I will point out why the sending broadcast not works. Even though you get well on with sending broadcast,it's strongly recommended to read the Section Why Sending MEDIA_SCANNER_SCAN_FILE broadcast not works.   
###Use MediaScannerConnection
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
the scanFile method is introduced since API 8
###Create an instance and call scanFile (String path, String mimeType) 
It's really easy, just read the post [http://developer.android.com/reference/android/media/MediaScannerConnection.html](http://developer.android.com/reference/android/media/MediaScannerConnection.html)

###How To Scan Mutiple Files 
*  Sending Mutiple Intent.ACTION_MEDIA_SCANNER_SCAN_FILE broadcast intents.
*  Use the second method by filled the second params with an array of paths.

##Why Sending MEDIA_SCANNER_SCAN_FILE broadcast not works
Actually someone may think sending ACTION_MEDIA_SCANNER_SCAN_FILE works on some devices but not on other devices. Actually it's. Is it a API limit?  
No, It's has someting to do with your file path.
Take a look at this
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
Every part is right except the intent data. I mean the file path. You may hardcode the filepath. This is my example
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
And this is the output log
```bash
LOGTAG Androidyue onReceive intent= Intent { act=android.intent.action.MEDIA_SCANNER_SCAN_FILE dat=file:///sdcard/1390136305831_add.png };path=/sdcard/1390136305831_add.png;externalStoragePath=/mnt/sdcard
```
So in the sending broadcast, your action is right, your data schema  OK, your data path not null;but your path  /sdcard/1390136305831_add.png does not **startswith** the externalStoragePath /mnt/sdcard/
And so the scan file is actually **not called**. 
In conclusion your hardcoding path results in the failure. 


##Remove From Media Library
If we deleted a file ,it means that we need to remove the file from the media library. 
###Simply sending a broadcast?
Can we simple sending a broadcast to the MediaScannerReceiver? I also wish it could. But actually it does not work. 
Look at this code for the explanation.
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
As the above code points out, It does have a check before the real scanning.
Then how should I do?
```java
    public void testDeleteFile() {
        String existingFilePath = "/mnt/sdcard/1390116362913_add.png";
        File  existingFile = new File(existingFilePath);
        existingFile.delete();
        ContentResolver resolver = getActivity().getContentResolver();
        resolver.delete(Images.Media.EXTERNAL_CONTENT_URI, Images.Media.DATA + "=?", new String[]{existingFilePath});
       
    }
```
The above code works. Just remove from Media Provider


##Special
*  You could check the external.db or internal.db file under /data/data/com.android.providers.media/ for more detailed information.


