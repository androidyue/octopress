---
layout: post
title: "Octopress填坑日记"
date: 2014-06-22 10:44
comments: true
categories: Octopress 404 noise.png line-tile.png rss.png code_bg.png 域名绑定 domain sitemap sitemap.xml _config.yml
---

今日开始开始填Octpress在天朝的坑。
<!--more-->
###文件404问题
{%img http://droidyueimg.qiniudn.com/octopress_404_img.png %}
修改代码简直是太辛苦了。毕竟涉及文件比较多。
于是干脆简单粗暴的把这些文件不存在的文件都创建了吧。直接上代码了
```bash
cd source/
mkdir github
mkdir github/images
cp images/noise.png github/images/
cp images/line-tile.png github/images/
cp images/rss.png github/images/
cp images/code_bg.png github/images/
```

###绑定域名更完美
按照[https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages](https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages)说明的绑定域名可以，但是不够完美。   
举一个例子，我之前的域名为**androidyue.github.io**，新的域名为**droidyue.com**，按照上述操作，可以完成绑定。但是在网站地图文件**sitemap.xml**中还是原来的**androidyue.github.io**。   
如何解决呢，其实将http://androidyue.github.io 换成 http://droidyue.com 即可。修改**_config.yml**文件。以下为修改前后diff。
```xml
diff --git a/_config.yml b/_config.yml
-url: http://androidyue.github.io
+url: http://droidyue.com
 title: 技术小黑屋
 subtitle: Better Than Before
 author: androidyue 
```

> Written with [StackEdit](https://stackedit.io/).
