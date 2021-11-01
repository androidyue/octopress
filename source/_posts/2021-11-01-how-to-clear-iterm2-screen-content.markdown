---
layout: post
title: "iTerm2 (Mac Terminal) 清空当前屏幕内容"
date: 2021-11-01 22:08
comments: true
categories: Mac iTerm2 Terminal 终端 bash clear
---

对于经常使用终端的开发者，清空当前屏幕的内容，我们可以使用`clear`。

clear 清空屏幕内容，大多数情况下会满足我们的需求，但是某些场景下还是会有一些问题。

  * 向上滑动，还是能够看到之前的终端内容。
  * 比如我们搜索当前屏幕中的字符，clear 之前的内容还是会被清理掉

<!--more-->

于是，除了clear，那么还有一个更彻底的清除内容的办法，那就是使用 `Command + K`。使用这个方法，就能完美解决上面提到的两个问题。
