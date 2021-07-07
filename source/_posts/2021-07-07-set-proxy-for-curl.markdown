---
layout: post
title: "curl 设置代理，看这篇就够了"
date: 2021-07-07 12:17
comments: true
categories: curl linux mac proxy socks http https ubuntu
---
curl 是一个很有名的处理网络请求的 类Unix 工具。出于某种原因，我们进行网络请求，需要设置代理。本文讲全面介绍如何为 curl 设置代理。

## 设置代理参数

### 基本用法
```java
-x, --proxy [protocol://]host[:port]
```
<!--more-->
### 设置 http 代理 示例

下面两种设置代理的方式是可以的。

```java
curl -x "http://user:pwd@127.0.0.1:1234" "http://httpbin.org/ip"
```

```java
curl --proxy "http://user:pwd@127.0.0.1:1234" "http://httpbin.org/ip"
```

由于代理地址的默认协议为`http`, 所以可以省略，按照下面的形式，也是可以的。

```java
curl --proxy "user:pwd@127.0.0.1:1234" "http://httpbin.org/ip"
```

## 使用环境变量
除了直接使用`curl`参数选项外，还可以使用全局的环境变量来处理。

其中关于环境变量

  * 针对系统全局的环境变量进行设置
  * 具体是否生效，取决于工具是否读取采用对应的环境变量。curl 是支持的。
  * 临时修改可以直接执行下面命令设置
  * 永久修改，需要讲下面的命令放到对应的配置文件，比如`~/.bashrc`或者`~/.zshrc`

```java
# 设置 http proxy
export http_proxy="http://user:pwd@127.0.0.1:1234"
# 设置 https proxy
export https_proxy="http://user:pwd@127.0.0.1:1234"
```

取消 http,https 代理
```java
unset http_proxy
unset https_proxy
```

## curl 配置文件设置代理
此外，还有第三种方法，就是为curl 设置专有名词的配置文件。

### 新建或打开 `~/.curlrc`文件
```bash
vim ~/.curlrc
```

### 增加 proxy 设置
```bash
proxy="http://user:pwd@127.0.0.1:1234"
```

## 覆盖/忽略 代理

当存在多个代理配置的时候，curl 配置选项的优先级最高，因此可以使用下面的方法覆盖其他的配置

```java
curl --proxy "http://user:pwd@1.0.0.1:8090" "http://httpbin.org/ip"
```

当存在其他的代理配置文件时，我们却不希望使用代理，可以使用下面的方式进行代理忽略

```java
curl --noproxy "*" "http://httpbin.org/ip"
```

## References
  * https://oxylabs.io/blog/curl-with-proxy
