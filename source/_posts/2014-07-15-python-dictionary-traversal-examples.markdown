---
layout: post
title: "Python中的字典遍历"
date: 2014-07-15 19:21
comments: true
categories: Python
---
备忘一下python中的字典如何遍历,没有什么太多技术含量.仅供作为初学者的我参考.
<!--more-->
```python
#!/usr/bin/env python
# coding=utf-8
demoDict = {'1':'Chrome', '2':'Android'}

for key in demoDict.keys():
    print key

for value in demoDict.values():
    print value

for key in demoDict:
    print key, demoDict[key]


for key, value in demoDict.items():
    print key, value

for key in demoDict.iterkeys():
    print key

for value in demoDict.itervalues():
    print value

for key, value in demoDict.iteritems():
    print key, value

print 'dict.keys()=', demoDict.keys(), ';dict.iterkeys()=', demoDict.iterkeys()
```
##interitems和iterms区别
  * 参考 http://stackoverflow.com/questions/10458437/python-what-is-the-difference-between-dict-items-and-dict-iteritems

###Others
  * <a href="http://www.amazon.cn/gp/product/B003TSBAMM/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B003TSBAMM&linkCode=as2&tag=droidyue-23">Python基础教程</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B003TSBAMM" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

