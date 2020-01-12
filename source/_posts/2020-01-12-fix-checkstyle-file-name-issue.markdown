---
layout: post
title: "解决Checkstyle file name 异常的问题"
date: 2020-01-12 20:44
comments: true
categories: checkstyle 静态代码分析 gradle 缓存 代码风格
---

Checkstyle是一款很棒的工具，用来发现很多编码风格的问题。还不了解的同学可以移步这里[Android代码规范利器： Checkstyle](https://droidyue.com/blog/2016/05/22/use-checkstyle-for-better-code-style/)查看。

但是在使用Checkstyle时，却出现了一些问题，就是file元素的name不是我们当前执行checkstyle任务的路径。

<!--more-->

举个例子，比如
  
  * 我们执行`./gradlew checkstyle`时项目的路径为`~/Document/aProject`
  * 但是报告输出的file name属性为`/tmp/aProject/Commonxxxx/src/main/java/com/xxxx/core/adapter/xxxxxx.java`，基础路径为`/tmp/aProject`

具体的相关报告的输出结果

```xml
<?xml version="1.0" encoding="UTF-8"?>
<checkstyle version="6.19">
<file name="/tmp/aProject/Commonxxxx/src/main/java/com/xxxx/core/adapter/xxxxxx.java">
<error line="26" column="37" severity="warning" message="Member name &apos;mHeaderViews&apos; must match pattern &apos;^[a-z][a-z0-9][a-zA-Z0-9]*$&apos;." source="com.puppycrawl.tools.checkstyle.checks.naming.MemberNameCheck"/>
<error line="27" column="37" severity="warning" message="Member name &apos;mFootViews&apos; must match pattern &apos;^[a-z][a-z0-9][a-zA-Z0-9]*$&apos;." source="com.puppycrawl.tools.checkstyle.checks.naming.MemberNameCheck"/>
<error line="30" column="23" severity="warning" message="Member name &apos;mContext&apos; must match pattern &apos;^[a-z][a-z0-9][a-zA-Z0-9]*$&apos;." source="com.puppycrawl.tools.checkstyle.checks.naming.MemberNameCheck"/>
<error line="62" severity="warning" message="Overload methods should not be split. Previous overloaded method located at line &apos;52&apos;." source="com.puppycrawl.tools.checkstyle.checks.coding.OverloadMethodsDeclarationOrderCheck"/>
```

## 原因
原因是使用了gralde的build cache导致的。

## 解决方法
执行时不使用gralde build cache


```bash
./gradlew --no-build-cache checkstyle
```

## 相关文章推荐
  * [一些关于加速Gradle构建的个人经验](https://droidyue.com/blog/2017/04/16/speedup-gradle-building/)
  * [Error-prone,Google出品的Java和Android Bug分析利器](https://droidyue.com/blog/2017/04/09/error-prone-tool-for-java-and-android/)
  * [更多gradle文章](https://droidyue.com/blog/categories/gradle/)