---
layout: post
title: "Build Android Packages From Command Line"
date: 2013-10-19 09:11
comments: true
categories: Android 
---
A few months ago,I dealed with a task:To build a large amount of apk files.  The trick I came up with is to build apk file from the command so that I could use Python to glue all the works.  Eventually I made it.And so this post is to make some description about the trick.  
##Requirements
  *  Setup JDK
  *  Setup Android SDK
##Steps
1.  Generate R class file   
2.  Compile Java codes(.java files) into classes(.class) files  
3.  Convert .class files into .dex files  
4.  Package Resouces  
5.  Build Unsigned APK File  
6.  Sign Apk with Jarsigner   
7.  The Extra One:Use zipalign for optimization
  
  
###Generate R class File 
In Android,We use R class to refer resources instead of hard-coding the resouces.  
For a better understanding,pleae have a look at http://www.satyakomatineni.com/akc/display?url=displaynoteimpurl&ownerUserId=satya&reportId=2883  
```bash
aapt package -f -m -J /home/androidyue/temp/ubuntu/workspace/MxDataProvider/gen/ -S /home/androidyue/temp/ubuntu/workspace/MxDataProvider/res/ -I /home/androidyue/dev_tools/android-sdk-linux_86_backup/platforms/android-17/android.jar -M /home/androidyue/temp/ubuntu/workspace/MxDataProvider/AndroidManifest.xml
```
####Some descriptions
  *  -f  force overwrite of existing files 
  *  -m  make package directories under location specified by -J
  *  -J  specify where to output R.java resource constant definitions
  *  -S  directory in which to find resources.  Multiple directories will be scanned and the first match found (left to right) will take precedence.
  *  -I  add an existing package to base include set 
  *  -M  specify full path to AndroidManifest.xml to include in zip 
  

###Comiple .java into .class files 
```bash
javac -encoding UTF-8 -source 1.6 -target 1.6 -bootclasspath /home/androidyue/dev_tools/android-sdk-linux_86_backup/platforms/android-17/android.jar -d /home/androidyue/temp/ubuntu/workspace/MxDataProvider/bin/ /home/androidyue/temp/ubuntu/workspace/MxDataProvider/src//coop/channel/provider/*.java /home/androidyue/temp/ubuntu/workspace/MxDataProvider/gen//coop/channel/provider/R.java 
```
####Some descriptions
  *  -encoding encoding  Set the source file encoding name, such as EUC-JP and UTF-8. If -encoding is not specified, the platform default converter is used. 
  *  -source release   Specifies the version of source code accepted, Please Do NOT use Java 7(1.7)
  *  -target version  Generate  class files that target a specified version of the VM. Class files will run on the specified target and on later versions, but not on earlier versions of the VM. Valid targets are 1.1, 1.2, 1.3, 1.4, 1.5 (also 5), 1.6(also 6), and 1.7 (also 7).
  *  -bootclasspath bootclasspath Cross-compile against the specified set of boot classes. As with the user class path, boot class path entries are separated by colons (:) and can be directories, JAR archives, or ZIP archives.
  *  -d directory  Set the destination directory for class files. The directory must already exist; javac will not create it. 
As I have suffered a lot using Java 7, It's recomended to use Java 6
  

###Convert .class into .dex files 
```bash
/home/androidyue/dev_tools/android-sdk-linux_86_backup/build-tools/17.0.0/dx --dex --output=/home/androidyue/temp/ubuntu/workspace/MxDataProvider/bin//class.dex /home/androidyue/temp/ubuntu/workspace/MxDataProvider/bin/
```
To dive into Dalvik, please visit http://source.android.com/devices/tech/dalvik/index.html

  
  
###Package Resouces 
```bash
aapt package -f -M /home/androidyue/temp/ubuntu/workspace/MxDataProvider/AndroidManifest.xml -S /home/androidyue/temp/ubuntu/workspace/MxDataProvider/res/ -A /home/androidyue/temp/ubuntu/workspace/MxDataProvider//assets/ -I /home/androidyue/dev_tools/android-sdk-linux_86_backup/platforms/android-17/android.jar -F /home/androidyue/temp/ubuntu/workspace/MxDataProvider/bin//resources.ap_
```
####Some descriptions
  *  -F  specify the apk file to output  
  *  -A  additional directory in which to find raw asset files  

###Build Unsigned APK File 
```bash
/home/androidyue/temp/ubuntu/dev_tools/adt-bundle-linux_backup/sdk/tools/apkbuilder /tmp/unsignedApkFile.apk -v -u -z /home/androidyue/temp/ubuntu/workspace/MxDataProvider/bin//resources.ap_ -f /home/androidyue/temp/ubuntu/workspace/MxDataProvider/bin//class.dex -rf /home/androidyue/temp/ubuntu/workspace/MxDataProvider/src/
```
####Some descriptions
  *  -u      Creates an unsigned package.
  *  -z      Followed by the path to a zip archive. Adds the content of the application package.
  *  -f      Followed by the path to a file. Adds the file to the application package.
  *  -rf     Followed by the path to a source folder. Adds the java resources found in that folder to the application package, while keeping their path relative to the source folder.


  
  
### Sign Apk with Jarsigner
```bash
jarsigner -keystore /home/androidyue/temp/ubuntu/myKeystore -storepass storepassValue -keypass keypassValue -signedjar /home/androidyue/Desktop/output/max1111111.apk /tmp/unsignedApkFile.apk maxthon -digestalg SHA1 -sigalg MD5withRSA
```
####Some descriptions 
  *  [-keystore <url>]           keystore location
  *  [-storepass <password>]     password for keystore integrity
  *  [-keypass <password>]       password for private key (if different)
  *  [-signedjar <file>]         name of signed JAR file 
  *  [-digestalg <algorithm>]    name of digest algorithm 
  *  [-sigalg <algorithm>]       name of signature algorithm 
  
  
###Use Zipalign for optimization
```bash
zipalign -f -v 4 /home/androidyue/Desktop/output/max1111111.apk /home/androidyue/Desktop/output/max222222.apk
```
####Some descriptions
  *  The <alignment> is an integer that defines the byte-alignment boundaries. This must always be 4 (which provides 32-bit alignment) or else it effectively does nothing.
  *  For more details, please visit http://developer.android.com/tools/help/zipalign.html


###Others
  * <a href="http://www.amazon.com/gp/product/1250032156/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1250032156&linkCode=as2&tag=droidyueblog-20&linkId=US32QO6KTI7UYC7U">How to Build an Android: The True Story of Philip K. Dick's Robotic Resurrection</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=1250032156" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

