---
layout: post
title: "最小特权原则"
date: 2014-08-03 09:02
comments: true
categories: 编程随想
---
之前的项目中的一些事情的做法违背了最小特权原则（亦为最小权限原则），这里记录以下什么是该原则。

##原始定义
该原则最早由Jerome Saltzer提出。其最原始的表述为
**Every program and every privileged user of the system should operate using the least amount of privilege necessary to complete the job.**  
其中文意思为  
**系统的每个程序或者用户应该使用完成工作所需的最小权限工作。**
<!--more-->

##带来的好处
  * 更好的系统稳定性。 当一段程序被限定了最小权限原则，就可以更加容易地测试可能的行为以及与其他程序的交互。比如，一个被赋予最小特权的程序没有权限让机器设备崩溃，也不会阻碍同一系统上的其他程序运行。
  * 更好的系统安全性。 当代码在系统范围的行动，它可以执行有限的，在一个应用程序中的漏洞不能用来利用机器的其他部分，例如，微软指出：“运行在标准用户模式为客户提供了更多的保护，防止意外造成“粉碎攻击”和恶意软件，比如根工具包，间谍软件和病毒无法检测“系统级的损坏。
  * 更容易的部署。     通常情况下，在一个比较大的环境下，程序需要权限越少就越容易部署。通常表现在以下两点。需要安装设备驱动或者需要提升权限的程序通常需要额外的步骤来完成部署。比如，Windows下，一个不需要设备驱动的解决方案不需要安装即可运行。而需要安装设备驱动的程序，需要使用Windows Installer服务来来装从而提升驱动的权限。

##延伸阅读
  * <a href="http://zh.wikipedia.org/wiki/%E6%9C%80%E5%B0%8F%E6%9D%83%E9%99%90%E5%8E%9F%E5%88%99" target="_blank">最小权限原则</a>
  * <a href="http://en.wikipedia.org/wiki/Principle_of_least_privilege" target="_blank">Principle of least privilege</a>

###其他
  * <a href="http://www.amazon.cn/gp/product/B0011C2P7W/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0011C2P7W&linkCode=as2&tag=droidyue-23">人月神话</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0011C2P7W" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B0016K8XGQ/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0016K8XGQ&linkCode=as2&tag=droidyue-23">编程之美:微软技术面试心得</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0016K8XGQ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
