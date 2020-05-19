---
layout: post
title: "十个超级实用的git命令"
date: 2020-05-19 12:32
comments: true
categories: git linux svn vim bash shell 脚本 script
---

git无疑已经成为了大家代码版本控制最多的工具了，这其中有不少人是使用终端来进行操作git。这里列出一些超级实用的git脚本，希望可以对大家开发有所帮助。

建议大家讲下面的脚本内容，都保存成脚本，然后设置执行权限，将所在目录加入环境变量，这样使用起来更加方便。

<!--more-->

## 查看未合并到master的分支
```bash
#!/bin/bash
git branch --no-merged master
```

## 列出最近修改过的分支
```bash
#!/bin/bash
git for-each-ref --count=30 --sort=-committerdate refs/heads/ --format='%(refname:short)'%
```

## 启用新的vim编写提交信息
执行前的准备（后续无需执行该脚本），设置vim为默认的编辑器
```bash
git config --global core.editor "vim"
```

每次执行的脚本
```bash
#!/bin/bash
git commit -a
```

## 将未提交的修改丢弃，恢复到之前的干净状态
```bash
#!/bin/bash
git reset --hard
```

## 撤销上一个git提交
```bash
 #!/bin/bash
 git reset HEAD~
```

## 未提交情况下，取消对于某个文件的修改
```bash
#!/bin/sh
git reset HEAD $1 && git checkout $1
```

## 查看暂存的差异
用来查看当我们使用`git add`之后的内容的差异

```bash
#!/bin/bash
git diff --cached
```

## 切回上一个分支
```bash
git checkout -
```


## 查找包含某个提交的分支列表
```bash
git branch --contains  9666b5979(commit hash)
```

## 查找包含某个提交的tag列表
```bash
git tag --contains 9666b5979(commit hash)
```

