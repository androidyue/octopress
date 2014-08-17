---
layout: page
title: "作品"
date: 2014-07-08 21:43
comments: true
sharing: true
footer: true
---
##简易强密码生成器
大概三年前做的，当时csdn被脱库，自己中枪了，于是到各个网站修改同样的密码，于是头脑闪过一个想法：可不可以各个网站用户名相同，密码不同呢，当然可以，于是这个工具就简单诞生了。

<html>
<script language="javascript" src="http://toolite.sinaapp.com/php/md5.js"></script>
<script language="javascript">
			
			function get_input(){
				var input=document.getElementsByName("plain_code")[0].value;	
				return input;	
			}	
				
			function encryption_md5_salt(){
				var salt="duchengyi";
				var input=get_input();
				var encrypted=hex_md5(input+salt);
				encrypted=encrypted.substring(2,14);
				return encrypted;
			}
				
			function display_result(){
				var result=encryption_md5_salt();
				document.getElementsByName("result")[0].value=result;			
			}
			
			function clear_tips(){
				document.getElementsByName("plain_code")[0].value="";			
			}
		</script>	
<p>请在下面输入您的简单密码</p>
<p><input type="text" name="plain_code" id="plain_code"  onclick="clear_tips()">
<input type="button" id="make_word" value="转换强密码" onclick="display_result()"></p>
<p><input type="text" name="result">复制左侧密码</p>
<p>使用说明：将你的未处理的密码输入第一个文本框，然后点击按钮获取特殊处理的密码，随后将特殊密码作为密码修改或注册.如google_123,weibo weibo_123,douban_123</p>
<p></p>
</html>

独立应用地址：http://toolite.sinaapp.com/php/salty_encryption.html
