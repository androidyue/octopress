---
layout: post
title: "Vibe Coding 最佳实践：10 个让开发效率提升 10 倍的关键技巧"
date: 2025-10-15 14:30
comments: true
categories: Android AI Claude VibeCoding Kotlin
---

本文整理 Vibe Coding（AI 辅助编程）的 10 个核心最佳实践，帮助提升开发效率和代码质量。

<!--more-->

## 1. 根据任务选择模型

**Claude Haiku 4.5**：速度最快、成本最低（$0.25/MTok 输入，$1.25/MTok 输出），适合简单快速任务（代码格式化、简单 bug 修复、基础代码补全、文档注释生成）。响应速度快，适合高频调用场景。

**Claude Sonnet 4.5**：日常开发首选，用于 70-80% 编程任务（代码生成、重构、测试），性价比最高（$3/MTok 输入，$15/MTok 输出）。

**Claude Opus 4.1**：复杂推理任务（多步骤工作流、架构决策），价格是 Sonnet 5 倍，支持 7 小时以上自主编程。

**OpenAI Codex / GPT-4**：擅长代码补全和快速生成，GitHub Copilot 基于此技术。适合 IDE 内实时代码提示、函数级补全、单元测试生成。

**决策框架**：
- 简单快速任务 → Claude Haiku 4.5
- 实时代码补全 → Codex
- 日常代码生成、重构 → Claude Sonnet 4.5
- 复杂架构设计、多文件重构 → Claude Opus 4.1

---

## 2. 使用四要素 Prompt 框架

**核心框架**：
- **上下文/角色**：设定专业背景（"你是精通 Kotlin 协程的 Android 性能优化专家"）
- **指令**：清晰的单一任务命令（"重构此 ViewModel 以减少数据库查询次数"）
- **内容**：使用代码块标记实际代码
- **格式**：明确输出结构（"提供重构后的代码并添加注释解释变更"）

**实用模式**：
- 逐步说明："创建 Kotlin 函数：1. 接收用户 ID 列表；2. 从 Room 获取数据；3. 过滤活跃用户；4. 返回 Flow 并处理异常"
- 示例驱动："参考以下 ViewModel 写法，转换这个 Activity"
- 角色扮演："作为 Android 安全专家，审查此登录代码，重点关注 SharedPreferences 加密、网络请求安全、WebView 配置"

**避免**：
- 模糊请求（"让这个更好"）
- 一次多个无关任务
- 缺少错误堆栈的调试请求

---

## 3. 善用代码上下文和文件引用

**核心问题**：AI 不了解项目结构，生成代码可能与项目风格不一致。

**提供上下文的方法**：

**引用文件**：
```
请参考 UserRepository.kt 的写法，为 ProductRepository 实现相同的缓存逻辑
```

**粘贴关键代码**：
```kotlin
// 现有的 BaseViewModel 实现
abstract class BaseViewModel : ViewModel() {
    protected val _loading = MutableStateFlow(false)
}
// 请按此模式实现 UserViewModel
```

**说明架构**：
```
项目使用 MVVM 架构：
- data/ 层：Repository + DataSource
- domain/ 层：UseCase + Model  
- presentation/ 层：ViewModel + Activity/Fragment
使用 Hilt、Room、Retrofit
```

**使用 @文件 语法**：
```
@MainActivity.kt 这个 Activity 的内存泄漏在哪里？
@app/build.gradle 添加 Coil 图片加载库
```

首次对话说明技术栈和架构，涉及多文件时列出文件名，生成代码时提供参考示例。

---

## 4. 针对复杂问题开启扩展思考模式

**适用场景**：复杂算法（图片压缩、列表优化）、不明确原因的 bug（ANR、内存泄漏）、架构决策（MVVM vs MVI）、跨文件重构、性能优化。

**不推荐**：简单补全、语法修复、基本 CRUD、简单 UI 布局。

**Claude Code 魔法词**：
- `think`：4,000 token
- `think hard` / `megathink`：10,000 token  
- `think harder` / `ultrathink`：31,999 token

**性能提升**：SWE-bench Verified 从 62.3% 提升至 70.3%，数学问题达 96.2%。

从最小预算（1,024 token）开始，根据问题复杂度逐步增加。

---

## 5. 采用小步迭代开发

**黄金法则**：一次生成太多代码会导致混乱和 bug，使用最小有意义增量。

**增量流程**：定义最小增量 → 编写失败测试 → AI 编写通过测试的代码 → 立即运行测试 → 失败则让 AI 诊断修复 → 重复。

**架构先行**：编码前先绘制模块图（Repository-ViewModel-View）、定义数据流（LiveData/StateFlow）、确定组件职责。

**多轮精炼**：第一轮生成基本结构 → 第二轮添加错误处理 → 第三轮优化性能 → 第四轮添加完整文档。每一轮都小而专注、可测试。

---

## 6. 审查代码并建立测试防线

**核心原则**：永远不要盲目接受 AI 输出。GitClear 研究发现粗心使用 AI 导致 bug 增加 41%。

