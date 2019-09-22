---
layout: post
title: "根据包名查找 jar 包文件"
date: 2019-09-22 21:19
comments: true
categories: jar 脚本 依赖 ruby 
---

很多时候，我们需要根据包名来查找一些依赖所在的jar包，比如我们想要查找`com.alipay`这个包及其文件所在的jar包。

最笨拙的办法可能是这样

  * 一个一个jar包查找，再利用一些工具来验证。

其实，大可不必，我们需要简单实用如下的脚本就能解决这个问题。

<!--more-->

## 脚本内容
```ruby
#!/usr/bin/ruby
require 'find'

# extract arguements from command line
dirToSearch = ARGV[0]
packageName = ARGV[1].to_s.strip
puts "dirToSearch=#{dirToSearch};packageName=#{packageName}"

results = []

Find.find(dirToSearch).select {
	|f| f.end_with? ".jar"
}.each {
	|f|
    puts "Checking #{f}"
    #as jar tf shows the package information like the file path style
    # we need to map all the dots(.) to slashes(/)
    contains = `jar tf #{f}`.include? packageName.gsub ".", "/"
	if contains
		results << "#{f}"
	end
}

puts "The jar files containing #{packageName}"
puts results
```

上面的脚本利用了

  * 遍历查找jar文件
  * 利用`jar tf`命令读取出jar包中的文件列表
  * 执行字符串包含来实行检查

## 脚本执行 

将上面的内容保存成文件`findJarByPackageName.rb`，如下执行即可。
```bash
ruby findJarByPackageName.rb . "com.alipay"

dirToSearch=.;packageName=com.alipay
Checking ./0.jar
Checking ./HwPush_SDK.jar
Checking ./MiPush_SDK_Client_3_0_3.jar
Checking ./alipaySdk-20180601.jar
Checking ./classes.jar
Checking ./full.jar
Checking ./gradle-wrapper.jar
Checking ./huawei-pps-channel-sdk.jar
Checking ./mqtt-client-java1.4-uber-1.14.jar
Checking ./mta-sdk-1.6.2.jar
Checking ./open_sdk_r5788.jar
Checking ./pinyin4j-2.5.0.jar
Checking ./res.jar
Checking ./tbs_sdk_thirdapp_v3.6.0.1249_43610_sharewithdownload_withoutGame_obfs_20180608_114954.jar
Checking ./zxing.jar
The jar files containing com.alipay
./alipaySdk-20180601.jar
```

## 更多推荐
  * [https://github.com/androidyue/DroidScripts](https://github.com/androidyue/DroidScripts)
  * [其他脚本](https://droidyue.com/blog/categories/jiao-ben/)
