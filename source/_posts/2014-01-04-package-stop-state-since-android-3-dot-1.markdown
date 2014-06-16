---
layout: post
title: "Package Stopped State Since Android 3.1"
date: 2014-01-04 20:07
comments: true
categories: Android Package Stop 3.1 LaunchControl receiver GooglePlay
---
##First Bite
Since Android 3.1, Android has introduced a LaunchControl mechanism. It's call Stopped State. 
<!--more-->
Here is what Google describes 
####What is Stopped State

>Starting from Android 3.1, the system's package manager keeps track of applications that are in a stopped state and provides a means of controlling their launch from background processes and other applications.

>Note that an application's stopped state is not the same as an Activity's stopped state. The system manages those two stopped states separately.

####Why Android Adds this
>Note that the system adds FLAG_EXCLUDE_STOPPED_PACKAGES to all broadcast intents. It does this to prevent broadcasts from background services from inadvertently or unnecessarily launching components of stoppped applications. A background service or application can override this behavior by adding the FLAG_INCLUDE_STOPPED_PACKAGES flag to broadcast intents that should be allowed to activate stopped applications.

As the above references point out it will prevent broadcast intents delivering to stopped packages. Actually this control mechanism will ensure safety and save energy. 

##State Switch from/to Stopped State 
What Google says
>Applications are in a stopped state when they are first installed but are not yet launched and when they are manually stopped by the user (in Manage Applications).

###To Stopped Sate
*  Manually force-stop in Manage Application of Settings.
*  adb shell am force-stop package-name
*  Use Hidden Method ActivityManager.forceStopPackages(String packageName) with Right Permission <uses-permission android:name="android.permission.FORCE_STOP_PACKAGES"/> It's without test.

###To Normal State (Not Stopped)
*  Manually Launch your application.
*  Use adb to Activate components(Activity or Receiver ) of the application 

##Send Broadcast Intent to Stopped Packages
>The platform defines two new intent flags that let a sender specify whether the Intent should be allowed to activate components in stopped application.

>FLAG_INCLUDE_STOPPED_PACKAGES — Include intent filters of stopped applications in the list of potential targets to resolve against.
FLAG_EXCLUDE_STOPPED_PACKAGES — Exclude intent filters of stopped applications from the list of potential targets.
When neither or both of these flags is defined in an intent, the default behavior is to include filters of stopped applications in the list of potential targets.

*  Add your Intent Flag FLAG_INCLUDE_STOPPED_PACKAGES in Java
*  Use ADB with Flag FLAG_INCLUDE_STOPPED_PACKAGES such as **adb shell am broadcast -a com.android.vending.INSTALL_REFERRER -f 32**

##Check Package Stopped
*  Manually Check InstalledAppDetails in Manage applications of Settings.
*  Step into Terminal of the Device and **cat /data/system/packages-stopped.xml**

##special Issues
*  Q:If My application has no activities and it just has a receiver, How can I activate and receive common broadcast intents?
*  A:Actually your above application is actually Not Stopped State when it's first installed. Becuase It has no launcher clickable chance. It can receive normal broadcast smoothly If you do not manually force-stop it.

*  Q:Will the system application be in stopped state when it's first installed?
*  A:The apps located in /system/app are what we called System Applications. It's Not in stopped state when it's installed.

*  Q:Will Google Play App still sends campaign broadcast to my application to keep track of install referrers?
*  A:Actually It does work smoothly. And I have tested on 4.0 OS device. I think the Play Store App adds FLAG_INCLUDE_STOPPED_PACKAGES to the broadcast intent.

##Referrences Links
*  [http://developer.android.com/about/versions/android-3.1.html](http://developer.android.com/about/versions/android-3.1.html)

