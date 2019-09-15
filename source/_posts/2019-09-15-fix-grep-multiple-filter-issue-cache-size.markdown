---
layout: post
title: "解决 grep 的多次管道过滤问题"
date: 2019-09-15 20:50
comments: true
categories: grep linux mac 缓存 管道 cli 过滤 buffer
---

在日常的开发过程中，我们利用`grep`可以方便快捷的查找感兴趣的日志内容，极大地提升了开发和排错效率。但是有时候，我们也会遇到一些问题，比如。

<!--more-->

1. `crazy.log` 是某个进程不断输出日志的文件
2. 我们使用`tail -f crazy.log`来检测日志的产生
3. 我们在前面的基础上利用管道增加一层过滤筛选感兴趣的内容。
```bash
tail -f crazy.log | grep Hello
Hello,printting from Ruby
Hello,Time is 1566096393
Hello,printting from Ruby
Hello,Time is 1566096393
Hello,printting from Ruby
Hello,Time is 1566096393
Hello,printting from Ruby
Hello,Time is 1566096393
Hello,printting from Ruby
Hello,Time is 1566096393
```
4. 那么当我们再次增加一个过滤是，却没有内容（立即）产生了

```bash
➜  /tmp tail -f crazy.log | grep Hello | grep Time


```



## 如何解决
```bash
tail -f crazy.log | grep --line-buffered Hello | grep Time
Hello,Time is 1566096393
Hello,Time is 1566096393
Hello,Time is 1566096393
Hello,Time is 1566096393
Hello,Time is 1566096393
```

如上，我们使用grep的选项`--line-buffered`即可。

## line-buffered 是什么
>     --line-buffered
             Force output to be line buffered.  By default, output is line buffered when standard output is
             a terminal and block buffered otherwise.

上面的意思是
  
  * 强制输出结果使用行缓冲
  * 默认情况下，如果标准输入时终端，则使用line bufferred
  * 否则，使用块缓冲，（默认的大小为4096 bytes，因系统和配置而异）

所以，这也就解释了为什么双重grep过滤没有内容，因为没有达到块缓冲限制。



以上。

