---
layout: post
title: "Check If A Python Module Is Installed"
date: 2013-11-16 20:14
comments: true
categories: Python Linux Bash module
---
I was once stucked in How to check Whether a Python module has been installed or not. After Googling, I found this trick.  
Python allows user to pass command from out of a python file.See here  
```bash
-c cmd : program passed in as string (terminates option list)
```
The result if we import an installed module 
```bash
20:15:45-androidyue~/osc_git/LnxClient (master)$ python -c "import os"
20:31:24-androidyue~/osc_git/LnxClient (master)$ echo $?
0
#0 means the module has been installed
```
Now if we import an module which is not installed. 
```bash
20:31:41-androidyue~/osc_git/LnxClient (master)$ python -c "import aaa"
Traceback (most recent call last):
File "<string>", line 1, in <module>
ImportError: No module named aaa
20:31:46-androidyue~/osc_git/LnxClient (master)$ echo $?
1
#1 means that module is not installed.
```


###Others
  * <a href="http://www.amazon.com/gp/product/1449355730/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1449355730&linkCode=as2&tag=droidyueblog-20&linkId=7AFWCWKMVI6GVH3K">Learning Python, 5th Edition</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=1449355730" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

