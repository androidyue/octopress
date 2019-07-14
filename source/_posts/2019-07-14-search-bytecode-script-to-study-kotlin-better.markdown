---
layout: post
title: "一个查找字节码更好研究Kotlin的脚本"
date: 2019-07-14 21:10
comments: true
categories: Kotlin Bytecode 字节码 ruby 脚本
---
众所周知，Kotlin通过语法糖的形式实现了很多便捷和高效的方法，因此研究Kotlin代码通常是需要研究字节码或者反编译后的java文件。

比如这样的代码

```bash
fun String.toConsole() {
    println(this)
}
```
<!--more-->
Kotlin的编译器会在字节码中自动地增加这样一行代码`Intrinsics.checkParameterIsNotNull`来做一些预检查的操作。

## 痛点
那么问题来了，如果我们想找出所有的关于`Intrinsics`相关的自动加入内容，该怎么办，不能一个一个文件去反编译查看吧，因为这样

  * 没有目标性，无法明确预知那个文件会生成这种代码
  * 不具有自动化可重复性，需要依赖于人为行为

那么，我们查看class文件类进行内容匹配是否包含`Intrinsics`呢，其实也不太好，因为一个class文件的内容是这样的
```java
cat StringExtKt.class
����43
      StringExtKtjava/lang/Object	toConsole(Ljava/lang/String;)V#Lorg/jetbrains/annotations/NotNull;$this$toConsokotlin/jvm/internal/Intrinsics
checkParameterIsNotNull'(Ljava/lang/Object;Ljava/lang/String;)V



java/lang/SystemoutLjava/io/PrintStream;
                                        	java/io/PrintStreamprintln(Ljava/lang/Object;)V

Ljava/lang/String;Lkotlin/Metadata;mvbvkd1"��

��


��
��0*0¨d2BytecodeSample
                      StringExt.ktCodeLineNumberTableLocalVariableTable$RuntimeInvisibleParameterAnnotations
SourceFileSourceDebugExtensionRuntimeVisibleAnnotations1,>*	�<�*�-
.
/0+1QSMAP
StringExt.kt
Kotlin
*S Kotlin
*F
+ 1 StringExt.kt
StringExtKt
*L
1#1,3:1
*E
2@[III ![II"I#$I%&[s'([ss)s)s*
```  

一段很错乱的内容，这样不利于我们更好的分析问题。因为相比较而言，我们有更加好的方法来处理。



基于上面的痛点，自己动手写了一个简单的ruby脚本，来解决问题。

## 实现思路
  * 遍历指定路径下的class文件
  * 将对应的class文件使用`javap`反编译
  * 使用上面反编译的结果，查看是否包含待查询的关键字
  * 如果上述结果匹配到，将反编译内容和文件路径输出到结果文件中

## 代码(Talk is cheap)

```ruby
#!/usr/bin/ruby
require 'find'
require 'colorize'
require "fileutils"

# extract arguements from command line
dirToSearch = ARGV[0]
keywordToSearch = ARGV[1].to_s.strip
matchedResultFile = ARGV[2]
puts "dirToSearch=#{dirToSearch};keywordToSearch=#{keywordToSearch}, matchedResultFile=#{matchedResultFile}"

# Eagerly create the result file so that user could use tools like `tail -f ` to observer the result
FileUtils.touch(matchedResultFile)
puts "result will be outputted to #{matchedResultFile}"

# Helper method to append content(each line) to the file
def appendLineContentToFile(lineContent, filePath)
  File.open(filePath, 'a') do |file|
     file.puts "#{lineContent}"
  end
end

# write matched class file path along with bytecode content to the output file.
def writeResultInformation(classFilePath, byteCodeContent, outputFile)
	appendLineContentToFile(classFilePath, outputFile)
	# leave blank lines
	appendLineContentToFile("", outputFile)
	appendLineContentToFile("", outputFile)
	appendLineContentToFile("", outputFile)

	appendLineContentToFile(byteCodeContent, outputFile)

	# leave blank lines
	appendLineContentToFile("", outputFile)
	appendLineContentToFile("", outputFile)
	appendLineContentToFile("", outputFile)
end


Find.find(dirToSearch).select {
	|f| f.end_with? ".class"
}.each {
	|f|
	puts "checking #{f}"
	byteCodeContent = `javap -c #{f}`
	contains = byteCodeContent.include? keywordToSearch
	resultMessage = ""
	if contains
		resultMessage = "#{f} contains #{keywordToSearch}".green
		writeResultInformation(f, byteCodeContent, matchedResultFile)
	else
		resultMessage = "#{f} does NOT contains #{keywordToSearch}".red
	end
	puts resultMessage
}
```

## 执行命令
```bash
ruby searchBytecode.rb ./ "Intrinsics" /tmp/result.txt
```

  * searchBytecode.rb 是上述的脚本文件名称
  * ./ 第一个参数，为待查找的目录
  * "Intrinsics" 第二个参数，为查询关键字
  * /tmp/result.txt  第三个参数，为结果输出文件


## 执行日志
为了更好的表达应用正在执行，执行时会有日志输出。
![https://asset.droidyue.com/image/2019_07/search_bytecode_logs.jpg](https://asset.droidyue.com/image/2019_07/search_bytecode_logs.jpg)

其中

  * 正常的日志会以白色颜色输出
  * 不匹配的内容会以红颜色输出
  * 匹配的内容会以绿颜色输出

## 结果文件
```java
 cat sample_intrinsics.txt

