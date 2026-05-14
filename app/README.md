# 课文漫游 - 前端

## 技术栈

- Nuxt 4 + Vue 3
- Pinia 状态管理
- Tailwind CSS + Nuxt UI
- nuxt-icon

## 开发

```bash
pnpm install
pnpm dev
```

访问 http://localhost:3000

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
| `/admin` | 管理后台 | 管理员 |

## API 代理

- `/api` → `http://localhost:8000`
- `/static` → `http://localhost:8000`

## 路由保护

- `auth` 中间件：保护 `/workspace`、`/profile`、`/my-works`
- `admin` 中间件：保护 `/admin` 及子路由

## 用户状态

`stores/auth.ts` 管理用户认证状态：

- `isAuthenticated` - 是否登录
- `isAdmin` - 是否管理员
- `user` - 用户信息
- `login()` / `register()` / `logout()`
- `getAuthHeader()` - 获取 Authorization header
