---
layout: post
title: "Atom订阅转成RSS2.0"
date: 2014-11-18 21:33
comments: true
categories: Atom RSS
---

Octopress博客自带的只Atom协议的订阅，但是最近提交收录网站时，需要使用RSS协议。于是利用周末简单实现了一下。
<!--more-->
##Atom和RSS
以下为维基百科对Atom和RSS的解释。
>RSS（简易信息聚合）是一种消息来源格式规范，用以聚合经常发布更新数据的网站，例如博客文章、新闻、音频或视频的网摘。RSS文件（或称做摘要、网络摘要、或频更新，提供到频道）包含了全文或是节录的文字，再加上发用者所订阅之网摘布数据和授权的元数据。


>Atom是一對彼此相關的標準。Atom供稿格式（Atom Syndication Format）是用於網站消息來源，基于XML的文档格式；而Atom出版協定（Atom Publishing Protocol，簡稱AtomPub或APP）是用於新增及修改網路資源，基于HTTP的协议。

>Atom借鉴了各种版本RSS的使用经验，被許多的聚合工具广泛使用在发布和使用上。Atom供稿格式設計作為RSS的替代品；而Atom出版協定用來取代現有的多種發布方式（如Blogger API和LiveJournal XML-RPC Client/Server Protocol）。而值得一提的是Google提供的多種服务正在使用Atom。Google Data API（GData）亦基於Atom。

可以访问<a href="http://zh.wikipedia.org/zh/Atom_(%E6%A8%99%E6%BA%96)#Atom.E8.88.87RSS_2.0.E7.9A.84.E6.AF.94.E8.BC.83" target="_blank">Atom與RSS 2.0的比較</a>，了解更详细的内容。

由此可知，Atom是现在和未来的主要供稿格式，而RSS是一个已经声明被冻结的格式。

##Atom转换成RSS
  * clone下这个工程[https://github.com/androidyue/atom2rss](https://github.com/androidyue/atom2rss)
  * 使用`php atom2rss.php input_file output_file`即可完成转换。

###atom2rss.php
```php
<?php
    $source = $argv[1];
    $toFile = $argv[2];
    $atom2rssXsl = dirname(__FILE__).'/atom2rss.xsl';
    $chan = new DOMDocument(); 
    $chan->load($source); 
    $sheet = new DOMDocument(); 
    $sheet->load($atom2rssXsl); 
    $processor = new XSLTProcessor();
    $processor->registerPHPFunctions();
    $processor->importStylesheet($sheet);
    date_default_timezone_set("Asia/Shanghai");
    $result = $processor->transformToXML($chan);
    if (strlen($result)) {
		file_put_contents($toFile, $result);
	}
?>
```
主要依赖的就是进行转换的atom2rss.xml规则。
上述代码可以根据自己的需要设置时区。
