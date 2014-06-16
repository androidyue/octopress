---
layout: post
title: "Quickly Find Content in Files"
date: 2014-05-15 20:34
comments: true
categories: 
---
Although Eclipse does provide a lot of facilities for Finding content is Workspace files, it maybe less efficient for find something such as a certain package or class usage. Actually we could do it more efficient and geeky.  
<!-- more -->
Now we use the classic Unix command **grep**. 
```bash
#Grammar
grep -E "word_to_search" folder_to_search -R --color=always -n
#Demo
grep -E "android.os.Looper" ./ -R --color=always -n
.//src/com/mining/app/zxing/decoding/DecodeHandler.java:23:import android.os.Looper;
.//src/com/mining/app/zxing/decoding/DecodeThread.java:24:import android.os.Looper;
```
Let's take a look at the command arguments explanation.
>-E, --extended-regexp
Interpret pattern as an extended regular expression (i.e. force grep to behave as egrep).

>-R, -r, --recursive
Recursively search subdirectories listed.

>--colour=[when, --color=[when]]
Mark up the matching text with the expression stored in GREP_COLOR environment variable.  The possible values of when can be `never`, `always` or `auto`.

>-n, --line-number
Each output line is preceded by its relative line number in the file, starting at line 1.  The line number counter is reset for each file processed.

Is this trick awesome? Save it as a bash script named **quickfind.sh**.
```bash
#!/bin/bash
grep -E $1 . -R --color=always -n
```
Then let it executable and just run it.
```bash
chmod a+x quickfind.sh
quickfind.sh "android.os.Looper"
```
> Written with [StackEdit](https://stackedit.io/).
