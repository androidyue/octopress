---
layout: post
title: "URL中的 # 原来是这个意思"
date: 2020-11-24 18:30
comments: true
categories: URL http https browser 浏览器 Google Javascript SEO 搜索引擎 网址 Uri
---
URL 是我们进行网络活动中很重要的概念，一个URL中可以包含域名，路径和参数等，

## 一个典型的 URL
```java
https://www.example.com/fruits.html?from=google#apple
```
<!--more-->

这其中包含了

  * 协议： https
  * 域名:  www.example.com
  * 路径文件名: fruits.html
  * 参数: from=google
  * 片段： apple

## #片段是什么
  * URL 中的 `#` 指的是一个片段
  * URL 片段 往往用来告知浏览器约定的一个滑动位置
  * 如果一个 URL 指向了一个文档，那么片段指向的就是文档的某个内容区间。

## # 作用范围
  * 会被本地浏览器处理
  * 不会被服务器端接收处理

### 所以
  * `www.example.com/fruits.html#apple`
  * `www.example.com/fruits.html#orange`

对应的情况是

  * 对于浏览器，上面的链接指向同一文档，但是具有不同的滑动位置
  * 对于服务器，上面的链接指向同一文档，没有其他信息了。

## # 还能怎么用
  * 考虑到在浏览器可以获取片段信息，我们可以利用 Javascript做一些事情
  * 网页应用可以使用片段来实现参数控制，做到不刷新页面，展示不同的内容


如下为 JavaScript获取片段的示例代码
```javascript
window.location.hash
```


## SEO 的影响

基于上面的理解，`www.example.com/fruits.html#apple`和`www.example.com/fruits.html#orange` 会被搜索引擎当成一个链接。

如果不想被搜索引擎如上处理，有两种方式

  * 使用不同的网页链接如`www.example.com/fruits_apple.html`和`www.example.com/fruits_orange.html`
  * 使用`#!`，即`www.example.com/fruits.html#!apple`和`www.example.com/fruits.html#!orange`  这种方式，可能只是Google 支持，其他搜索引擎待验证。

## 参考内容
  * https://www.oho.com/blog/explained-60-seconds-hash-symbols-urls-and-seo

