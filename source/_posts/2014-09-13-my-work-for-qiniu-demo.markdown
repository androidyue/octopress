---
layout: post
title: "我的七牛参赛作品"
date: 2014-09-13 13:19
comments: true
categories: 作品
---
使用Ocopress写博客将近一年多了，大概几个月前同事给我推荐了<a href="http://droidredirect.sinaapp.com/qiniu_redirect.php" target="_blank">七牛</a>做网站的静态文件存储服务，于是果断尝试了一下，发现真实不错。速度不错，而且有免费套餐。很是支持。最近发现七牛有一个demo大赛，于是果断参加了。
<!--more-->
##痛点
  * 域名Godaddy购买，无法备案，不能使用七牛的独立域名绑定
  * 服务器为github pages， 有300M空间限制，所以只能把静态文件放到七牛
  * 每次写带图片等资源的博客，都需要先上传到七牛，然后得到外链地址，贴回到博客，过于繁琐啦。
  
##解决思路
由于ocotpress程序是将markdown文档转换成纯静态的HTML网页，我们可以在这个转换过程之前或者期间将图片等资源自动上传到七牛服务器，然后替换这些资源的地址为已上传文件的外链。

##实现细节
  * 通过rb-inotify检测文件变化，新文件会直接上传，已经上传过的文件则覆盖更新。避免在生成html网页时大量拥挤上传
  * 进行rake generate时，对没有上传的文件进行上传
  * 通过sqlite数据库，记录文件路径和最后修改时间进行验证。
  
##好处
  * 节省了博客在github中的空间占用，让github空间限制几乎不再存在。只剩纯文本了，能占用多少空间
  * 提高了在国内的访问的速度
  * 使用更多的七牛的服务，比如防盗链等功能。
  
##安装
如果尚未安装Octopress，请参考<a href="http://blog.segmentfault.com/yaashion_xiang/1190000000364677" target="_blank">本文</a>安装。
###超级简单的一步安装
```bash
cd YOUR_OCTOPRESS_ROOT_DIR
curl -o /tmp/install.sh https://gitcafe.com/androidyue/octopress_qiniu/raw/master/install.sh && bash /tmp/install.sh
```
###配置文件
安装过程中，会使用vi打开一个配置文件，文件内容为，文件路径位于家目录下的.qiniu.ini。按照自己的实际情况填写配置即可。
```bash
#Qiniu Config File

#Project
[octopress]
#Your Bucket to Store Images In Octopress
image_bucket = "your_bucket"
#Your Image Folder Path to store the files locally. Usually it's #{OCTORESS_DIRECTORY}/public/images/
image_dir = "image_dir_in_octopress"

#Auth Info
#Generate two following two keys in Qiniu Web Portal
[auth]
access_key = "your_access_key"
secret_key = "your_secret_key"
```

##启动程序
配置完成，轻松执行一个脚本就可以启动监控文件变化自动上传的程序了。当检测目录有文件变化时就会自动上传到七牛的文件服务器。
```bash
YOUR_OCTOPRESS_ROOT_DIR/startQiniu.sh
```


##文件介绍
```bash
.
|-- install.sh  #快捷安装脚本
|-- octopress   #覆盖octopress程序的目录
|   `-- plugins 
|       `-- image_tag.rb # 覆盖Octopress 程序自带的image_tag，实现图片上传到七牛
|-- qiniu       #工具程序的主目录
|   |-- qiniuCLI.rb    #命令行工具，这个工具是所有上传下载请求的对外处理程序，本工具中所有的请求都是直接调用这个工具。
|   |-- .qiniu_config_template.ini #配置文件模板，不要对这个文件直接配置，请使用家目录下的.qiniu.ini进行配置
|   |-- qiniuCore.rb   #最主要的处理脚本。支持从ini文件读取配置，数据库存储文件的上传信息，调用七牛的SDK来完成文件的上传和下载。
|   |-- .qiniu.db      #数据库文件，存储上传的记录
|   |-- qiniuFileNotifier.rb  #监控配置目录变化，自动上传或者覆盖文件。
|   `-- .setupQiniu.rb #安装需要的gem，复制配置文件到家目录
|-- README.md  #说明文件
`-- startQiniu.sh #检查安装情况并启动文件监控自动上传启动程序
```

##源码地址
  * <a href="https://gitcafe.com/androidyue/octopress_qiniu" target="_blank">我的七牛参赛作品</a>

###解答问题
  * 提问：为什么配置文件放在家目录下
  * 回答：配置文件中包含了七牛的accessKey和accessSecret，默认的ocotpress受git管理，为了避免将配置文件误加入git管理，传到服务器端造成前面的accessKey和acessSecret泄露，所以放到家目录下。
  
  * 提问：既然文件都上传到了，是不是可以删除掉存储到public/images/的文件
  * 回答：当然可以，因为生成的网页的图片地址为七牛的外链地址，目前程序没有做主动删除文件的操作。

###投票地址
我的作品名称**octopress_qiniu**

[投票地址](http://campaign.gitcafe.com/qiniu-demo?page=11)

最后希望大家多多支持，投我一票哈。
