---
layout: post
title: "关于仓库的批量处理脚本，效率提升 500%"
date: 2022-09-04 21:57
comments: true
categories: 脚本 效率 Git Gitlab Github grep find 
---
很多时候，我们会遇到这样的场景

  * 换了新电脑，需要挨个 clone gitlab repos？
  * 无法确定哪个 repo 包含了 maven.aliyun.com 这个设置？
  * 能否批量更新 本地的 repos？

如果你有上述的疑问或者情况，你可以尝试本文中的一些批量处理 repos 的方法

<!--more-->

## 批量 clone
```bash
ruby cloneRepos.rb code-git-xxxxxx ../projects/
```

其中 cloneRepos.rb 脚本内容如下
```ruby
#!/usr/bin/env ruby
# encoding: utf-8
require 'httparty'
require 'json'


def cloneRepos(repoUrlApi)
    headers = {
        'PRIVATE-TOKEN': ARGV[0],
    }

    response = HTTParty.get(repoUrlApi, headers: headers)
    data = JSON.parse(response.body);
    puts data.length()
    data.each { |e|
        name = e['name']
        gitUrl = e['ssh_url_to_repo']
        system "cd #{ARGV[1]} && git clone  #{gitUrl}"
        puts name
    }
end


cloneRepos('https://code.hahaha.io/api/v4/projects?per_page=100')
cloneRepos('https://code.hahaha.io/api/v4/projects?per_page=100&page=2')

```

### 参数解释
  * code-git-xxxxxx 从 gitlab 获取的token，根据下图指示获取

![https://asset.droidyue.com/image/2022/h2/QQ20220904-220957%402x.png](https://asset.droidyue.com/image/2022/h2/QQ20220904-220957%402x.png)


  * ../projects 存放的目录


### 注意

这个脚本目前只能处理 前200个 repos，如果有需要，可以自行修改代码处理。
批量工程检索

## 快速查找

比如我们想要搜索 maven.aliyun.com 

```bash
projects gradleSearch.sh maven.aliyun.com

./xxxx/example/android/build.gradle:7:            url 'http://maven.aliyun.com/nexus/content/repositories/releases/'

./xxxxx/example/android/build.gradle:23:            url 'http://maven.aliyun.com/nexus/content/repositories/releases/'

./xxxx/android/build.gradle:22:            url 'https://maven.aliyun.com/repository/public/'

./xxxx/example/android/build.gradle:6:        maven {url 'https://maven.aliyun.com/repository/google'
```


其中 gradleSearch.sh 的内容如下
```bash
#!/bin/bash
find . -name "*.gradle" | xargs grep -E -n --color=always -r "$1"

```



## 批量更新 
```bash
updateRepo.sh
```

它的内容是这样的
```bash
#!/bin/bash
for dir in */; do
    echo "$dir"
    realpath=`realpath $dir`
    echo $realpath
    cd $realpath
    git checkout master
    git pull origin master
    cd -
done

```



### 注意
  * 如果当前repo 有未提交修改，则无法更新。 


通过上面的几个脚本，我们可以轻松实现效率提升。












