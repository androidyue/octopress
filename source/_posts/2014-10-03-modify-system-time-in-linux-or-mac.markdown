---
layout: post
title: "修改Linux系统时间的最简单方法"
date: 2014-10-03 21:07
comments: true
categories: Linux Mac
---
在Linux桌面发行版提供了设置系统时间的界面程序，这个设置很简单，但是当你学会了下面的方法之后，你就开始厌烦用GUI界面设置了。

最简单的设置方法 就是创建一个符号链接/etc/localtime，其指向目标设置的时区城市代表（/usr/share/zoneinfo/ 目录下）
<!--more-->
比如我们想把机器的时区修改成亚洲的上海（东八区），我们按照下面操作就可以了。

其中s选项代表是符号链接，f选项代表强制删除目标。
```bash
sudo ln -sf /usr/share/zoneinfo/Asia/Shanghai  /etc/localtime
```
注意，Asia通常是没有Beijing的，可能没有上海国际化吧，所以如果是东八区就要用上海。

经测试，Mac机器上述命令也是生效的。

###其他
  * <a href="http://www.amazon.cn/gp/product/B00BQTWC0U/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00BQTWC0U&linkCode=as2&tag=droidyue-23">Linux命令行大全</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00BQTWC0U" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00LF4UPWS/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00LF4UPWS&linkCode=as2&tag=droidyue-23">Linux就是这个范儿</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00LF4UPWS" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B003TJNO98/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B003TJNO98&linkCode=as2&tag=droidyue-23">鸟哥的Linux私房菜:基础学习篇</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B003TJNO98" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

