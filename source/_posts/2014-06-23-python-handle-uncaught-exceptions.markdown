---
layout: post
title: "处理Python未捕获异常"
date: 2014-06-23 21:01
comments: true
categories: Python Exception logger trackback error try catch 异常 callback hook
keywords:  "python exception trackback hook try catch error logger"
---

###Talk Is Cheap
和Java一样,python也提供了对于checked exception和unchecked exception. 对于checked exception,我们通常使用**try except**可以显示解决,对于unchecked 异常,其实也是提供回调或者是钩子来帮助我们处理的,我们可以在钩子里面记录崩溃栈追踪或者发送崩溃数据.   
下面代码可以实现python unchecked exception回调,并输出日志信息.
<!--more-->
###Show Me The Code
```python
#!/usr/bin/env python
# coding=utf-8
import os, sys
import logging
logger = logging.getLogger(__name__)
handler = logging.StreamHandler(stream=sys.stdout)
logger.addHandler(handler)

def handle_exception(exc_type, exc_value, exc_traceback):
    if issubclass(exc_type, KeyboardInterrupt):
        sys.__excepthook__(exc_type, exc_value, exc_traceback)
        return
    logger.error("Uncaught exception", exc_info=(exc_type, exc_value, exc_traceback))

sys.excepthook = handle_exception
if __name__ == "__main__":
    raise RuntimeError("Test unhandled Exception")
```
###相关解释
  * 上述忽略处理终端下键盘按Ctrl + C 终止异常.
  * 上述使用python的日志管理模块输出格式化的异常信息.

###参考文章
http://stackoverflow.com/questions/6234405/logging-uncaught-exceptions-in-python/16993115#16993115


> Written with [StackEdit](https://stackedit.io/).
