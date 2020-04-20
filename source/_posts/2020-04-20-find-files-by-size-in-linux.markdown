---
layout: post
title: "Linux 下按照文件大小查找文件"
date: 2020-04-20 20:33
comments: true
categories: linux find bash shell 
---

## 为什么需要这篇文章

我想大概是这种情况，你的Linux 机器下磁盘满了，需要清理，然后就需要查找大的文件，确定是否有用进行删除。

<!--more-->

## 具体做法

### 查找500M以上的文件

```bash
sudo find / -size +500M

/swap.img
/home/androidyue/file_server/ubuntu_18.04.tar
/home/androidyue/bin/TeamCity-2019.2.2.tar.gz
/proc/kcore
find: ‘/proc/23619’: No such file or directory
```

### 查找整整500M的文件
```bash
sudo find / -size 500M
```

### 查找小于500M的文件
```bash
sudo find / -size -500M
/
/opt
/opt/containerd
/opt/containerd/lib
/opt/containerd/bin
/opt/gitlab
/opt/gitlab/sv
/opt/gitlab/sv/prometheus
/opt/gitlab/sv/prometheus/log
/opt/gitlab/sv/prometheus/log/run
/opt/gitlab/sv/prometheus/log/main
/opt/gitlab/sv/prometheus/log/supervise
/opt/gitlab/sv/prometheus/log/supervise/stat
/opt/gitlab/sv/prometheus/log/supervise/status
/opt/gitlab/sv/prometheus/log/supervise/pid
/opt/gitlab/sv/prometheus/log/supervise/lock
/opt/gitlab/sv/prometheus/log/supervise/ok
/opt/gitlab/sv/prometheus/log/supervise/control
/opt/gitlab/sv/prometheus/run
/opt/gitlab/sv/prometheus/env
```


### 查找大于100M且小于500M的文件
```bash
sudo find / -size -500M -size +100M
/sys/devices/pci0000:00/0000:00:02.0/resource2_wc
/sys/devices/pci0000:00/0000:00:02.0/resource2
/usr/bin/dockerd
```


## 其他查找单位
  * b – for 512-byte blocks (this is the default if no suffix is used)
  * c – for bytes
  * w – for two-byte words
  * k – for Kilobytes
  * M – for Megabytes
  * G – for Gigabytes


## References
  * [https://www.ostechnix.com/find-files-bigger-smaller-x-size-linux/](https://www.ostechnix.com/find-files-bigger-smaller-x-size-linux/)
  * [http://man7.org/linux/man-pages/man1/find.1.html](http://man7.org/linux/man-pages/man1/find.1.html)
