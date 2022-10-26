---
layout: post
title: "git clone 使用代理，实现百倍加速"
date: 2022-10-26 08:51
comments: true
categories: git proxy github gitlab 
---
有时候我们对 github 的仓库进行 clone 的时候，会发现很慢，甚至是龟速，很不够效率。好在有一个简单且快捷的方法来倍速提升clone 效率。

我们通过检索 git 的帮助文档发现有这样的描述

>If you just want to use proxy on a specified repository, don't need on other repositories. The preferable way is the -c, --config <key=value> option when you git clone a repository. e.g.

<!--more--> 


## 实践起来
```bash 
git clone https://github.com/flutter/flutter.git --config "http.proxy=192.168.1.6:1611"
```

上面的例子

* 通过 `--config "http.proxy=192.168.1.6:1611"` 设置代理
* 其中 `192.168.1.6:1611` 是代理的地址，需要自己搭建或者可用的

上面的配置好，再次执行，基本上可以得到百倍的提效。

