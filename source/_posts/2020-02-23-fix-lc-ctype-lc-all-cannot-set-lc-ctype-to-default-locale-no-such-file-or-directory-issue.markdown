---
layout: post
title: "修复 LC_CTYPE LC_ALL 设置问题"
date: 2020-02-23 17:12
comments: true
categories: LC_CTYPE  LC_ALL bash linux ubuntu locale 
---
## 错误日志
```bash
locale: Cannot set LC_CTYPE to default locale: No such file or directory
locale: Cannot set LC_ALL to default locale: No such file or directory
```

<!--more-->

## 修复方式
第一步
```bash
sudo apt-get purge locales
```

第二步
```bash
sudo aptitude install locales
```

第三部
```bash
sudo dpkg-reconfigure locales
```

如果出现选择locale时，选择`en-us-utf-8`即可。
