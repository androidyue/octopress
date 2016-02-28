---
layout: post
title: "一个简易小工具，七牛Uploader for Octopress"
date: 2016-02-28 17:15
comments: true
categories: Octopress 七牛 作品
---
春节假期，带着电脑回家，蹭着邻居的网，除夕晚上用ruby写了一个简单的工具。安利一下，广而告之。
<!--more-->

##为什么写这个应用
###为什么用七牛
七牛是我比较看好的一个云存储，其国内国外有很多cdn，如果我把我的网站放到七牛上，打开速度应该会显著提升。

###为什么还自己写
  * 七牛官方的qrsync不支持例外目录，会上传.git文件夹下的内容
  * 七牛的qrsync更新策略不符合我的需求
  * 自己有时间和能力

##功能描述
  * 暂时只支持对文件的上传和更新，不含删除和下载功能
  * 尤其适合于Octopress网站

##使用
###创建授权信息文件
从七牛后台 账号-->秘钥 中获取AccessKey和SecretKey分别填入下面
```
[auth]
access_key = ""
secret_key = ""
```
将上述内容保存成文件`.qiniu.ini` 放在同步脚本的祖先目录上即可，也可以放在家目录。

举个例子，比如你的同步脚本放在`~/tools/notes/sync_dir/`下，你的配置文件，可以放在`~/`,`~/tools/`以及`~/tools/notes/`。

注意，不要将上述文件放同步脚本目录，以免信息泄露。

###同步
使用方法如下，很简单，需要传入同步文件夹路径和bucket名称

```java
ruby push2Qiniu.rb dir_to_sync bucket
```

##实现原理
实现原理很简单，基本如下
  
  * 新文件 直接上传
  * 已存在的文件，如果lastModified没有变化，不上传
  * 已存在的文件，如果lastModified有变化，检测文件内容md5，如果和上一次不同，则上传，否则不上传。


##和Octopress集成
修改Octopress的Rakefile文件
```ruby
desc "Default deploy task"
task :deploy do
  # Check if preview posts exist, which should not be published
  if File.exists?(".preview-mode")
    puts "## Found posts in preview mode, regenerating files ..."
    File.delete(".preview-mode")
    Rake::Task[:generate].execute
  end

  Rake::Task[:copydot].invoke(source_dir, public_dir)
  atom2rssDir = '~/osc_git/php_works/'
  Rake::Task["#{deploy_default}"].execute
  //在这里加入同步脚本执行
end
```


##源码
  * [Qiniu_Uploader](https://github.com/androidyue/Qiniu_Uploader)


##使用七牛
下面的是七牛的一位员工的QQ二维码，想要使用七牛（每月免费10G流量）并得到更多优惠，请联系她，注明来自技术小黑屋。

![http://7jpolu.com1.z0.glb.clouddn.com/qiniu_tina.jpg](http://7jpolu.com1.z0.glb.clouddn.com/qiniu_tina.jpg)







