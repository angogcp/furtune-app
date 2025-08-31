# 设计系统 - 卡片和按钮样式指南

## 卡片组件样式规范

### 基础卡片样式
- **默认卡片**: `bg-white rounded-xl shadow-soft border border-neutral-200`
- **玻璃卡片**: `bg-white/80 backdrop-blur-md rounded-xl border border-white/20 shadow-soft`
- **深色卡片**: `bg-gradient-to-r from-purple-900/40 to-indigo-900/40 backdrop-blur-sm rounded-xl border border-purple-400/20`
- **悬浮效果**: `hover:shadow-medium transition-all duration-300`

### 卡片内边距规范
- **小**: `p-4`
- **中**: `p-6`
- **大**: `p-8`

### 卡片圆角规范
- **标准**: `rounded-xl` (12px)
- **大圆角**: `rounded-2xl` (16px)
- **小圆角**: `rounded-lg` (8px)

## 按钮组件样式规范

### 主要按钮样式
- **主按钮**: `bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700`
- **次要按钮**: `bg-purple-600 hover:bg-purple-700`
- **成功按钮**: `bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700`
- **警告按钮**: `bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700`
- **危险按钮**: `bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700`

### 按钮尺寸规范
- **小**: `px-3 py-1.5 text-sm rounded-lg`
- **中**: `px-4 py-2 text-base rounded-xl`
- **大**: `px-6 py-3 text-lg rounded-2xl`
- **超大**: `px-8 py-4 text-xl rounded-3xl`

### 按钮状态样式
- **基础**: `font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2`
- **禁用**: `disabled:opacity-50 disabled:cursor-not-allowed`
- **加载**: `cursor-wait`
- **悬浮效果**: `transform hover:scale-[1.02] shadow-soft hover:shadow-medium`

## 输入框样式规范

### 基础输入框
- **默认**: `bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50`
- **聚焦**: `focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent`
- **过渡**: `transition-all duration-300`

### 深色主题输入框
- **默认**: `bg-purple-900/30 border border-purple-400/30 rounded-xl text-white placeholder-purple-400`
- **聚焦**: `focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20`

## 标签和徽章样式规范

### 基础标签
- **主要**: `bg-purple-600/30 text-purple-300 px-2 py-1 rounded-full text-xs`
- **次要**: `bg-indigo-600/30 text-indigo-300 px-2 py-1 rounded-full text-xs`
- **成功**: `bg-green-600/30 text-green-300 px-2 py-1 rounded-full text-xs`
- **警告**: `bg-yellow-600/30 text-yellow-300 px-2 py-1 rounded-full text-xs`

### 状态指示器
- **在线**: `bg-green-400 w-2 h-2 rounded-full animate-pulse`
- **离线**: `bg-gray-400 w-2 h-2 rounded-full`
- **忙碌**: `bg-orange-400 w-2 h-2 rounded-full`

## 阴影系统

### 阴影层级
- **软阴影**: `shadow-soft` (轻微阴影)
- **中等阴影**: `shadow-medium` (标准阴影)
- **强阴影**: `shadow-strong` (明显阴影)
- **发光效果**: `shadow-glow` (发光阴影)

## 动画和过渡

### 标准过渡
- **快速**: `transition-all duration-200`
- **标准**: `transition-all duration-300`
- **慢速**: `transition-all duration-500`

### 变换效果
- **缩放**: `transform hover:scale-[1.02]`
- **上升**: `transform hover:-translate-y-1`
- **旋转**: `transform hover:rotate-1`

## 使用建议

1. **保持一致性**: 在整个应用中使用相同的样式模式
2. **响应式设计**: 使用 `sm:`, `md:`, `lg:` 前缀适配不同屏幕尺寸
3. **可访问性**: 确保足够的对比度和焦点状态
4. **性能优化**: 避免过度使用复杂的阴影和动画效果
5. **语义化**: 根据功能选择合适的颜色和样式变体