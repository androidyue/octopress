---
layout: post
title: "Octopress中处理加网分享问题"
date: 2014-08-06 19:44
comments: true
categories: Octopress 网站
---

作为一个以内容为中心的网站，在文章结尾增加社会化分享按钮是一种标配，使用Octopress也不例外，本博客选用了加网的社会化分享按钮。开始的时候一切顺利，但是后来出现了一点小瑕疵，具体的情况如下图
<!--more-->
{%img http://droidyueimg.qiniudn.com/jiathis_flash_issue.png Octoress jiathis Issue %}

##究其原因
我们来看看出问题的HTML代码。
```html linenos:false
<div class="flash-video">
    <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="0" height="0" id="JIATHISSWF" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab">
        <param name="allowScriptAccess" value="always">
        <param name="swLiveConnect" value="true">
        <param name="movie" value="http://www.jiathis.com/code/swf/m.swf">
        <param name="FlashVars" value="z=a">
        <embed name="JIATHISSWF" src="http://www.jiathis.com/code/swf/m.swf" flashvars="z=a" width="0" height="0" allowscriptaccess="always" swliveconnect="true" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer">
    </object>
</div>
```

压缩css代码之后发现了这样一段代码。
```css linenos:false
article img,article video,article .flash-video {
	-webkit-border-radius:0.3em;
	-moz-border-radius:0.3em;
	-ms-border-radius:0.3em;
	-o-border-radius:0.3em;
	border-radius:0.3em;
	-webkit-box-shadow:rgba(0,0,0,0.15) 0 1px 4px;
	-moz-box-shadow:rgba(0,0,0,0.15) 0 1px 4px;
	box-shadow:rgba(0,0,0,0.15) 0 1px 4px;
	-webkit-box-sizing:border-box;
	-moz-box-sizing:border-box;
	box-sizing:border-box;
	border:#fff 0.5em solid
}
```
这句话`border:#fff 0.5em solid`就会产生我们所看到的白色的遮挡。
##解决问题
思路：对id为JIATHISSWF的Object不应用包裹flash-video的div即可。
需要修改的文件为**source/javascripts/octopress.js**

###这是原来的代码
```javascript linenos:false source/javascripts/octopress.js
function wrapFlashVideos() {
  $('object').each(function(i, object) {
    if( $(object).find('param[name=movie]').length ){
      $(object).wrap('<div class="flash-video">')
    }
  });
  $('iframe[src*=vimeo],iframe[src*=youtube]').wrap('<div class="flash-video">')
}
```
###这是修改后的代码
```javascript linenos:false source/javascripts/octopress.js
function wrapFlashVideos() {
  $('object').each(function(i, object) {
    if ($(object).attr('id') != "JIATHISSWF") {
      if( $(object).find('param[name=movie]').length ){
        $(object).wrap('<div class="flash-video">')
      }
    }
  });
  $('iframe[src*=vimeo],iframe[src*=youtube]').wrap('<div class="flash-video">')
}
```
OK，到这里就解决问题了，检查一下看看吧。
###其他
  * <a href="http://www.amazon.cn/gp/product/B007VEF454/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B007VEF454&linkCode=as2&tag=droidyue-23">网站优化也是艺术</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B007VEF454" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00G6SNZXY/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00G6SNZXY&linkCode=as2&tag=droidyue-23">就这样设计大型网站</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00G6SNZXY" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00C5KS5AA/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00C5KS5AA&linkCode=as2&tag=droidyue-23">极客:改变世界的创新基因</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00C5KS5AA" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
