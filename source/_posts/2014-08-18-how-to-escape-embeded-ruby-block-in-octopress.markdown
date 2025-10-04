---
layout: post
title: "Octopress中嵌入ruby代码如何不被解析"
date: 2014-08-18 07:48
comments: true
categories: Octopress Ruby 其他
---

用Octopress写博客即将快一年了，感觉自己用的还可以，并且借此熟练使用了Markdown，但是前几天写一篇关于如何在Octopress中集成多说评论的文章的时候，遇到了一个代码高亮的问题，就是如何处理&#123;&#123;&#125;&#125;代码块的问题。

<!--more-->
##问题描述
默认的&#123;&#123;&#125;&#125;作为嵌入的ruby代码会被解释然后转成其真实的值对应的HTML代码形式。

##举个例子
`{{ page.title }}`代表当前页面的标题，默认情况下，如果执行了`rake generate && rake preview`，这段代码会被解释成了**{{page.title}}**

但是我们想要的是原样输出，类似这样在代码块中。
```html
{% raw %}{{ page.title }}{% endraw %}
```

##如何做到
如果想避免嵌入的ruby代码块被解析，使用&#123;% raw %&#125;和&#123;% endraw %&#125;来包裹不想被解析的代码块即可。示例如下


&#123;% raw %&#125;{% raw %}{{ page.title }}{% endraw %}&#123;% endraw %&#125;
&#123;% raw %&#125;{% raw %}{{ page.url }}{% endraw %}&#123;% endraw %&#125;

##更棘手的
如果出现了`Liquid Exception: Unknown tag 'endraw' in _posts`这样的问题，
使用`&#123;`代替**{**,使用`&#125;`代替**}**

###其他
  * <a href="http://www.amazon.cn/gp/product/B0061XKRXA/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0061XKRXA&linkCode=as2&tag=droidyue-23">代码大全</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0061XKRXA" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B005KGBTQ8/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B005KGBTQ8&linkCode=as2&tag=droidyue-23">松本行弘的程序世界</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B005KGBTQ8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B004WHZGZQ/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B004WHZGZQ&linkCode=as2&tag=droidyue-23">黑客与画家:硅谷创业之父Paul Graham文集</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B004WHZGZQ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
