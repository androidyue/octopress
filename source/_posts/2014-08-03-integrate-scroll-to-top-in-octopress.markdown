---
layout: post
title: "Octopress添加回到顶部功能"
date: 2014-08-03 20:47
comments: true
categories: Octopress 网站
---
在Octopress当阅读到文章底部的时候，或多或少都想回到顶部，而默认的Octopress没有提供回到顶部的功能，于是一不做二不休，自己找个控件加上。
<!--more-->

##现成的资源
<a href="http://www.scrolltotop.com/" target="_blank">Scroll To Top</a> 这个网站提供了数十种回到顶部的样式。你可以根据自己的需要，添加所中意的widget。

##如何添加

###新建一个文件来存放widget代码
文件归属目录**source/_includes/custom/**,假设文件名为**scroll_to_top.html**
```html linenos:false source/_includes/custom/scroll_to_top.html
<script type="text/javascript" src="http://arrow.scrolltotop.com/arrow37.js"></script>
<noscript>Not seeing a <a href="http://www.scrolltotop.com/">Scroll to Top Button</a>? Go to our FAQ page for more info.</noscript>
```
注意，默认Octopress引入了jquery.min.js，所以没有必要再次引入。

###引入代码
回到顶部功能，不仅仅要在文章页生效，同时也需要对类似归档页面有效才完美。于是我们需要找一个公用的位置。这个位置就是**source/_layouts/default.html**
```html linenos:false source/_layouts/default.html
  <footer role="contentinfo">{% raw %}{% include footer.html %}{% endraw %}</footer>
  {% raw %}{% include after_footer.html %}{% endraw %}
  {% raw %}{% include custom/scroll_to_top.html %}{% endraw %}
</body>
</html>
```


##更加完美
Octopress默认的为所有的div添加了一个背景，所以上述完成之后看到的图片是有一个灰色背景的，需要去除一下。修改以下文件即可。**sass/base/_theme.scss**
```css linenos:false sass/base/_theme.scss
body {
  > div:not(#ds-wrapper):not(#topcontrol){
    background: $sidebar-bg $noise-bg;
    border-bottom: 1px solid $page-border-bottom;
    > div {
      background: $main-bg $noise-bg;
      border-right: 1px solid $sidebar-border;
    }
  }
}
```
其中我们添加的div的id为topcontrol。当然前面的ds-wrapper是为了去除多说评论框登陆的背景问题，如不需要可以去掉。

到这里，你已经完成了一个可以秒杀新浪微博的回到顶部的功能啦，恭喜哈。

###其他
  * <a href="http://www.amazon.cn/gp/product/B00B01LKQ6/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00B01LKQ6&linkCode=as2&tag=droidyue-23">如何以数据驱动决策,提升网站价值</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00B01LKQ6" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B0011BTJV8/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0011BTJV8&linkCode=as2&tag=droidyue-23">访客至上的网页设计秘笈</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0011BTJV8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00C5KS5AA/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00C5KS5AA&linkCode=as2&tag=droidyue-23">极客:改变世界的创新基因</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00C5KS5AA" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

