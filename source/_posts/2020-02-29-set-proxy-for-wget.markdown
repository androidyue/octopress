---
layout: post
title: "Linux 下 wget 设置代理"
date: 2020-02-29 20:41
comments: true
categories: linux wget proxy 代理curl ubuntu debian 
---

Linux进行网络下载,基本上是wget或者curl,比如我们这样去进行请求,如果没有代理,是访问不了的
```bash
androidyue@in-house-ubuntu:/tmp$ wget google.com
--2020-03-01 11:53:14--  http://google.com/
Resolving google.com (google.com)... 46.82.174.69, 93.46.8.90
Connecting to google.com (google.com)|46.82.174.69|:80... connected.
HTTP request sent, awaiting response... Read error (Connection reset by peer) in headers.
Retrying.

--2020-03-01 11:53:15--  (try: 2)  http://google.com/
Connecting to google.com (google.com)|46.82.174.69|:80...
```



所以,我们想要实现一些功能,需要为wget设置代理.方法很简单

<!--more-->
## 方法一:参数设置
```bash
wget -e http_proxy=192.168.1.8:1611 google.com 

--2020-03-01 11:53:55--  http://google.com/
Connecting to 192.168.1.8:1611... connected.
Proxy request sent, awaiting response... 301 Moved Permanently
Location: http://www.google.com/ [following]
--2020-03-01 11:53:57--  http://www.google.com/
Reusing existing connection to 192.168.1.8:1611.
Proxy request sent, awaiting response... 200 OK
Length: unspecified [text/html]
Saving to: ‘index.html’

index.html                               [ <=>                                                                 ]  12.56K  --.-KB/s    in 0s

2020-03-01 11:54:01 (160 MB/s) - ‘index.html’ saved [12863]
```


### 方法二:配置文件设置
### 进入家目录
```bash
cd ~/
```

### 创建.wgetrc配置文件
```bash
vim .wgetrc
```

### 设置代理
```bash
http_proxy = http://your_proxy:port
https_proxy = http://your_proxy:port
proxy_user = user
proxy_password = password
use_proxy = on
wait = 15
```

以上
