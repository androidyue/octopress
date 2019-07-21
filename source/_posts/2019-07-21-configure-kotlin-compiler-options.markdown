---
layout: post
title: "为 Kotlin 项目设置编译选项"
date: 2019-07-21 20:15
comments: true
categories: Kotlin compiler kotlinc compilation options
---
经常用终端的人都知道，终端命令有很多选项可以指定，这里我们以相关的`kotlinc`为例，我们可以在终端这样指定选项

```bash
kotlinc -Werror ./app/src/main/java/com/example/compileroptionssample/Simple.kt
error: warnings found and -Werror specified
app/src/main/java/com/example/compileroptionssample/Simple.kt:4:19: warning: unnecessary safe call on a non-null receiver of type String
    println(string?.toString())
                  ^
```
<!--more-->

上面的代码

  * 我们指定了-Werror 意思是当编译器遇到了警告时当做错误抛出，中断执行。
  * 上面的命令执行中断，不会导致class文件生成

## 编译选项有哪些
Kotlin的编译选项分为标准选项和高级选项 


如下是一些标准选项的内容(使用`kotlinc -help`获取)
```bash
kotlinc -help
Usage: kotlinc-jvm <options> <source files>
where possible options include:
  -classpath (-cp) <path>    Paths where to find user class files
  -d <directory|jar>         Destination for generated class files
  -include-runtime           Include Kotlin runtime in to resulting .jar
  -java-parameters           Generate metadata for Java 1.8 reflection on method parameters
  -jdk-home <path>           Path to JDK home directory to include into classpath, if differs from default JAVA_HOME
  -jvm-target <version>      Target version of the generated JVM bytecode (1.6 or 1.8), default is 1.6
  -module-name <name>        Name of the generated .kotlin_module file
  -no-jdk                    Don't include Java runtime into classpath
  -no-reflect                Don't include kotlin-reflect.jar into classpath
  -no-stdlib                 Don't include kotlin-stdlib.jar or kotlin-reflect.jar into classpath
  -script                    Evaluate the script file
  -script-templates <fully qualified class name[,]>
                             Script definition template classes
  -Werror                    Report an error if there are any warnings
  -api-version <version>     Allow to use declarations only from the specified version of bundled libraries
  -X                         Print a synopsis of advanced options
  -help (-h)                 Print a synopsis of standard options
  -kotlin-home <path>        Path to Kotlin compiler home directory, used for runtime libraries discovery
  -language-version <version> Provide source compatibility with specified language version
  -P plugin:<pluginId>:<optionName>=<value>
                             Pass an option to a plugin
  -progressive               Enable progressive compiler mode.
                             In this mode, deprecations and bug fixes for unstable code take effect immediately,
                             instead of going through a graceful migration cycle.
                             Code written in the progressive mode is backward compatible; however, code written in
                             non-progressive mode may cause compilation errors in the progressive mode.
  -nowarn                    Generate no warnings
  -verbose                   Enable verbose logging output
  -version                   Display compiler version
  @<argfile>                 Expand compiler arguments from the given file, containing one argument or file path per line
```

如下是更加高级的选项(使用`kotlinc -X`获取)
```bash
 kotlinc -X
Usage: kotlinc-jvm <options> <source files>
where advanced options include:
  -Xadd-compiler-builtins    Add definitions of built-in declarations to the compilation classpath (useful with -no-stdlib)
  -Xadd-modules=<module[,]>  Root modules to resolve in addition to the initial modules,
                             or all modules on the module path if <module> is ALL-MODULE-PATH
  -Xassertions={always-enable|always-disable|jvm|legacy}
                             Assert calls behaviour
                             -Xassertions=always-enable:  enable, ignore jvm assertion settings;
                             -Xassertions=always-disable: disable, ignore jvm assertion settings;
                             -Xassertions=jvm:            enable, depend on jvm assertion settings;
                             -Xassertions=legacy:         calculate condition on each call, check depends on jvm assertion settings in the kotlin package;
                             default: legacy
  -Xbuild-file=<path>        Path to the .xml build file to compile
  -Xcompile-java             Reuse javac analysis and compile Java source files
  -Xnormalize-constructor-calls={disable|enable}
                             Normalize constructor calls (disable: don't normalize; enable: normalize),
                             default is 'disable' in language version 1.2 and below,
                             'enable' since language version 1.3
  -Xdump-declarations-to=<path> Path to JSON file to dump Java to Kotlin declaration mappings
  -Xdisable-default-scripting-plugin
                             Do not enable scripting plugin by default
  -Xdisable-standard-script  Disable standard kotlin script support
  -Xfriend-paths=<path>      Paths to output directories for friend modules (whose internals should be visible)
  -Xmultifile-parts-inherit  Compile multifile classes as a hierarchy of parts and facade
  -Xmodule-path=<path>       Paths where to find Java 9+ modules
  -Xjavac-arguments=<option[,]> Java compiler arguments
  -Xjsr305={ignore/strict/warn}|under-migration:{ignore/strict/warn}|@<fq.name>:{ignore/strict/warn}
                             Specify behavior for JSR-305 nullability annotations:
                             -Xjsr305={ignore/strict/warn}                   globally (all non-@UnderMigration annotations)
                             -Xjsr305=under-migration:{ignore/strict/warn}   all @UnderMigration annotations
                             -Xjsr305=@<fq.name>:{ignore/strict/warn}        annotation with the given fully qualified class name
                             Modes:
                               * ignore
                               * strict (experimental; treat as other supported nullability annotations)
                               * warn (report a warning)
  -Xjvm-default={disable|enable|compatibility}
                             Allow to use '@JvmDefault' annotation for JVM default method support.
                             -Xjvm-default=disable         Prohibit usages of @JvmDefault
                             -Xjvm-default=enable          Allow usages of @JvmDefault; only generate the default method
                                                           in the interface (annotating an existing method can break binary compatibility)
                             -Xjvm-default=compatibility   Allow usages of @JvmDefault; generate a compatibility accessor
                                                           in the 'DefaultImpls' class in addition to the interface method
  -Xload-builtins-from-dependencies
                             Load definitions of built-in declarations from module dependencies, instead of from the compiler
  -Xno-call-assertions       Don't generate not-null assertions for arguments of platform types
  -Xno-exception-on-explicit-equals-for-boxed-null
                             Do not throw NPE on explicit 'equals' call for null receiver of platform boxed primitive type
  -Xno-optimize              Disable optimizations
  -Xno-param-assertions      Don't generate not-null assertions on parameters of methods accessible from Java
  -Xno-receiver-assertions   Don't generate not-null assertion for extension receiver arguments of platform types
  -Xsanitize-parentheses     Transform '(' and ')' in method names to some other character sequence.
                             This mode can BREAK BINARY COMPATIBILITY and is only supposed to be used as a workaround
                             of an issue in the ASM bytecode framework. See KT-29475 for more details
  -Xscript-resolver-environment=<key=value[,]>
                             Script resolver environment in key-value pairs (the value could be quoted and escaped)
  -Xsingle-module            Combine modules for source files and binary dependencies into a single module
  -Xskip-runtime-version-check Allow Kotlin runtime libraries of incompatible versions in the classpath
  -Xstrict-java-nullability-assertions
                             Generate nullability assertions for non-null Java expressions
  -Xgenerate-strict-metadata-version
                             Generate metadata with strict version semantics (see kdoc on Metadata.extraInt)
  -Xsupport-compatqual-checker-framework-annotations=enable|disable
                             Specify behavior for Checker Framework compatqual annotations (NullableDecl/NonNullDecl).
                             Default value is 'enable'
  -Xuse-ir                   Use the IR backend
  -Xuse-javac                Use javac for Java source and class files analysis
  -Xuse-old-class-files-reading Use old class files reading implementation. This may slow down the build and cause problems with Groovy interop.
                             Should be used in case of problems with the new implementation
  -Xuse-type-table           Use type table in metadata serialization
  -Xallow-kotlin-package     Allow compiling code in package 'kotlin' and allow not requiring kotlin.stdlib in module-info
  -Xallow-result-return-type Allow compiling code when `kotlin.Result` is used as a return type
  -Xcommon-sources=<path>    Sources of the common module that need to be compiled together with this module in the multi-platform mode.
                             Should be a subset of sources passed as free arguments
  -Xcoroutines={enable|warn|error}
                             Enable coroutines or report warnings or errors on declarations and use sites of 'suspend' modifier
  -Xdisable-phases           Disable backend phases
  -Xdump-perf=<path>         Dump detailed performance statistics to the specified file
  -Xeffect-system            Enable experimental language feature: effect system
  -Xexperimental=<fq.name>   Enable and propagate usages of experimental API for marker annotation with the given fully qualified name
  -Xintellij-plugin-root=<path> Path to the kotlin-compiler.jar or directory where IntelliJ configuration files can be found
  -Xlegacy-smart-cast-after-try Allow var smart casts despite assignment in try block
  -Xlist-phases              List backend phases
  -Xmetadata-version         Change metadata version of the generated binary files
  -Xmulti-platform           Enable experimental language support for multi-platform projects
  -Xnew-inference            Enable new experimental generic type inference algorithm
  -Xno-check-actual          Do not check presence of 'actual' modifier in multi-platform projects
  -Xno-inline                Disable method inlining
  -Xphases-to-dump           Dump backend state both before and after these phases
  -Xphases-to-dump-after     Dump backend state after these phases
  -Xphases-to-dump-before    Dump backend state before these phases
  -Xplugin=<path>            Load plugins from the given classpath
  -Xprofile-phases           Profile backend phases
  -Xproper-ieee754-comparisons Generate proper IEEE 754 comparisons in all cases if values are statically known to be of primitive numeric types
  -Xread-deserialized-contracts Enable reading of contracts from metadata
  -Xreport-output-files      Report source to output files mapping
  -Xreport-perf              Report detailed performance statistics
  -Xskip-metadata-version-check Load classes with bad metadata version anyway (incl. pre-release classes)
  -Xuse-experimental=<fq.name> Enable, but don't propagate usages of experimental API for marker annotation with the given fully qualified name
  -Xverbose-phases           Be verbose while performing these backend phases

Advanced options are non-standard and may be changed or removed without any notice.
```

