---
layout: post
title: "获取shell脚本所在目录"
date: 2014-09-21 17:48
comments: true
categories: Bash Linux Shell
---
前几天写的<a href="http://droidredirect.sinaapp.com/qiniu_redirect.php" target="_blank">七牛</a>的参赛demo，用bash写了一个便捷安装的脚本，涉及到了路径相关的判断，从<a href="http://stackoverflow.com/questions/59895/can-a-bash-script-tell-what-directory-its-stored-in" target="_blank">stackoverflow</a>，加上自己的实践整理一下。
<!--more-->
###简单版
下面是一个最简单的实现，可以解决大多数问题，缺陷是对于软链接显示的是软链接所在的目录
```bash lineos:false
#!/bin/bash
DIR="$( cd "$( dirname "$0"  )" && pwd  )"
```

###完善版
这个版本解决了使用`ln -s target linkName`创造软链接无法正确取到真实脚本的问题。
```bash lineos:false
#!/bin/bash
SOURCE="$0"
while [ -h "$SOURCE"  ]; do # resolve $SOURCE until the file is no longer a symlink
    DIR="$( cd -P "$( dirname "$SOURCE"  )" && pwd  )"
    SOURCE="$(readlink "$SOURCE")"
    [[ $SOURCE != /*  ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE"  )" && pwd  )"
```

###其他
  * <a href="http://www.amazon.cn/gp/product/0596009658/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=0596009658&linkCode=as2&tag=droidyue-23">Learning the Bash Shell</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=0596009658" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B0096EXMS8/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0096EXMS8&linkCode=as2&tag=droidyue-23">Linux命令行与shell脚本编程大全</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0096EXMS8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00N75YP74/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00N75YP74&linkCode=as2&tag=droidyue-23">穿布鞋的马云:决定阿里巴巴生死的27个节点</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00N75YP74" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

