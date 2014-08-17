---
layout: post
title: "Ruby程序区分运行来源"
date: 2014-08-17 20:12
comments: true
categories: Ruby Python
---

当我们在写模块的时候，或多或少需要直接运行这个文件也可以执行一些方法，但是这样对于当这个模块被require或者include时，显得不好，在ruby里，有没有区分运行来自当前文件，还是被require的目标文件调用呢？
##Python可以
比如像Python这样
```python lineos:false
if __name__ == '__main__':
    print "from direct running"
```
<!--more-->
##Ruby当然也可以
对于处处为程序员着想，拥有快乐编程理念的Ruby来说当然是可以区别的。其原理就是判断启动文件是否为模块的代码文件。
```ruby lineos:false
if __FILE__ == $0
    puts 'called from direct running'
end
```

##举个例子
工具类模块utils.rb
```ruby lineos:false
module Utils
    class StringUtils
        def self.test
            puts "test method myfile=" + __FILE__ + ';load from ' +  $0
        end
    end
end 

if __FILE__ == $0
    puts 'called from direct running'
    Utils::StringUtils.test() 
end
```
直接运行，结果,if条件成立，执行了输出
```bash lineos:false
20:04:37-androidyue~/rubydir/test$ ruby utils.rb 
called from direct running
test method myfile=utils.rb;load from utils.rb
```
引用Utils的类test.rb
```ruby lineos:false
require './utils'
Utils::StringUtils.test()
```
运行结果，引入模块的条件不成立，没有输出`called from direct running`
```bash lineos:false
20:08:07-androidyue~/rubydir/test$ ruby test.rb 
test method myfile=/home/androidyue/rubydir/test/utils.rb;load from test.rb
```

