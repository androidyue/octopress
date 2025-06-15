---
layout: post
title: "使用 flock 解决 Git `unable to read tree` 问题"
date: 2025-06-15 08:49
comments: true
categories: Git Linux Flock Mac 
---

## 背景

在 CI/CD 环境下，团队常遇到以下错误：

```
fatal: unable to read tree <SHA>
```

这通常是多个进程或脚本并发操作同一个 Git 仓库，导致元数据损坏或锁冲突。Git 并非为高并发本地操作设计，因此需要解决并发问题。

<!--more-->

## 问题复现

在自动化脚本中，例如：

```bash
git fetch origin
git checkout some-branch
```

如果多个任务同时执行，可能导致锁冲突或元数据损坏。

## 解决思路

通过加锁机制，让所有 Git 操作串行执行。`flock` 是一个简单高效的工具，专为这种场景设计。

## flock 安装

### Linux

大多数 Linux 发行版自带 `flock`（属于 `util-linux` 套件）。如果没有，可按以下方式安装：

- **Debian/Ubuntu**:

```bash
sudo apt-get update
sudo apt-get install util-linux
```

- **CentOS/RHEL**:

```bash
sudo yum install util-linux
```

- **Arch**:

```bash
sudo pacman -S util-linux
```

安装后即可使用 `flock` 命令。

### macOS

macOS 默认不包含 `flock`，但可通过 Homebrew 安装兼容版本：

```bash
brew install flock
```

安装的是 Ben Noordhuis 的 `flock`，语法与 Linux 版本基本一致。

**提示**：在 CI 服务（如 GitHub Actions）中，可在步骤中提前安装 `flock`。

## flock 用法

`flock` 用于在 shell 脚本中对文件加锁：

```bash
flock <lockfile> <command>
```

建议将锁文件放在 `.git` 目录下，避免污染业务代码目录。

## 实战例子

假设有一个 `deploy.sh` 脚本：

```bash
#!/bin/bash
git fetch origin
git checkout some-branch
# ...more commands...
```

加锁后修改为：

```bash
#!/bin/bash
LOCK_FILE="/path/to/your/repo/.git/deploy.lock"

flock -n "$LOCK_FILE" bash <<'EOF'
git fetch origin
git checkout some-branch
# ...more commands...
EOF
```

或者直接锁定整个脚本：

```bash
flock -n /path/to/your/repo/.git/deploy.lock ./deploy.sh
```

- `-n`：表示拿不到锁时立即退出（可选）。
- 建议将锁文件放在 `.git` 目录下。

## 总结

- 避免并发操作同一个 Git 仓库！
- 使用 `flock` 使 Git 操作串行，防止元数据损坏。
- Linux 下直接使用，macOS 通过 Homebrew 安装 `flock`。
- 锁粒度可适当放宽，确保安全优先。
- 本地自动化操作 Git 时，`flock` 是必备工具，简单高效！

如有问题，请在评论区讨论。
