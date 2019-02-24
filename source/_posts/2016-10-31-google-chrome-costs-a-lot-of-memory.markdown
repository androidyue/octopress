---
layout: post
title: "解决Mac下Chrome发热严重的问题"
date: 2016-10-31 22:19
comments: true
categories: Chrome Mac
---

Mac电脑是一款程序员得力的开发机器,而Chrome也是一个高效率的浏览器.通常,大多数开发都会在Mac上使用Chrome.我也不例外,只是最近遇到了一些比较麻烦的事情.

那就是自从用了Chrome之后，电脑发热太严重了，有时候都可以在上面煎个鸡蛋了。

<!--more-->

打开电脑进程管理器，发现了Chrome进程居然这么多。

![google_chrome_helper_process.png](//asset.droidyue.com/broken_images/chrome_helper_process.png)

后来Google到了一些解决方案，做法如下

1. 打开Chrome浏览器  
2. 进入设置  
3. 选择`Show advanced settings`  
4. 点击Privacy下面的Content Settings  
5. 向下翻到Plugins,选择如下图的`Let me choose when to run plugin content`  
![chrome_plugin_settings.png](https://asset.droidyue.com/broken_images/chrome_plugin_settings.png)

实际上，上面的操作主要是关闭一些Flash相关的插件。因为Flash是电脑中的散热大户，比如同样一段视频，在国内的优酷（使用flash）播放，小本本的温度摸上去真让人心疼，然而在YouTube（使用HTML5）则几乎温度没有什么上升。

进行了上面的设置后，当遇到Flash的问题后，需要手动在网站上开启。

##参考文章
  * ["google chrome helper" using too much CPU?](https://discussions.apple.com/thread/5572267?start=0)
