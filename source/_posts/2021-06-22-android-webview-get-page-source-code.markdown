---
layout: post
title: "Android WebView 获取网页源码 实践与问题解决"
date: 2021-06-22 11:50
comments: true
categories: Android WebView HTML Javascript Css 
---

出于某些场景需要，有时候，我们需要从 WebView 获取源码，本文将简单介绍如何从 WebView 中获取源码，以及遇到的问题的分析和总结。


## 获取源码的方法
  * WebView 没有提供直接获取网页源码的方法
  * 我们需要使用Javascript 的方法来获取源码，具体的核心代码如下

```javascript
function() {
    var content = document.getElementsByTagName('html')[0].innerHTML;
    return '<html>' + content + '</html>';
})
```
<!--more-->

## 获取时机
  * 为了确保源码完整，建议放在`onPageFinished`（即网页加载完毕时）时机。

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView.settings.javaScriptEnabled = true

        webView.webViewClient = object: WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                Log.i("GetPageSourceCode", "onPageFinished url=$url")
                super.onPageFinished(view, url)
                parseSourceCode(webView)
            }

        }

        webView.webChromeClient = object: WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                super.onProgressChanged(view, newProgress)
                Log.i("GetPageSourceCode", "onProgressChanged newProgress=$newProgress")
            }
        }

        webView.loadUrl("http://10.185.240.240:8000/")
}
```

## 解析处理源码

  * 这里我们获取并打印所有的`<a>`元素

```kotlin
private fun parseSourceCode(webView: WebView) {
        webView.evaluateJavascript("""
                    (function() {
                        var content = document.getElementsByTagName('html')[0].innerHTML;
                        return '<html>' + content + '</html>';
                    })();""".trimIndent()) {
						Log.i("GetPageSourceCode", it)
						printATagElements(it)


        }
}


private fun printATagElements(htmlString: String?) {
        htmlString ?: return
        val document = Jsoup.parse(htmlString)
        document.select("a").joinToString().let {
            Log.i("GetPageSourceCode", "ATag.content=$it")
        }
    }
