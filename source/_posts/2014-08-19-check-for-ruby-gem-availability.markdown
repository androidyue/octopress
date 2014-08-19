---
layout: post
title: "Ruby检测Gem是否安装"
date: 2014-08-19 20:04
comments: true
categories: Ruby Rails
---

最近参加七牛的<a href="https://portal.qiniu.com/contest/demo2014" target="_blank">demo大赛</a>,决定使用ruby开发。于是遇到了一些疑问，然后解决了，这里记录一下。

在Ruby中，Gem是一个很常见的东西，其相当于插件，Ruby有很多很棒的gem，避免了我们重复造轮子，我的demo中需要安装gem，但是为了更加实现好一些，先检测gem是否已经安装，如果没有安装，在继续安装，否则不安装。
<!--more-->
于是，怎么在Ruby中检测gem是否安装呢，其实也很简单，直接上代码就可以了。不需太多解释。begin...rescue...相当于java中的try catch。
```ruby lineos:false
#!/usr/bin/env ruby
# encoding: utf-8

def checkGemAvailable(gemName, versionLimit=nil)
    isAvailable = false
    begin
        if versionLimit == nil
            gem  gemName
        else
            gem  gemName, versionLimit
        end
        isAvailable = true
    rescue LoadError
    end
    isAvailable
end
```
跑起来看一看
```ruby lineos:false
puts checkGemAvailable('rack')
puts checkGemAvailable('rack', '>=2')
```
我机器的rack信息
```bash lineos:false
rack (1.5.2)
```
所以上面执行的结果为
```bash lineos:false
true
false
```

###其他
  * <a href="http://www.amazon.cn/gp/product/B0061XKRXA/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0061XKRXA&linkCode=as2&tag=droidyue-23">代码大全</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0061XKRXA" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B005KGBTQ8/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B005KGBTQ8&linkCode=as2&tag=droidyue-23">松本行弘的程序世界</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B005KGBTQ8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B004WHZGZQ/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B004WHZGZQ&linkCode=as2&tag=droidyue-23">黑客与画家:硅谷创业之父Paul Graham文集</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B004WHZGZQ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />