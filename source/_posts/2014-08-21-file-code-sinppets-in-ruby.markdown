---
layout: post
title: "Ruby常用文件操作"
date: 2014-08-21 19:20
comments: true
categories: Ruby 
---

初学Ruby，很多需要学习，现在开始尝试使用Ruby来写一个脚本，其中用到了很多文件相关的操作，这里阶段地整理一些。便于后续的再次查找。
<!--more-->
###是否为文件
```ruby
File.file?("file_path")
```

###是否为目录
```ruby
File.directory?("file_path")
```

###从路径中获取文件名
```ruby
File.basename('/tmp/adb.log')  #=> "adb.log"

#从上面结果中移除扩展名

File.basename('/tmp/adb.log', '.log') #=> "adb"
#或者
File.basename('/tmp/adb.log', '.*')   #=> "adb"
```

###列出目录下的全部子文件
```ruby
#替换puts child为自己的操作
Dir['/tmp/*'].each{|child|puts child}
```

###其他
  * <a href="http://www.amazon.cn/gp/product/B0061XKRXA/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0061XKRXA&linkCode=as2&tag=droidyue-23">代码大全</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0061XKRXA" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B005KGBTQ8/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B005KGBTQ8&linkCode=as2&tag=droidyue-23">松本行弘的程序世界</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B005KGBTQ8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B004WHZGZQ/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B004WHZGZQ&linkCode=as2&tag=droidyue-23">黑客与画家:硅谷创业之父Paul Graham文集</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B004WHZGZQ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />