---
layout: post
title: "解决Mac终端退出时的不爽"
date: 2014-07-13 14:28
comments: true
categories: Mac
---

##问题
从Fedora切换到Linux下,有很多不适应,与其说不适应不如说不爽,其中一个就是今天要说的终端输入exit的问题.在Linux发行版中,输入exit会推出当前窗口,而Mac居然不是,弄出来一个特别脑残的Process Completed,中文版提示大概是提示进程已完成. 然后什么也不能做,只能关闭.真心有点搞不懂这么设计的用意是什么.
<!--more-->
{%img http://7jpolu.com1.z0.glb.clouddn.com/terminal_process_finished.png Mac Terminal Process Completed %}

##解决
当然遇到问题,解决是很必要的,其实简单修改就可以解决问题.
设置Settings--Shell--When the shell exits 选择close the window 或如图.
{%img http://7jpolu.com1.z0.glb.clouddn.com/terminal_set_close_exit.png Mac Terminal Set Close Window When Exists %}

###Others
  * <a href="http://www.amazon.cn/gp/product/B00A11060M/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00A11060M&linkCode=as2&tag=droidyue-23">Mac功夫:OSX的300多个技巧和小窍门</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00A11060M" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00H1OF8ZA/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00H1OF8ZA&linkCode=as2&tag=droidyue-23">苹果Mac OS X 10.9 Mavericks高手真经</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00H1OF8ZA" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
