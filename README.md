# 课文漫游 - AI驱动的语文可视化平台

将语文课文自动转化为漫画的 AI 学习工具。

## 功能

- **AI 漫画生成**：输入课文 → DeepSeek 分析场景 → ComfyUI 生成漫画
- **三种画风**：写实古风、水墨风格、彩色插画
- **场景编辑**：增删、移动、修改中文描述
- **边生成边预览**：图片逐步返回，无需等待全部完成
- **作品保存**：云端保存 / 下载 ZIP
- **用户系统**：注册登录、管理个人作品
- **审核机制**：作品公开需管理员审核
- **管理后台**：管理员可审核作品、管理用户

## 用户角色

| 角色 | 权限 |
|------|------|
| 普通用户 | 登录/注册、管理自己的作品、申请公开 |
| 管理员 | 审核公开申请、管理所有作品和课文、管理用户 |

## 技术栈

| 前端 | 后端 |
|------|------|
| Nuxt 4 + Vue 3 | FastAPI + Uvicorn |
| Pinia | DeepSeek API |
| Tailwind CSS | ComfyUI + SD1.5 |

## 快速开始

### 后端

```bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 前端

```bash
cd app
pnpm install
pnpm dev
```

访问 http://localhost:3000

## 项目结构

```
kemenmanyou/
├── app/                      # Nuxt 4 前端
│   ├── app/pages/            # 页面
│   │   ├── admin/            # 管理后台
│   │   ├── watch/            # 观看页
│   │   ├── workspace.vue     # 工作台
│   │   └── ...
│   └── server/api/           # API 代理
└── server/                   # FastAPI 后端
    ├── main.py
    └── static/              # 静态文件
```

## 页面

| 路由 | 说明 | 权限 |
|------|------|------|
| `/workspace` | 工作台 | 需登录 |
| `/gallery` | 展示广场 | 公开 |
| `/watch/{id}` | 观看页 | 公开 |
| `/login` | 登录 | 公开 |
| `/register` | 注册 | 公开 |
| `/profile` | 个人中心 | 需登录 |
| `/my-works` | 我的作品 | 需登录 |
| `/admin` | 管理后台首页 | 管理员 |
| `/admin/works` | 作品管理 | 管理员 |
| `/admin/lessons` | 课文管理 | 管理员 |
| `/admin/users` | 用户管理 | 管理员 |

## API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/texts` | 内置课文列表 |
| POST | `/api/analyze` | AI 分析课文 |
| POST | `/api/generate` | 提交生成任务 |
| GET | `/api/task/{task_id}` | 轮询任务状态 |
| POST | `/api/works` | 保存作品（需登录） |
| GET | `/api/works/my` | 我的作品（需登录） |
| GET | `/api/works/public` | 公开作品（展示广场） |

详见 `doc/API.md`