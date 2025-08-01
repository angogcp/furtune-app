# 用户认证系统设置指南

## 功能概述

本项目已集成完整的用户认证系统，包括以下功能：

### 🔐 用户认证
- 用户注册/登录
- 邮箱验证
- 密码安全管理
- 用户资料管理

### 📅 每日签到
- 每日签到获取运势
- 连续签到奖励
- 签到统计和成就系统
- 个性化每日运势生成

### 💫 许愿墙
- 匿名/实名许愿
- 社区互动（点赞）
- 愿望展示墙
- 实时更新

### 👤 用户中心
- 个人资料管理
- 签到统计
- 成就徽章系统
- 占卜历史记录

## 技术栈

- **前端**: React 19 + TypeScript + Tailwind CSS
- **路由**: React Router DOM
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **状态管理**: React Context API
- **日期处理**: date-fns
- **图标**: Lucide React

## 设置步骤

### 1. 创建Supabase项目

1. 访问 [Supabase](https://supabase.com)
2. 创建新项目
3. 获取项目URL和匿名密钥

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并填入你的Supabase配置：

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 初始化数据库

在Supabase控制台的SQL编辑器中执行 `database/init.sql` 文件中的SQL语句。

这将创建以下表：
- `users` - 用户信息
- `sign_ins` - 签到记录
- `daily_fortunes` - 每日运势
- `wishes` - 许愿记录
- `wish_likes` - 点赞记录
- `divination_history` - 占卜历史

### 4. 配置Supabase认证

在Supabase控制台中：
1. 进入 Authentication > Settings
2. 配置邮箱模板（可选）
3. 设置重定向URL（开发环境：`http://localhost:5173`）

### 5. 启动应用

```bash
npm install
npm run dev
```

## 文件结构

```
src/
├── components/
│   ├── Auth/
│   │   ├── LoginForm.tsx          # 登录表单
│   │   └── RegisterForm.tsx       # 注册表单
│   ├── DailyCheckin/
│   │   └── DailyCheckin.tsx       # 每日签到组件
│   ├── WishWall/
│   │   └── WishWall.tsx           # 许愿墙组件
│   └── Profile/
│       └── UserProfile.tsx        # 用户资料组件
├── contexts/
│   └── AuthContext.tsx            # 认证上下文
├── lib/
│   └── supabase.ts                # Supabase配置
├── App.tsx                        # 原占卜应用
├── AppWithAuth.tsx                # 带认证的主应用
└── main.tsx                       # 应用入口
```

## 使用说明

### 游客模式
- 访问首页查看功能介绍
- 点击"立即开始占卜之旅"进行注册/登录

### 注册用户
1. **占卜功能**: 使用原有的所有占卜功能
2. **每日签到**: 每天签到获取专属运势，连续签到获得奖励
3. **许愿墙**: 发布愿望，与其他用户互动
4. **个人中心**: 查看统计数据和成就

### 导航菜单
- **占卜**: 主要的占卜功能
- **签到**: 每日签到和运势
- **许愿墙**: 社区许愿功能
- **个人**: 用户资料和统计

## 数据库安全

项目使用Supabase的行级安全策略（RLS）：
- 用户只能访问自己的数据
- 许愿墙对所有人可见
- 认证用户才能发布内容

## 自定义配置

### 修改运势内容
在 `DailyCheckin.tsx` 的 `generateDailyFortune` 函数中修改运势文案。

### 调整成就系统
在 `UserProfile.tsx` 中修改成就徽章的获取条件。

### 自定义许愿墙样式
在 `WishWall.tsx` 的 `getWishColors` 函数中修改颜色主题。

## 故障排除

### 常见问题

1. **无法连接数据库**
   - 检查环境变量配置
   - 确认Supabase项目状态

2. **认证失败**
   - 检查邮箱格式
   - 确认密码长度（至少6位）

3. **签到失败**
   - 检查用户是否已登录
   - 确认今日是否已签到

4. **许愿发布失败**
   - 检查内容长度（最多200字符）
   - 确认用户认证状态

### 开发调试

在浏览器控制台查看详细错误信息，所有数据库操作都有错误日志输出。

## 部署注意事项

1. 更新生产环境的重定向URL
2. 配置邮箱服务（用于用户验证）
3. 设置适当的数据库备份策略
4. 监控API使用量和性能

## 扩展功能建议

- 添加社交登录（Google、微信等）
- 实现推送通知
- 添加用户等级系统
- 实现占卜结果分享功能
- 添加用户间私信功能
- 实现付费高级功能

---

如有问题，请查看Supabase官方文档或提交Issue。