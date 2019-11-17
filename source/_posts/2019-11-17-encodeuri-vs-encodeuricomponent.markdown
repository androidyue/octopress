---
layout: post
title: "简简单单对比encodeURI与encodeURIComponent"
date: 2019-11-17 21:40
comments: true
categories: Javascript encodeURI encodeURIComponent encode escape
---
encodeURI和encodeURIComponent 是两个很相近的方法，用来encode URI。但是他们之间也存在着细微的差异，如果不能很好的理解这个差异，可能会导致一些不必要的麻烦。本文将尝试用最简单的形式展示这个差异。

<!--more-->

## encodeURI
  * encode所有的字符，除了下面的字符

> Not Escaped:
>
>  A-Z a-z 0-9 ; , / ? : @ & = + $ - _ . ! ~ * ' ( ) #

## encodeURIComponent
  * encode所有的字符，除了下面的字符

>Not Escaped:
>
>  A-Z a-z 0-9 - _ . ! ~ * ' ( )


## 表现差异
encodeURIComponent encode的字符多于 encodeURI，即如下字符

>
> , / ? : @ & = + $ #
>

## 使用场景差异

### 当encode内容作为 URI 的参数值时，使用encodeURIComponent

比如下面的例子
```javascript

var linkOne = "https://droidyue.com/q=" + encodeURIComponent("安卓")
//encode后的内容  https://droidyue.com/q=%E5%AE%89%E5%8D%93

var deepLink = "droidyue://webview?url=" + encodeURIComponent("https://droidyue.com/?q=%E5%AE%89%E5%8D%93&from=direct")

//encode后的内容  droidyue://webview?url=https%3A%2F%2Fdroidyue.com%2F%3Fq%3D%25E5%25AE%2589%25E5%258D%2593%26from%3Ddirect
```

### 当encode的内容是独立的URI，不作为其他URI附属时，使用encodeURI

```javascript
var linkTwo = encodeURI("https://droidyue.com/?q=安卓")
//encode后的内容 https://droidyue.com/?q=%E5%AE%89%E5%8D%93
```

## 错用会怎样

### 该用encodeURI,却使用了 encodeURIComponent

  * 导致连接无法被识别加载

```javascript
encodeURIComponent("https://droidyue.com/?q=安卓")
//encode后的内容 https%3A%2F%2Fdroidyue.com%2F%3Fq%3D%E5%AE%89%E5%8D%93
```

### 该用encodeURIComponent 却使用了 encodeURI
  * 导致参数丢失

```javascript
"droidyue://webview?url=" + encodeURI("https://droidyue.com/?q=%E5%AE%89%E5%8D%93&from=direct")
//encode后的内容 droidyue://webview?url=https://droidyue.com/?q=%25E5%25AE%2589%25E5%258D%2593&from=direct
```

如上`from=direct`本属于`https://droidyue.com/?q=%E5%AE%89%E5%8D%93&from=direct`，但是错误的encode后，反而属于了`droidyue://webview?url=your_url&from=direct`。

以上，希望有所帮助。

## References
  * [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)
  * [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
  * [https://dev.to/wanoo21/difference-between-encodeuri-and-encodeuricomponent-j3j](https://dev.to/wanoo21/difference-between-encodeuri-and-encodeuricomponent-j3j)

