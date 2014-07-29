---
layout: post
title: "Ocotpress集成多说评论"
date: 2014-07-29 21:02
comments: true
categories: Octopress 网站 其他
---

Octopress默认自带了DISQUS，但是对于国内不是很好用。于是一开始替换了国内的友言。但是后来发现用友言的人不多，而且感觉友言加载速度比较慢。然后就是到了今天的多说了。官方并没有给出具体针对Octopress的解决指导。我这里记录一下如何集成，并且解决一些常见的问题。

<!--more-->

##集成

###来说评论框
这就是多说提供的通用代码中,其实理论上以下三个值通过javascript都可以得到的。
```html linenos:false
<!-- 多说评论框 start -->
	<div class="ds-thread" data-thread-key="请将此处替换成文章在你的站点中的ID" data-title="请替换成文章的标题" data-url="请替换成文章的网址"></div>
<!-- 多说评论框 end -->
```
如果换成Octopress（准确的来说是jekyll ）的变量，应该是这样子。
```html linenos:false
<!-- 多说评论框 start -->
<div class="ds-thread" data-thread-key="{% raw %}{{ page.id }}{% endraw %}" data-title="{% raw %}{{ page.title }}{% endraw %}" data-url="{% raw %}{{site.url}}{{ page.url  }}{% endraw %}"></div>
<!-- 多说评论框 end -->
```

###整合公共JS代码
在Octopress的**source/_includes/post**目录下，新建一个文件，比如**duoshuo.html**
其代码如下,
```html source/_includes/post/duoshuo.html linenos:false
<!-- 多说评论框 start -->
<div class="ds-thread" data-thread-key="{% raw %}{{ page.id }}{% endraw %}" data-title="{% raw %}{{ page.title }}{% endraw %}" data-url="{% raw %}{{site.url}}{{ page.url  }}{% endraw %}"></div>
<!-- 多说评论框 end -->
<!-- 多说公共JS代码 start (一个网页只需插入一次) -->
<script type="text/javascript">
    var duoshuoQuery = {short_name:"your_short_name"};
    (function() {

        var ds = document.createElement('script');
        ds.type = 'text/javascript';ds.async = true;
        ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js';
        ds.charset = 'UTF-8';
        (document.getElementsByTagName('head')[0] 
         || document.getElementsByTagName('body')[0]).appendChild(ds);
     })();
 </script>
 <!-- 多说公共JS代码 end -->
```
注意，请修改上面代码中的short_name
```javascript linenos:false
 var duoshuoQuery = {short_name:"your_short_name"};
```

###将文件嵌入到**`<body></body>`**
将上面的文件嵌入到**source/_layouts/post.html**下，可参考下列代码。
```html source/_layouts/post.html linenos:false
  </footer>
  </article>
{% raw %}{% if page.comments == true %}{% endraw %}
  <section>
   {% raw %}{% include post/duoshuo.html %}{% endraw %}
  </section>
 {% raw %}{% endif %}{% endraw %}
</div>
{% raw %}{% unless page.sidebar == false %}{% endraw %}
<aside class="sidebar">
  {% raw %}{% if site.post_asides.size %}{% endraw %}
    {% raw %}{% include_array post_asides %}{% endraw %}
  {% raw %}{% else %}{% endraw %}
    {% raw %}{% include_array default_asides %}{% endraw %}
  {% raw %}{% endif %}{% endraw %}
</aside>
{% raw %}{% endunless %}{% endraw %}
```
到这里，基本可以跑成功了。

##问题解决
###表象
不要高兴的太早，集成后的多说还是有点小问题，就是当需要登陆或者输入邮箱地址的时候，会出现如下图的问题，登陆框的背后有一层带颜色的层。
{%img http://droidyueimg.qiniudn.com/duoshuo_background_issue.png duoshuo issue in Octopress %}

###原因
具体原因是我所使用的css为所有的body div增加了一个背景。下图为id为ds-wrapper的div的背景属性
{%img http://droidyueimg.qiniudn.com/div_background_property.png ds-wrapper div background %}

###解决
昨天晚上自己找到了一个可行的办法，思路就是对所有body div的设置不应用到id为ds-wrapper的div
默认的设置如下。文件为sass/base/_theme.scss
```css sass/base/_theme.scss linenos:false
body {
  > div {
    background: $sidebar-bg $noise-bg;
    border-bottom: 1px solid $page-border-bottom;
    > div {
      background: $main-bg $noise-bg;
      border-right: 1px solid $sidebar-border;
    }
  }
}
```
使用not把ds-wrapper加入例外，修改为这样的设置
```css sass/base/_theme.scss linenos:false
body {
  > div:not(#ds-wrapper){
    background: $sidebar-bg $noise-bg;
    border-bottom: 1px solid $page-border-bottom;
    > div {
      background: $main-bg $noise-bg;
      border-right: 1px solid $sidebar-border;
    }
  }
}

```

到这里，就比较完美的解决了问题，边Google变StackOverflow解决了问题了，哈哈。

##延伸
<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/%3anot?redirectlocale=en-US&redirectslug=CSS%2F%3Anot" target="_blank">CSS not API</a>

###其他
  * <a href="http://www.amazon.cn/gp/product/B00B01LKQ6/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00B01LKQ6&linkCode=as2&tag=droidyue-23">如何以数据驱动决策,提升网站价值</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00B01LKQ6" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B0011BTJV8/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0011BTJV8&linkCode=as2&tag=droidyue-23">访客至上的网页设计秘笈</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0011BTJV8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />


