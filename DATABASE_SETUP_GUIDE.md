# 数据库设置指南 - 修复登录和注册问题

## 问题诊断

您的登录和注册功能无法正常工作的主要原因是：**Supabase 数据库中缺少必要的数据表**。

当前应用尝试访问 `users` 表来存储用户资料，但该表尚未在数据库中创建。

## 解决方案

### 步骤 1: 访问 Supabase 控制台

1. 打开浏览器，访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 登录您的账户
3. 选择您的项目：`anwwblcjzmykznimqmxu`

### 步骤 2: 运行数据库设置脚本

**如果您遇到 "policy already exists" 错误，请使用安全版本脚本：**

1. 在 Supabase 控制台中，点击左侧菜单的 **"SQL Editor"**
2. 点击 **"New Query"** 创建新查询
3. 复制 `setup-database-safe.sql` 文件中的所有内容（推荐使用此版本）
4. 粘贴到 SQL 编辑器中
5. 点击 **"Run"** 按钮执行脚本

**注意**: `setup-database-safe.sql` 会先删除现有的策略和触发器，然后重新创建，避免重复创建错误。

### 步骤 3: 验证数据库设置

执行脚本后，您应该看到以下表格被创建：

- ✅ `users` - 用户信息表
- ✅ `sign_ins` - 签到记录表
- ✅ `daily_fortunes` - 每日运势表
- ✅ `wishes` - 许愿墙表
- ✅ `wish_likes` - 点赞记录表
- ✅ `divination_history` - 占卜历史表

### 步骤 4: 测试认证功能

1. 返回您的应用 (http://localhost:5175/)
2. 点击 "立即开始占卜之旅" 按钮
3. 尝试注册新用户：
   - 输入邮箱地址
   - 输入用户名
   - 输入密码（至少6位）
   - 点击 "注册"

4. 如果注册成功，您会看到 "注册成功！请检查邮箱验证链接" 的消息
5. 检查您的邮箱，点击验证链接
6. 返回应用，使用相同的邮箱和密码登录

## 故障排除

### 如果仍然无法注册/登录：

1. **检查邮箱验证设置**：
   - 在 Supabase 控制台，进入 Authentication > Settings
   - 确保 "Enable email confirmations" 已启用
   - 检查邮件模板设置

2. **检查 RLS (Row Level Security) 策略**：
   - 在 Supabase 控制台，进入 Database > Tables
   - 确保所有表都启用了 RLS
   - 检查策略是否正确应用

3. **查看浏览器控制台错误**：
   - 按 F12 打开开发者工具
   - 查看 Console 标签页中的错误信息
   - 查看 Network 标签页中的网络请求状态

4. **使用测试页面**：
   - 打开 `src/test-auth.html` 文件
   - 在浏览器中直接打开该文件
   - 测试基本的 Supabase 连接和认证功能

### 常见错误及解决方案：

**错误**: "relation 'public.users' does not exist"
**解决**: 确保已正确运行 `setup-database.sql` 脚本

**错误**: "Invalid login credentials"
**解决**: 确保邮箱已验证，或检查密码是否正确

**错误**: "Username already exists"
**解决**: 尝试使用不同的用户名

**错误**: "Email not confirmed"
**解决**: 检查邮箱中的验证链接并点击确认

## 数据库架构说明

### 用户认证流程：

1. 用户在前端填写注册表单
2. 应用调用 Supabase Auth API 创建认证用户
3. 触发器自动在 `users` 表中创建用户资料
4. 用户收到邮箱验证链接
5. 验证后即可正常登录使用

### 安全特性：

- ✅ Row Level Security (RLS) 已启用
- ✅ 用户只能访问自己的数据
- ✅ 密码由 Supabase Auth 安全处理
- ✅ 邮箱验证确保账户安全

## 联系支持

如果按照以上步骤操作后仍有问题，请提供以下信息：

1. 浏览器控制台的错误信息截图
2. Supabase 数据库中的表格列表截图
3. 具体的错误步骤描述

---

**注意**: 确保您的 `.env` 文件中的 Supabase 配置信息正确无误：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

这些信息可以在 Supabase 项目的 Settings > API 页面找到。