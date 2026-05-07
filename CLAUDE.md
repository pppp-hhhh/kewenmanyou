# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**课文漫游** transforms Chinese textbook articles into illustrated manga/comics using AI. Users select a textbook, AI analyzes it into scenes, and ComfyUI generates corresponding images.

## Architecture

```
┌─────────────────────────────────────────────┐
│               前端 (Nuxt 4)                 │
│  ┌─────────────┐  ┌─────────────────────┐  │
│  │  工作台      │  │    展示广场          │  │
│  │  (CSR)      │  │    (SSR/SSG)         │  │
│  └─────────────┘  └─────────────────────┘  │
└────────────────────┬────────────────────────┘
                     │ HTTP API (代理 /api)
                     ▼
┌─────────────────────────────────────────────┐
│           后端 API (FastAPI)                 │
│  server/ — FastAPI + Uvicorn               │
└─────────────────────────────────────────────┘
```

## Team Branches

| Branch | Owner | Purpose |
|--------|-------|---------|
| `dev-backend` | lzl | FastAPI backend (server/) |
| `dev-frontend-ph` | ph | Workspace page |
| `dev-frontend-zgl` | zgl | Gallery + watch pages |

## Project Structure

```
kemenmanyou/
├── app/                          # Nuxt 4 frontend
│   ├── app.vue                   # 根组件
│   ├── layouts/default.vue       # 默认布局
│   ├── pages/
│   │   ├── index.vue             # 重定向 / → /gallery
│   │   ├── gallery.vue           # 展示广场
│   │   ├── watch/[id].vue        # 观看页
│   │   └── workspace.vue         # 工作台
│   ├── components/
│   ├── stores/workspace.ts       # Pinia store
│   ├── composables/
│   │   ├── api.ts                # useApiFetch 封装
│   │   ├── useAnalyze.ts
│   │   ├── useGenerate.ts
│   │   └── useWorks.ts
│   └── assets/css/tailwind.css
├── server/                       # FastAPI backend
│   └── (main.py, models, etc.)
└── public/                       # 静态资源
```

## Backend (lzl)

- **URL**: `http://localhost:8000`
- **Swagger**: `http://localhost:8000/docs`
- **Start**: `uvicorn server.main:app --reload --host 0.0.0.0 --port 8000`
- **Database**: SQLite at `./app.db` (MVP)

### Key API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/texts` | List built-in textbooks |
| POST | `/api/analyze` | Analyze text with DeepSeek → scene list |
| POST | `/api/generate` | Submit batch image generation task |
| GET | `/api/task/{task_id}` | Poll task status |
| POST | `/api/works` | Save generated work |
| GET | `/api/works/public` | List public works (gallery) |
| GET | `/api/works/{work_id}` | Get work details |

### Environment Variables (.env)

```
DEEPSEEK_API_KEY=your_key
DEEPSEEK_BASE_URL=https://api.deepseek.com
COMFYUI_API_URL=http://localhost:8188/api/generate
MAX_CONCURRENT_GENERATIONS=2
TEMP_IMAGE_DIR=./static/temp
WORKS_IMAGE_DIR=./static/works
DATABASE_URL=sqlite:///./app.db
```

### Backend Tech Stack

- **Framework**: Python 3.10, FastAPI + Uvicorn
- **AI**: DeepSeek via OpenAI-compatible API (课文分析)
- **Image Gen**: ComfyUI + SD1.5古风模型 + LCM LoRA (~8-10s per image)
- **Task queue**: In-memory dict + `BackgroundTasks` (no Celery)
- **Concurrency**: `asyncio.Semaphore` (max 2 concurrent generations)
- **Image resolution**: 512×512 or 512×384
- **LCM LoRA**: Reduces sampling steps from 20-30 to 4-6 (3-5x speedup)

## Frontend (Nuxt 4)

- **Framework**: Nuxt 4 + Vue 3 + Pinia + Tailwind CSS + Nuxt UI + nuxt-icon
- **Rendering**: Workspace (CSR), Gallery (SSR/SSG)
- **Proxy**: Nuxt Nitro proxies `/api` → `http://localhost:8000`
- **State**: Pinia stores (`stores/workspace.ts`)

### Routes

| Route | Owner | Rendering | Description |
|-------|-------|-----------|-------------|
| `/workspace` | ph | CSR | Main workspace (text input, AI analysis, scene editing, generation) |
| `/gallery` | zgl | SSR/SSG | Public works gallery with filtering |
| `/watch/{id}` | zgl | SSR | Comic reader with image grid |

### Composables

- `useApiFetch` — base fetch wrapper with error handling
- `useAnalyze` —课文 analysis logic
- `useGenerate` — task submission + polling
- `useWorks` — work save/load

### Art Style Prompt Prefixes

| Style | Prefix |
|-------|--------|
| 写实古风 | `realistic ancient Chinese style, traditional Chinese painting aesthetic, detailed, historical accuracy,` |
| 水墨风格 | `Chinese ink painting style, wash painting, sumi-e, black and white, traditional brush strokes,` |
| 彩色插画 | `colorful illustration, vibrant, modern cartoon style, anime, bright colors,` |

## Interaction Flow

```
Select text → Choose style → "AI分析课文" → Edit scenes → "开始生成"
    ↓                                                      ↓
POST /api/analyze                                   POST /api/generate
    ↓                                                      ↓
Scenes list ←────────                          → Poll GET /api/task/{id}
                                                            ↓
                                                      Images appear incrementally
                                                            ↓
                                                      "保存作品" → POST /api/works
```

## Image Storage

- **Temp**: `./static/temp/{task_id}_{index}.png` — cleared 1hr after task completion
- **Works**: `./static/works/{work_id}/` — permanent after save
- **Thumbnails**: Auto-generated 200x150 from first image on save

## Key Constraints

- **Phase 1**: No user authentication (user_id=0 for anonymous saves)
- **Text limit**: ≤3000 characters per analysis
- **Scene limit**: Max 30 scenes per work
- **Concurrency**: Max 2 simultaneous image generations (Semaphore)
- **DeepSeek cache**: Same text hash cached for 1 day
- **Temp cleanup**: Images in `./static/temp/` cleared 1hr after task completion

## In-Memory Task Storage

```python
tasks = {
    "task_id": {
        "status": "pending | processing | completed | failed",
        "total": 12,
        "completed": 5,
        "images": [{"index": 0, "url": "/static/temp/..._0.png"}],
        "error": None
    }
}
```

## Phase 1 Acceptance Criteria

| # | Criteria | Target |
|---|----------|--------|
| 1 | 课文分析 ≤3000字 | ≤10s return, 6-30 scenes |
| 2 | 场景编辑 |增删、移动、修改中文描述 |
| 3 | 生成速度 | ≤12s per image, concurrent 2张 |
| 4 | 边生成边看 | 右侧网格增量显示，无需等待全部 |
| 5 | 保存下载 | ZIP含所有图片+JSON元数据 |
| 6 | 展示广场 | 浏览公开作品，进入观看页 |
| 7 | 稳定性 | 连续3次（每次≥10格）无报错 |
