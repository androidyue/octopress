---
layout: post
title: "使用脚本批量替换文本内容"
date: 2019-10-13 19:07
comments: true
categories: 脚本 bash shell script sed grep find 替换 字符串 文本 linux mac 
---

很多时候，我们需要进行多个文件的查找并替换，虽然IDE有这样的可视化功能，但是偏爱终端的人还是想要尝试用脚本实现一把。如下是一个简单的脚本来实现多文件的查找替换处理。
<!--more-->
## 脚本内容
```bash
#!/bin/sh
# $1 search_keyword
# $2 replace_original
# $3 replace_destination
# $4 search file type


find ./ -type f -name "*.$4" -exec grep -l "$1" {} \; | xargs sed -i "" -e "s/$2/$3/g"
```

### 内容解析  
  * find 查找文件命令使用  
  * -name 限定文件名   
  * -type 限定文件类型，f为常用文件   
  * -exec 执行相关的命令，这里是用来查找关键字   
  * sed 用来执行将源文字替换为目标文字  


我们将上述脚本保存为`replaceText.sh`。

## 执行脚本
```bash
➜  octopress git:(master) replaceText.sh "FD" "FD" "文件描述符" "markdown"
➜  octopress git:(master) ✗ git status
On branch master
Your branch is up to date with 'origin/master'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   source/_posts/2014-02-16-fix-no-sound-issue-on-mac.markdown
	modified:   source/_posts/2014-07-06-my-plan-for-the-left-half-of-2014.markdown
	modified:   source/_posts/2019-06-02-file-descriptor-explained.markdown
	modified:   source/_posts/2019-06-09-will-unclosed-stream-objects-cause-memory-leaks.markdown
	modified:   source/buy/index.markdown
	modified:   source/fuli/index.markdown
```
这样一个很简单快速的功能就实现了。

注：该脚本未在Linux发行版验证，可能有涉及到sed的简单修改。

以上。