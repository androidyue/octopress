---
layout: post
title: "Android 升级 targetSDK 35 解决 namespace 问题"
date: 2025-10-04 10:00
comments: true
categories: Android Gradle React-Native
---

升级 Android targetSDK 至 35 并使用 Gradle 8.0+ 后，遇到了第三方库 namespace 配置问题。

<!--more-->

## 错误信息

```bash
Execution failed for task ':react-native-inappbrowser:processDebugManifest'.
> A failure occurred while executing com.android.build.gradle.tasks.ProcessLibraryManifest$ProcessLibWorkAction
> Setting the namespace via the package attribute in the source AndroidManifest.xml is no longer supported.
  Recommendation: remove package="com.proyecto26.inappbrowser" from the source AndroidManifest.xml.
```

或者类似错误：

```bash
Namespace not specified. Please specify a namespace in the module's build.gradle file like so:

android {
    namespace 'com.example.namespace'
}
```

---

## 原因分析

Android Gradle Plugin 8.0+ 不再支持在 `AndroidManifest.xml` 中通过 `package` 属性设置 namespace，要求在 `build.gradle` 中显式声明。升级 targetSDK 至 35 需要使用 Gradle 8.0+，但很多第三方库（如 `react-native-inappbrowser`、`appcenter-analytics` 等）尚未更新配置，导致构建失败。

---

## 解决方案

在项目根目录的 `android/build.gradle` 文件中添加以下代码：

```groovy
allprojects {
    repositories {
        google()
        mavenCentral()
        
        // 如果使用 Detox 测试框架，添加此配置
        maven {
            url("$rootDir/../node_modules/detox/Detox-android")
        }
    }
    
    subprojects {
        afterEvaluate { project ->
            if (project.hasProperty('android')) {
                project.android {
                    // 自动设置 namespace
                    if (namespace == null || namespace.isEmpty()) {
                        def defaultNamespace = project.group.toString().replace('.', '_')
                        namespace = defaultNamespace
                    }

                    // 启用 buildConfig
                    buildFeatures {
                        buildConfig = true
                    }
                }

                // 自动修复 namespace 和清理 AndroidManifest.xml
                project.tasks.register("fixManifestsAndNamespace") {
                    doLast {
                        // 1. 从 AndroidManifest.xml 提取 package 并添加到 build.gradle
                        def buildGradleFile = file("${project.projectDir}/build.gradle")
                        if (buildGradleFile.exists()) {
                            def buildGradleContent = buildGradleFile.getText('UTF-8')
                            def manifestFile = file("${project.projectDir}/src/main/AndroidManifest.xml")
                            if (manifestFile.exists()) {
                                def manifestContent = manifestFile.getText('UTF-8')
                                def packageName = manifestContent.find(/package="([^"]+)"/) { match, p -> p }
                                if (packageName && !buildGradleContent.contains("namespace")) {
                                    println "Setting namespace in ${buildGradleFile}"
                                    buildGradleContent = buildGradleContent.replaceFirst(
                                        /android\s*\{/, "android {\n    namespace '${packageName}'"
                                    )
                                    buildGradleFile.write(buildGradleContent, 'UTF-8')
                                }
                            }
                        }

                        // 2. 移除 AndroidManifest.xml 中的 package 属性
                        def manifests = fileTree(dir: project.projectDir, includes: ['**/AndroidManifest.xml'])
                        manifests.each { File manifestFile ->
                            def manifestContent = manifestFile.getText('UTF-8')
                            if (manifestContent.contains('package=')) {
                                println "Removing package attribute from ${manifestFile}"
                                manifestContent = manifestContent.replaceAll(/package="[^"]*"/, '')
                                manifestFile.write(manifestContent, 'UTF-8')
                            }
                        }
                    }
                }

                // 在构建前自动执行修复
                project.tasks.matching { it.name.startsWith("preBuild") }.all {
                    dependsOn project.tasks.named("fixManifestsAndNamespace")
                }
            }
        }
    }
}
```

---

## 说明

### 工作原理

此方案包含三个层次的处理：

1. **自动设置 namespace**：如果子项目未配置 namespace，自动使用 `project.group` 并将点号替换为下划线作为 namespace
2. **启用 buildConfig**：自动为所有子项目启用 `buildConfig` 特性
3. **自动迁移配置**：
   - 从 `AndroidManifest.xml` 中提取 `package` 属性
   - 将其写入对应的 `build.gradle` 作为 `namespace`
   - 移除 `AndroidManifest.xml` 中的 `package` 属性

这个 task 在每次构建前（`preBuild`）自动执行，确保所有第三方库都符合 Gradle 8.0+ 的要求。

### 适用场景

- React Native 项目升级 targetSDK 35
- Flutter 项目升级 targetSDK 35
- 使用 Detox 测试框架的项目
- 原生 Android 项目使用旧版第三方库
- 任何遇到 "namespace not specified" 或 "package attribute not supported" 错误的场景

### 注意事项

- 此方案会**自动修改**第三方库的 `build.gradle` 和 `AndroidManifest.xml` 文件
- 修改仅在 `node_modules` 中生效，不影响源码仓库
- 建议在 CI/CD 中首次构建后检查修改是否正确
- 如果某些库已经声明了 namespace，不会被覆盖

---

## 验证

执行以下命令重新构建项目：

```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

或在 React Native 项目中：

```bash
npx react-native run-android
```

构建过程中会看到类似输出：

```bash
Setting namespace in /path/to/project/android/react-native-inappbrowser/build.gradle
Removing package attribute from /path/to/project/android/react-native-inappbrowser/src/main/AndroidManifest.xml
```

---

## 与简化方案对比

如果只需要为缺少 namespace 的库自动设置默认值，可以使用简化版：

```groovy
subprojects {
    afterEvaluate { project ->
        if (project.hasProperty('android')) {
            project.android {
                if (namespace == null || namespace.isEmpty()) {
                    namespace project.group.toString().replace('.', '_')
                }
            }
        }
    }
}
```

简化方案不会修改任何文件，仅在内存中设置 namespace，但可能无法解决所有第三方库的问题。

---

## 参考

- [GitHub Issue #451](https://github.com/proyecto26/react-native-inappbrowser/issues/451)
- [Stack Overflow - namespace not specified](https://stackoverflow.com/questions/76108428)
- [Detox Project Setup](https://wix.github.io/Detox/docs/introduction/project-setup)