---
layout: post
title: "树莓派 gitlab问题整理"
date: 2020-03-29 20:15
comments: true
categories: gitalb 树莓派  raspbian raspberry apt 
---

## E: Unable to locate package gitlab-ce
  * 不要使用`sudo curl -sS https://packages.gitlab.com/install/repositories/gitlab/raspberry-pi2/script.deb.sh | sudo bash`
  * 替换使用这个`sudo curl -sS https://packages.gitlab.com/install/repositories/gitlab/raspberry-pi2/script.deb.sh | sudo os=raspbian dist=jessie bash`
  * 然后执行`sudo apt install gitlab-ce`

<!--more-->

## E: The package gitlab-ce needs to be reinstalled, but I can't find an archive for it.
  * 执行`sudo dpkg --remove --force-all  gitlab-ce`


## References
  * https://gitlab.com/gitlab-org/omnibus-gitlab/issues/2767#note_54628738
  * https://askubuntu.com/questions/868064/e-the-package-ubuntu-mono-needs-to-be-reinstalled-but-i-cant-find-an-archive/868227#868227
