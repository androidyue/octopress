---
layout: post
title: "防手抖开源之 Git 钩子"
date: 2019-05-04 19:12
comments: true
categories: Git hook github shell
---

最近“从开源到跑路”的事件逐渐增多，给涉事企业造成了不小的损失。因而相关的防范工作显得愈发重要。

客观而言，人为手动的防范显得原始和笨拙，好在git提供了相关的钩子方法，为我们这里的防范提供了可行性。

这里我们以`git push` 命令对应的`pre-push`钩子为例，因为想要开源出去，这个命令通常是必须执行的。

<!--more-->
## 编写git pre-hook

```bash
#!/bin/sh

# An example hook script to verify what is about to be pushed.  Called by "git
# push" after it has checked the remote status, but before anything has been
# pushed.  If this script exits with a non-zero status nothing will be pushed.
#
# This hook is called with the following parameters:
#
# $1 -- Name of the remote to which the push is being done
# $2 -- URL to which the push is being done
#
# If pushing without using a named remote those arguments will be equal.
#
# Information about the commits which are being pushed is supplied as lines to
# the standard input in the form:
#
#   <local ref> <local sha1> <remote ref> <remote sha1>
#
# This sample shows how to prevent push of commits where the log message starts
# with "WIP" (work in progress).

remote="$1"
url="$2"
echo $url

if [[ $url == *"git@github.com"* ]]; then
    echo "github repo refused to push"
    exit 1
fi

if [[ $url == *"https://github.com"* ]]; then
    echo "github repo refused to push"
    exit 1
fi


z40=0000000000000000000000000000000000000000

while read local_ref local_sha remote_ref remote_sha
do
	if [ "$local_sha" = $z40 ]
	then
		# Handle delete
		:
	else
		if [ "$remote_sha" = $z40 ]
		then
			# New branch, examine all commits
			range="$local_sha"
		else
			# Update to existing branch, examine new commits
			range="$remote_sha..$local_sha"
		fi

		# Check for WIP commit
		commit=`git rev-list -n 1 --grep '^WIP' "$range"`
		if [ -n "$commit" ]
		then
			echo >&2 "Found WIP commit in $local_ref, not pushing"
			exit 1
		fi
	fi
done

exit 0
```
拦截代码解释
```bash
remote="$1"
url="$2"
echo $url

if [[ $url == *"git@github.com"* ]]; then
    echo "github repo refused to push"
    exit 1
fi

if [[ $url == *"https://github.com"* ]]; then
    echo "github repo refused to push"
    exit 1
fi
```

上述的代码
  
  * 拦截git协议的到github远程仓库的push请求
  * 拦截https协议的到github远程仓库的push请求

除此之外，我们还可以做什么

  * 可以根据自身需要增加`git@gitee.com`等屏蔽
  * 根据需要，可以判定仓库名称来屏蔽。
  * 编写shell语句，实现更加复杂的拦截处理


完整文件地址: https://asset.droidyue.com/content/pre-push



## 针对单个Repo生效
将上述pre-push 放入项目的`.git/hooks/`下面即可


## 针对全局生效
git 2.9 开始支持
设置全局git hook路径
```bash
git config --global core.hooksPath  /Users/yourUserName/.git/hooks
```

将上述pre-push 放入`/Users/yourUserName/.git/hooks`


支持文件可执行权限
```
chmod a+x your_pre_push_hook_path
```


## 效果演示
```bash
xxx@bogon:/tmp/vim_katana(master|✔) % git push origin master
git@github.com:androidyue/vim_katana.git
github repo refused to push
error: failed to push some refs to 'git@github.com:androidyue/vim_katana.git'
```

## 效果有多少
防止恶意开源，并不能。只是理论上稍微提高了一点门槛。
  
这是因为

  * 恶意开源者可能删除这些git钩子
  * 恶意开源者可以使用别的形式公开代码

## 它能做什么
  * 如题所属，它是自身无意原因或者某些恶意中间环节导致开源的最后一道防线。

源码安全无小事，事事需谨慎。

## 内容推荐
  * [pre-commit钩子实例](https://droidyue.com/blog/2016/05/22/use-checkstyle-for-better-code-style/)
