---
layout: post
title: "Python中字典序列化操作"
date: 2014-07-26 13:32
comments: true
categories: Python
---
JSON是编程中常用的数据结构，各种语言都有良好的支持。字典是Python的一种数据结构。可以看成关联数组。

有些时候我们需要设计到字典转换成JSON序列化到文件，或者从文件中读取JSON。简单备忘一下。
<!--more-->
##Dict转JSON写入文件
```python
#!/usr/bin/env python
# coding=utf-8
import json
d = {'first': 'One', 'second':2}
json.dump(d, open('/tmp/result.txt', 'w'))
```

##写入结果
```bash
cat /tmp/result.txt 
{"second": 2, "first": "One"}
```

##读取JSON
```python
#!/usr/bin/env python
# coding=utf-8
import json
d = json.load(open('/tmp/result.txt','r'))
print d, type(d)
```

##运行结果
```bash
{u'second': 2, u'first': u'One'} <type 'dict'>
```

###其他
  * <a href="http://www.amazon.cn/gp/product/B00GHGZLWS/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00GHGZLWS&linkCode=as2&tag=droidyue-23">利用Python进行数据分析</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00GHGZLWS" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00KYFJTP8/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00KYFJTP8&linkCode=as2&tag=droidyue-23">编写高质量代码:改善Python程序的91个建议</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00KYFJTP8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

