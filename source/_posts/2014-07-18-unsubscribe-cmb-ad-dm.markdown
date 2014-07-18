---
layout: post
title: "退订招商银行广告邮件那些事"
date: 2014-07-18 13:44
comments: true
categories: 其他
---

自从办理信用卡留下了我的gmail邮箱之后,就偶尔收到招商银行的购物类的广告邮件,发现没有多大的用处,于是就决定清理掉.谁知逆天的是,它的退订简直是不能用.
<!--more-->
##招商银行购物类邮件
购物类广告邮件大概长成这个样子
{%img http://droidyueimg.qiniudn.com/cmb_ad_mail.png CMB Ads DM %}
##无法退订!!!
当我点击邮件中的退订链接,逆天了,这简直是没有人测试啊
{%img http://droidyueimg.qiniudn.com/cmb_ad_mail_unsubscribe_page.png CMB unsubscripe page %}
##能难倒程序员么
这段代码简直是太简单了
```javascript
function subEml(flag) {
  var param = window.location.search; 
  if (flag == true) {
    var url = "https://pbdw.ebank.cmbchina.com/edm/servlet/ExtImageServlet" + param;
    document.location.href = url; 
  } else {
    window.close();
  }
}
```
看一下`window.location.search`,结果就是get请求参数
{%img http://droidyueimg.qiniudn.com/cmb_ad_mail_params.png cmb ad mail params %}

##解决方法

###技术宅能听懂的
其实讲到这里,怎么做你懂得. 

将```window.location.search```得到的值,拼接`https://pbdw.ebank.cmbchina.com/edm/servlet/ExtImageServlet`,然后进行一个get请求即可.

###小白能听懂的
点击退订链接后,地址然会有类似https://pbdw.ebank.cmbchina.com/cbmresource/22/unsub/unSubEml.html?CALL=DMZ_UNSUBINFO 这样的链接,从问号(包含)开始选择到结尾,复制,然后将复制的放在 https://pbdw.ebank.cmbchina.com/edm/servlet/ExtImageServlet 后面,将组合后的地址复制然后粘贴到地址栏按回车就可以了.

##退订成功的标志
再一次无语的退订成功的界面
{%img http://droidyueimg.qiniudn.com/cmb_ad_mail_unsubscribe_result.png cmd ad mail unsubscribed result %}

###其他
  * <a href="http://www.amazon.cn/gp/product/B00JRUE7VW/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00JRUE7VW&linkCode=as2&tag=droidyue-23">白岩松:行走在爱与恨之间</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00JRUE7VW" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00KVZ5FBI/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00KVZ5FBI&linkCode=as2&tag=droidyue-23">时寒冰说:未来二十年,经济大趋势(现实篇)</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00KVZ5FBI" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

