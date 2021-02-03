---
layout: post
title: "10年程序员都不一定搞清楚的文件路径"
date: 2021-02-03 12:48
comments: true
categories: Java Linux Unix Mac Windows File 文件 路径 Path
---

在 Java 中，文件是很常用的概念，这其中文件路径是一个很基础的内容，因为文件的创建，读取，写入和删除等操作都是依赖于文件路径的。但是你仔细看一下Java中 `File`的 API 你会发现有这样三个方法返回路径。

  * getPath（获取路径）
  * getAbsolutePath（获取绝对路径）
  * getCanonicalPath（获取规范路径）

<!--more-->
了解这其中的差异，我们可以先看一看通用的路径的概念，即相对路径，绝对路径和规范路径。

## 文件路径中的特殊字符
  * `.`  用来代表当前的目录
  * `..` 用来代表父目录
  * `/`  为Linux/Mac等操作系统的路径分隔符
  * `\`  为 Windows 路径分隔符
  * `:`  为 Windows磁盘分割符,比如`C:`



## 相对路径
  * 相对路径指的是某个文件相对于`当前目录`的路径

### 举个例子
有两个文件，路径为

  * 文件 `/tmp/a/a.txt`
  * 目录 `/tmp/b/`

那么
  * 文件(`a.txt`)相对当前目录(`b`)的相对路径就是`../a/a.txt`




## 绝对路径
  * 绝对路径指的是从文件系统的根目录到当前文件的路径。
  * 其中Windows的文件系统根目录可以是`C:`或者`D:`等
  * Linux和Mac 等系统的根目录是`/`
  * 另外，对于同一个文件，可以存在多个不同的绝对路径。


### 同一文件的多个绝对路径
假设`C`盘下有`temp`和`temp1`两个目录
```java
C:\temp
C:\temp1
```

那么这些都是指向同一个文件的绝对路径，且都是合法的。
```java
C:\temp\test.txt
C:\temp\test.txt
C:\temp\TEST.TXT
C:\temp\.\test.txt
C:\temp1\..\temp\test.txt
```

备注： Windows下路径不区分大小写。


## Canonical路径 规范路径
  * 规范路径是从文件系统的根目录到当前文件的唯一的路径。
  * 规范路径不像绝对路径那样有多个不同的值指向同一文件。
  * 规范路径是绝对路径，但是绝对路径不一定是规范路径。
  * 规范路径中移除了`.`和`..`等特殊字符

举一个例子

一个相对路径为`.././Java.txt`的文件，

  * 它的绝对路径是 `/Users/androidyue/Documents/projects/PathSamples/.././Java.txt`
  * 它的规范路径是 `/Users/androidyue/Documents/projects/Java.txt`


备注：Canonical ` kə-ˈnä-ni-kəl` 发音类似 可囊尼口

## 回到 Java File方法中
  * `getPath` 返回的路径可能是相对路径，也可能是绝对路径。
  * `getAbsolutePath` 返回的路径是绝对路径
  * `getCanonicalPath` 返回的路径是唯一的规范路径。


## 多说无益，上代码
```java
import java.io.File;

public class PathDemo {
    public static void main(String args[]) {
        System.out.println("Path of the given file :");
        File child = new File(".././Java.txt");
        displayPath(child);
        File parent = child.getParentFile();
        System.out.println("Path of the parent folder :");
        displayPath(parent);


        File anotherFile = new File("a.txt");
        System.out.println("Path of another file(a.txt)");
        displayPath(anotherFile);

        File anotherAbsFile = new File("/tmp/a.txt");
        System.out.println("Path of another file(/tmp/a.txt)");
        displayPath(anotherAbsFile);
    }


    public static void displayPath(File testFile) {
        System.out.println("path : " + testFile.getPath());
        System.out.println("absolute path : " + testFile.getAbsolutePath());
        try {
            System.out.println("canonical path : " + testFile.getCanonicalPath());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
```

执行后，输出的日志为
```java
Path of the given file :
path : .././Java.txt
absolute path : /Users/androidyue/Documents/projects/PathSamples/.././Java.txt
canonical path : /Users/androidyue/Documents/projects/Java.txt
Path of the parent folder :
path : ../.
absolute path : /Users/androidyue/Documents/projects/PathSamples/../.
canonical path : /Users/androidyue/Documents/projects
Path of another file(a.txt)
path : a.txt
absolute path : /Users/androidyue/Documents/projects/PathSamples/a.txt
canonical path : /Users/androidyue/Documents/projects/PathSamples/a.txt
Path of another file(/tmp/a.txt)
path : /tmp/a.txt
absolute path : /tmp/a.txt
canonical path : /private/tmp/a.txt

Process finished with exit code 0

```


## References
  * https://javarevisited.blogspot.com/2014/08/difference-between-getpath-getabsolutepath-getcanonicalpath-java.html

