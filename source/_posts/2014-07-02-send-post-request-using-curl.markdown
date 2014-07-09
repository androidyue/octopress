---
layout: post
title: "curl发送POST请求"
date: 2014-07-02 20:35
comments: true
categories: linux curl 备忘 
keywords: curl,post,json,curl post json,curl post
---
curl发送POST请求
今天写Gitlab的一个merge request hook,使用curl来简化测试请求.简单备忘一下,如何使用curl发送POST请求.以下为使用curl发送一个携带json数据的POST请求.
<!--more-->

###命令介绍
>-H, --header LINE   Custom header to pass to server (H)  
>-d, --data DATA     HTTP POST data (H)

###示例命令
{% codeblock %}
curl -H "Content-Type: application/json" -d '{"object_kind":"merge_request","object_attributes":{"id":22,"target_branch":"master","source_branch":"master","source_project_id":57,"author_id":9,"assignee_id":null,"title":"Master Title","created_at":"2014-07-02T02:31:20.000Z","updated_at":"2014-07-02T02:36:33.008Z","milestone_id":null,"state":"closed","merge_status":"unchecked","target_project_id":55,"iid":7,"description":"description_content"}}' http://10.0.6.122:9002/merge_request 
{% endcodeblock %}

###推荐
  * <a href="http://www.amazon.cn/gp/product/B002A2LQR2/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B002A2LQR2&linkCode=as2&tag=droidyue-23">Shell脚本学习指南</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B002A2LQR2" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

