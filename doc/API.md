# 课文漫游 API 文档

Base URL: `http://localhost:8000`

---

## 认证

### 注册

```
POST /api/auth/register
```

**请求**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### 登录

```
POST /api/auth/login
```

**请求**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### 登出

```
POST /api/auth/logout
```

需要 Authorization header。

### 获取当前用户

```
GET /api/auth/me
```

需要 Authorization header。

**响应**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "user"
}
```

### 刷新 Token

```
POST /api/auth/refresh
```

**请求**

```json
{
  "refresh_token": "..."
}
```

---

## 课文

### 获取内置课文列表

```
GET /api/texts
```

返回内置课文列表。

**响应**

```json
[
  {
    "id": 1,
    "title": "荷塘月色",
    "author": "朱自清",
    "content": "曲曲折折的荷塘上面..."
  }
]
```

---

## 分析

### 分析课文

```
POST /api/analyze
```

调用 DeepSeek 分析课文，生成漫画场景列表。

**请求**

```json
{
  "text": "曲曲折折的荷塘上面，弥望的是田田的叶子...",
  "style": "彩色插画"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| text | string | 是 | 课文内容，最多 3000 字 |
| style | string | 否 | 画风：写实古风/水墨风格/彩色插画，默认彩色插画 |

**响应**

```json
{
  "scenes": [
    {
      "description_cn": "月光下的荷塘，荷叶田田，荷花亭亭玉立",
      "prompt_en": "moonlit lotus pond, verdant lotus leaves..."
    }
  ]
}
```

---

## 生成

### 提交生成任务

```
POST /api/generate
```

**请求**

```json
{
  "prompts": ["prompt1", "prompt2"],
  "style": "彩色插画"
}
```

**响应**

```json
{
  "task_id": "a1b2c3d4"
}
```

### 查询任务状态

```
GET /api/task/{task_id}
```

**响应**

```json
{
  "status": "processing",
  "total": 6,
  "completed": 2,
  "images": [
    { "index": 0, "url": "/static/temp/a1b2c3d4_0.png", "status": "completed" }
  ],
  "error": null
}
```

| status | 说明 |
|--------|------|
| pending | 等待开始 |
| processing | 生成中 |
| completed | 全部完成 |
| failed | 失败 |

---

## 作品

### 保存作品

```
POST /api/works
```

需要 Authorization header。

**请求**

```json
{
  "text_id": 1,
  "custom_title": "我的荷塘月色",
  "scenes": [{ "description_cn": "场景1", "prompt_en": "scene 1" }],
  "images": ["/static/temp/a1b2c3d4_0.png"],
  "style": "彩色插画",
  "is_public": false
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| text_id | integer | 否 | 课文 ID |
| custom_title | string | 否 | 自定义标题 |
| scenes | Scene[] | 是 | 场景列表 |
| images | string[] | 是 | 图片路径列表 |
| style | string | 否 | 画风 |
| is_public | boolean | 否 | 是否申请公开，默认 false |

### 获取我的作品

```
GET /api/works/my
```

需要 Authorization header。返回当前登录用户的作品。

### 获取公开作品列表

```
GET /api/works/public
```

返回已审核通过的作品（展示广场用）。

### 获取作品详情

```
GET /api/works/{work_id}
```

### 更新作品

```
PUT /api/works/{work_id}
```

### 删除作品

```
DELETE /api/works/{work_id}
```

### 导出作品

```
GET /api/works/{work_id}/export
```

---

## 课文管理

### 添加课文

```
POST /api/lessons
```

### 获取课文列表

```
GET /api/lessons
```

### 更新课文

```
PUT /api/lessons/{lesson_id}
```

### 删除课文

```
DELETE /api/lessons/{lesson_id}
```

---

## 文件

### 上传图片

```
POST /api/upload
```

---

## 管理员接口

所有管理员接口需要 Authorization header 且用户角色为 `admin`。

### 获取统计数据

```
GET /api/admin/stats
```

**响应**

```json
{
  "works": { "total": 100, "pending": 5, "approved": 80 },
  "lessons": { "total": 50 },
  "users": { "total": 20 }
}
```

### 获取作品列表（管理）

```
GET /api/admin/works
```

**查询参数**

| 参数 | 说明 |
|------|------|
| status | 筛选状态：pending/approved/rejected/all |
| search | 搜索标题 |
| page | 页码 |
| page_size | 每页数量 |

### 批量操作作品

```
POST /api/admin/works/batch
```

**请求**

```json
{
  "ids": [1, 2, 3],
  "action": "approve" | "reject" | "delete"
}
```

### 待审核作品

```
GET /api/admin/works/pending
```

### 批准作品

```
POST /api/admin/works/{id}/approve
```

### 拒绝作品

```
POST /api/admin/works/{id}/reject
```

### 删除作品

```
DELETE /api/admin/works/{id}
```

### 获取用户列表

```
GET /api/admin/users
```

### 修改用户角色

```
PUT /api/admin/users/{id}/role
```

**请求**

```json
{
  "role": "admin" | "user"
}
```

### 获取课文列表（管理）

```
GET /api/admin/lessons
```

### 删除课文

```
DELETE /api/admin/lessons/{id}
```

---

## 画风

| 画风 | 提示词前缀 |
|------|-----------|
| 写实古风 | `realistic ancient Chinese style, traditional Chinese painting aesthetic...` |
| 水墨风格 | `Chinese ink painting style, wash painting, sumi-e...` |
| 彩色插画 | `colorful illustration, vibrant, modern cartoon style...` |

---

## 错误响应

```json
{
  "detail": "错误描述"
}
```

| 状态码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未登录 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 审查流程

```
用户提交公开申请 → review_status='pending'
                         ↓
              管理员查看待审核列表
                         ↓
          批准 → review_status='approved' → 展示广场可见
          拒绝 → review_status='rejected'
```