```

## 问题来了

打印出来一堆这样的网页源码, 无法进行Jsoup解析

> "\u003Chtml>\u003Chead>\n    \u003Ctitle>Index of /\u003C/title>\n    \u003Cstyle type=\"text/css\">\n    \u003C!--\n    .name, .mtime { text-align: left; }\n    .size { text-align: right; }\n    td { text-overflow: ellipsis; white-space: nowrap; overflow: hidden; }\n    table { border-collapse: collapse; }\n    tr th { border-bottom: 2px groove; }\n    //-->\n    \u003C/style>\n  \u003C/head>\n  \u003Cbody>\n    \u003Ch1>Index of /\u003C/h1>\n\u003Ctable width=\"100%\">\u003Cthead>\u003Ctr>\n\u003Cth class=\"name\">\u003Ca href=\"?N=D\">Name\u003C/a>\u003C/th>\u003Cth class=\"mtime\">\u003Ca href=\"?M=D\">Last modified\u003C/a>\u003C/th>\u003Cth class=\"size\">\u003Ca href=\"?S=D\">Size\u003C/a>\u003C/th>\n\u003C/tr>\u003C/thead>\n\u003Ctbody>\n\u003Ctr>\u003Ctd class=\"name\">\u003Ca href=\"..\">Parent Directory\u003C/a>\u003C/td>\u003Ctd class=\"mtime\">2021/01/05 11:08\u003C/td>\u003Ctd class=\"size\">-\u003C/td>\u003C/tr>\n\u003Ctr>\u003Ctd class=\"name\">\u003Ca href=\"8.0.27_first/\">8.0.27_first/\u003C/a>\u003C/td>\u003Ctd class=\"mtime\">2021/04/15 19:37\u003C/td>\u003Ctd class=\"size\">-\u003C/td>\u003C/tr>\n\u003Ctr>\u003Ctd class=\"name\">\u003Ca href=\"8.0.27_second/\">8.0.27_second/\u003C/a>\u003C/td>\u003Ctd class=\"mtime\">2021/04/16 15:43\u003C/td>\u003Ctd class=\"size\">-\u003C/td>\u003C/tr>\n\u003Ctr>\u003Ctd class=\"name\">\u003Ca href=\"8.0.28_first/\">8.0.28_first/\u003C/a>\u003C/td>\u003Ctd class=\"mtime\">2021/04/20 08:35\u003C/td>\u003Ctd class=\"size\">-\u003C/td>\u003C/tr>\n\u003Ctr>\u003Ctd class=\"name\">\u003Ca href=\"8.0.28_second.tar.bz2\">8.0.28_second.tar.bz2\u003C/a>\u003C/td>\u003Ctd class=\"mtime\">2021/04/20 18:54\u003C/td>\u003Ctd class=\"size\">8287826524\u003C/td>\u003C/tr>\n\u003Ctr>\u003Ctd class=\"name\">\u003Ca href=\"8.0.28_second/\">8.0.28_second/\u003C/a>\u003C/td>\u003Ctd class=\"mtime\">2021/04/20 14:25\u003C/td>\u003Ctd class=\"size\">-\u003C/td>\u003C/tr>\n\u003Ctr>\u003Ctd class=\"name\">\u003Ca href=\"archive/\">archive/\u003C/a>\u003C/td>\u003Ctd class=\"mtime\">2021/04/15 14:06\u003C/td>\u003Ctd class=\"size\">-\u003C/td>\u003C/tr>\n\u003Ctr>\u003Ctd class=\"name\">\u003Ca href=\"channel\">channel\u003C/a>\u003C/td>\u003Ctd class=\"mtime\">2020/06/05 18:10\u003C/td>\u003Ctd class=\"size\">10\u003C/td>\u003C/tr>\n\u003Ctr>\u003Ctd class=\"name\">\u003Ca href=\"huawei_channel/\">huawei_channel/\u003C/a>\u003C/td>\u003Ctd class=\"mtime\">2021/04/15 14:18\u003C/td>\u003Ctd class=\"size\">-\u003C/td>\u003C/tr>\n\u003Ctr>\u003Ctd class=\"name\">\u003Ca href=\"huawei_channel_second/\">huawei_channel_second/\u003C/a>\u003C/td>\u003Ctd class=\"mtime\">2021/04/16 11:14\u003C/td>\u003Ctd class=\"size\">-\u003C/td>\u003C/tr>\n\u003Ctr>\u003Ctd class=\"name\">\u003Ca href=\"nohup.out\">nohup.out\u003C/a>\u003C/td>\u003Ctd class=\"mtime\">2019/12/20 13:48\u003C/td>\u003Ctd class=\"size\">14003\u003C/td>\u003C/tr>\n\u003Ctr>\u003Ctd class=\"name\">\u003Ca href=\"seperate_apks/\">seperate_apks/\u003C/a>\u003C/td>\u003Ctd class=\"mtime\">2020/06/05 18:14\u003C/td>\u003Ctd class=\"size\">-\u003C/td>\u003C/tr>\n\u003Ctr>\u003Ctd class=\"name\">\u003Ca href=\"temp_master_batch_build/\">temp_master_batch_build/\u003C/a>\u003C/td>\u003Ctd class=\"mtime\">2020/12/04 17:46\u003C/td>\u003Ctd class=\"size\">-\u003C/td>\u003C/tr>\n\u003Ctr>\u003Ctd class=\"name\">\u003Ca href=\"trash/\">trash/\u003C/a>\u003C/td>\u003Ctd class=\"mtime\">2020/04/29 12:19\u003C/td>\u003Ctd class=\"size\">-\u003C/td>\u003C/tr>\n\u003C/tbody>\u003C/table>\u003Chr>    \u003Caddress>\n     WEBrick/1.4.2 (Ruby/2.5.5/2019-03-15)\u003Cbr>\n     at 10.185.240.240:8000\n    \u003C/address>\n  \n\n\u003C/body>\u003C/html>"

### 怎么处理
将获取的源码进行`unescape` 即可。


```java
StringEscapeUtils.unescapeEcmaScript(rawString)
```

注意，`StringEscapeUtils`来自依赖库`commons-text`
```java
implementation group: 'org.apache.commons', name: 'commons-text', version: '1.9'
```

### 处理后的结果
```java
<html><head>
    <title>Index of /</title>
    <style type="text/css">
    <!--
    .name, .mtime { text-align: left; }
    .size { text-align: right; }
    td { text-overflow: ellipsis; white-space: nowrap; overflow: hidden; }
    table { border-collapse: collapse; }
    tr th { border-bottom: 2px groove; }
    //-->
    </style>
  </head>
  <body>
    <h1>Index of /</h1>
