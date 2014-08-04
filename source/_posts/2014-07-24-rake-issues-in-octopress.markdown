---
layout: post
title: "Octopress 下 rake 失败问题解决"
date: 2014-07-24 19:11
comments: true
categories: 其他 Octopress
---

在 Mac 机器上，使用 octopress 总是问题重重，今天遇到了这样的问题，解决了，记录一下。
```bash
13:28 $ rake generate
rake aborted!
You have already activated rake 10.1.1, but your Gemfile requires rake 0.9.2.2. Prepending `bundle exec` to your command may solve this.
/Users/androidyue/.rvm/gems/ruby-1.9.3-p484/gems/bundler-1.6.2/lib/bundler/runtime.rb:34:in `block in setup'
/Users/androidyue/.rvm/gems/ruby-1.9.3-p484/gems/bundler-1.6.2/lib/bundler/runtime.rb:19:in `setup'
/Users/androidyue/.rvm/gems/ruby-1.9.3-p484/gems/bundler-1.6.2/lib/bundler.rb:120:in `setup'
/Users/androidyue/.rvm/gems/ruby-1.9.3-p484/gems/bundler-1.6.2/lib/bundler/setup.rb:7:in `<top (required)>'
/Users/androidyue/github/myblog/Rakefile:2:in `<top (required)>'
(See full trace by running task with --trace)
```
<!--more-->

##查看 rake 信息
```ruby
13:48 $ gem list rake

*** LOCAL GEMS ***

rake (10.1.1, 0.9.6, 0.9.2.2)
```

##方法一
在所有的 rake 命令前面加入 bundle exec 前缀。
```bash
bundle exec rake generate
```
##方法二
修改Gemfile 文件如下。
```ruby
 group :development do
-  gem 'rake', '~> 0.9'
+  gem 'rake', '~> 10.0'
```

###其他
  * <a href="http://www.amazon.cn/gp/product/B002WJI7YI/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B002WJI7YI&linkCode=as2&tag=droidyue-23">锦绣蓝图:怎样规划令人流连忘返的网站</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B002WJI7YI" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00ASOV2AU/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00ASOV2AU&linkCode=as2&tag=droidyue-23">你的网站赚钱吗？</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00ASOV2AU" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />







