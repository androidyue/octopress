---
layout: post
title: "一个检测 json 合法性的脚本"
date: 2022-01-23 20:38
comments: true
categories: Ruby Linux json Mac 脚本 
---
越来越多的配置都是使用 json 的格式，当我们修改好，最好是进行一下 json 合法性校验。

我们可以使用下面的脚本进行校验。


```ruby
#!/usr/bin/env ruby
# encoding: utf-8
require 'json'
file = ARGV[0]


def is_json_valid(value)
	result = JSON.parse(value)
    result.is_a?(Hash) || result.is_a?(Array)
  rescue JSON::ParserError, TypeError
    false
  end


result = is_json_valid(File.open(file).read)
puts "json is valid(#{result})"


```

<!--more--> 

## 进行一些验证

### 验证错误文件1 （非json 文件）
```bash
cat /tmp/bad_json.json
123
checkJson.rb /tmp/bad_json.json
json is valid(false)
```

### 验证错误文件2 (json文件，但是引号错误)
```bash
cat /tmp/bad_json_1.json
{
	'aaa': "b"
}

checkJson.rb /tmp/bad_json_1.json
json is valid(false)

```

### 验证错误文件3（空文件）
```bash
cat /tmp/empty.txt

checkJson.rb /tmp/empty.txt
json is valid(false)
```

### 验证正确文件1 （空JsonObject）
```bash
cat /tmp/good_json_1.json
{}
checkJson.rb /tmp/good_json_1.json
json is valid(true)
```

### 验证正确文件2（空 JsonArray）
```bash
 cat /tmp/good_json_2.json
[]
checkJson.rb /tmp/good_json_2.json
json is valid(true)
```


### 验证正确文件3 （正常数据）
```bash
cat /tmp/good_json_3.json
{
	"key": "value"
}

checkJson.rb /tmp/good_json_3.json
json is valid(true)

```




