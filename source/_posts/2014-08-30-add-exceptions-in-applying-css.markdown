---
layout: post
title: "也说CSS之not：为样式加入例外处理"
date: 2014-08-30 11:37
comments: true
categories: 也说 CSS
---

使用Octopress作为日常的博客发布工具，在加入多说评论的时候遇到了一个问题，顺带接触了css中的not选择，**用来将某些Css选择器加入例外，不应用指定的css样式**。
<!--more-->
##用法
 :not(selector),参数selector为css中的选择器，可以是元素，类，id等。如不清楚，可以查阅<a href="http://www.w3school.com.cn/cssref/css_selectors.asp" target="_blank">CSS3 选择器</a>了解详细。
 
 语法
```css lineos:false
/*单个使用*/
 :not(selector) {
  property: value;
}
/*多个使用*/
 :not(selector1):not(selector2) {
  property: value;
}
```
 


##例子
下面代码，所有的li元素都有一个样式，就是背景色设置为红色，这里我们把class为special和id为specialLi的li元素加入例外，不应用这个样式，我们就可以这样做。
```html lineos:false
<head>
    <style type="text/css">
        li:not(.special):not(#specialLi) {
            background-color: red
        } 
    </style>
</head>
<ul>
<li class="special">Android</li>
<li>Chrome</li>
<li id="specialLi">Google Glass</li>
</ul>
```
效果就是如下这样
<ul>
<li class="special">Android</li>
<li style="background-color:red">Chrome</li>
<li id="specialLi">Google Glass</li>
</ul>


###其他
  * <a href="http://www.amazon.cn/gp/product/B008HN791U/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B008HN791U&linkCode=as2&tag=droidyue-23">CSS禅意花园</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B008HN791U" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B0011F5SIC/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0011F5SIC&linkCode=as2&tag=droidyue-23">典藏经典：CSS权威指南</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0011F5SIC" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00ASVF4Y8/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00ASVF4Y8&linkCode=as2&tag=droidyue-23">HTML5与CSS3设计模式</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00ASVF4Y8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
