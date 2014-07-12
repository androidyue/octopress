---
layout: post
title: "Read Output From Shell"
date: 2013-11-05 12:38
comments: true
categories: python linux shell subprocess pipe stdout command  
---
Python provides a lot of method to read output from a just executed shell. However many of them has been deprecated(Not recommened). But subprocess works at present compared to other methods.
```python 
from subprocess import Popen,PIPE,STDOUT
 
def readFromCommand(command) :
    p = Popen(command, shell=True, stdin=PIPE, stdout=PIPE, stderr=STDOUT, close_fds=True)
    result = p.stdout.read().strip()
    return result
    
print readFromCommand('ls')
#result
#0001-.patch
#0001-.patch.zip
#0001-Replace-app_name-into-Browser.patch
```
A detailed description about subprocess has been written down here. http://docs.python.org/2/library/subprocess.html


###Others
  * <a href="http://www.amazon.com/gp/product/1449319793/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1449319793&linkCode=as2&tag=droidyueblog-20&linkId=7L2XQ6AYY5SBBJ5W">Python for Data Analysis: Data Wrangling with Pandas, NumPy, and IPython</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=1449319793" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

