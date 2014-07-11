---
layout: post
title: "How To Summarize Folder Size In Terminal"
date: 2014-05-11 11:49
comments: true
categories: 
---
In this post, we will use the **du** command. This command does estimate file space usage; and It will summarize disk usage of each FILE, recursively for directories.  
<!-- more -->
The description on the arguments we will use.
>-h, --human-readable
print sizes in human readable format (e.g., 1K 234M 2G)
>-s, --summarize
display only a total for each argument


###How to Summarize a single Folder Size 

```bash
#Summarize the current folder size.
11:33:57-androidyue~/googlecode$ du -sh
85M	.
```

###Summarize a certain folder size.
```bash
11:34:03-androidyue~/googlecode$ du -sh apps-for-android/
11M	apps-for-android/
```

###How to summarize multiple folders sizes
```bash
11:35:17-androidyue~/googlecode$ ls | xargs du -sh
11M	apps-for-android
22M	depot_tools
740K	_gclient_src_fo4RrR
42M	gerrit
11M	reviewboard-read-only
```
More detailed information
> ls - list directory contents  
Description:List  information about the FILEs (the current directory by default)
> xargs - build and execute command lines from standard input

###Others
  * <a href="http://www.amazon.com/gp/product/B0098ERUK2/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B0098ERUK2&linkCode=as2&tag=droidyueblog-20&linkId=FIXJNDL4OGZ4GTKW">Linux Bible</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=B0098ERUK2" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

