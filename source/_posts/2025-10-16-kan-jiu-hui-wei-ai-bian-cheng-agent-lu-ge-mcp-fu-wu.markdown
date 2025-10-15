---
layout: post
title: "一看就会，为 AI 编程 Agent 撸一个 MCP 服务"
date: 2025-10-15 14:30
comments: true
categories: Android MCP ADB Node.js
---

通过 MCP (Model Context Protocol) 让 AI 助手直接调用 ADB 命令操作 Android 设备，实现日志查看、应用安装、性能分析等自动化操作。

<!--more-->

## MCP 协议说明

MCP 是 Anthropic 推出的开放协议，用于连接 AI 助手与外部工具。MCP Server 将特定工具包装成标准化接口，让 AI 能够理解和调用。

架构如下：

```
Claude Desktop/API → MCP Server → ADB Commands → Android Device
```

---

## 实现步骤

### 初始化项目

```bash
mkdir adb_mcp
cd adb_mcp
npm init -y
npm install @modelcontextprotocol/sdk
```

### 配置 package.json

```json
{
  "name": "adb-mcp-server",
  "version": "1.0.0",
  "description": "MCP Server for Android Debug Bridge (ADB) operations",
  "main": "adb-mcp-server.js",
  "bin": {
    "adb-mcp-server": "./adb-mcp-server.js"
  },
  "scripts": {
    "start": "node adb-mcp-server.js"
  },
  "keywords": ["mcp", "adb", "android", "debug"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0"
  }
}
```

### 核心代码实现

创建 `adb-mcp-server.js`：

