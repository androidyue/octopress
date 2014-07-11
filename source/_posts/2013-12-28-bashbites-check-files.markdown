---
layout: post
title: "BashBites:Check Files"
date: 2013-12-28 10:38
comments: true
categories: bash shell Linux test file directory 
---
###Check a file exists
```bash 
#!/bin/bash
if [[ -e /tmp/adb.log  ]]
then
    echo "Exists"
else
    echo "Not Exists"
fi
```
<!--more-->
###Check Empty String
```bash
if [[ -z "$emptyString"  ]]
then
    echo "Empty"
else
    echo "Not Empty"
fi
```

Here is a reference material from Stackoverflow[http://stackoverflow.com/questions/3767267/check-if-file-exists](http://stackoverflow.com/questions/3767267/check-if-file-exists)
```python
-d FILE
    FILE exists and is a directory
-e FILE
    FILE exists
-f FILE
    FILE exists and is a regular file
-h FILE
    FILE exists and is a symbolic link (same as -L)
-r FILE
    FILE exists and is readable
-s FILE
    FILE exists and has a size greater than zero
-w FILE
    FILE exists and is writable
-x FILE
    FILE exists and is executable
-z STRING
    the length of STRING is zero
```
For more detailed information, please visit [http://linux.about.com/library/cmd/blcmdl1_test.htm](http://linux.about.com/library/cmd/blcmdl1_test.htm)

##Others
  * <a href="http://www.amazon.cn/gp/product/1430219971/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=1430219971&linkCode=as2&tag=droidyue-23">Pro Bash Programming: Scripting the Linux Shell</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=1430219971" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

