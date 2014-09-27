---
layout: post
title: "Refused to execute script from because its MIME type (text/plain) is not executable, and strict MIME type checking is enabled"
date: 2014-09-27 17:08
comments: true
categories: Javascript github
---
今天又与这个问题相遇了,Orz,还是研究一下解决方法和出现原因吧。  
刚刚在github上传了一个js文件，想让这个文件被其他网页引用，于是贴出了这个文件的raw版本的地址。但是却就遇到了这样的问题。
<!--more-->
这就是出现错误的代码
```html
<html>
    <script src="http://droidyue-tools.qiniudn.com/jquery.min.js"></script>
    <script src="https://raw.githubusercontent.com/androidyue/weekly-scripts/master/javascript/target_blank_link.js"></script>
	<div>
    <a href="http://droidyue.com">droidyue.com</a>
    </div>
</html>
```

##解决方法
将上面的链接中的<font color="red">raw.githubusercontent.com</font>换成<font color="red">rawgit.com</font>即可，此例中的网址最终为 <b>https://rawgit.com/androidyue/weekly-scripts/master/javascript/target_blank_link.js</b>

##原因
因为raw.githubusercontent.com在Response中设置了**X-Content-Type-Options:nosniff**，告诉浏览器强制检查资源的MIME，进行加载。

下面就是未处理的HTTP Response
```bash lineos:false
HTTP/1.1 200 OK
Date: Sat, 27 Sep 2014 09:27:12 GMT
Server: Apache
Access-Control-Allow-Origin: https://render.githubusercontent.com
Content-Security-Policy: default-src 'none'
X-XSS-Protection: 1; mode=block
X-Frame-Options: deny
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
ETag: "4f10b14e4a81a195976ea05787287a019c8bcf6f"
Content-Type: text/plain; charset=utf-8
Cache-Control: max-age=300
Content-Encoding: gzip
Content-Length: 204
Accept-Ranges: bytes
Via: 1.1 varnish
X-Served-By: cache-lax1426-LAX
X-Cache: HIT
X-Cache-Hits: 1
Vary: Authorization,Accept-Encoding
Expires: Sat, 27 Sep 2014 09:32:12 GMT
Source-Age: 44
Keep-Alive: timeout=10, max=50
Connection: Keep-Alive
```

###X-Content-Type-Options:nosniff 是神马
  1 如果服务器发送响应头 "X-Content-Type-Options: nosniff"，则 script 和 styleSheet 元素会拒绝包含错误的 MIME 类型的响应。这是一种安全功能，有助于防止基于 MIME类型混淆的攻击。  
  
  2 服务器发送含有 "X-Content-Type-Options: nosniff" 标头的响应时，此更改会影响浏览器的行为。  
  
  3 如果通过 styleSheet 参考检索到的响应中接收到 "nosniff" 指令，则 Windows Internet Explorer 不会加载“stylesheet”文件，除非 MIME 类型匹配 "text/css"。  
  
  4 如果通过 script 参考检索到的响应中接收到 "nosniff" 指令，则 Internet Explorer 不会加载“script”文件，除非 MIME 类型匹配以下值之一：  

  * "application/ecmascript"
  * "application/javascript"
  * "application/x-javascript"
  * "text/ecmascript"
  * "text/javascript"
  * "text/jscript"
  * "text/x-javascript"
  * "text/vbs"
  * "text/vbscript"

该部分参考<a href="http://msdn.microsoft.com/zh-cn/library/ie/gg622941(v=vs.85).aspx">减少 MIME 类型的安全风险</a>


###进阶书籍
  * <a href="http://www.amazon.cn/gp/product/B00GOM5IL4/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00GOM5IL4&linkCode=as2&tag=droidyue-23">深入浅出Node.js</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00GOM5IL4" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B0097CON2S/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0097CON2S&linkCode=as2&tag=droidyue-23">JavaScript语言精粹</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0097CON2S" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00BQ7RMW0/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00BQ7RMW0&linkCode=as2&tag=droidyue-23">编写可维护的JavaScript</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00BQ7RMW0" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

  
