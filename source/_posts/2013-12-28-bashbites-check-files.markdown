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
