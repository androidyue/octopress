---
layout: post
title: "效率脚本：删除已经合并的git分支"
date: 2014-10-24 22:45
comments: true
categories: 脚本 效率 Git Ruby
---

使用Git管理代码工程，着实方便了很多，但是当做完feature分支或者完成hotfix之后，总是忘记删除这些无用的分支，一个一个地删除着实麻烦，重复手工劳动不符合程序员的风格，于是写了一个简单的脚本。一键删除那些不需要的分支，让多余的干扰信息离开视线。
<!--more-->
##删除哪些分支？
删除的为Merge（合并）操作的源分支。如果工程正在处于分支A(HEAD为A分支),分支B已经合并到了分支A，即A分支包含了B分支的内容，则会删除B分支。

##代码
```ruby
#!/usr/bin/env ruby
# encoding: utf-8
exceptBranches = ['master', 'pre', 'develop']
for branch in `cd #{ARGV[0]} && git branch -l`.split(' ') - ['*']
    next if exceptBranches.include? branch
    system("git branch -d #{branch}")
end
```

##使用方法
```bash
ruby removeMergedBranches.rb your_git_project
```

##执行结果
执行结果类似如下，注意如果没有进行合并，则会提示警告或者错误，这些可以忽略。
```bash
warning: deleting branch 'custom' that has been merged to
         'refs/remotes/origin/custom', but not yet merged to HEAD.
Deleted branch custom (was b63ab7d).
Deleted branch hotfix (was 340cca0).
Deleted branch mgit (was 86b4004).
error: The branch 'develop_rtl' is not fully merged.
If you are sure you want to delete it, run 'git branch -D develop_rtl'.
```


##链接
[在Github上的脚本](https://github.com/androidyue/weekly-scripts/blob/master/ruby/removeMergedBranches.rb)


###学习书籍
  * <a href="http://www.amazon.cn/gp/product/B0058FLC40/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0058FLC40&linkCode=as2&tag=droidyue-23">Git权威指南</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0058FLC40" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B008041DUY/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B008041DUY&linkCode=as2&tag=droidyue-23">七周七语言:理解多种编程范型</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B008041DUY" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
