---
layout: post
title: "一个脚本，快速发现项目中的重复文件"
date: 2022-05-15 22:16
comments: true
categories: bash ruby Android md5 script 脚本 Linux  Mac
---
项目中的文件越来愈多，导致生成的apk包也不断增大，可是这些文件中会不会存在重复的文件呢，这是一个值得验证的问题，毕竟解决了之后会减少很多apk的体积。

我们不可能依赖人工的手动查找，因为这样是时间成本太大。于是我们再次尝试使用脚本程序来实现检查项目中是否有重复文件。

<!--more-->

## 脚本思路
  * 利用md5对内容进行计算
  * 设置一个字典，key是md5值，value是对应的文件路径列表
  * 如果上字典的value项（文件路径列表）多余1个，则表示存在重复的文件
  * 利用重复的文件的数量和重复文件的大小，我们计算出总共可以节省的空间大小

## 脚本内容
```ruby
#!/usr/bin/env ruby
# encoding: utf-8
require 'find'
require 'digest/md5'

#  通常为项目的路径
targetDirToSearch = ARGV[0]
$hashesFiles = {}
$sizeCanBeSaved = 0

def getFileMd5Checksum(file)
	return Digest::MD5.hexdigest(File.read(file))
end

def shouldCheckThisFile(f)
	isFile = File.file?(f)
	isGitFile = f.include? ".git/"
	isGradleFile = f.include? ".gradle/"
	isIdeFile = f.include? ".idea/"
	return isFile && !isGitFile && !isGradleFile && !isIdeFile
end

def getFilesByMd5(md5Value)
	existingFiles = $hashesFiles[md5Value]
	if (existingFiles == nil)
		existingFiles = []
	end
	return existingFiles
end

def recordFile(f)
	md5 = getFileMd5Checksum(f)
	$hashesFiles[md5] = getFilesByMd5(md5).push(f)
end

def printHashesFiles()
	$hashesFiles.values.select {
		|array| array.size > 1
	}.sort_by {
		|files| File.size(files[0])
	}.each {
		|array|
			fileSize = File.size(array[0])
			puts "Duplicated files size=#{format_mb(fileSize)}"
			array.each {
				|f| puts f
			}
			$sizeCanBeSaved += fileSize * (array.size - 1)
			puts ""
	}

end

def format_mb(size)
	conv = [ 'b', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb' ];
	scale = 1024;

	ndx=1
	if( size < 2*(scale**ndx)  ) then
	  return "#{(size)} #{conv[ndx-1]}"
	end
	size=size.to_f
	[2,3,4,5,6,7].each do |ndx|
	  if( size < 2*(scale**ndx)  ) then
		return "#{'%.3f' % (size/(scale**(ndx-1)))} #{conv[ndx-1]}"
	  end
	end
	ndx=7
	return "#{'%.3f' % (size/(scale**(ndx-1)))} #{conv[ndx-1]}"
end

def getFileSize(f)
	return format_mb(File.size(f))
end

def start(dirToSearch)
	Find.find(dirToSearch).select {
		|f| shouldCheckThisFile(f)
	}.each {
		|f| puts "Checking file #{f}"
			recordFile(f)
	}
	printHashesFiles()
	puts "Size can be saved #{format_mb($sizeCanBeSaved)}"
end

start(targetDirToSearch)
```

## 执行结果
```bash
MacBook-Pro-8:~/Documents/AndroidProjects/EasyHybridApp(master|✚3) % findDuplicatedFiles.rb ./
Checking file ./.gitignore
Checking file ./EasyHybridApp.iml
Checking file ./app/.gitignore
Checking file ./app/app.iml
Checking file ./app/build.gradle
Checking file ./app/proguard-rules.pro
Checking file ./app/src/androidTest/java/com/droidyue/easyhybridapp/ExampleInstrumentedTest.kt
Checking file ./app/src/main/AndroidManifest.xml
Checking file ./app/src/main/java/com/droidyue/easyhybridapp/AppInfo.kt
Checking file ./app/src/main/res/layout/activity_main.xml
Checking file ./app/src/main/res/values/colors.xml
Checking file ./app/src/main/res/values/strings.xml
Checking file ./app/src/main/res/values/styles.xml
Checking file ./app/src/main/res/xml/network_security_config.xml
Checking file ./app/src/test/java/com/droidyue/easyhybridapp/ExampleUnitTest.kt
Checking file ./build.gradle
Checking file ./common/.gitignore
Checking file ./common/build.gradle
Checking file ./common/common.iml
Checking file ./common/consumer-rules.pro
Checking file ./common/proguard-rules.pro
Checking file ./common/src/androidTest/java/com/droidyue/common/ExampleInstrumentedTest.kt
Checking file ./common/src/main/AndroidManifest.xml
Checking file ./common/src/main/java/com/droidyue/common/ClassExt.kt
Checking file ./common/src/main/java/com/droidyue/common/ConfirmDialogExt.kt
Checking file ./common/src/main/java/com/droidyue/common/ContextExt.kt
Checking file ./webview/src/androidTest/java/com/droidyue/webview/ExampleInstrumentedTest.kt
Checking file ./webview/src/main/java/com/droidyue/webview/webviewclient/PageRequestWebViewClient.kt
Checking file ./webview/src/main/java/com/droidyue/webview/webviewclient/WhitelistLaunchingIntentWebViewClient.kt
Checking file ./webview/src/main/res/layout/activity_webview.xml
Checking file ./webview/src/main/res/raw/deeplink_whitelist.json
Checking file ./webview/src/main/res/values/strings.xml
Checking file ./webview/src/test/java/com/droidyue/webview/ExampleUnitTest.kt
Checking file ./webview/webview.iml
Duplicated files size=0 b
./common/consumer-rules.pro
./webview/consumer-rules.pro

Duplicated files size=7 b
./app/.gitignore
./common/.gitignore
./webview/.gitignore

Duplicated files size=272 b
./app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml
./app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml

Duplicated files size=751 b
./app/proguard-rules.pro
./common/proguard-rules.pro
./webview/proguard-rules.pro

Size can be saved 1788 b
```

## 运行建议

  * 在执行之前建议执行以下clean，比如安卓项目执行`./gradlew clean`