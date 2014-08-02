---
layout: post
title: "持续整理：Git 标签操作"
date: 2014-08-02 13:20
comments: true
categories: Git
---
使用Git作为版本控制工具，当每次发版的时候我们通常会做一个tag（标签），比如我们的软件发布了1.0版，那么我们需要生成一个类似v1.0的标签。  
很多工具都可以生成，比如Gitlab网页就可以很方便的生成。 这里简单地介绍以下如何使用终端进行git相关的标签操作。
<!--more-->

##签出
```bash linenos:false
#语法：git checkout tagName
git checkout v0.9
```
注意git clone会将远程所有的标签都保存到本地仓库。

##创建
```bash linenos:false
#语法：git tag tagName 如下面示例 
git tag v1.0
```

##查看
创建之后如何查看呢，也相当简单。
```bash linenos:false
13:37:49-androidyue/tmp/tagdemo (master)$ git tag 
v1.0
v2.0
```

###过滤查看
  * git tag -l 
```bash linenos:false
  13:37:49-androidyue/tmp/tagdemo (master)$ git tag -l v*
	v1.0
	v2.0
```
  * git tag --list
```bash linenos:false
13:37:49-androidyue/tmp/tagdemo (master)$ git tag --list v*
v1.0
v2.0
```
  * git tag | grep regex
```bash linonos:false
13:45:26-androidyue/tmp/tagdemo (master)$ git tag | grep v
v1.0
v2.0
```

##删除
```bash linenos:false
13:47:06-androidyue/tmp/tagdemo (master)$ git tag -d v1.0
Deleted tag 'v1.0' (was bc70b55)
##或者
13:47:11-androidyue/tmp/tagdemo (master)$ git tag --delete v2.0
Deleted tag 'v2.0' (was bc70b55)
```

##分享
  * 推送单个到服务器端，和推送分支规则一样
```bash linenos:false
#git push origin tag_name
git push  origin v1.0
```
  * 推送全部标签到服务器端
```bash linenos:false
git push  origin --tags
```

###其他
  * <a href="http://www.amazon.cn/gp/product/1430218339/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=1430218339&linkCode=as2&tag=droidyue-23">Pro Git</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=1430218339" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/1430218339/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=1430218339&linkCode=as2&tag=droidyue-23">成为大神必读的Git书籍</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=1430218339" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
