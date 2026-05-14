# 课文漫游 - 后端 API

FastAPI 后端服务，提供课文分析、漫画生成、作品管理、用户认证等功能。

## 技术栈

- **框架**: Python 3.10 + FastAPI + Uvicorn
- **AI**: DeepSeek API（课文分析与分镜）
- **图像生成**: ComfyUI + SD1.5 模型 + LCM LoRA
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth (JWT)

## 安装

```bash
pip install -r requirements.txt
```

## 配置

在 `server/` 目录创建 `.env` 文件：

```env
DEEPSEEK_API_KEY=your_api_key
DEEPSEEK_BASE_URL=https://api.deepseek.com
COMFYUI_API_URL=http://localhost:8188/prompt
```

## 启动

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API 文档：http://localhost:8000/docs

## 核心接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/register` | 用户注册 |
| POST | `/api/auth/login` | 用户登录 |
| GET | `/api/auth/me` | 获取当前用户 |
| GET | `/api/texts` | 内置课文列表 |
| POST | `/api/analyze` | AI 分析课文 |
| POST | `/api/generate` | 提交生成任务 |
| GET | `/api/task/{task_id}` | 轮询任务状态 |
| POST | `/api/works` | 保存作品 |
| GET | `/api/works/my` | 我的作品 |
| GET | `/api/works/public` | 公开作品 |

## 管理员接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/stats` | 获取统计数据 |
| GET | `/api/admin/works` | 作品列表（管理） |
| POST | `/api/admin/works/batch` | 批量操作 |
| GET | `/api/admin/works/pending` | 待审核作品 |
| POST | `/api/admin/works/{id}/approve` | 批准 |
| POST | `/api/admin/works/{id}/reject` | 拒绝 |
| DELETE | `/api/admin/works/{id}` | 删除 |
| GET | `/api/admin/users` | 用户列表 |
| PUT | `/api/admin/users/{id}/role` | 修改角色 |
| GET | `/api/admin/lessons` | 课文列表 |
| DELETE | `/api/admin/lessons/{id}` | 删除课文 |

## 画风

| 画风 | 提示词前缀 |
|------|-----------|
| 写实古风 | realistic ancient Chinese style, traditional Chinese painting aesthetic... |
| 水墨风格 | Chinese ink painting style, wash painting, sumi-e... |
| 彩色插画 | colorful illustration, vibrant, modern cartoon style... |

## 任务状态

```
pending → processing → completed
                   ↘ failed
```

## 审查流程

```
用户提交公开申请 → review_status='pending'
                         ↓
              管理员审查 → 批准/拒绝
                         ↓
           approved → 展示广场可见
           rejected → 用户可见被拒绝
```