## 编译选项有什么用
编译选项通常有以下这样的作用，不完全列举

  * 开启或关闭某些feature等行为（比如coroutine, 新的类型推断算法等）
  * 控制或设置编译器需要的参数(比如-jvm-target设置class的目标平台)
  * 控制编译器的输出（比如method inline,-Xno-param-assertions对参数进行断言处理）

## 如何开启设置
以Android项目为例，增加`kotlinOptions`配置
```groovy
android {
    compileSdkVersion 28
    defaultConfig {
        applicationId "com.example.compileroptionssample"
        minSdkVersion 15
        targetSdkVersion 28
        versionCode 1
        versionName "1.0"
        testInstrumentationRunner "android.support.test.runner.AndroidJUnitRunner"
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }

        debug {
        }
    }


    //Code to be added
    kotlinOptions {
        allWarningsAsErrors = true
    }
}
```
## 更加复杂的参数传递
默认情况下，gradle中只有四个字段处理编译选项

  * allWarningsAsErrors  将所有的警告当做错误处理，默认值为false
  * suppressWarnings	压制所有的警告，默认值为false
  * verbose  打印更多的信息，默认值为false
  * freeCompilerArgs  附加的编译器选项列表,默认值为[]


```groovy
 kotlinOptions {
    allWarningsAsErrors = true
    freeCompilerArgs += ['-Xno-param-assertions', '-Xmultifile-parts-inherit']
}
```

关于上述配置的验证，大家可以对比如下的代码的编译输出验证`-Xno-param-assertions`选项的作用
```kotlin
package com.example.compileroptionssample

fun dump(string: String) {
    println(string)
}
```

## 如何按照Variant进行配置
那我能不能这样呢？

  * 仅仅在Release编译下设置某个编译选项
  * 其他非Release编译不设置这个编译选项

答案是可以的，按照下面的方式就行了。

```java
//only add kotlinOptions for the releaseKotlin build task
tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).all {
    task ->
        if (task.getName() == "compileReleaseKotlin") {
            kotlinOptions {
                allWarningsAsErrors = true
            }
            println("Add kotlin options when task=" + task)
        } else {
            println("Do not add kotlin options when task=" + task)
        }
}
```

上述代码

  * 所在文件为模块目录，比如app/build.gradle
  * 上述代码与`android`同级别


利用Kotlin编译选项我们可以做一些很好玩的事情，后续会输出更多这方面的内容。