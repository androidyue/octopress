---
layout: post
title: "Ruby执行shell命令的六种方法"
date: 2014-11-18 21:17
comments: true
categories: Ruby Shell
---
在Ruby中，执行shell命令是一件不奇怪的事情，Ruby提供了大概6种方法供开发者进行实现。这些方法都很简单，本文将具体介绍一下如何在Ruby脚本中进行调用终端命令。
<!--more-->
##exec
exec会将指定的命令替换掉当前进程中的操作,指定命令结束后，进程结束。
```ruby
exec 'echo "hello world"'
print 'abc'
```
执行上述的命令，结果如下，我们可以看到没有abc的输出，可以看出来，在执行`echo "hello world"`命令后进程就结束了。不会继续执行后面的`print 'abc'`。
```ruby
ruby testCommand.rb 
hello world
```
使用exec一个头疼的事情就是没有办法知道shell命令执行成功还是失败。

##system
system和exec相似，但是system执行的命令不会是在当前进程，而是在一个新创建的进程。system会返回布尔值来表明命令执行结果是成功还是失败。
```ruby
$ irb             
> system 'echo "hello $HOSTNAME"'
hello androidyue
 => true
> puts $?
pid 11845 exit 0
 => nil 
> system 'false' 
 => false
> puts $?
pid 11858 exit 1
 => nil 
>> 
```
system会将进程的退出的状态码赋值给$?，如果程序正常退出，$?的值为0，否则为非0。通过检测退出的状态码我们可以在ruby脚本中抛出异常或者进行重试操作。

注：在Unix-like系统中进程的退出状态码以0和非0表示，0代表成功，非0代表失败。

system可以告诉我们命令执行是成功还是失败，但是有些时候我们需要得到执行命令的输出，并在脚本中使用。显然system无法直接满足，需要我们使用反引号来实现。

##反引号(`)
使用反引号是shell中常用的获取命令输出内容的方法，在ruby中也是可以，而且一点都需要做改变。使用反引号执行命令也会将命令在另一个进程中执行。
```ruby
1.9.3p448 :013 > today = `date`
 => "Sat Nov 15 19:28:55 CST 2014\n" 
1.9.3p448 :014 > $?
 => #<Process::Status: pid 11925 exit 0> 
1.9.3p448 :015 > $?.to_i
 => 0 
1.9.3p448 :016 >
```

上面的方法如此简单，我们可以直接对返回的字符串结果进行操作。

注意，$?已经不再是上述的那样单纯的退出状态码了，它实际上是一个Process::Status对象。我们从中不仅可以知道进程的退出状态码也可以知道进程的ID。使用`$?.to_i`会得到退出的状态码，使用`$?.to_s`会得到包含了进程id，退出状态码等信息的字符串。

使用反引号的一个结果就是我们只能得到标准的输出（stdout）而不能得到标准的错误信息(stderr),比如下面的例子，我们执行一个输出错误字符串的perl脚本。
```ruby
  $ irb
  >> warning = `perl -e "warn 'dust in the wind'"`
  dust in the wind at -e line 1.
  => "" 
  >> puts warning

  => nil
```
可以看出，warning并没有得到出错的信息，这就表明反引号无法得到标准错误的信息。

##IO#popen
IO#popen也是一种执行命令的方法,其命令也是在另外的进程中执行。使用popen你可以像操作IO对象一样处理标准输入和输出。
```ruby
$ irb
>> IO.popen("date") { |f| puts f.gets }
Mon Mar 12 18:58:56 PDT 2007
=> nil
```

##Open3#popen3
在标准的Ruby库中还提供了一个Open3。使用这个类我们可以很容易的对标准输入，输出，错误进行处理。这里我们使用一个可以交互的工具dc。dc是一种逆波兰表达式（又叫做后缀表达式，每一运算符都置于其运算对象之后）的计算器，支持从标准输入读取数学表达式。在这个例子中，我们将两个数值和一个操作符进行压栈处理。然后使用p来输出结果。比如我们输入5和10，然后输入+，然后会得到15\n的输出。
```ruby
  $ irb
  >> stdin, stdout, stderr = Open3.popen3('dc') 
  => [#<IO:0x6e5474>, #<IO:0x6e5438>, #<IO:0x6e53d4>]
  >> stdin.puts(5)
  => nil
  >> stdin.puts(10)
  => nil
  >> stdin.puts("+")
  => nil
  >> stdin.puts("p")
  => nil
  >> stdout.gets
  => "15\n" 
```
使用这个方法，我们不仅可以读取到命令的输出还可以对命令进行输入操作。这个方法对于进行交互操作很方便。通过popen3，我们还可以得到标准的错误信息。
```ruby
  # (irb continued...)
  >> stdin.puts("asdfasdfasdfasdf")
  => nil
  >> stderr.gets
  => "dc: stack empty\n" 
```
但是，在ruby 1.8.5中popen3有一个缺陷，进程的退出状态没有写入到$?中。
```ruby
  $ irb
  >> require "open3" 
  => true
  >> stdin, stdout, stderr = Open3.popen3('false')
  => [#<IO:0x6f39c0>, #<IO:0x6f3984>, #<IO:0x6f3920>]
  >> $?
  => #<Process::Status: pid=26285,exited(0)>
  >> $?.to_i
  => 0
```
为什么是0，false命令执行后的退出状态应该是非0才对，由于这个缺陷，我们需要了解一下Open4

##Open4#popen4
Open4#popen4使用起来和Open3#popen3差不多，而且我们也可以得到程序的退出状态。popen4还可以返回一个子进程ID。你也可以通过Process::waitpid2 加上对应的进程ID获得进程退出状态。但是前提是要安装open4的gem。
```ruby
  $ irb
  >> require "open4" 
  => true
  >> pid, stdin, stdout, stderr = Open4::popen4 "false" 
  => [26327, #<IO:0x6dff24>, #<IO:0x6dfee8>, #<IO:0x6dfe84>]
  >> $?
  => nil
  >> pid
  => 26327
  >> ignored, status = Process::waitpid2 pid
  => [26327, #<Process::Status: pid=26327,exited(1)>]
  >> status.to_i
  => 256
```

##原文
  * [http://tech.natemurray.com/2007/03/ruby-shell-commands.html](http://tech.natemurray.com/2007/03/ruby-shell-commands.html)
  * 在原文基础上，进行了部分删减。
  
