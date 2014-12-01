---
layout: post
title: "效率工具：强大的批量删除文件的脚本"
date: 2014-11-29 17:29
comments: true
categories: Ruby Shell glob
---
最近打包服务器上的apk包又增多了，每次手动rm操作过于麻烦，于是花了几分钟写了一个可以对指定目录下根据最后修改时间和通配符匹配进行批量删除的脚本。将这个脚本加入crontab中之后，以后就再也不用担心多余的安装包占用磁盘空间了。
<!--more-->
##简短的代码
```ruby
#!/usr/bin/env ruby
# encoding: utf-8
#Usage: ruby removeOldFiles.rb "dest_file_pattern" days_ago
destFilePattern= ARGV[0]
daysAgo= ARGV[1]
edenTime = Time.now.to_i - daysAgo.to_i * 86400
Dir[destFilePattern].each{|child|
    system "rm -rfv #{child}"   if (File.mtime(child).to_i < edenTime)
}
```

##如何使用
使用起来很简单，使用规则如下  
```bash
ruby removeOldFiles.rb "dest_file_pattern" days_ago
```
举个例子，比如我们想删除/tmp目录下的，所有最后修改时间为3天前的apk文件，我们只需要这样执行。
```bash
ruby removeOldFiles.rb "/tmp/*.apk" 3 
```

##为什么第一个参数使用双引号
第一个参数为包含通配符的路径，在shell中存在一个工具就是glob会将包含通配符的路径匹配到具体的文件，比如这样的一段代码。
```ruby
#!/usr/bin/env ruby
# encoding: utf-8
puts ARGV.length
ARGV.each do |a|
    puts "Argument: #{a}"
end
```
我们传入含有通配符的路径参数，得到的结果就是glob匹配后的文件名（前提是通配符可以匹配到文件）。
```bash
10:41 $ ruby test.rb *.txt
2
Argument: abc.txt
Argument: def.txt
```
为了避免进行glob操作,需要对包含通配符的路径参数使用双引号标记。
```bash
10:41 $ ruby test.rb "*.txt"
1
Argument: *.txt
```
所以在使用脚本时第一个参数一定要使用双引号。

##如何遍历文件包含子目录内的
比如我们想遍历`/tmp/abc/def.txt` 我们可以使用`/tmp/**/.txt`即可
