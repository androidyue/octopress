---
layout: post
title: "创建Linux服务，轻松管理（自启动，恢复）进程"
date: 2019-12-29 20:08
comments: true
categories: Linux systemd 环境变量 ruby centos ubuntu 进程 开机启动 service
---

有这样一个场景，在一台服务器上，我们想要启动一个简单的网络文件服务器，用来提供给内网的用户下载。

这里，我们使用ruby启动一个服务

  * 使用`ruby -run -ehttpd /home/webbuild/easy_file_server/  -p8000`启动文件服务器
  * 使用`ruby -run -ehttpd /home/webbuild/easy_file_server/  -p8000 & ` 将该进程设置为后台执行
  * 为了防止挂起，我们还需要使用nohup处理。像这样`nohup ruby -run -ehttpd /home/webbuild/easy_file_server/  -p8000 & `

如上面设置一番，基本上可以工作了。

<!--more-->

但是还有一些问题，比如

  * 进程意外停止了，无法自动启动
  * 服务器重启，该进程也不会自动启动

那么我们有没有什么好的办法解决呢，答案是有的。就是下面介绍的使用systemd创建Linux 服务的方式解决。

## 创建服务Unit文件
创建一个服务文件，比如这里叫做`vim /etc/systemd/system/apk_server.service`(可以将apk_server替换为你希望的名称)

内容如下
```ruby
[Unit]
Description=APK Server Service
StartLimitIntervalSec=0
[Service]
Type=simple
Restart=always
RestartSec=1
User=root
ExecStart=/usr/bin/env ruby -run -ehttpd /home/webbuild/easy_file_server/  -p8000

[Install]
WantedBy=multi-user.target
```

重点可能需要替换的有

  * Description 该服务的描述信息
  * User 填写真实的用户名称，也可以填写root不修改。
  * ExecStart 必须替换为你需要执行的命令。


## 基本搞定了

### 启动服务
```bash
systemctl start apk_server.service
```

### 停止服务
```bash
systemctl stop apk_server.service
```

### 重新启动服务
```bash
systemctl restart apk_server.service
```

### 设置开启自启动
```bash
systemctl enable apk_server.service
//执行结果
Created symlink /etc/systemd/system/multi-user.target.wants/apk_server.service → /etc/systemd/system/apk_server.service.
```

## 其他字段解释
  * StartLimitIntervalSec 启动频率限制，设置为0
  * Restart=always  当进程退出后自动重启
  * RestartSec 重启延迟时间，单位为毫秒
  * WantedBy 自动启动相关参数

## 查看服务状态
```bash
systemctl status apk_server.service
● apk_server.service - APK Server Service
   Loaded: loaded (/etc/systemd/system/apk_server.service; disabled; vendor preset: disabled)
   Active: active (running) since Fri 2019-12-xx 22:06:40 CST; 9s ago
 Main PID: 17802 (ruby)
    Tasks: 2 (limit: 26213)
   Memory: 15.8M
   CGroup: /system.slice/apk_server.service
           └─17802 ruby -run -ehttpd /home/webbuild/easy_file_server/ -p8000

localhost.localdomain systemd[1]: Started APK Server Service.
localhost.localdomain env[17802]: [2019-12-xx 22:06:40] INFO  WEBrick 1.4.2
localhost.localdomain env[17802]: [2019-12-xx 22:06:40] INFO  ruby 2.5.3 (2018-10-18) [x86_64-linux]
localhost.localdomain env[17802]: [2019-12-xx 22:06:40] INFO  WEBrick::HTTPServer#start: pid=17802 port=8000
```

## 配置更新
当我们修改了之前的service文件后，会得到的提示
> Warning: The unit file, source configuration file or drop-ins of apk_server.service changed on disk. Run 'systemctl daemon-reload' to reload units.

所以，当我们每次修改后，都需要执行`systemctl daemon-reload`确保配置生效。


## 排查错误

### 查找错误信息

可以使用使用两种方法

  * 第一种是`systemctl status`，上面介绍的
  * 第二种是`journalctl`


#### journalctl
journalctl相对提供的日志会更多一些，使用方法也很简单

```bash
journalctl -u coo_code_review.service --no-pager --reverse
```

对应的日志就能看到了
```bash
localhost.localdomain systemd[1]: coo_code_review.service: Failed with result 'exit-code'.
localhost.localdomain systemd[1]: coo_code_review.service: Service RestartSec=1s expired, scheduling restart.
localhost.localdomain systemd[1]: coo_code_review.service: Scheduled restart job, restart counter is at 52.
localhost.localdomain systemd[1]: Stopped Coo Code Review Service.
localhost.localdomain systemd[1]: Started Coo Code Review Service.
```


### code=exited, status=217/USER
```bash
apk_server.service - APK Server Service
   Loaded: loaded (/etc/systemd/system/apk_server.service; disabled; vendor preset: disabled)
   Active: activating (auto-restart) (Result: exit-code) since Fri 2019-12-20 14:03:12 CST; 409ms ago
  Process: 17535 ExecStart=/usr/bin/env bash /root/startApkServer.sh (code=exited, status=217/USER)
 Main PID: 17535 (code=exited, status=217/USER)
```
通常的错误原因是上面配置中的User设置的用户名不对。更新正确即可

### 设置工作目录
很多是否我们的命令会是这样

  * 进入一个目录
  * 然后执行命令

但是当我们这样设置`ExecStart=/usr/bin/env cd your_dir && ruby -run -ehttpd easy_file_server/  -p8000`是有问题的。好在可以这样设置工作目录

```ruby
[Unit]
Description=APK Server Service
StartLimitIntervalSec=0
[Service]
Type=simple
Restart=always
RestartSec=1
User=root
WorkingDirectory=/root/your_dir
ExecStart=/usr/bin/env ruby -run -ehttpd /home/webbuild/easy_file_server/  -p8000

[Install]
WantedBy=multi-user.target
```

通过增加`WorkingDirectory=/root/your_dir`可以解决问题。

### 设置环境变量
```bash
[Unit]
Description=xxxxx Service
StartLimitIntervalSec=0
[Service]
Type=simple
Restart=always
RestartSec=1
User=root
Environment="ANDROID_HOME=/opt/android-sdk-linux"
WorkingDirectory=/root/automan/xxx
ExecStart=/usr/bin/env bash /root/automan/xxx/gradlew run

[Install]
WantedBy=multi-user.target
```

使用上面的代码，我们就增加了`ANDROID_HOME=/opt/android-sdk-linux`这个环境变量。

如果是多个环境变量，设置多行`Environment="ANDROID_HOME=/opt/android-sdk-linux"`就行

### 203/EXEC 错误
```bash
localhost.localdomain systemd[1]: Started Coo Code Review Service.
localhost.localdomain systemd[1]: coo_code_review.service: Main process exited, code=exited, status=203/EXEC
localhost.localdomain systemd[1]: coo_code_review.service: Failed with result 'exit-code'.
```

解决方法,增加`/usr/bin/env`
```ruby
ExecStart=/usr/bin/env bash /root/automan/xxxxx/gradlew run
```