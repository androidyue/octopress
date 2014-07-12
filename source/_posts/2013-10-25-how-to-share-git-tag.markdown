---
layout: post
title: "How To Share Git Tag"
date: 2013-10-25 19:00
comments: true
categories: git tag
---
Now I have two tags under my git repository. Let's take a look at how to push the git tags to Server.
```bash
v2850
v4.1.1.2000_2852
```
###Push a single tag to the server
```bash
#git push origin tag_name
#Take v2850 for example
git push  origin v2850 
```

###Push all tags to the server
```bash
git push  origin --tags
```

###Others
  * <a href="http://www.amazon.com/gp/product/1449325866/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1449325866&linkCode=as2&tag=droidyueblog-20&linkId=4VH4KYJK2JZU7ZKB">Git Pocket Guide</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=1449325866" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

