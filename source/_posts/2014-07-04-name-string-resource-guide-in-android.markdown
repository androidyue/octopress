---
layout: post
title: "Android字符串资源命名参考规范"
date: 2014-07-04 15:12
comments: true
categories: Android Guide
keywords: Android String, Android strings.xml, Android Guide, Android String guide,Android命名规范,Android规范
---
对于如何命名strings.xml中得字符串资源名称,以下是一些参考建议.
##基本命名规则
**[feature_[subfeature_]]widget_stringname**
<!--more-->
##不完全规则举例
###features and subfeatures##
  *  quickdial
  *  bookmark
  *  history
  *  download
  *  account
  *  account_login
  *  account_register_phone
  *  account_register_email
  *  settings
  *  rss

###widgets
  *  toast
  *  menuitem
  *  editor
  *  toolbar
  *  button
  *  titlebar
  *  contextmenu
  *  dialog

##Examples
  *  比如我们添加一个在快速拨号点击某个Item进行toast提示说正在添加到桌面.可以这样命名quickdial_toast_adding_to_desktop.