./out/production/BytecodeSample/MainKt.class



Compiled from "Main.kt"
public final class MainKt {
  public static final void main();
    Code:
       0: ldc           #11                 // String Hello
       2: invokestatic  #17                 // Method StringExtKt.toConsole:(Ljava/lang/String;)V
       5: iconst_1
       6: invokestatic  #23                 // Method IntExtKt.increase:(I)I
       9: pop
      10: new           #25                 // class Book
      13: dup
      14: invokespecial #28                 // Method Book."<init>":()V
      17: getfield      #32                 // Field Book.name:Ljava/lang/String;
      20: dup
      21: ifnonnull     27
      24: invokestatic  #37                 // Method kotlin/jvm/internal/Intrinsics.throwNpe:()V
      27: invokevirtual #43                 // Method java/lang/String.toString:()Ljava/lang/String;
      30: pop
      31: return

  public static void main(java.lang.String[]);
    Code:
       0: invokestatic  #9                  // Method main:()V
       3: return
}



./out/production/BytecodeSample/StringExtKt.class



Compiled from "StringExt.kt"
public final class StringExtKt {
  public static final void toConsole(java.lang.String);
    Code:
       0: aload_0
       1: ldc           #9                  // String $this$toConsole
       3: invokestatic  #15                 // Method kotlin/jvm/internal/Intrinsics.checkParameterIsNotNull:(Ljava/lang/Object;Ljava/lang/String;)V
       6: iconst_0
       7: istore_1
       8: getstatic     #21                 // Field java/lang/System.out:Ljava/io/PrintStream;
      11: aload_0
      12: invokevirtual #27                 // Method java/io/PrintStream.println:(Ljava/lang/Object;)V
      15: return
}
```

## 问题排查
```bash
/System/Library/Frameworks/Ruby.framework/Versions/2.3/usr/lib/ruby/2.3.0/rubygems/core_ext/kernel_require.rb:55:in `require': cannot load such file -- colorize (LoadError)
	from /System/Library/Frameworks/Ruby.framework/Versions/2.3/usr/lib/ruby/2.3.0/rubygems/core_ext/kernel_require.rb:55:in `require'
	from /Users/androidyue/Documents/OneDrive/scripts//searchBytecode.rb:3:in `<main>'
```

需手动安装ruby gems依赖
```bash
➜  gem install colorize
YAML safe loading is not available. Please upgrade psych to a version that supports safe loading (>= 2.0).
Fetching: colorize-0.8.1.gem (100%)
Successfully installed colorize-0.8.1
Parsing documentation for colorize-0.8.1
Installing ri documentation for colorize-0.8.1
1 gem installed
```

再次执行即可。

## 执行优化
  * 具体的执行时间可能会随着工程的复杂而不同。
  * 建议筛选更加精细的目录，避免不必要的查询和操作
  * 可以同时使用`tail -f`筛选匹配结果。

脚本github地址:[https://github.com/androidyue/DroidScripts/blob/master/ruby/searchBytecode.rb](https://github.com/androidyue/DroidScripts/blob/master/ruby/searchBytecode.rb)

以上。

## 相关内容
  * [研究学习Kotlin的一些方法](https://droidyue.com/blog/2017/05/08/how-to-study-kotlin/)