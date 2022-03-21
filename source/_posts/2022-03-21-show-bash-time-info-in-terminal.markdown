---
layout: post
title: "终端下 history 展示时间信息"
date: 2022-03-21 21:40
comments: true
categories: Linux Mac Bash Zsh 脚本 
---

经常使用终端的同学，最常用的命令之一可能就有 history， 它可以帮助我们查看执行过的终端命令的历史信息。

history 执行很简单
```bash
pi@raspberrypi:~ $ history
    1  clear
    2  ls
    3  sudo apt update
    4  df -h
    5  sudo apt install vim
    6  sudo reboot
    7  clear
    8  ls
    9  sudo apt install vim
   10  locale

```
<!--more-->

但是有时候，我们想要获取一些关于历史信息更多的内容，比如 执行某条命令时的时间，来确定一些操作。

## 针对 bash 这样设置
```bash
echo 'HISTTIMEFORMAT="%F %T "' >> ~/.bashrc
source ~/.bashrc
```

然后再次执行即可

```bash
history
    1  2022-02-06 21:55:32 clear
    2  2022-02-06 21:55:32 ls
    3  2022-02-06 21:55:32 sudo apt update
    4  2022-02-06 21:55:32 df -h
    5  2022-02-06 21:55:32 sudo apt install vim
    6  2022-02-06 21:55:32 sudo reboot
    7  2022-02-06 21:55:32 clear
    8  2022-02-06 21:55:32 ls
    9  2022-02-06 21:55:32 sudo apt install vim
   10  2022-02-06 21:55:32 locale

```


但是对于使用了zsh 环境的终端（比如 ohmyzsh 等），上述的配置不生效，需要这样(history -i )使用
```bash
 history -i 
    1  2020-07-05 16:48  mv ~/Downloads/aaaaa.zip ./
    2  2020-07-05 16:48  unzip aaaaa.zip
    3  2020-07-03 21:58  export http_proxy=http://127.0.0.1:1087;export https_proxy=http://127.0.0.1:1087;
    4  2020-07-03 21:58  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    5  2020-07-03 22:10  sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
    6  2020-07-03 22:13  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"\n
    7  2020-07-03 22:44  cd OneDrive

```

