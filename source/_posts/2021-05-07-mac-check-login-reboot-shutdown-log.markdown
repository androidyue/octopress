---
layout: post
title: "Mac 查看系统的在线，登陆，重启，关机日志时间"
date: 2021-05-07 11:44
comments: true
categories: Mac MBP Login Reboot Shutdown Online
---
有时候，我们需要查询一下机器的信息，比如运行了多长时间，什么时候开机的等等。下面是一些整理，来帮助大家快速通过终端查看信息。

<!--more--> 
## 查看运行时间
```java
17:35  up  7:13, 3 users, load averages: 2.57 2.75 2.56
```

其中`7:13` 为开机后运行的时间

## 最近的重启时间点
```java
➜  2021_04 last reboot
reboot    ~                         Mon Apr 19 10:22
reboot    ~                         Thu Apr 15 10:01
reboot    ~                         Sun Apr 11 14:56
reboot    ~                         Fri Apr  9 11:48
reboot    ~                         Fri Apr  9 11:46
reboot    ~                         Fri Apr  9 11:45
reboot    ~                         Fri Apr  9 11:44
reboot    ~                         Fri Apr  9 11:41
reboot    ~                         Thu Apr  8 09:56
reboot    ~                         Mon Mar 29 09:49
reboot    ~                         Fri Mar 26 14:06
reboot    ~                         Fri Mar 26 14:02
reboot    ~                         Mon Mar 22 09:56
reboot    ~                         Fri Mar 19 09:52
reboot    ~                         Wed Mar 17 19:25
reboot    ~                         Mon Mar 15 09:50
reboot    ~                         Fri Mar 12 13:51
reboot    ~                         Fri Mar 12 09:54
reboot    ~                         Thu Mar 11 12:46

wtmp begins Thu Mar 11 12:46
```

## 最近的关机时间点
```java
➜  2021_04 last shutdown


shutdown  ~                         Fri Apr 16 20:29
shutdown  ~                         Thu Apr 15 10:01
shutdown  ~                         Fri Apr  9 21:10
shutdown  ~                         Fri Apr  9 11:48
shutdown  ~                         Fri Apr  9 11:46
shutdown  ~                         Fri Apr  9 11:45
shutdown  ~                         Fri Apr  9 11:43
shutdown  ~                         Fri Apr  9 11:41
shutdown  ~                         Thu Apr  1 20:07
shutdown  ~                         Fri Mar 26 21:58
shutdown  ~                         Fri Mar 26 14:06
shutdown  ~                         Fri Mar 26 14:02
shutdown  ~                         Fri Mar 19 21:54
shutdown  ~                         Wed Mar 17 19:29
shutdown  ~                         Fri Mar 12 21:57
shutdown  ~                         Fri Mar 12 13:50
shutdown  ~                         Fri Mar 12 09:53

wtmp begins Thu Mar 11 12:46
```

## 最近的登陆时间点

  * 使用方法为`last user_name`即可查看


```java
➜  2021_04 last androidyue
androidyue  ttys001                   Mon Apr 19 10:23   still logged in
androidyue  ttys000                   Mon Apr 19 10:23   still logged in
androidyue  console                   Mon Apr 19 10:23   still logged in
androidyue  ttys001                   Fri Apr 16 19:02 - 19:02  (00:00)
androidyue  ttys002                   Fri Apr 16 17:14 - 17:14  (00:00)
androidyue  ttys001                   Fri Apr 16 17:07 - 17:07  (00:00)
androidyue  ttys001                   Fri Apr 16 14:39 - 14:39  (00:00)
androidyue  ttys000                   Fri Apr 16 14:37 - 14:37  (00:00)
```


以上。
