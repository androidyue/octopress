---
layout: post
title: "一个Android代码JIT友好度检测工具"
date: 2016-04-10 20:26
comments: true
categories: Android Jit Java
---

利用周末的时间，写了一个检测Android代码JIT友好度的工具，取个名字为DroidJitChecker。希望可以帮助大家快速发现有坏味道的代码，并且及时修正。
<!--more-->
##名词解释
  * JIT：JIT全称Just-in-time compilation。意思为实时编译，是JVM中一种优化技术，对频繁调用并且符合条件的方法进行优化将字节码翻译成机器代码，提升执行效率。
  * 方法大小：每个方法的方法体实现都可用字节作为单位进行衡量，通常情况下，方法体越大，其方法大小也越大。
  * JIT友好：通常方法体实现越小越简单，越对JIT编译友好。

##这是什么
  * 这是一个检测Android（目录组织结构）代码JIT友好度的工具
  * 该工具基于AdoptOpenJDK/jitwatch中的jarScan.sh进行组装
  * 输出结果支持html，便于在浏览器中查看


##前提准备
  * 所检测Android项目可以支持Gradle编译成功
  * 安装jitwatch套件
  * ruby运行环境

##安装
###安装jitwatch组件
获取代码

```
git clone git@github.com:AdoptOpenJDK/jitwatch.git
```

编译  
进入上面的repo目录，采用以下三种方法之一即可  

ant  
```
ant clean compile test run
```

Maven  
```
mvn clean compile test exec:java
```

Gradle
```
gradlew clean build run
```


##配置
获取本repo的代码，并打开config.ini文件修改
```
[setup]
jarScan = "/Users/androidyue/github/jitwatch/jarScan.sh"
maxMethodSize = 325
outputDir = "/tmp/DroidJitChecker/output_new/"
```

修改说明  

  * jarScan 必须修改，修改成已经安装的的JarScan路径
  * maxMethodSize 无需更改，如更改请谨慎
  * 输出目录，outputDir，建议修改为可以持续存在的目录


##如何使用
使用比较简单，打开终端，执行如下语句
```bash
ruby jitChecker.rb your_android_project jarTask
```

注意：jarTask是一个将工程的java文件编译成jar包的任务，可以通过执行`./gradlew tasks`  查看，然后选择以jar开头的任务即可。
##查看结果
  * 检查结束后，会自动使用浏览器打开结果
  * 结果文件路径也会输出到终端
  * 结果文件名中包含了相关的jarTask信息，便于查找
  * 结果内容，依照方法的字节大小，从大到小降序排列

一个典型的内容示例
```java
MD4.mdfour64

Package:com.app.utils
Parameters:int[]
ByteSize:1129
```

  * MD4.mdfour64 对JIT不友好的方法及其所属类
  * Package:com.app.utils 上述MD4所属的包
  * Parameters:int[] mdfour64方法接受的参数
  * ByteSize:1129 表示mdfour64方法持有的大小



##如何解决
  * 书写逻辑简单，职责单一的小方法
  * 书写逻辑简单，职责单一的小方法
  * 书写逻辑简单，职责单一的小方法

##贡献代码
任何有帮助的建议都欢迎。

以下代码贡献更收欢迎

  * 美化结果展示页面（HTML，CSS）



##问题
###问：字节量大的方法一定要修改么，修改后就能JIT编译么
  * 答：字节量大的方法建议修改，非强制，修改后不一定就能JIT编译，因为对JIT优化并不意味着JIT就编译该方法，还需要其他因素，比如该方法的调用频率。所以这是一个你情我愿的事情。

###为什么用Ruby
  * 答：有了idea时很纠结，因为不确定用什么语言实现，尤其是在Python和ruby之间，为此问了不少同学，最后“一意孤行”决定用Ruby了，不喜欢Python的强制对齐，超级喜欢Ruby的字符串模板。Ruby很简单，很人性化，相信你会喜欢的。
  
##源码
  * [DroidJitChecker@Github](https://github.com/androidyue/DroidJitChecker)
