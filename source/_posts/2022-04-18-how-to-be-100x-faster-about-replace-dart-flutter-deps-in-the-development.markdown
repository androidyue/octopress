---
layout: post
title: "简单一招，百倍提速 Flutter 开发"
date: 2022-04-18 06:25
comments: true
categories: Flutter Dart unpub pub dependencies Android iOS 
---
Flutter 开发中，为了实现更好的解耦与更高的复用，我们都会使用模块化的思路来处理，在Dart 和 Flutter 中，我们会使用 Dart 包或者插件包等，将它们发布到比如自己的unpub 服务器上，然后在壳工程（主工程）中聚合使用。

比如一个 壳工程的 yaml 是这样的

```yaml
dependencies:
 flutter:
   sdk: flutter
 firebase_crashlytics: 2.4.5
 firebase_analytics: 9.0.5
 basic:
   hosted:
     name: basic
     url: https://unpub.droidyue.com
   version: 1.6.2

```

于是有这样一个场景，我们想要在basic 包里面加一个方法，并应用到 主工程中。

但是在执行处理的时候，我们会有这样的考虑

  * 如果修改的内容，通过 unpub 进行验证，时间成本很大。
  * 但是发布到unpub，需要有一定的质量把控，修改的内容必须进行验证通过后，才能发布到unpub 服务器上   

所以，我们需要尝试寻找一种不通过 unpub，更快速验证修改内容的方式。

好在 dart 提供了 `dependency_overrides` 这个配置项来处理依赖重写问题。
<!--more-->

使用起来也很简单，下面就是我们实现重写 basic 的示例，基本上只需要关心 包名称(basic)与 path (../basic)即可。

```yaml
dependency_overrides:
 basic:
   path: "../basic"

```



虽然提供了上面的方法可以实现依赖重写，但是还是不够快速，这是因为通常场景是这样的

  * 我们通常用 Android Studio 打开了 basic 工程，AS 开多了会卡。
  * 当我们想要使用`dependency_overrides`调整 basic 时，需要用Android studio 再次打开壳工程项目。当然也可以使用文本编辑器，但是它对yaml 支持不一定有 AS 那么好，无法智能提示。

那么有没有更快速的方式呢，答案是有的，这是因为 yaml 是结构化的，我们可以使用脚本来生成`dependency_overrides`对应的内容。

下面就是一个ruby 脚本，实现yaml 内容的添加处理。



```ruby
#!/usr/bin/env ruby
# encoding: utf-8
require 'yaml'
file_path = ARGV[0]
repo_name = ARGV[1]
repo_path = ARGV[2]

yaml_string = File.read file_path
data = YAML.load yaml_string

if data.key?('dependency_overrides')
    hash = {
        repo_name.strip => {
            "path" => repo_path.strip
        }
    }
    data['dependency_overrides'] = data['dependency_overrides'].merge(hash)
else
    data['dependency_overrides'] = {
        repo_name.strip => {
            "path" => repo_path.strip
        }
    }

end

output = YAML.dump data
File.write(file_path, output)
```


  * 保存上面的脚本，命名为 localDartDep.rb, 
  * 将其路径放入环境变量 PATH, 然后更新当前的bash   
  * 切换到当前项目路径，然后执行 `localDartDep.rb basic ../basic` 即可快速完成替换操作。不用开Android Studio，轻量快捷。

对于上面的操作，依然可以更加包装成一个shell 脚本，实现更加便捷的处理
```bash
#!/bin/bash
localDartDep.rb "$1/pubspec.yaml" "basic" "../basic"
```

然后切换到对应的工程下，执行`basicLocalDep.sh ./` 即可。