```javascript
#!/usr/bin/env node
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

// 创建 MCP Server 实例
const server = new Server(
  {
    name: 'adb-server',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// 定义工具列表
const tools = [
  {
    name: 'adb-logcat',
    description: 'Get Android device logs',
    inputSchema: {
      type: 'object',
      properties: {
        lines: {
          type: 'number',
          description: 'Number of log lines to retrieve',
          default: 100
        }
      }
    }
  },
  {
    name: 'adb-devices',
    description: 'List connected Android devices',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'adb-install',
    description: 'Install APK on connected device',
    inputSchema: {
      type: 'object',
      properties: {
        apkPath: {
          type: 'string',
          description: 'Path to the APK file to install'
        }
      },
      required: ['apkPath']
    }
  },
  {
    name: 'adb-app-info',
    description: 'Get app package information',
    inputSchema: {
      type: 'object',
      properties: {
        packageName: {
          type: 'string',
          description: 'Android package name (e.g., com.example.app)'
        }
      },
      required: ['packageName']
    }
  },
  {
    name: 'adb-meminfo',
    description: 'Get app memory usage information',
    inputSchema: {
      type: 'object',
      properties: {
        packageName: {
          type: 'string',
          description: 'Android package name (e.g., com.example.app)'
        }
      },
      required: ['packageName']
    }
  },
  {
    name: 'adb-clear-data',
    description: 'Clear app data and cache',
    inputSchema: {
      type: 'object',
      properties: {
        packageName: {
          type: 'string',
          description: 'Android package name (e.g., com.example.app)'
        }
      },
      required: ['packageName']
    }
  }
];

// 处理工具列表请求
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// 处理工具执行请求
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    switch (name) {
      case 'adb-logcat': {
        const lines = args.lines || 100;
        const { stdout } = await execPromise(`adb logcat -d -t ${lines}`);
        result = stdout;
        break;
      }

      case 'adb-devices': {
        const { stdout } = await execPromise('adb devices -l');
        result = stdout;
        break;
      }

      case 'adb-install': {
        if (!args.apkPath) {
          throw new Error('apkPath is required');
        }
        const { stdout } = await execPromise(`adb install -r "${args.apkPath}"`);
        result = stdout;
        break;
      }

      case 'adb-app-info': {
        if (!args.packageName) {
          throw new Error('packageName is required');
        }
        const { stdout } = await execPromise(`adb shell dumpsys package ${args.packageName}`);
        result = stdout;
        break;
      }

      case 'adb-meminfo': {
        if (!args.packageName) {
          throw new Error('packageName is required');
        }
        const { stdout } = await execPromise(`adb shell dumpsys meminfo ${args.packageName}`);
        result = stdout;
        break;
      }

      case 'adb-clear-data': {
        if (!args.packageName) {
          throw new Error('packageName is required');
        }
        const { stdout } = await execPromise(`adb shell pm clear ${args.packageName}`);
        result = stdout;
        break;
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: result
        }
      ]
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error executing ${name}: ${error.message}`
        }
      ],
      isError: true
    };
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('ADB MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
```

赋予执行权限：

```bash
chmod +x adb-mcp-server.js
```

---

## 关键实现说明

### Server 初始化

```javascript
const server = new Server(
  { name: 'adb-server', version: '1.0.0' },
  { capabilities: { tools: {} } }
);
```

声明服务器名称、版本和支持的能力类型。

### 工具定义

每个工具包含三个部分：
- **name**: 唯一标识符
- **description**: 功能描述，AI 根据此判断调用时机
- **inputSchema**: JSON Schema 格式的参数定义

示例：

```javascript
{
  name: 'adb-install',
  description: 'Install APK on connected device',
  inputSchema: {
    type: 'object',
    properties: {
      apkPath: { type: 'string', description: 'Path to the APK file' }
    },
    required: ['apkPath']
  }
}
```

### 请求处理

MCP 定义两种请求类型：

**ListToolsRequest** - 列出所有可用工具：
```javascript
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});
```

**CallToolRequest** - 执行具体工具：
```javascript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  // 根据 name 执行相应 ADB 命令
});
```

### 命令执行

使用 `child_process` 执行 ADB 命令：

```javascript
const { stdout } = await execPromise(`adb devices -l`);
```

---

## 配置方式

### Claude Desktop 配置

编辑 `~/Library/Application Support/Claude/claude_desktop_config.json`：

```json
{
  "mcpServers": {
    "adb": {
      "command": "node",
      "args": ["/Users/你的用户名/Documents/self_host/adb_mcp/adb-mcp-server.js"]
    }
  }
}
```

配置完成后重启 Claude Desktop。

### Claude Code CLI 配置

使用 Claude Code 命令行工具添加 MCP Server：

```bash
claude -p mcp add adb node /Users/xxxx/Documents/sxxx/adb_mcp/adb-mcp-server.js
```

参数说明：
- `adb`: MCP Server 名称
- `node`: 运行命令
- 最后是 `adb-mcp-server.js` 的完整路径

### Gemini CLI 配置

编辑 Gemini CLI 配置文件 `~/.gemini/mcp_config.json`：

```json
{
  "mcpServers": {
    "adb": {
      "command": "node",
      "args": ["/Users/xxxx/Documents/sxxx/adb_mcp/adb-mcp-server.js"]
    }
  }
}
```

**注**：Gemini CLI 的 MCP 配置可能因版本而异，建议以官方文档为准。

### Copilot CLI 配置

编辑 Copilot CLI 配置文件 `~/.github-copilot/mcp_servers.json`：

```json
{
  "adb": {
    "command": "node",
    "args": ["/Users/xxxx/Documents/sxxx/adb_mcp/adb-mcp-server.js"]
  }
}
```

**注**：Copilot CLI 的 MCP 配置可能因版本而异，建议以官方文档为准。

---

## 使用示例

在 Claude 中直接使用自然语言：

```
查看连接的 Android 设备
```

```
获取最近 50 行 logcat 日志
```

```
查看 com.android.chrome 的内存使用情况
```

```
清除 com.example.app 的数据
```

Claude 会自动调用对应的 MCP 工具执行操作。

---

## 应用场景

### 日志分析

传统方式：
```bash
adb logcat -d > log.txt
# 手动搜索错误信息
```

使用 MCP：
```
获取最近的 logcat 日志，找出所有 ERROR 级别信息
```

Claude 自动执行并分析结果。

### 性能监控

传统方式：
```bash
adb shell dumpsys meminfo com.example.app
# 手动分析输出数据
```

使用 MCP：
```
查看 com.example.app 的内存使用，分析是否有内存泄漏
```

### 批量操作

```
列出所有连接的设备，在每个设备上安装 /path/to/app.apk
```

Claude 自动处理设备列表和批量安装。

---

## 扩展功能

### 添加截图

```javascript
{
  name: 'adb-screenshot',
  description: 'Take a screenshot',
  inputSchema: {
    type: 'object',
    properties: {
      savePath: { type: 'string', description: 'Path to save screenshot' }
    },
    required: ['savePath']
  }
}
```

执行命令：
```javascript
await execPromise(`adb exec-out screencap -p > ${args.savePath}`);
```

### 添加性能监控

```javascript
{
  name: 'adb-top',
  description: 'Get CPU usage',
  inputSchema: { type: 'object', properties: {} }
}
```

### 添加文件传输

```javascript
{
  name: 'adb-push',
  description: 'Push file to device',
  inputSchema: {
    type: 'object',
    properties: {
      localPath: { type: 'string' },
      remotePath: { type: 'string' }
    },
    required: ['localPath', 'remotePath']
  }
}
```

---

## 注意事项

### 权限检查

确保 ADB 已添加到系统 PATH：

```bash
which adb
adb version
```

### 设备授权

使用前确认设备已连接并授权：

```bash
adb devices
```

如果显示 `unauthorized`，需在设备上确认 USB 调试授权。

### 错误处理

生产环境应添加：
- 详细日志记录
- 设备断开连接处理
- 命令超时机制

### 安全性

- 避免在不信任的环境使用
- 注意 APK 路径注入风险
- 考虑添加命令白名单

---

## 参考资源

- [MCP 官方文档](https://modelcontextprotocol.io/)
- [MCP SDK GitHub](https://github.com/modelcontextprotocol/sdk)
- [ADB 官方文档](https://developer.android.com/tools/adb)
