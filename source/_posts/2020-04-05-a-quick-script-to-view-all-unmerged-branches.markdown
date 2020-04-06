---
layout: post
title: "未合并分支不怕丢,一个脚本快速搞定"
date: 2020-04-05 21:20
comments: true
categories: git branching 分支管理 ruby 脚本 效率 工程  
---
我们使用 git 作为 版本控制工具，极大的提高了效率，但是随着业务的增多和自身对于提交内容原子性的要求，往往会产生很多的分支，这就难免有时候，在发版的时候，某些分支被遗忘提交，造成功能丢失等问题。

因而如果保证分支多而且不忘记合并，是一个我们需要解决的问题。

  * 单纯靠人为挨个去看，肯定是不行的
  * 如果有程序化处理就靠谱多了

<!--more-->

是的，git有一个这样的功能呢，比如我们想要查看是否有分支没有合并进入develop

```bash
git branch --no-merged develop
```

是的，这能解决问题，但是比如我们迁出了预发布分支(pre_release)，有的分支合并到了pre_release(但没有合并到develop), 上面的查找就不太合适了。


所以我们需要的是

  * 能进行基于多个分支未合并的分支去交集
  * 支持自定义的忽略某些分支出现在未合并分支列表

于是有了下面的脚本


## 脚本内容
```ruby
#!/usr/bin/env ruby
# encoding: utf-8

def getUnmergedBranches(targetBranch)
	return `git branch --no-merged #{targetBranch}`.split(/\n+/).map { |e| e.sub  '*', '' }.map { |e| e.strip }
end

branchesUnmergedToPreRelease = getUnmergedBranches('origin/pre_release')

puts (getUnmergedBranches('origin/develop') & branchesUnmergedToPreRelease).select {|branch| !branch.start_with? "unmerge_ignore_"}
```

上面的脚本做的是

  * 获取未合并进入`origin/develop`的分支集合 A
  * 获取未合并进入`origin/pre_release`的分支集合 B
  * 对于上面的 分支集合 A 和 B 取交集 得到 分支集合 C
  * 在分支集合 C 中提出 自定义忽略分支（以`unmerge_ignore_`开头）


## 脚本使用示例

```bash
~:/  ruby unmergedBranches.rb
checkstyle
error_prone
file_chooser_webview
image_loading
jduan_inter_webview_messaging
jduan_webview_client_refactor
migration_to_androidx
upgrade_gradle_1106
upgrade_gradle_3.2.0
upgrade_suppport_28.0.0
video_preload
```

## 忽略某个分支，不作为unmerged 分支内容
```ruby
#!/usr/bin/env ruby
# encoding: utf-8


puts "Please input the branch to unmerge-ignore"
targetBranch = gets.chomp
puts "You want to ignore this branch:#{targetBranch}, Are you sure? (input yes)"

confirm = gets.chomp

if (confirm == "yes")
	newBranchName = "unmerge_ignore_#{targetBranch}"
	system "git branch -m #{targetBranch} #{newBranchName}"
	puts "changed #{targetBranch} into #{newBranchName}"
end
```

使用上面的脚本，就能够以命令交互的形式忽略某个分支

```bash
~:/ ruby ignoreBranchWhenUnmerged.rb
Please input the branch to unmerge-ignore
new_account_sys
You want to ignore this branch:new_account_sys, Are you sure? (input yes)
yes
changed new_account_sys into unmerge_ignore_new_account_sys
```

以上.

## 更多内容推荐
  * [更多脚本高效工具](https://droidyue.com/blog/categories/jiao-ben/)
  * [小黑屋优质内容](https://droidyue.com/ninki/)
