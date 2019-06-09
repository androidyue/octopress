---
layout: post
title: "未关闭的文件流会引起内存泄露么？"
date: 2019-06-09 22:06
comments: true
categories: Android FD 文件描述符 内存泄露 MemoryLeaks Leaks 内存泄露
---


最近接触了一些面试者，在面试过程中有涉及到内存泄露的问题，其中有不少人回答说，如果文件打开后，没有关闭会导致内存泄露。当被继续追问，为什么会导致内存泄露时，大部分人都没有回答出来。

本文将具体讲一讲 文件(流)未关闭与内存泄露的关系。

<!--more-->
## 什么是内存泄露

  * 定义：当生命周期长的实例`L` **不合理**地持有一个生命周期短的实例`S`，导致`S`实例无法被正常回收

### 举例说明
```java
public class AppSettings {
    private Context mAppContext;
    private static AppSettings sInstance = new AppSettings();

    //some other codes
    public static AppSettings getInstance() {
      return sInstance;
    }

    public final void setup(Context context) {
        mAppContext = context;
    }
}
```

上面的代码可能会发生内存泄露

  * 我们调用`AppSettings.getInstance.setup()`传入一个`Activity`实例
  * 当上述的`Activity`退出时，由于被`AppSettings`中属性`mAppContext`持有，进而导致内存泄露。

为什么上面的情况就会发生内存泄露

  * 以 Android 为例，GC 回收对象采用`GC Roots`强引用可到达机制。
  * `Activity`实例被`AppSettings.sInstance`持有
  * `AppSettings.sInstance`由于是静态，被`AppSettings`类持有
  * `AppSettings`类被加载它的类加载器持有
  * 而类加载器就是`GC Roots`的一种
  * 由于上述关系导致`Activity`实例无法被回收销毁。




## 验证是否引起内存泄露

因此，想要证明未关闭的文件流是否导致内存泄露，需要查看文件流是否是`GC Roots`强引用可到达。

示例代码1（辅助验证GC 发生）
```kotlin
package com.example.streamleakssample

import java.io.BufferedReader
import java.io.Reader


class MyBufferedReader(`in`: Reader?) : BufferedReader(`in`) {
    protected fun finalize() {
        println("MyBufferedReader get collected")
    }
}
```

示例代码2
```kotlin
package com.example.streamleakssample

import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.view.View
import java.io.FileInputStream
import java.io.InputStreamReader


class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        findViewById<View>(R.id.textview).setOnClickListener {
            testInputStream()
        }
    }

    private fun testInputStream() {
    	//需进入设置手动开启应用权限，未处理运行时权限问题
        val `is` = FileInputStream("/sdcard/a.txt")
        val buf = MyBufferedReader(InputStreamReader(`is`))

        var line = buf.readLine()
        val sb = StringBuilder()

        while (line != null) {
            sb.append(line).append("\n")
            line = buf.readLine()
        }

        val fileAsString = sb.toString()
        Log.i("MainActivity", "testInputStream.Contents : $fileAsString")
    }
}

```

这里我们这样操作

  1. 点击textview视图，触发多次`testInputStream`   
  2. 过几秒后，我们执行`heap dump`。
  3. 我们使用 MAT 对上一步的dump文件进行分析(需进行格式转换)

