---
layout: post
title: "解决Octopress博客访问慢的问题"
date: 2014-06-22 10:00
comments: true
categories: octopress 慢 谷歌 Google godaddy dnspod github 安全宝 Disqus Twitter Google+ Facebook pinboard delicious analytics fonts.googleapis.com ajax.googleapis.com libs.useso.com ajax.useso.com fonts.useso.com useso
---
解决Octopress博客访问慢的问题
##本博情况
  * 前身为[http://androidyue.github.io](http://androidyue.github.io)
  * 新域名[droidyue.com](http://droidyue.com)从[Godaddy](http://www.godaddy.com/?ci=90231)购买。
  * DNS由[DNSPod](https://www.dnspod.cn/)解析。
  * 内容存放在[Github Pages](https://pages.github.com/)。
  * 博客系统为[Octopress](http://octopress.org/)
<!--more-->
##必不可少的罗嗦
买了这个域名已经一周了，已经决定博客的面向群体为汉语用户。但是发现国内访问还是超级慢，慢的让人无法接收了，当然具体原因，大家都懂得。没办法，尝试使用过安全宝，速度并没有明显替身，反而搜索引擎收录加少了，遂弃用。于是只好自己修改Octopress程序了。修改之前的访问速度以分钟计数。修改完成之后，秒开了有木有。

##清理没用的服务
以下修改均修改`_config.yml`,以下可以根据自己的需要进行去除。
###去除Disqus评论
{%img http://droidyueimg.qiniudn.com/disques_comments.png %}
去除上面红色区域的部分,打开文件找到`Disqus Comments`，按照下面在每一行前面加**#**注释掉即可。
```java
# Disqus Comments
#disqus_short_name: androidyue
#disqus_show_comment_count: true 
```
###去掉Github仓库展示
```java
# Github repositories
#github_user: androidyue
#github_repo_count: 11
#github_show_profile_link: true
#github_skip_forks: true
```
###去除Twitter按钮
```java
# Twitter
#twitter_user: 
#twitter_tweet_button: true
```
###去除Google+相关
```java
# Google +1
#google_plus_one: true
#google_plus_one_size: medium

# Google Plus Profile
# Hidden: No visible button, just add author information to search results
#googleplus_user: 105362551238192049560
#googleplus_hidden: false
```
###去除Pinboard服务
```java
# Pinboard
#pinboard_user:
#pinboard_count: 3
```
###去除Delicious评论,去除后可能没有评论系统
```java
# Delicious
#delicious_user:
#delicious_count: 3
```
###去除Facebook Like
```java
# Facebook Like
#facebook_like: true 
```

##替换快速的请求资源
其实，真正解决加速的重要环节可能是这里，因为Octopress很多依赖于Google的库和资源。

###解决Google Analytics巨慢的问题
对于使用Google Analytics来说，加在ga.js这个文件简直是要命的慢，这里我使用自己存放在[七牛CDN](https://portal.qiniu.com/signup?code=3l8cqx1u74rbm)上的js.http://droidyue-tools.qiniudn.com/ga.js 已验证，完全可以正常收集数据。  
参考如下，修改`source/_includes/google_analytics.html`
```html
     _gaq.push(['_trackPageview']);
 
     (function() {
     var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
     ga.src='http://droidyue-tools.qiniudn.com/ga.js';
     var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
     })();
   </script>
```
###解决fonts.googleapis.com蜗牛慢
这里我们使用数字公司提供的Google Fonts大陆解决方案，使用`fonts.useso.com`替换`fonts.googleapis.com`。  
修改文件`/source/_includes/custom/head.html`
```html
 <!--Fonts from Google"s Web font directory at http://google.com/webfonts -->
<link href="http://fonts.useso.com/css?family=PT+Serif:regular,italic,bold,bolditalic" rel="stylesheet" type="text/css">
<link href="http://fonts.useso.com/css?family=PT+Sans:regular,italic,bold,bolditalic" rel="stylesheet" type="text/css">
```

###解决ajax.googleapis.com慢的问题
修改`source/_includes/head.html`
```html
   <link href="{{ root_url }}/stylesheets/screen.css" media="screen, projection" rel="stylesheet" type="text/css">
   <link href="{{ site.subscribe_rss }}" rel="alternate" title="{{site.title}}" type="application/atom+xml">
   <script src="{{ root_url }}/javascripts/modernizr-2.0.js"></script>
   <script src="//ajax.useso.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
   <script>!window.jQuery && document.write(unescape('%3Cscript src="./javascripts/lib/jquery.min.js"%3E%3C/script%3E'))</script>
   <script src="{{ root_url }}/javascripts/octopress.js" type="text/javascript"></script>
```

##In Conclusion
导致网站慢的原因其实是加载Google的资源，当然我们不能怨Google.经过测试，使用数字公司的解决方法之后，国内国外访问速度都是可以的。这里还是推荐以下数字公司的这个解决方案http://libs.useso.com/  





> Written with [StackEdit](https://stackedit.io/).
