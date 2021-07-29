---
layout: post
title: "Ubuntu下 /usr/lib/* 内容恢复"
date: 2021-07-29 21:38
comments: true
categories: Ubuntu Ruby Linux Shell APT
---

有一次处理 Ruby 的版本问题，删除了`/usr/lib/ruby`文件夹，然后导致了ruby 出现各种问题。

那么怎么解决呢，重做系统，其实大可不必。在 Ubuntu 下使用这个方法即可。

```ruby
raw_pkgs = `dpkg --get-selections`.split("\n")
need_reinstall = []

path="/usr/lib/ruby"

raw_pkgs.each do |x|
    pkg = x.split(" ")[0]
    if `dpkg -L #{pkg}`.include? path
        puts "-> #{pkg} has files in #{path}"
        need_reinstall << pkg
    end
end
puts "\nYou need to reinstall #{need_reinstall.size} packages:"
puts "\tsudo apt-get install --reinstall " + need_reinstall.join(" ")

```
<!--more-->


上面的内容保存成ruby脚本或者使用`irb`后复制粘贴执行即可。

最后会得到一个`sudo apt-get install --reinstall xxxxxx` 的内容。 然后在终端 执行得到的输出内容即可。