<table width="100%"><thead><tr>
<th class="name"><a href="?N=D">Name</a></th><th class="mtime"><a href="?M=D">Last modified</a></th><th class="size"><a href="?S=D">Size</a></th>
</tr></thead>
<tbody>
<tr><td class="name"><a href="..">Parent Directory</a></td><td class="mtime">2021/01/05 11:08</td><td class="size">-</td></tr>
<tr><td class="name"><a href="8.0.27_first/">8.0.27_first/</a></td><td class="mtime">2021/04/15 19:37</td><td class="size">-</td></tr>
<tr><td class="name"><a href="8.0.27_second/">8.0.27_second/</a></td><td class="mtime">2021/04/16 15:43</td><td class="size">-</td></tr>
<tr><td class="name"><a href="8.0.28_first/">8.0.28_first/</a></td><td class="mtime">2021/04/20 08:35</td><td class="size">-</td></tr>
<tr><td class="name"><a href="8.0.28_second.tar.bz2">8.0.28_second.tar.bz2</a></td><td class="mtime">2021/04/20 18:54</td><td class="size">8287826524</td></tr>
<tr><td class="name"><a href="8.0.28_second/">8.0.28_second/</a></td><td class="mtime">2021/04/20 14:25</td><td class="size">-</td></tr>
<tr><td class="name"><a href="archive/">archive/</a></td><td class="mtime">2021/04/15 14:06</td><td class="size">-</td></tr>
<tr><td class="name"><a href="channel">channel</a></td><td class="mtime">2020/06/05 18:10</td><td class="size">10</td></tr>
<tr><td class="name"><a href="huawei_channel/">huawei_channel/</a></td><td class="mtime">2021/04/15 14:18</td><td class="size">-</td></tr>
<tr><td class="name"><a href="huawei_channel_second/">huawei_channel_second/</a></td><td class="mtime">2021/04/16 11:14</td><td class="size">-</td></tr>
<tr><td class="name"><a href="nohup.out">nohup.out</a></td><td class="mtime">2019/12/20 13:48</td><td class="size">14003</td></tr>
<tr><td class="name"><a href="seperate_apks/">seperate_apks/</a></td><td class="mtime">2020/06/05 18:14</td><td class="size">-</td></tr>
<tr><td class="name"><a href="temp_master_batch_build/">temp_master_batch_build/</a></td><td class="mtime">2020/12/04 17:46</td><td class="size">-</td></tr>
<tr><td class="name"><a href="trash/">trash/</a></td><td class="mtime">2020/04/29 12:19</td><td class="size">-</td></tr>
</tbody></table><hr>    <address>
     WEBrick/1.4.2 (Ruby/2.5.5/2019-03-15)<br>
     at 10.185.240.240:8000
    </address>


</body></html>
```

## 为什么 使用 WebView 获取源码
  * WebView 相对 其他的 Http Client 库，支持运行 Javascript 得到的源码相对来说更完整。



