---
layout: post
title: "Linux 下使用cut命令，实现更好切分数据"
date: 2020-04-25 22:07
comments: true
categories: linux mac unix bsd bash shell cmd cut 
---

## cut是什么
  * 一个Unix终端命令
  * 切割行内容，并进行标准输出
  * 可以按照字节，字符，分隔符进行切分

<!--more-->

## 能有什么用

我们举一个简单的例子（非全部示例）来描述cut有什么用，可以做什么

### 简洁输出，去除干扰冗余信息

比如这个日志，可能会出现折行，另外假设`04-19 18:26:55.605 22750 22883 W`这些列的信息属于干扰信息
```bash
04-19 18:26:55.605 22750 22883 W System.err: java.lang.NoSuchFieldException
04-19 18:26:55.605 22750 22883 W System.err: 	at com.xiaomi.push.au.a(Unknown Source:16)
04-19 18:26:55.605 22750 22883 W System.err: 	at com.xiaomi.push.au.a(Unknown Source:4)
04-19 18:26:55.605 22750 22883 W System.err: 	at com.xiaomi.push.service.z.a(Unknown Source:880)
04-19 18:26:55.605 22750 22883 W System.err: 	at com.xiaomi.push.service.z.a(Unknown Source:188)
04-19 18:26:55.605 22750 22883 W System.err: 	at com.xiaomi.push.service.p.a(Unknown Source:821)
04-19 18:26:55.605 22750 22883 W System.err: 	at com.xiaomi.push.service.p.a(Unknown Source:605)
04-19 18:26:55.605 22750 22883 W System.err: 	at com.xiaomi.push.service.p.a(Unknown Source:11)
04-19 18:26:55.605 22750 22883 W System.err: 	at com.xiaomi.push.service.d.a(Unknown Source:46)
04-19 18:26:55.605 22750 22883 W System.err: 	at com.xiaomi.push.service.ak.b(Unknown Source:50)
04-19 18:26:55.605 22750 22883 W System.err: 	at com.xiaomi.push.service.ak.a(Unknown Source:10)
04-19 18:26:55.605 22750 22883 W System.err: 	at com.xiaomi.push.service.XMPushService$c.a(Unknown Source:8)
04-19 18:26:55.605 22750 22883 W System.err: 	at com.xiaomi.push.service.XMPushService$i.run(Unknown Source:37)
04-19 18:26:55.605 22750 22883 W System.err: 	at com.xiaomi.push.service.g$c.run(Unknown Source:175)
04-19 18:27:24.787 23660 23685 W System.err: load vdr indoor lib success.
```

使用cut 我们可以实现删除上面的冗余信息
```bash
adb logcat | grep "System.err" --line-buffered | cut -d " " -f 6-
System.err: java.lang.NoSuchFieldException
System.err: 	at com.xiaomi.push.au.a(Unknown Source:16)
System.err: 	at com.xiaomi.push.au.a(Unknown Source:4)
System.err: 	at com.xiaomi.push.service.z.a(Unknown Source:880)
System.err: 	at com.xiaomi.push.service.z.a(Unknown Source:188)
System.err: 	at com.xiaomi.push.service.p.a(Unknown Source:821)
System.err: 	at com.xiaomi.push.service.p.a(Unknown Source:605)
System.err: 	at com.xiaomi.push.service.p.a(Unknown Source:11)
System.err: 	at com.xiaomi.push.service.d.a(Unknown Source:46)
System.err: 	at com.xiaomi.push.service.ak.b(Unknown Source:50)
System.err: 	at com.xiaomi.push.service.ak.a(Unknown Source:10)
System.err: 	at com.xiaomi.push.service.XMPushService$c.a(Unknown Source:8)
System.err: 	at com.xiaomi.push.service.XMPushService$i.run(Unknown Source:37)
System.err: 	at com.xiaomi.push.service.g$c.run(Unknown Source:175)
```

## 按照字节切分(cut -b)

### 按照字节位置切分
```bash
# 取第一个字节
pi@raspberrypi:~ $ echo "abcdef" | cut -b 1
a


# 取第二个字节
pi@raspberrypi:~ $ echo "abcdef" | cut -b 2
b


# 从1开始，0会报错
pi@raspberrypi:~ $ echo "abcdef" | cut -b 0
cut: byte/character positions are numbered from 1
Try 'cut --help' for more information.
```

### 按照字节区间切分
```bash
#1到2字节位置切分
pi@raspberrypi:~ $ echo "abcdef" | cut -b 1-2
ab

# 限定区间起始位置，不限定结束位置
pi@raspberrypi:~ $ echo "abcdef" | cut -b 1-
abcdef

# 限定区间结束位置，但不限定起始位置
pi@raspberrypi:~ $ echo "abcdef" | cut -b -5
abcde
```

### 按照字节多个位置切分
```bash
pi@raspberrypi:~ $ echo "abcdef" | cut -b 1,3,5
ace
```


## 按照字符区分

当我们按照字符进行切分时，会遇到一些问题，比如出现中文的时候（一个中文占用三个字节）
```bash
# 异常出现
echo "小黑屋" | cut -b 1
�

##必须限定满足正确的开始和结束位置
echo "小黑屋" | cut -b 1-3
小
```

但是如果中英文并存，就比较麻烦了，好在有按照字符切分的方法(cut -c)

```bash
echo "abcd技术小黑屋ef" | cut -c 7
小

echo "abcd技术小黑屋ef" | cut -c 7-9
小黑屋

echo "abcd技术小黑屋ef" | cut -c 7,8,9
小黑屋

echo "abcd技术小黑屋ef" | cut -c 5-
技术小黑屋ef

echo "abcd技术小黑屋ef" | cut -c -9
abcd技术小黑屋
```

## 按照分隔符切分（cut -d ）
```bash
echo "A|BC|DEF|GHIJ" |  cut -d "|" -f 1
A

echo "A|BC|DEF|GHIJ" |  cut -d "|" -f 2
BC

echo "A|BC|DEF|GHIJ" |  cut -d "|" -f 3
DEF

# 区间，限定开始位置
echo "A|BC|DEF|GHIJ" |  cut -d "|" -f 1-
A|BC|DEF|GHIJ

#区间，限定结束位置
echo "A|BC|DEF|GHIJ" |  cut -d "|" -f -3
A|BC|DEF

# 区间，限定开始和结束位置
echo "A|BC|DEF|GHIJ" |  cut -d "|" -f 1-2
A|BC

#提供多个位置
echo "A|BC|DEF|GHIJ" |  cut -d "|" -f 1,2
A|BC

```

## 注意
  * 上面为了示例简单实用了echo 加管道的方式
  * 上面所有的例子，都可以实用类似加文件的形式
  * 比如`cut -b 1 test_cut_file.txt`,`cut -c 1 test_cut_file.txt`,`cut -d "|" -f 1 test_cut_file.txt`

## 更多
  * [更多Linux文章](https://droidyue.com/blog/categories/linux/)
  * [更多脚本文章](https://droidyue.com/blog/categories/jiao-ben/)

