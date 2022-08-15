---
layout: post
title: "unpub 发布原子化处理"
date: 2022-08-16 07:43
comments: true
categories: Dart Flutter unpub git 
---

目前 unpub 作为我们重要的 pub 私有服务托管着 众多的 pubs。在日常的开发过程中，我们也会对pub 做出了一些约束。比如

  * 只允许在 master 或者 release/* 分支发布  
  * 不符合上述条件的分支不允许发布。  


今天我们讨论的问题重点，非上述的问题，而是发布 unpub 的原子性。

<!--more-->

## 非原子化的两步

在讨论原子性之前，我们需要明确有两个步骤。

  * 我们需要执行 `flutter packages pub publish --server=https://pub.aaa.com/ --verbose` 进行发布  
  * 在发布unpub 前后，我们需要将代码推送到远端 gitlab 服务器

## 非原子化的问题
那么如果我们忘记了，最后一步的推送工作，带来的问题可能会很严重

  * 某份代码 A 未被推送，后面的更改再发布 unpub 导致 代码 A 的功能 丢失  
  * 后续发现丢失后，找回代码A 很可能无法 确定 当时的代码修改内容（可能包含其他修改，人的记忆里不总是可靠）
  * 找回后，往往需要投入一定的测试资源验证较为稳妥。


所以，将上面两部合成一步，来作为一个原子操作，显得尤为重要。

## 一个脚本原子化
这里有一个简单，却极为实用的方式，就是这个代码

```bash
#!/bin/bash
git push origin "$(git symbolic-ref -q HEAD 2>/dev/null | cut -d'/' -f 3)"
flutter packages pub publish --server=https://pub.aaa.com/ --verbose
```


下载到本地后，设置文件可执行(加入环境变量)，然后当再次发布 unpub 时 这样处理即可。

```bash
unpubUpload.sh
```





