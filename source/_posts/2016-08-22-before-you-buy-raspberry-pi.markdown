---
layout: post
title: "树莓派入手指南"
date: 2016-08-22 18:57
comments: true
categories: 树莓派 折腾
---
最近入手了树莓派,简单整理一些入手的注意事项,本文尤其是对于不了解树莓派并想要购买的同学有参考意义.

<!--more-->
## 关于树莓派
>树莓派（英语：Raspberry Pi），是一款基于Linux的单板机电脑.

从一问世就受到了极客的热捧,现在最新的为第三代.它长成这个样子

![RaspBerry Pi 3](http://7jpolu.com1.z0.glb.clouddn.com/rasp-pi-3-board.png)

以树莓派3为例,它的硬件配置已经很强悍了

  * 四核1.2GHz Broadcom BCM2837 64位ARM CPU 
  * 1GB RAM
  * 板载WiFi和蓝牙低能耗(BLE)
  * 40引脚扩展GPIO
  * 4个USB 2端口
  * 4路立体声输出和复合视频端口
  * 全尺寸HDMI
  * 其他

树莓派3强悍的不仅是硬件,软件方便也不示弱

### 系统篇
  * Raspbian 树莓派官方系统(Desktop和Server版),基于著名的Debian
  * Ubuntu 发行版
  * Windows 10 IOT 系统
  * 其他系统,如Fedora,Arch Linux等支持ARM CPU的系统.

既然有了上面的操作系统,可以做的事情就越来越多,利用`apt-get`等安装很多工具,比如

  * ruby
  * python
  * java
  * php
  * etc

目前我的板子上跑的是Raspbian的Server版,安装了ruby,python等运行环境.

## 树莓派能做啥
树莓派能做的事情多了去了,这里简单列举一些我实现的用途

  * Long-running server
  * 运行Shadowsocks上网
  * 类网络爬虫的工具
  * VPN服务器

除此之外,一些网友列出的树莓派的用途还有
![What can Raspberry do](http://7jpolu.com1.z0.glb.clouddn.com/what_can_raspberry_do.png)

查看详细链接为[34 个使用 Raspberry Pi 的酷创意](https://linuxtoy.org/archives/cool-ideas-for-raspberry-pi.html)  
  
## 入手必备
### 树莓派板子
这个是必不可少的,目前来说,最新的是三代,建议选择要选购最新的.

[树莓派购买地址](https://s.click.taobao.com/t?e=m%3D2%26s%3DipZBrVjUNPocQipKwQzePOeEDrYVVa64Qih%2F7PxfOKS5VBFTL4hn2ZAjY1sSUHRSc4zWPc6e823M3gYQjCL89vSdxyvKgR5IYpon8UCVSYY8adpyqfOGuyh37tAy5cF3foyLpRdzEyTNiASMxOD6RyGFCzYOOqAQ)

### TF卡
  * 也称sd卡,起硬盘的作用
  * 如没有,需要购买
  * **建议的容量8G或者以上**.
  * 建议单独从京东或天猫上购买。
  * 推荐：[金士顿 16G](https://s.click.taobao.com/t?e=m%3D2%26s%3DPznSC3MbYUMcQipKwQzePOeEDrYVVa64K7Vc7tFgwiHjf2vlNIV67oVyT62DOxkm7km9mWjOCUbM3gYQjCL89vSdxyvKgR5IYpon8UCVSYa0Y5H7SRGlljbN5Lj4uDgdR1vdRbvMIqTsUdEykNJqqxrHip5TDoqW&pvid=10_117.100.136.71_7646_1482673558764)即可.

### TF卡读卡器
  * 用来将系统镜像写到TF卡中
  * 非必需,根据需求购买
  * 另外一些支持拆卸SD卡的Android手机也可以实现读卡器的功能
  * 推荐：[aszune多合一高速读卡器 多功能SD/TF/MS/PSP手机相机内存卡](https://s.click.taobao.com/t?e=m%3D2%26s%3Dtx92UoDB9KccQipKwQzePOeEDrYVVa64K7Vc7tFgwiHjf2vlNIV67tcaUqBHDIydLzyWwQxzkU%2FM3gYQjCL89vSdxyvKgR5IYpon8UCVSYa8QQ2rDp0VRYQr13kiO08GlrfKbc84rldXkrGSpNbO1w6XNX%2Byi3HbxiXvDf8DaRs%3D&pvid=10_117.100.136.71_7297_1482673861615)

### 电源
  * 需要购买
  * 树莓派要求的输出电流(2.1A),普通安卓手机的电源无法满足
 
### 散热片
  * 建议购买
  * 树莓派3的散热量会大一些,通常三片儿就够了.

### 风扇
  * 不建议购买
  * 如果已经使用了散热片,实际上就不需要购买风扇了.

### 保护壳
  * 建议购买
  * 保护主板不受一些不必要的破坏.
  * 亚克力透明外壳 很便宜,但是很容易坏掉,建议安装后不要在拆卸,否则就很容易坏掉.
  * 推荐一个比较豪华的保护壳,不仅其保护作用,由于材质为铝合金,还起到了散热的作用,有了它,散热片和风扇都免了. [树莓派3B代外壳 电脑机箱金属 2B保护盒子 铝合金 带散热柱](http://s.click.taobao.com/t?e=m%3D2%26s%3DQfp662yOKDAcQipKwQzePOeEDrYVVa64LKpWJ%2Bin0XLjf2vlNIV67lq2yb%2B823hksUZsiWgXrvjM3gYQjCL89vSdxyvKgR5IYpon8UCVSYajLHHEy4DVWPecTmP%2Bt89nu9eJRZ3mZqJD8TATeSZeQGTuSLA3e9ZzxiXvDf8DaRs%3D&pvid=10_118.247.4.215_1955_1471161468655)

###小显示屏
  * 非必需
  * 因个人需求购买
  * 如果是仅仅跑server,则不需要.通过ssh登录即可.

### 视频线及转接口
  * 建议购买,但因需求而定.
  * 视频线通常为HDMI
  * 转接口为HDMI转VGA
  * 可以连接大显示器

### 网线
  * 因个人需要购买
  * 如果没有显示装备,网线则必须要具有
  * 等开启了wifi连接后,网线则不再需要了
  * 通常1m即可.

基本上,在首次购买树莓派时,该买什么不该买什么有了大致的掌握了.
   
## 入手心理
然后光准备好了银子也是不够的,还需要准备心理.

因为很多人买了树莓派,过了一段时间新鲜期就把它放置不管,通常称为"吃土".

我购买树莓派的目的很简单:就是让它做一个long-running server.我在购买树莓派之前已经写了一些长期运行的脚本.

为了充分利用树莓派,建议学习如下

  * ruby,python等脚本
  * js脚本运行工具phantomjs

树莓派很便宜,但是购买之前还是要再三思考,确保物尽其用.

## 补充1:
文章发出后,很多朋友问我,该具体怎么玩树莓派,说来话长,于是从精挑细选了一本介绍如何玩树莓派的书籍

  * [树莓派 Raspberry Pi 实战指南](http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgFVGF4UBSJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIUB1YeWhIdS0IJRmtza2JjB08GVmFEBA18OVIFbwUtayhDDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhcHVB1SEwcaAGUbXhMAFwFWG1IWBhAOZRxrRV1HRAtDDl1GRjdl&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBBIEUBpcCltXWwg%3D)

## 补充2
  * [树莓派3代B型传感器套件 包含16种传感器](https://s.click.taobao.com/t?e=m%3D2%26s%3DC0D1WNsa%2FkAcQipKwQzePOeEDrYVVa64LKpWJ%2Bin0XLjf2vlNIV67gJaOZeI%2BkuIF%2FSaKyaJTUbM3gYQjCL89vSdxyvKgR5IYpon8UCVSYZZln0vafkv4GAtvLiJtd%2BYlrfKbc84rldy6biH%2FHXYoR%2FeYmCjoUYzxiXvDf8DaRs%3D&pvid=10_116.243.181.163_528_1486887990075)