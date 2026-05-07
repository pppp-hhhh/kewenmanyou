# 课文漫游 - 工作台

AI 语文课文 → 漫画生成前端工作台。

## 技术栈

- **框架**: Nuxt 4 (Vue 3)
- **状态管理**: Pinia
- **样式**: Tailwind CSS
- **HTTP**: `$fetch` (ofetch)

## 项目结构

```
frontend-workspace/
├── app/
│   ├── app.vue                    # 根组件
│   ├── assets/css/main.css         # 全局样式
│   ├── composables/
│   │   └── useTaskPoll.ts        # 轮询任务状态
│   ├── pages/
│   │   ├── index.vue             # 首页（跳转）
│   │   └── workspace.vue         # 工作台页面
│   ├── stores/
│   │   └── workspace.ts          # Pinia 状态管理
│   └── types/
│       └── api.ts                 # API 类型定义
├── doc/
│   └── API.md                     # 接口文档
├── nuxt.config.ts                  # Nuxt 配置
├── tailwind.config.js              # Tailwind 配置
└── package.json
```

## 开发

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000/workspace

### 构建生产版本

```bash
pnpm build
```

## 功能流程

1. **选择课文** - 从内置课文库选择或自定义输入
2. **选择画风** - 写实古风 / 水墨风格 / 彩色插画
3. **AI 分析** - 调用后端分析课文，生成场景列表
4. **编辑场景** - 可修改、增删、调整场景顺序
5. **生成图片** - 调用后端生成漫画图片
6. **预览效果** - 竖向滚动浏览生成的漫画
7. **保存作品** - 提交到后端保存

## API 代理

开发环境下，Nuxt 会代理以下路径到后端：

- `/api` → `http://localhost:8000`
- `/static` → `http://localhost:8000`

确保后端服务运行在 `http://localhost:8000`。

## 画风提示词

前端会自动为每个 prompt 加上画风前缀：

| 画风 | 提示词前缀 |
|------|-----------|
| 写实古风 | realistic ancient Chinese style, traditional Chinese painting... |
| 水墨风格 | Chinese ink painting style, wash painting, sumi-e... |
| 彩色插画 | colorful illustration, vibrant, modern cartoon style... |
