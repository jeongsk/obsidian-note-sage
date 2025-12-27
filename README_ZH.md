# Note Sage

[한국어](README.md) | [English](README_EN.md) | [简体中文](README_ZH.md) | [日本語](README_JA.md) | [Deutsch](README_DE.md) | [Français](README_FR.md) | [Español](README_ES.md) | [Português](README_PT.md) | [Русский](README_RU.md) | [हिन्दी](README_HI.md) | [العربية](README_AR.md)

https://github.com/user-attachments/assets/3b251604-cf52-4f38-8c9d-fba67e280b64

将 AI 代理直接集成到您的 Obsidian 库中。本插件将 Claude Code CLI 与 Obsidian 无缝集成，让您无需离开工作区即可与 AI 聊天、编辑文件和管理知识库。

## 为什么开发这个插件？

使用 AI 时不应该打断您的工作流程或丢失库的上下文。

本插件让 Claude 能够感知您的 Obsidian 环境，让您无需切换到终端即可在工作区内完成所有操作。它还提供了帮助您更有效地管理上下文的功能。

## 主要功能

- **直接 AI 集成**：在 Obsidian 界面中直接与 Claude Code 对话
- **文件优先方式**：AI 代理可以读取、编辑和创建库中的文件
- **上下文感知**：自动将相关的库上下文包含在对话中
- **实时协作**：实时查看 AI 在 Obsidian 界面中的编辑
- **快捷操作**：使用预定义提示快速执行常用任务（摘要、改进、分析、翻译）
- **MCP 服务器集成**：将外部工具和资源连接到 AI 代理
- **多语言界面**：支持 11 种语言（中文、英语、韩语、日语、德语、法语、西班牙语、葡萄牙语、俄语、印地语、阿拉伯语）
- **会话管理**：保持对话连续性并保存对话

## 安装

### 前置要求

- **Anthropic 账户** - Claude API 访问所需（[console.anthropic.com](https://console.anthropic.com)）
- **Claude Code CLI** - 从 [Anthropic's Claude Code](https://www.anthropic.com/claude-code) 获取

### 安装步骤

*即将上架 Obsidian 社区插件商店*

1. **验证 CLI 访问**：确保您可以在终端中运行 `claude`
2. **下载**：从[发布页面](../../releases)获取最新版本（`obsidian-note-sage.zip`）
3. **安装**：解压并将文件夹放置到 `[您的库路径]/.obsidian/plugins/obsidian-note-sage`
4. **启用**：在 Obsidian 的社区插件设置中激活插件
5. **开始聊天**：使用工作区右侧边栏中的 Note Sage 面板

> [!WARNING]
> **预览版本说明**
>
> 本插件正在积极开发中，会修改您库中的文件。目前使用提升的权限（`--permission-mode bypassPermissions` 和 `dangerously-skip-permissions`）以实现完整功能。
>
> **建议**：使用前请备份您的库。精细权限控制计划在未来版本中添加。

## 使用方法

### 基本使用

1. 点击右侧边栏中的 Note Sage 图标
2. 在聊天输入框中输入消息
3. 按 Enter 发送（Shift+Enter 换行）
4. 使用"当前页面"按钮包含/排除当前笔记上下文

### 快捷操作

使用聊天输入框上方的快捷操作按钮快速执行常用任务：

- **摘要**：简洁地摘要当前文档
- **改进**：改进写作风格并修正错误
- **分析**：分析文档并提供见解
- **翻译**：韩语和英语互译

您可以在设置中自定义每个按钮的提示。

## 设置

### 基本设置

| 设置 | 说明 |
|------|------|
| 模型 | 选择 Claude 模型（opus-4-5、sonnet-4-5、haiku-4-5）|
| 语言 | 界面语言（自动或从 11 种语言中选择）|

### 文件上下文

| 设置 | 说明 |
|------|------|
| 包含文件内容 | 在上下文中包含当前文件内容 |
| 优先选中文本 | 选中文本时仅包含选中部分而非整个文件 |
| 最大内容长度 | 从文件中包含的最大字符数（用于节省令牌）|

### 快捷操作

在设置中自定义每个快捷操作按钮的提示。留空则使用默认值。

### MCP 服务器

连接 MCP（Model Context Protocol）服务器以扩展 AI 代理的功能。

| 设置 | 说明 |
|------|------|
| 添加服务器 | 连接 stdio、SSE 或 HTTP 类型的 MCP 服务器 |
| 启用/禁用服务器 | 切换单个服务器 |
| 工具面板 | 查看已连接 MCP 服务器的可用工具 |

### 高级设置

| 设置 | 说明 |
|------|------|
| API 密钥 | Anthropic API 密钥（可选）|
| Claude CLI 路径 | claude 可执行文件路径（留空则自动检测）|
| 自定义系统提示 | Claude 的自定义指令 |
| 调试模式 | 启用调试日志以便排查问题 |

## 故障排除

### CLI 问题

**找不到 Claude CLI？**

1. **验证安装**：在终端中运行 `claude --version`
2. **手动配置**：如果自动检测失败，在**设置 > 社区插件 > Note Sage**中手动设置路径

**查找可执行文件路径：**
```bash
# Claude CLI 位置
echo "$(sed -n 's/^exec "\([^"]*\)".*/\1/p' $(which claude))"
```

**Windows 用户**：Claude 必须安装在 WSL 中。Windows 原生支持仍在测试中。

### 调试模式

**启用详细日志：**
1. 前往**设置 > 社区插件 > Note Sage**
2. 启用"调试模式"
3. 打开开发者控制台：`Cmd+Opt+I`（Mac）或 `Ctrl+Shift+I`（Windows/Linux）

## 路线图

### 已完成的功能
- [x] **MCP 服务器集成** - 连接外部工具和资源
- [x] **多语言支持** - 11 种语言及 RTL 支持
- [x] **快捷操作自定义** - 按钮级别的提示设置
- [x] **Obsidian 插件管理工具** - 通过 AI 管理插件

### 计划中的功能
- [ ] **交互模式** - 写作模式、计划模式和自定义工作流
- [ ] **权限控制** - 精细的文件访问和编辑权限
- [ ] **跨平台支持** - 增强的 Windows/WSL 兼容性
- [ ] **上下文菜单集成** - 在文件浏览器中"添加到 AI 上下文"
- [ ] **文件链接** - 打开模型读取/编辑过的文件
- [ ] **增强的复制/粘贴** - 智能上下文复制/粘贴

## 隐私与数据处理

### 远程服务

本插件使用 **Anthropic Claude API** 处理您的请求。发送消息时：
- 您的提示文本会发送到 Anthropic 服务器
- 如果启用"当前页面"上下文，文件内容也会发送
- 数据按照 [Anthropic 隐私政策](https://www.anthropic.com/privacy)处理

### 账户要求

- **Anthropic API 密钥**：API 访问所需
  - 在 [console.anthropic.com](https://console.anthropic.com) 获取
  - 本地存储在您库的插件数据中（未加密）

### 文件系统访问

本插件访问 Obsidian 库外部的位置：
- **Claude CLI 检测**：搜索系统路径以定位 Claude 可执行文件
  - macOS/Linux：`~/.local/bin/`、`/usr/local/bin/`、`/opt/homebrew/bin/`
  - Windows：`%USERPROFILE%\AppData\`、`C:\Program Files\`
- **代理权限**：使用提升的权限（`bypassPermissions`）允许 AI 读取/编辑库中的文件

### 本地数据存储

- 聊天消息仅存储在内存中（重启时清除）
- 设置存储在 `.obsidian/plugins/obsidian-note-sage/data.json`
- 对话可以手动保存到您的库作为 markdown 文件

## 许可证

MIT License
