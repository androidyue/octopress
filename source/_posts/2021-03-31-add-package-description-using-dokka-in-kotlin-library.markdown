---
layout: post
title: "Dokka 设置包描述，让你的 Kotlin 库文档更详实"
date: 2021-03-31 19:21
comments: true
categories: Dokka Kotlin Java JavaDoc API 
---

## Dokka 是啥

  * Dokka 是 Kotlin 生成类似 Javadoc 文档的工具，可以为 Kotlin 的库依据代码和注释等信息生成技术文档。
  * Dokka 的 github 地址为 https://github.com/Kotlin/dokka 不了解的同学可以先了解一下。

<!--more-->
## 痛点
  * 像类，方法等都可以在代码文件中进行添加注释来增加必要的描述
  * 而 包 没有对应的代码文件载体，无法直接添加。


好在，搜索了外文文档，找到了对应的方法，特此记录一下，希望可以帮到其他人。



## 创建对应的 mardkown 文件
  * 在期望的模块 (Module) 内部
  * 不一定与build.grale同级，可以是新目录下，这里以同级为例
  * 命名随意，没有限制
  * 文件内容为 markdown 格式


比如我们创建一个文件为`packages.md`,内容如下

```
# Package com.secoo.coobox.library.impl

这里填写关于 `com.secoo.coobox.library.impl`的描述信息

## 这里也是 `com.secoo.coobox.library.impl` 的描述信息哈
```


## 如何引入描述信息
在对应的模块下的`build.gradle`中增加`includes.from("packages.md")`

```java
dokkaHtml {
        outputDirectory.set(new File(rootDir, "dokkadocs"))
        // Set module name displayed in the final output
        moduleName.set("library")

        dokkaSourceSets {
            configureEach { // Or source set name, for single-platform the default source sets are `main` and `test`

                includes.from("packages.md")

            // 此处省略其他配置

        }
}
```

## 效果
使用`./gradlew dokkaHtml` 生成文档文件

### 包索引页的效果
![https://asset.droidyue.com/image/2021/03/dokka_package_index_sample.png](https://asset.droidyue.com/image/2021/03/dokka_package_index_sample.png)

### 包详细页的效果
![https://asset.droidyue.com/image/2021/03/dokka_package_detail_sample.png](https://asset.droidyue.com/image/2021/03/dokka_package_detail_sample.png)

## 如何支持多个
  * 可以支持多个，这样避免了超级文件的产生
  * 增加新的markdown文件，比如 packages_1.md
  * 在 gradle 文件中这样配置 `includes.from("packages.md", "packages_1.md")`


## 示例内容
  * [https://github.com/secoo-android/coobox/blob/main/library/build.gradle#L59](https://github.com/secoo-android/coobox/blob/main/library/build.gradle#L59)
  * [https://secoo-android.github.io/coobox/library/](https://secoo-android.github.io/coobox/library/)
  * [https://github.com/secoo-android/coobox/tree/main/library/package-info](https://github.com/secoo-android/coobox/tree/main/library/package-info)
