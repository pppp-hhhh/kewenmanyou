# 课文漫游

将语文课文自动转化为漫画和动画的 AI 辅助学习工具。

## 项目简介

学生在阅读语文课文时常常遇到"文字转化不了画面"的困难，特别是古诗、文言文、写景文。**课文漫游**通过 AI 技术，将课文自动分解为漫画场景，生成对应的插画，让学生"看得见"课文。

## 功能

- **课文分析**：调用 DeepSeek 将课文分解为多个漫画场景，每个场景包含中文描述和英文绘图提示词
- **场景编辑**：支持增删、移动、修改场景，可自定义画风
- **实时预览**：边生成边看，无需等待全部完成
- **作品保存**：一键下载 ZIP 包（含所有图片和场景元数据）
- **展示广场**：浏览公开作品，进入观看页阅读漫画

## 技术栈

### 前端

- Nuxt 4 + Vue 3
- Pinia 状态管理
- Tailwind CSS + Nuxt UI
- SSR/CSR 混合渲染

### 后端

- Python 3.10 + FastAPI + Uvicorn
- DeepSeek API（课文分析与分镜拆解）
- ComfyUI + Z-image（图像生成）
- pillow (用于长漫分镜物理拼接)
- SupaBase 数据库

## 项目结构

```
kemenmanyou/
├── app/                    # Nuxt 4 前端
│   ├── pages/
│   │   ├── index.vue       # 重定向 / → /gallery
│   │   ├── gallery.vue     # 展示广场
│   │   ├── watch/[id].vue # 观看页
│   │   └── workspace.vue   # 工作台
│   ├── components/         # 组件
│   ├── stores/             # Pinia stores
│   └── composables/        # API composables
├── server/                 # FastAPI 后端
└── public/                 # 静态资源
```

## 快速开始

### 环境要求

- Python 3.10+
- Node.js 18+
- ComfyUI（本机部署，端口 8188）
- DeepSeek API Key

### 1. 克隆并安装后端依赖

```bash
cd server
pip install -r requirements.txt
```

### 2. 配置环境变量

在 `server/` 目录创建 `.env` 文件：

```env
DEEPSEEK_API_KEY=your_api_key
DEEPSEEK_BASE_URL=https://api.deepseek.com
COMFYUI_API_URL=http://localhost:8188/api/generate
MAX_CONCURRENT_GENERATIONS=2
TEMP_IMAGE_DIR=./static/temp
WORKS_IMAGE_DIR=./static/works
DATABASE_URL=sqlite:///./app.db
```

### 3 .启动后端服务

本系统后端基于 FastAPI 构建，提供两种运行模式以适配不同的教学场景。

#### 准备工作
在启动前，请确保已安装核心依赖并配置好 ComfyUI：
cd server
pip install -r requirements.txt
pip install Pillow

#### 运行模式选择

你可以根据需要启动以下任一服务：

- **标准单图版**：python main.py (端口: 8001)
  核心功能：快速生成单张课文插画。
  
- **增强连排版**：python multi_stitcher.py (端口: 8002)
  核心功能：自动分镜、多图生成并物理拼接为垂直长漫画。

#### 3. API 调试说明
服务启动后，可以通过 Swagger UI 实时调试接口：
- 单图版文档: http://127.0.0.1:8001/docs
- 连排版文档: http://127.0.0.1:8002/docs

> ⚠️ 运行须知：
> - 确保 ComfyUI 已启动（API 默认端口通常为 8188）。
> - 请务必在代码配置区填入有效的 DEEPSEEK_API_KEY 和 SUPABASE_KEY。
> - 连排模式下，生成的长漫会自动保存至桌面的 “课文漫游长漫” 文件夹。

### 4. 安装前端依赖并启动

```bash
cd app
npm install
npm run dev
```

访问：`http://localhost:3000`


## 页面说明

| 页面 | 路由 | 说明 |
|------|------|------|
| 工作台 | `/workspace` | 课文输入、AI分析、场景编辑、漫画生成（CSR） |
| 展示广场 | `/gallery` | 浏览公开作品（SSR/SSG） |
| 观看页 | `/watch/{id}` | 漫画阅读器（SSR） |

## API 概览

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | `/api/texts` | 获取内置课文列表 |
| POST | `/api/analyze` | 分析课文，返回场景列表 |
| POST | `/api/generate` | 提交批量生成任务 |
| GET | `/api/task/{task_id}` | 查询任务状态（轮询） |
| POST | `/api/works` | 保存作品 |
| GET | `/api/works/public` | 获取公开作品列表 |
| GET | `/api/works/{work_id}` | 获取作品详情 |

详见 `doc/API_DOC.md`

## 团队

| 成员 | 职责 |
|------|------|
| lzl | 后端开发（FastAPI + AI 集成） |
| ph | 前端工作台 |
| zgl | 前端展示广场 |

## 团队协作

### 分支策略

```
main          ─── 稳定分支，始终可部署
 ├── dev-backend        ── 后端开发分支
 ├── dev-frontend-ph    ── 工作台开发分支
 └── dev-frontend-zgl   ── 展示广场开发分支
```

### 工作流程

1. **从 `main` 创建功能分支**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/xxx
   ```

2. **开发完成后提交 PR**
   ```bash
   git push origin feature/xxx
   # 在 GitHub 创建 PR → 合并到对应开发分支
   ```

3. **定期合并到 `main`**
   - 由各分支负责人发起 PR，经团队 review 后合并

### Commit 规范

格式：`<type>: <subject>`

| type | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式（不影响功能） |
| `refactor` | 重构（不影响功能） |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建/工具相关 |

示例：
```
feat: 添加课文分析接口
fix: 修复轮询超时问题
docs: 更新API文档
```

### 前后端约定

- **接口联调**：后端提供 Swagger 文档，前端按接口文档开发
- **联调周期**：每周两次同步会议
- **环境区分**：
  - 开发：`http://localhost:8000`（后端）、`http://localhost:3000`（前端）
  - 联调环境：待定

## 文档

- `doc/API_DOC.md` — 接口详细文档
- `doc/课文漫游 - 开发分工与接口大纲.md` — 开发分工与里程碑
- `doc/课文漫游 - 项目说明书.md` — 完整项目说明
