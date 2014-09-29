---
layout: post
title: "每周一脚本：js设置链接为新标签打开"
date: 2014-09-29 21:59
comments: true
categories: 每周1脚本 Javascript 
---
由于Markdown在编辑Octopress文章的链接时无法指定打开方式，所以很多时候需要使用html写。后来想了一下，为什么不通过javascript把超链接的打开方式默认成新标签实现呢。
<!--more-->

JQuery中提供了一个DOM元素插入事件 DOMNodeInserted ，我们可以通过监听这个事件，对没有target属性值的a标签设置其target为_blank。这样就实现了默认新标签打开了。

###脚本代码
```javascript lineos:false
/*To use the  DOMNodeInserted event listening, jquery is required*/
$(document).bind('DOMNodeInserted', function(event) {
	$('a[href^="http"]').each(
        function(){
			if (!$(this).attr('target')) {
				$(this).attr('target', '_blank')
			}   
        }
    );
});
```

###示例
```html lineos:false
<html>
    <script type="text/javascript" src="//code.jquery.com/jquery-1.11.0.min.js"></script>
    <script type="text/javascript" src="https://rawgit.com/androidyue/weekly-scripts/master/javascript/target_blank_link.js"></script>
    <body>
   		<a href="http://droidyue.com">droidyue</a>
    </body>
</html>
```
上述示例在浏览器加载之后，就会对a标签添加target="_blank"属性。

[每周一脚本@Github](https://github.com/androidyue/weekly-scripts/blob/master/javascript/target_blank_link.js)


###其他
  * <a href="http://www.amazon.cn/gp/product/B0089TDFNS/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0089TDFNS&linkCode=as2&tag=droidyue-23">锋利的jQuery</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0089TDFNS" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00BQ7RMW0/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00BQ7RMW0&linkCode=as2&tag=droidyue-23">编写可维护的JavaScript</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00BQ7RMW0" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00B14IGUK/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00B14IGUK&linkCode=as2&tag=droidyue-23">安全技术大系:Web前端黑客技术揭秘</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00B14IGUK" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
