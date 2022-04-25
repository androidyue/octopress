---
layout: post
title: "超快速实现 svg 转 png，jpg等格式"
date: 2022-04-25 07:58
comments: true
categories: svg png jpg npm Linux Mac Bash Terminal
---
svg 是 用于描述二维矢量图形的图形格式，有着很多的优势，但是有时候并不是所有的场景都支持 svg，那么这时候，我们需要将svg 图片转换成 png 等格式。

当然，可以进行svg 转png 的方式有很多，比如通过在线的网页工具可以，也可以使用终端的命令处理。这里我们主要设计的使用终端命令进行转换处理。


<!--more-->
## svgexport 工具
  
  * svgexport 是一个 NodeJs 模块，也是一个命令行工具。
  * 可以实现 从 svg 转换成png，jpeg等格式。
  * github 地址 https://github.com/shakiba/svgexport 

## 安装很简单
```bash
npm install svgexport -g
```

## 使用方式
```
svgexport <input file> <output file> <options>
svgexport <datafile>

<options>        [<format>] [<quality>] [<input viewbox>] [<output size>] [<resize mode>] [<styles>]

<format>         png|jpeg|jpg
                 If not specified, it will be inferred from output file extension or defaults to "png".

<quality>        1%-100%

<input viewbox>  <left>:<top>:<width>:<height>|<width>:<height>
                 If input viewbox is not specified it will be inferred from input file.

<output size>    <scale>x|<width>:<height>|<width>:|:<height>
                 If output size is specified as width:height, <viewbox mode> is used.

<viewbox mode>   crop|pad
                 Crop (slice) or pad (extend) input to match output aspect ratio, default mode is "crop".

<datafile>       Path of a JSON file with following content:
                 [ {
                   "input" : ["<input file>", "<option>", "<option>", ...],
                   "output": [ ["<output file>", "<option>", "<option>", ...] ]
                 }, ...]
                 Input file options are merged with and overridden by output file options.
                 Instead of a JSON file, a Node module which exports same content can be provided.
```

## 转换示例

按比例扩大1.5x  
``` 
svgexport input.svg output.png 1.5x
```

按比例缩放，指定宽度为32px   
```
svgexport input.svg output.png 32:
```

设置宽高(32px:54px)进行缩放   
```
svgexport input.svg output.png  32:54
```

设置JPEG 输出质量   
```
svgexport input.svg output.jpg 80%
``` 


## 批量转换脚本
```ruby
#!/usr/bin/env ruby
# encoding: utf-8
dir = ARGV[0]

Dir.entries(dir).select { |f|
    f.end_with? '.svg'
}.each { |f|
    newFile = f.gsub '.svg', '.png'
    puts newFile
    system "cd #{dir} && svgexport #{f} #{newFile} 120:120"
}
```


