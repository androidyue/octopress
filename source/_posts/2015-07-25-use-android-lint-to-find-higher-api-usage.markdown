---
layout: post
title: "使用Android lint发现并解决高版本API问题"
date: 2015-07-25 16:51
comments: true
categories: Android
---
在编写代码时，为了实现一些功能，我们需要使用高版本的API，比如SharedPreference的Editor中的apply方法为API 9开始引入，在API 9 以上的机器使用没有问题，但是在API 8上，如果运行时执行了这段代码，就会崩溃，问题相当严重。尤其是该问题出现在正式版中，后果不堪设想。本文将介绍如何使用lint发现并解决这些问题。
<!--more-->
##lint是什么
lint是Android提供的一个静态代码分析的工具，使用这个工具可以帮助我们找出Android项目中潜在的bug，安全，性能，可用性，辅助性和国际化等问题，同时还可以查找出错误拼写，提示开发者更正。

###lint的工作流程

![lint workflow](https://asset.droidyue.com/broken_images_2015/lint_workflow.png)

上图为lint的工作流程图，下面为一些元素的简短说明。

**程序源文件**

程序源文件就是Android工程的组成部分，包括Java和xml文件，图标以及混淆配置文件

**lint.xml文件**

lint配置文件，用来排除某些检查或者自定义检测问题的严重程度。

**lint工具**

一个静态代码扫描工具，对Android工程进行扫描分析，可以从终端执行命令，也可以从Android Studio等IDE中使用。lint工具可以帮助我们找到Android应用性能和代码质量问题。在正式发布应用之前，强烈建议使用lint检查并修复发现的问题。

**lint检查结果**

lint的检查结果可以从终端，Android Studio等IDE工具，或者生成结果文件查看。每一个问题都会标明在文件中的位置行数，以及关于该问题的说明等信息。


##查找问题
知道了lint如何工作，就只需执行lint查找问题，有了明确的问题，才能有的放矢地解决。 
###Android Sutdio
选择菜单Analyze-->Configure Current File Analysis-->Configure Inspections 清空所有的检查项，然后如下图勾选**Calling new methods on older versions** 和 **Using inlined constants on older versions**

![Android Studio Lint](https://asset.droidyue.com/broken_images_2015/android_studio_lint.png)

然后执行Analyze--> Inspect Code，然后查看底部的Inspection即可

###command line
```bash lineos:false
cd project_root_dir
lint --check NewApi,InlinedApi --html /tmp/api_check.html ./
```
无需多时，结果就会以html形式写入/tmp/api_check.html文件

###Gradle Command Line
配置build.gradle
```java lineos:false
android{
    //some other config
    lintOptions {
        abortOnError false
        xmlReport false
        check 'NewApi', 'InlinedApi'
    }
}
```
然后执行下面的命令
```bash lineos:false
cd project_root_dir
./gradlew lint
```
结果会输出到工程目录build/outputs/lint-results.html。

##如何解决
结合上面的输出结果，我们接下来要做的就是如何解决，如下为一些解决思路。
###必然执行高版本API
  * 如果是NewApi警告，考虑其他方法代替。比如String.isEmpty自API 9才引入，但是使用TextUtils.isEmpty替换。
  * 如果是InlinedApi警告，可以自定义与常量同值的另一个常量。
  * 使用反射，对于不太重要的方法，我们可以使用反射来解决问题。

###或然执行高版本API
如果该段代码进行了API Level限制，确保高版本API不会在低版本设置执行，只需对这个警告设置为忽略即可。

##实战解决
以下代码所属工程最低支持2.2系统，即API 8。
###NewApi有警报代码
```java lineos:false
private void testNewApi() {
    PreferenceManager.getDefaultSharedPreferences(getApplicationContext()).edit().putBoolean("first_use", false).apply();
}
```
上面代码中的apply方法为Android API 9引入，使用lint检查会提示警告。

###方案一
按照API Level不同，选择不同的方法,对于API 9以下使用commit，API 9及其以上使用apply
```java lineos:false
private void testNewApi() {
    SharedPreferences.Editor editor = PreferenceManager.getDefaultSharedPreferences(this).edit();
    editor.putBoolean("first_launch", false);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.GINGERBREAD) {
      editor.apply();
    } else {
      editor.commit();
    }
}
```

###方案二
对于确定不会在低版本运行的情况，我们可以增加@TargetApi加上对应的API引入的版本即可。
```java lineos:false
@TargetApi(Build.VERSION_CODES.GINGERBREAD)
private void testNewApi() {
    SharedPreferences.Editor editor = PreferenceManager.getDefaultSharedPreferences(this).edit();
    editor.putBoolean("first_launch", false).apply();
}
```

###方案三
同样确保新API不会在低版本运行，也可以忽略警报。
```java lineos:false
@SuppressLint("NewApi")
private void testNewApi() {
    SharedPreferences.Editor editor = PreferenceManager.getDefaultSharedPreferences(this).edit();
    editor.putBoolean("first_launch", false).apply();
}
```
**但是这种方案不推荐**，是直接对方法的警告忽略，如果继续在方法中增加代码，则不利于发现问题，比如
```java lineos:false
@SuppressLint("NewApi")
private void testNewApi() {
    SharedPreferences.Editor editor = PreferenceManager.getDefaultSharedPreferences(this).edit();
    editor.putBoolean("first_launch", false).apply();
    "".isEmpty(); //新增加代码，不容易发现问题
}
```

###含有InlinedApi警告的代码
下面代码过于简单，只是为了打印一个API 19引入的int常量值。
```java lineos:false
private void testInlinedApi() {
    Log.i("MainActivity", "inlinedValue=" + View.ACCESSIBILITY_LIVE_REGION_ASSERTIVE);
}
```
对于这个问题的方案很简答，就是自己定义一个常量，其值与高版本的API常量相同，然后使用这个自定义常量即可。如下代码
```java lineos:false
private void testInlinedApi() {
    final int VIEW_ACCESSIBILITY_LIVE_REGION_ASSERTIVE = 2;
    Log.i("MainActivity", "inlinedValue=" + VIEW_ACCESSIBILITY_LIVE_REGION_ASSERTIVE);
}
```


##小问题
  * 如果没有lint命令，需要将Android中的sdk/tools/目录加入PATH即可。


{%include post/book_copyright.html %}