**重点审查**：潜在 bug、安全漏洞（未加密 SharedPreferences、不安全 WebView、Intent 劫持）、性能瓶颈（主线程阻塞、内存泄漏、过度绘制）、缺失错误处理、生命周期管理问题。

**测试生成**：使用 AI 生成单元测试和 UI 测试，但必须人工验证测试是否真实有效、边界情况有意义（空列表、网络错误、权限拒绝）、使用合适框架（JUnit、Mockito、Espresso、Robolectric）。

**覆盖率目标**：ViewModel/Repository 层、复杂业务逻辑、数据转换工具类追求 80%+ 代码覆盖率。

---

## 7. 与版本控制系统深度集成

**核心原则**：Git 是安全网，每个 AI 生成的代码都必须提交，便于快速回退错误修改。

**快速回退命令**：
```bash
git checkout .              # 放弃所有修改
git checkout -- file.kt     # 放弃指定文件修改
git reset HEAD <file>       # 回退暂存区
git reset --hard HEAD^      # 完全回退到上一次提交
```

**原子提交**：每次提交一个逻辑变更，使用祈使语气，消息正文解释原因。

**分支管理**：使用清晰命名（`feat/add-retrofit-api`、`fix/memory-leak-viewmodel`）、所有 AI 实验都使用分支、出问题直接删除分支。

---

## 8. 建立项目规则和指南文件

**规则文件**：创建 `.editorconfig`、`detekt.yml` 或 `docs/coding-standards.md`，定义编码规范（优先使用 Kotlin、Activity/Fragment 最大 500 行、使用 ViewBinding）、测试要求（80% 覆盖率、JUnit 和 Espresso、ViewModel 必须有单元测试）、文档标准（public 方法使用 KDoc、每个模块需 README）、安全策略（永不硬编码 API 密钥、使用 EncryptedSharedPreferences）。

**Android 常用配置**：
- `.editorconfig` - 统一代码格式
- `detekt.yml` - Kotlin 代码质量检查
- `lint.xml` - Android Lint 配置
- `docs/android-conventions.md` - 团队开发规范

**配置方法**：Cursor IDE 在设置中添加用户规则，Claude Projects 在自定义指令中添加规则。

**核心收益**：AI 自动遵循项目规范，团队代码生成一致，保持质量和可维护性。

---

## 9. 及时会话管理

**三种策略**：

**清理会话（Clear）**：任务切换或 AI 出现混乱时使用 `/clear` 或 Cmd/Ctrl + Shift + N。

**新建会话（New Chat）**：开始完全不同的任务时，避免上下文混淆。

**压缩会话（Compact）**：长会话超过 50 轮对话时使用 `/compact`，保留关键信息，释放上下文空间。

**时长建议**：
- 短任务：15-30 分钟，10-20 轮
- 中等任务：1-2 小时，30-50 轮
- 复杂项目：单次不超过 3-4 小时

超过 50-70 轮对话后性能明显下降，及时管理会话。

---

## 10. 使用 MCP 扩展 AI 能力

**什么是 MCP**：Model Context Protocol 让 AI 直接执行 ADB 命令、查询设备状态，无需手动复制日志。

### Android ADB MCP Server

创建 `adb-mcp-server.js`：
```javascript
#!/usr/bin/env node
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);

const server = new Server({ name: 'adb-server', version: '1.0.0' });

server.tool('adb-logcat', 'Get device logs', async ({ lines = 100 }) => {
  const { stdout } = await execPromise(`adb logcat -d -t ${lines}`);
  return { content: stdout };
});

server.tool('adb-meminfo', 'Get memory usage', async ({ packageName }) => {
  const { stdout } = await execPromise(`adb shell dumpsys meminfo ${packageName}`);
  return { content: stdout };
});

server.tool('adb-install', 'Install APK', async ({ apkPath }) => {
  const { stdout } = await execPromise(`adb install -r ${apkPath}`);
  return { content: stdout };
});

server.start();
```

**配置 Claude Desktop**（`~/Library/Application Support/Claude/claude_desktop_config.json`）：
```json
{
  "mcpServers": {
    "adb": {
      "command": "node",
      "args": ["/path/to/adb-mcp-server.js"]
    }
  }
}
```

### 实战场景

**分析崩溃**：
```
用户：应用启动时崩溃
AI：[调用 adb-logcat] 发现 NullPointerException in MainActivity:45
     user 对象为 null，建议使用 safe call (?.)
```

**性能排查**：
```
用户：列表滑动很卡
AI：[调用 adb-meminfo] 内存 450MB，ImageLoader 持有 Activity 引用
     建议使用 WeakReference 和 Glide 生命周期管理
```

### 配置建议

**安全限制**：添加包名白名单，避免误操作。
**错误处理**：捕获异常，提示检查 USB 调试。
**性能优化**：限制 logcat 行数（默认 100），使用 `-d` 参数。

---

## 总结

掌握这十个最佳实践后，原本需要 3 天完成的功能模块可以压缩到半小时。关键在于将 AI 视为超级助手而非普通工具，快速试错、频繁提交、大胆回退，让看似不可能的开发效率成为现实。
