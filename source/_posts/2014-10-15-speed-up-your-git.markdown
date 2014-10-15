---
layout: post
title: "人生苦短，让你的Git飞起来吧"
date: 2014-10-15 21:37
comments: true
categories: Git
---


git是一款超极优秀的版本控制工具，包括Linus大神的linux项目在内的千千万万的项目在使用。你可以使用Eclipse插件管理，亦可以使用终端工具。

git虽然有着svn不能匹及的本地仓库，但是和svn一样，和远程服务器通信也相当常用。常用的pull和push就是比较常见的命令。

然后，你是不是觉得从远程拉取（pull）到本地是不是很慢，从本地推到服务器端（push）又是不是很耗时呢，是吧，正所谓人生苦短，赶紧加速你的git吧。
<!--more-->
##修改ssh配置
按照下面的内容修改这个文件`vim ~/.ssh/config`
```ruby
ControlMaster auto
##ControlPath /tmp/%r@%h:%p
ControlPath /tmp/git@github.com:22
ControlPersist yes
```

##一些注解
  * **ControlMaster auto**可以使多个ssh会话共享一个已经存在的连接，如果没有，则自动创建一个连接。
  * **ControlPath /tmp/%r@%h:%p**可以指定想要共享的连接。%r代表远程登录用户名，一般都为git，%h表示目标主机，%p表示端口。
  * **ControlPersist yes** 则可以让共享的连接持有处于连接状态。

##常用的ControlPath
下面包含开源中国，github，gitcafe等代码托管。
```
ControlPath /tmp/git@git.oschina.net:22
ControlPath /tmp/git@github.com:22
ControlPath /tmp/git@gitcafe.com:22
```

快来试一试吧，是不是提高了5倍！

注：由于网络的情况，结果可能略有不同。已经很快的但没有感觉改善的同学，可以继续读下去。

##还能更快
还有一个能提高50倍的方法，不过对于一般开发者不是很常用，如需了解可以参考[Speed Up Git (5x to 50x)](http://interrobeng.com/2013/08/25/speed-up-git-5x-to-50x/)


###其他
  *  <a href="http://www.amazon.cn/gp/product/1430218339/ref=as_li_qf_sp_asin_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=1430218339&linkCode=as2&tag=droidyue-23">成为Git大神很简单，读完这本书</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=1430218339" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
