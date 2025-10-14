---
layout: post
title: "同样是 Sonnet 4.5，为何 CLI 工具差距这么大"
date: 2025-10-13 08:00
comments: true
categories: CLI AI Tools Claude Copilot
---

最近使用 Claude Code CLI 和 GitHub Copilot CLI 时发现，虽然两者都使用 Claude Sonnet 4.5 模型，但 Claude Code 明显更智能。本文记录性能差异的技术原因。

<!--more-->

## 核心问题

**同模型不等于同性能**。Claude Sonnet 4.5 原生支持 200K tokens 上下文和 Extended Thinking，但 Copilot CLI 通过中间层大幅限制了这些能力。

---

## Copilot CLI 的三大限制

### 1. 上下文窗口严重缩水

**Claude Sonnet 4.5 原生能力**：
- 标准：200K tokens
- 长上下文版本：1M tokens

**Copilot CLI 实际限制**：
- 约 **8K tokens** 上下文窗口
- 官方未明确公布，但用户实测约为此值

**实际影响**：

```python
# 场景：分析涉及 10 个文件的代码库

# Claude Code CLI (200K 上下文)
# ✓ 可同时加载多个相关文件
# ✓ 保持完整的代码关系理解
# ✓ 前后一致的分析结果

# Copilot CLI (8K 上下文)
# ✗ 只能保持 1-2 个文件
# ✗ 频繁遗忘先前分析内容
# ✗ 需要反复重新读取
```

8K tokens 约等于 **6000 英文单词** 或 **1500 行代码**。Copilot CLI 的小窗口导致频繁的上下文切换和信息丢失。

### 2. Extended Thinking 功能完全缺失

**什么是 Extended Thinking**：

允许模型进行深度推理，配置 1K-64K tokens 的"思考预算"，在复杂任务中显著提升表现。

**Claude Code CLI 配置示例**：

```json
{
  "model": "claude-sonnet-4-5-20250929",
  "thinking": {
    "type": "enabled",
    "budget_tokens": 10000
  }
}
```

**Copilot CLI**：

完全不支持此配置，无法启用 Extended Thinking。这是两者智能表现差异的关键原因。

### 3. 资源配额与超时策略

**Claude Code CLI**：
- 按 token 计费（$3/百万输入，$15/百万输出）
- 允许长时间运行
- 支持检查点功能，可保存进度

**Copilot CLI**：
- Premium Request 配额制（Pro 300 次/月）
- 隐性"思考预算"限制
- 超时中断机制

**比喻**：

Claude Code 设计用于 **跑马拉松**（长时间、多步骤任务），Copilot CLI 只能 **跑百米**（快速交互）。

---

## 架构差异

### Claude Code CLI：直接访问

```
用户 → Anthropic API → Claude Sonnet 4.5
```

**特点**：
- 完整的 200K tokens 上下文
- 支持 Extended Thinking  
- 完全参数控制
- 并行工具调用
- 无功能限制

**代价**：
- 使用 grep-only 检索（无语义索引）
- 大量顺序工具调用
- **速度慢 4-5 倍**

### Copilot CLI：中间层架构

```
用户 → GitHub 编排层 → Anthropic API → Claude Sonnet 4.5
```

**中间层作用**：
- 模型路由和切换
- 成本控制和配额管理
- 上下文窗口限制（8K）
- 屏蔽高级功能（Extended Thinking）
- GitHub 生态集成

**优点**：
- 多模型选择
- GitHub 深度集成
- 相对稳定

**代价**：
- 模型能力被"阉割"
- 上下文限制严重
- 复杂任务表现差

---

## 实测性能对比

### 速度差异

重构 React 前端任务（约 15 个文件）：
- **Claude Code CLI**: 18 分 20 秒
- **Claude Chat 手动**: 4 分 30 秒
- **Copilot CLI**: 约 **90 分钟**（18 分 × 5）

用户反馈：Copilot CLI 比 Claude Code **慢 5 倍以上**。

### 大文件处理

**Claude Code 限制**：

```bash
# 单文件读取限制 25K tokens
Error: File content (28375 tokens) exceeds maximum allowed tokens (25000)
```

需要使用 offset 和 limit 分块读取，导致反复工具调用。

**Copilot CLI 问题**：
- 8K tokens 窗口导致频繁分块
- >1000 行文件经常卡顿
- 有时卡死 30 分钟后超时

---

## 为什么 Claude Code "更智能"

### 1. 全局视野 vs 局部视野

**Claude Code**：
- 200K tokens 上下文窗口
- 可同时保持多个文件内容
- 理解代码全局关系

**Copilot CLI**：
- 8K tokens 上下文窗口
- 只能保持少量文件
- 频繁遗忘先前内容

### 2. 深度思考 vs 快速响应

**Claude Code**：
- Extended Thinking 允许模型"想"得更久
- 可以进行复杂推理
- 适合多步骤任务

**Copilot CLI**：
- 无 Extended Thinking
- 思考预算受限
- 倾向快速给出结果

### 3. 马拉松 vs 百米

**Claude Code**：
- 设计用于长时间运行
- 可处理复杂、多步骤任务
- 允许大量 token 消耗

**Copilot CLI**：
- 为快速交互优化
- 超出一定时限就中断
- 控制成本和资源

---

## 稳定性问题

### Copilot CLI

GitHub 社区反馈：
- Claude Sonnet 4 在约 5 个提示后停止
- 频繁 "I'm sorry but there was an error"
- 上下文突然丢失

官方承认是"已知的服务器端问题"。

### Claude Code

- 使用 31% 配额时被提前限制
- 陷入"无限压缩循环"
- 读取大文件时崩溃

---

## 优化建议

### Claude Code

**使用语义索引**：
```bash
# 安装 MCP 服务器（如 Serena MCP）
# 替代低效 grep 检索
```

**主动管理上下文**：
```bash
/clear   # 清理上下文
/compact # 压缩上下文
```

**维护 CLAUDE.md**：
- 项目规范
- 禁止目录
- 常用命令

### Copilot CLI

**监控配额**：
```bash
/usage  # 查看使用情况
```

**按任务选模型**：
- 复杂任务：Claude Sonnet 4.5
- 简单任务：Haiku

**避免大任务接近限制时启动**

---

## 总结

两者差异的根本原因：

| 维度 | Claude Code CLI | Copilot CLI |
|------|----------------|-------------|
| **上下文窗口** | 200K tokens | ~8K tokens |
| **Extended Thinking** | ✓ 支持 | ✗ 不支持 |
| **资源策略** | 马拉松 | 百米 |
| **架构** | 直接访问 | 中间层限制 |
| **适用场景** | 复杂重构 | 快速迭代 |

**Claude Code** 提供完整模型能力但速度慢，像让模型"看全局、想得久"。

**Copilot CLI** 功能受限但集成好，像让模型"看局部、快速答"。

用户反馈的"8K tokens 限制"并非误解，而是 Copilot CLI 的真实约束。这个限制加上 Extended Thinking 缺失，是智能表现差异的核心原因。

实际使用中，**许多开发者两者并用**：Claude Code 处理复杂任务，Copilot CLI 处理快速交互。