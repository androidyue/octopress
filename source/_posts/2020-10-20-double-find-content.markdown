---
layout: post
title: "终端下双重过滤筛选内容"
date: 2020-10-20 20:38
comments: true
categories:  grep find ruby shell python 
---
很多时候，我们需要对文件内容进行查找，查找出包含某段字符串的文件，比如这样

我们使用这个命令可以查找包含Ruby字符的全部文件和行数。
```bash
source git:(master) grep  -E "Ruby" --exclude-dir={.git,lib,.gradle,.idea,build,captures}   . -R --color=always -n
./_posts/2014-09-08-learn-sqlite-in-a-very-fast-way.markdown:9:最近用Ruby写了一个七牛的demo参赛作品，使用了sqlite3，用到很多操作，利用假期的时间，简单做一个快速掌握SQLite命令的小入门。
./_posts/2013-09-07-issues-about-installing-octopress.markdown:6:categories: Github OctoPress Ruby RVM
./_posts/2016-04-10-jit-friendly-checker-for-android.markdown:117:###为什么用Ruby
./_posts/2016-04-10-jit-friendly-checker-for-android.markdown:118:  * 答：有了idea时很纠结，因为不确定用什么语言实现，尤其是在Python和ruby之间，为此问了不少同学，最后“一意孤行”决定用Ruby了，不喜欢Python的强制对齐，超级喜欢Ruby的字符串模板。Ruby很简单，很人性化，相信你会喜欢的。
./_posts/2014-09-22-weekly-script-add-prefix-to-mutiple-files-in-ruby.markdown:6:categories: Ruby, 效率, 每周1脚本
./_posts/2014-08-21-file-code-sinppets-in-ruby.markdown:3:title: "Ruby常用文件操作"
./_posts/2014-08-21-file-code-sinppets-in-ruby.markdown:6:categories: Ruby
```
<!--more-->

那么问题来了，如果，我们想要查找出同时包含了Ruby和Android的文件路径，怎么办呢，其实不难

  * 确定好包含包含Ruby的文件路径
  * 从上面的路径中查找是否包含 Android

具体的实现如下

## 脚本内容
```ruby
#!/usr/bin/env ruby
# encoding: utf-8

dirToSearch = ARGV[0]
firstFilter = ARGV[1]
secondFilter = ARGV[2]


firstFilterCommand = "grep  -E '#{firstFilter}' --exclude-dir={.git,lib,.gradle,.idea,build,captures} --exclude={*.png,*.jpg,*.jar}  #{dirToSearch} -R"
puts firstFilterCommand
`#{firstFilterCommand}`.split("\n").map {
    |line| line.split(":")[0]
}.uniq.each {
    |f|
        puts ""
        puts ""
        puts ""
        puts "Checking file #{f}"
        system "grep #{secondFilter} #{f} -n --color=always"
}
```

## 执行结果
```bash
➜  source git:(master) doubleGrep.rb ./ ruby Android
grep  -E 'ruby' --exclude-dir={.git,lib,.gradle,.idea,build,captures} --exclude={*.png,*.jpg,*.jar}  ./ -R



Checking file .//_posts/2014-09-20-interaction-between-java-and-javascript-in-android.markdown
3:title: "Android中Java和JavaScript交互"
6:categories: Android Java JavaScript
8:Android提供了一个很强大的WebView控件用来处理Web网页，而在网页中，JavaScript又是一个很举足轻重的脚本。本文将介绍如何实现Java代码和Javascript代码的相互调用。
107:Java-Javascript Interaction In Android
138:Android在4.4之前并没有提供直接调用js函数并获取值的方法，所以在此之前，常用的思路是 java调用js方法，js方法执行完毕，再次调用java代码将值返回。
158:Android 4.4之后使用evaluateJavascript即可。这里展示一个简单的交互示例
211:如果只在4.2版本以上的机器出问题，那么就是系统处于安全限制的问题了。Android文档这样说的
212:>Caution: If you've set your targetSdkVersion to 17 or higher, you must add the @JavascriptInterface annotation to any method that you want available your web page code (the method must also be public). If you do not provide the annotation, then the method will not accessible by your web page when running on Android 4.2 or higher.
268:  * <a href="http://www.amazon.cn/gp/product/B00LVHTI9U/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00LVHTI9U&linkCode=as2&tag=droidyue-23">第一行代码:Android</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00LVHTI9U" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />



Checking file .//_posts/2013-09-07-issues-about-installing-octopress.markdown



Checking file .//_posts/2016-04-10-jit-friendly-checker-for-android.markdown
```