![https://asset.droidyue.com/image/2019_05/fianalizer_reference_path_to_gc_roots.png](https://asset.droidyue.com/image/2019_05/fianalizer_reference_path_to_gc_roots.png)  


分析上图，我们发现

  * FileInputStream 只被 FinalizerReference 这个类(GC Root)持有
  * 上述持有的原因是，`FileInputStream`重写了`finalize`，会被加入到`FinalizerReference`的析构处理集合
  * 上述引用会随着`Finalizer`守护线程处理后解除，即`FileInputStream`实例彻底销毁。

所以，我们再来操作一波，验证上面的结论。

  * 然后利用工具执行强制GC回收
  * 过几秒后，我们执行`heap dump`。
  * 我们使用 MAT 对上一步的dump文件进行分析(需进行格式转换)
  * 堆分析文件，查找`MyBufferedReader`或者`FileInputStream`或者`InputStreamReader` 没有发现这些实例，说明已经GC回收
  * 出于谨慎考虑，我们按照包名查找`java.io`在排除无关实例外，依旧无法找到`testInputStream`中的实例。再次证明已经被GC回收

因而我们可以确定，正常的使用流，不会导致内存泄露的产生。  

当然，如果你刻意显式持有Stream实例，那就另当别论了。


## 为什么需要关闭流

首先我们看一张图
![https://asset.droidyue.com/image/2019_05/file-descriptor_table.jpg](https://asset.droidyue.com/image/2019_05/file-descriptor_table.jpg)

如上图从左至右有三张表

  * file descriptor table 归属于单个进程
  * global file table(又称open file table) 归属于系统全局
  * inode table 归属于系统全局

### 从一次文件打开说起
当我们尝试打开文件`/path/myfile.txt`

1.从inode table 中查找到对应的文件节点   
2.根据用户代码的一些参数（比如读写权限等）在open file table 中创建open file 节点   
3.将上一步的open file节点信息保存，在file descriptor table中创建 file descriptor   
4.返回上一步的file descriptor的索引位置，供应用读写等使用。   

### file descriptor 和流有什么关系

  * 当我们这样`FileInputStream("/sdcard/a.txt")` 会获取一个file descriptor。
  * 出于稳定系统性能和避免因为过多打开文件导致CPU和RAM占用居高的考虑，每个进程都会有可用的file descriptor 限制。
  * 所以如果不释放file descriptor，会导致应用后续依赖file descriptor的行为(socket连接，读写文件等)无法进行，甚至是导致进程崩溃。
  * 当我们调用`FileInputStream.close`后，会释放掉这个file descriptor。

因此到这里我们可以说，不关闭流不是内存泄露问题，是**资源泄露问题**(file descriptor 属于资源)。

## 不手动关闭会怎样
不手动关闭的真的会发生上面的问题么？ 其实也不完全是。

因为对于这些流的处理，源代码中通常会做一个兜底处理。以`FileInputStream`为例

```java
	/**
     * Ensures that the <code>close</code> method of this file input stream is
     * called when there are no more references to it.
     *
     * @exception  IOException  if an I/O error occurs.
     * @see        java.io.FileInputStream#close()
     */
    protected void finalize() throws IOException {
        // Android-added: CloseGuard support.
        if (guard != null) {
            guard.warnIfOpen();
        }

        if ((fd != null) &&  (fd != FileDescriptor.in)) {
            // Android-removed: Obsoleted comment about shared FileDescriptor handling.
            close();
        }
    }
```

是的，在finalize方法中有调用`close`来释放file descriptor.

**但是finalize方法执行速度不确定，不可靠**

所以，我们不能依赖于这种形式，还是要手动调用`close`来释放file descriptor。


## 关闭流实践
Java 7 之后，可以使用try-with-resource方式处理
```java
static String readFirstLineFromFile(String path) throws IOException {
    try (BufferedReader br =
                   new BufferedReader(new FileReader(path))) {
        return br.readLine();
    }
}
```

Kotlin 可以使用`use`
```kotlin
private fun readFirstLine(): String {
    BufferedReader(FileReader("test.file")).use { return it.readLine() }
}
```

当然，还有最基础的手动关闭的形式
```java
private String readFirstLine() throws FileNotFoundException {
    BufferedReader reader = new BufferedReader(new FileReader("test.file"));
    try {
        return reader.readLine();
    } catch (IOException e) {
        e.printStackTrace();
    } finally {
        try {
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    return null;
}
```

## Reference
  * https://stackoverflow.com/questions/26541513/why-is-it-good-to-close-an-inputstream 
  * https://www.reddit.com/r/learnjava/comments/577769/why_do_you_need_to_close_streams/