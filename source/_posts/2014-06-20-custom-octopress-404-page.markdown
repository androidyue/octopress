---
layout: post
title: "自定义Octopress404页面"
date: 2014-06-20 22:44
comments: true
categories: octopress github page 404 公益 搜索引擎 网站地图 search sitemap 
---
刚刚在Octopress实现了自定义的404页面。参考别人的文章写的，很容易实现，谁知发现写完后，感觉自己掉进了一个坑，然后又爬了出来，所以，有必要自己写出来一个超级精简没有坑的帖子帮助别人。
<!--more-->
##最简一步到位
  * 只需执行**rake new_page[404.html]** 然后编辑404.html即可。
  * 执行完上述操作404.html页面会创建在source目录下。
  * 说明：网站404页面必须要在最终的Githug Pages网站根目录。
  * 关于404页面，很多人都喜欢设置成公益页面，这里推荐两个公益爱心404页面， [腾讯公司404](http://www.qq.com/404/)， [益云公益404](http://yibo.iyiyun.com/Index/web404).

我的404.html示例,其中关闭了comments，sharing，去掉了footer。
```html
---
layout: page
title: "404"
date: 2014-06-20 22:06
comments: false
sharing: false
footer: false
---
<script type="text/javascript" src="http://www.qq.com/404/search_children.js" charset="utf-8"></script>
```
**----------------------------实现和完美的分割线--------------------------------**
##高级处理
追求完美的人，请继续读下去。
###禁止搜索引擎索引
  * 修改**source/robots.txt** 如文件不存在请创建。

我的robots.txt示例
```html
---
layout: nil
---
User-agent: *
Disallow: /404.html

Sitemap: {{ site.url }}/sitemap.xml
```

###禁止404页面加入sitemap
  * 修改**plugins/sitemap_generator.rb**
  * 在 EXCLUDED_FILES  中加入404.html

sitemap_generator.rb部分示例
```ruby
SITEMAP_FILE_NAME = "sitemap.xml"

# Any files to exclude from being included in the sitemap.xml
EXCLUDED_FILES = ["atom.xml", "404.html"]
 
# Any files that include posts, so that when a new post is added, the last
# modified date of these pages should take that into account
```
参考资料：https://help.github.com/articles/custom-404-pages
> Written with [StackEdit](https://stackedit.io/).
