---
layout: page
title: "Buy"
date: 2014-09-16 21:30
comments: true
sharing: true
footer: true
---

<script src="http://7jpncc.com1.z0.glb.clouddn.com/masonry.pkgd.min.js"></script>
<link href="http://1.toolite.sinaapp.com/css/buy.css" media="screen, projection" rel="stylesheet" type="text/css">

<script type="text/javascript">
	function getJDRefer() {
		return 'http://union.click.jd.com/jdc?e=&p=AyIPZRprFDJWWA1FBCVbV0IUEEULRFRBSkAOClBMW0srBhVrRnsmXzh2ek4DNmFSHVdNcy1bHRkOIgVTE1gTAhEGVCtZFwISDlEbWhAyImYnKxB7AyIFUxNYEwMQBVUrWxAGEw9TGlwXChYCVitc&t=W1dCFBBFC0RUQUpADgpQTFtL';
	}

	function getTaobaoRefer() {
		var refer;
		if (isDesktop()) {
			refer = 'http://temai.taobao.com?pid=mm_58471937_7778195_46364959';
		} else {
			refer = 'http://ai.m.taobao.com?pid=mm_58471937_7778195_46364959';
		}
		return refer;
	}

	function getTmallRefer() {
		var refer;
		//Expire 2016-12-31
		if (isDesktop()) {
			refer = 'http://s.click.taobao.com/t?e=m%3D2%26s%3Dc%2Fi2s6ZzCnQcQipKwQzePCperVdZeJviK7Vc7tFgwiFRAdhuF14FMaCU3YgAWZ9Nlovu%2FCElQOtvRUYbRlHU7OsSDvD9jGaL5ryjCDjdIrGqeD%2F1CltTpqUuZxIcp9pfUIgVEmFmgnbDX0%2BHH2IEVa7A5ve%2FEYDnFveQ9Ld2jopwTqWNBsAwm%2BIKl4JSR4lzxgxdTc00KD8%3D';
		} else {
			refer = 'http://s.click.taobao.com/t?e=m%3D2%26s%3D4zV5JGoYX8ccQipKwQzePCperVdZeJviK7Vc7tFgwiFRAdhuF14FMe4x4tf9rpoqlovu%2FCElQOtvRUYbRlHU7OsSDvD9jGaL5ryjCDjdIrGqeD%2F1CltTpqUuZxIcp9pfUIgVEmFmgnbDX0%2BHH2IEVa7A5ve%2FEYDnFveQ9Ld2jopwTqWNBsAwm%2BIKl4JSR4lzxgxdTc00KD8%3D';
		}
		return refer;
	}

	function getAmazonRefer() {
		return 'http://www.amazon.cn/?_encoding=UTF8&camp=536&creative=3200&linkCode=ur2&tag=droidyue-23';
	}
	
	function getSuningRefer() {
		return 'https://sucs.suning.com/visitor.htm?userId=7015177&webSiteId=0&adInfoId=0&adBookId=0&channel=14&vistURL=http://chaoshi.suning.com/';
	}
</script>

这是一个购物网站的列表，欢迎从下面网站购物，得到的佣金将用于技术小黑屋网站的日常费用。<br/>

<div id="masonry"> <!-- Masonry container element-->
	<div class="masonry-sizer"></div> <!-- Width of .masonry-sizer used for columnWidth-->
	<div class="masonry-item jd"><a id="jd_link" href="">京东</a></div> <!-- .masonry-item used for itemSelector-->
	<div class="masonry-item masonry-item-height3 taobao"><a id="taobao_link" href="">淘宝</a></div>
	<div class="masonry-item masonry-item-height2 tmall"><a id="tmall_link">天猫</a></div>
	<div class="masonry-item masonry-item-height3 amazon"><a id="amazon_link">亚马逊</a></div>
	<div class="masonry-item masonry-item-height3 suning"><a id="suning_link">苏宁易购</a></div>


</div>

<script type="text/javascript">
$(document).ready(function(){
	var $masonry = $('#masonry').masonry({ // Initialize with jQuery
		itemSelector: '.masonry-item',
		columnWidth: '.masonry-sizer',
		percentPosition: true // Set to true for fluid layout and responsive design
	});
	$masonry.on('click', '.masonry-item', function(){
		console.info($(this));
		//$(this).toggleClass('masonry-item-enlarged');
		//$masonry.masonry(); // Re-initialize Masonry
	});
});

function addLinkHref(elementId, href) {
	var e = document.getElementById(elementId);
	if (e) {
		e.href = href;
	}
}

addLinkHref('jd_link', getJDRefer());
addLinkHref('taobao_link', getTaobaoRefer());
addLinkHref('tmall_link', getTmallRefer());
addLinkHref('amazon_link', getAmazonRefer());
addLinkHref('suning_link', getSuningRefer());
</script>





<script type="text/javascript">var jd_union_unid="331185104",jd_ad_ids="506:6",jd_union_pid="CNCfieOdKhDQ9/WdARoAINHT7LQBKgA=";var jd_width=760;var jd_height=90;var jd_union_euid="";var p="ABQPVhxdEQAVNwpfBkgyTUMIRmtKRk9aZV8ETVxNNwpfBkgyR2YKWi1dVFpkIhglQlBHBVVfA3VWcgtZK1kTChEBVRhaFDIQBVUbUhECEwJlKwRRX083HnVaJV1WWggrWxAGEgdUG14UChEFVyta";</script><script type="text/javascript" charset="utf-8" src="http://u.x.jd.com/static/js/auto.js"></script>
<a data-type="3" data-tmpl="800x90" data-tmplid="195" data-rd="2" data-style="2" data-border="1" href="#"></a>
