---
layout: post
title: "每周一脚本：批量对多个文件增加前缀"
date: 2014-09-22 17:03
comments: true
categories: Ruby, 效率, 每周1脚本
---
最近从设计师那里get了超多的图，结果都是1.png，2.png这样的文件名，自己还需要将这些文件变成可读的文件名，不想一个一个得修改，于是就写了一个简单的脚本，实现批量对多个文件增加前缀的操作，后期修改了一下，分享一下。
<!--more-->

##代码
```ruby lineos:false  add_prefix_files.rb https://raw.githubusercontent.com/androidyue/weekly-scripts/master/ruby/add_prefix_files.rb
#!/usr/bin/env ruby
# encoding: utf-8

srcDir= ARGV[0]
prefix= ARGV[1]
pattern = '*'
pattern = ARGV[2] if ARGV.size == 3

Dir[srcDir + '/' + pattern ].each{|child|
    childName = File.basename(child)
    destChildName = prefix  + childName
    destChild = child.gsub(childName, destChildName)
    system 'mv %s %s'%[child, destChild]
}
```

##如何使用
###使用的方法
  * **ruby add_prefix_files.rb dest_folder prefix pattern**
  * dest_folder 必选 操作进行的基础目录，并不一定总是直接父目录
  * prefix      必须 前缀名称  建议结尾以_结束
  * pattern     可选，如不填写为dest_folder的直接子文件（含目录），否则应用提供的pattern匹配

###使用示例
对当前目录下所有文件增加test_前缀。
```ruby lineos:false
~/rubydir/tools/add_prefix_files.rb ./ test_
```

对当前目录下res/drawable-hdpi/所有的png文件，增加test_前缀
```ruby lineos:false
 ~/rubydir/tools/add_prefix_files.rb ./ test_  "res/drawable-hdpi/*.png"
```

###其他
  * <a href="http://www.amazon.cn/gp/product/0596009658/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=0596009658&linkCode=as2&tag=droidyue-23">Learning the Bash Shell</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=0596009658" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B0096EXMS8/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0096EXMS8&linkCode=as2&tag=droidyue-23">Linux命令行与shell脚本编程大全</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0096EXMS8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00N75YP74/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00N75YP74&linkCode=as2&tag=droidyue-23">穿布鞋的马云:决定阿里巴巴生死的27个节点</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00N75YP74" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />