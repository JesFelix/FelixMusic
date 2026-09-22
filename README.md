# FelixMusic

> 一款简洁、可定制的本地音乐播放器。

FelixMusic 是一个基于 [Tauri 2](https://tauri.app/) 构建的桌面音乐应用。它使用 Vue 3 实现现代化的用户界面，并通过 Rust 提供本地音频播放、音乐目录扫描、主题管理和窗口控制能力。

![Vue 3](https://img.shields.io/badge/Vue.js-3-42b883?logo=vuedotjs&logoColor=white)
![Tauri 2](https://img.shields.io/badge/Tauri-2-24c8db?logo=tauri&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-2021-000000?logo=rust&logoColor=white)
![License](https://img.shields.io/badge/license-Apache--2.0-blue)

## 项目状态

项目目前处于早期开发阶段，当前版本为 `0.1.0`。核心界面和本地播放链路已经搭建完成，功能、稳定性和跨平台兼容性仍在持续完善中。

## 功能概览

- **本地音乐**：扫描本地音乐目录并展示歌曲列表。
- **音频播放**：支持播放、暂停、停止、上一首、下一首和音量调节。
- **多页面导航**：包含精选、收藏、歌单、本地音乐、最近播放和系统设置等页面。
- **主题系统**：内置浅色与深色主题，支持主题目录管理及主题文件导入/删除。
- **桌面体验**：提供自定义无边框窗口、最小化、最大化和关闭等窗口操作。
- **现代化界面**：采用响应式布局、组件化设计和统一的播放控制区域。

## 开发进度

| 模块 | 状态 | 说明 |
| --- | --- | --- |
| 项目基础架构 | 已完成 | Vue 3、Vite、Tauri 2、Rust 基础工程已建立 |
| 主界面与导航 | 已完成 | 主布局、播放布局及主要页面路由已完成 |
| 本地音乐扫描 | 已完成 | 支持调用 Rust 命令扫描音乐目录 |
| 基础播放控制 | 已完成 | 播放、暂停、切歌、停止和音量控制已接入 |
| 主题管理 | 已完成 | 内置主题、主题读取、导入和删除流程已接入 |
| 播放队列 | 进行中 | 完善队列管理、循环模式和播放状态同步 |
| 数据持久化 | 待开发 | 收藏、历史记录和用户设置持久化 |
| 歌词与更多格式 | 待开发 | 歌词显示、格式兼容性和错误提示优化 |
| 自动化测试与发布 | 待开发 | 建立测试、打包和跨平台发布流程 |

## 技术栈

### 前端

- Vue 3、TypeScript、Vite
- Vue Router、Pinia、Pinia Persisted State
- Tailwind CSS、Sass、Element Plus、Arco Design Vue

### 桌面端

- Tauri 2
- Rust 2021
- Rodio：音频播放
- Rusqlite：本地数据存储基础

## 快速开始

### 环境要求

请先安装以下环境：

- Node.js 及 npm
- Rust 及 Cargo
- Tauri 2 对应的系统开发依赖

### 安装与运行

```bash
# 克隆项目
git clone <your-repository-url>
cd FelixMusic

# 安装前端依赖
npm install

# 启动前端开发服务器
npm run dev

# 启动完整 Tauri 桌面应用
npm run tauri dev
```

### 构建与检查

```bash
# 类型检查并构建前端生产版本
npm run build

# 检查 Rust 后端
cargo check --manifest-path src-tauri/Cargo.toml

# 格式化 Rust 代码
cargo fmt --manifest-path src-tauri/Cargo.toml
```

## 项目结构

```text
src/                         Vue 前端代码
├─ components/               通用组件
├─ layouts/                  主布局和播放布局
├─ stores/                   Pinia 状态管理
├─ views/                    业务页面
├─ router/                   路由配置
├─ theme/                    主题引擎和主题样式
└─ assets/                   图片、图标、字体和样式

src-tauri/                   Tauri 与 Rust 后端
├─ src/fm_audio/             音频播放与本地音乐处理
├─ src/fm_theme/             主题管理
├─ src/fm_window/            窗口控制
├─ resource/themes/          内置主题资源
└─ capabilities/             Tauri 权限配置

public/                      公共静态资源
```

## 许可证

本项目采用 [Apache License 2.0](LICENSE) 开源许可证。
