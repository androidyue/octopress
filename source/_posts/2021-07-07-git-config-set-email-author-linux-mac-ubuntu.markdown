---
layout: post
title: "Git 中 设置 提交者 email 的多种方式"
date: 2021-07-07 11:50
comments: true
categories: git linux mac ubuntu bash svn
---

## 需求场景
  * 针对项目 A 使用  aaa@aaa.com 邮箱
  * 针对除了项目A之外的项目 使用  bbb@bbb.com 邮箱

<!--more--> 

## git 配置的三种作用范围
  * 项目级,英文为`project`.
  * 全局（当前用户），英文为 `global`.
  * 系统级（针对所有用户），英文为`system`.

### 项目级配置

为当前项目设置`aaa@aaa.com` 作为代码提交者的邮箱。
```java
git config user.email "aaa@aaa.com"
```

检索一下设置，进行验证是否成功
```java
git config --get user.email
aaa@aaa.com
```

几点注意

  * 该设置只针对于当前项目，其他项目不生效。
  * 该项目对应的远程地址再次clone 下来的项目也不生效。
  * 该修改不会随着`git push`推送到远程服务器中。
  * 配置设置持久化在当前项目的`.git/config`文件中。


### 全局配置
我们为当前用户设置默认的代码提交者的邮箱（即例子中除A项目外的）
```java
git config --global user.email "bbb@bbb.com"
```

再次检索一下配置是否生效
```java
git config --global --get user.email
bbb@bbb.com
```

几点注意

  * 该配置方式只对当前用户生效，其他用户不生效。
  * 配置设置持久化在`~/.gitconfig`文件中。

### 系统级设置
这是一种为所有的用户和项目设置默认git配置的方式
```java
sudo git config --system user.email "ccc@ccc.com"
```

再次验证一下配置是否生效
```java
git config --system --get user.email
ccc@ccc.com
```

几点注意

  * 这种设置需要使用root权限
  * 配置设置持久化在`/etc/gitconfig`中。
  * 一般情况下这种配置使用频率不高。
