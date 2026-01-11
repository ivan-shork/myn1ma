# 时光记录小程序 - 开发文档

## 项目概述

这是一个基于微信小程序云开发的时光记录应用，用于记录和朋友们一起出去活动的美好时光。

### 核心功能
- 时光列表：按时间倒序展示所有活动记录
- 新建活动：所有朋友都可以创建新活动，大家都能看到
- 活动详情：查看活动详细信息，支持评论互动

---

## 项目架构

### 目录结构

```
myn1ma/
├── app.js                  # 小程序入口，云开发初始化
├── app.json                # 全局配置
├── app.wxss                # 全局样式
├── project.config.json     # 项目配置
├── package.json            # 依赖管理
│
├── cloudfunctions/         # 云函数
│   └── database/          # 数据库初始化云函数
│
├── common/                 # 公共模块
│   └── updateManager.js   # 小程序更新管理
│
├── components/            # 自定义组件
│   └── ...               # 可复用组件
│
├── config/               # 配置文件
│   ├── index.js         # 主配置（Mock开关等）
│   ├── model.js         # 数据模型标识定义
│   └── eslintCheck.js   # ESLint配置
│
├── images/               # 图片资源
│   └── icons/           # 图标资源
│
├── pages/               # 页面目录
│   ├── timeline/       # 时光列表页（已完成）
│   ├── create/         # 新建活动页（已完成）
│   └── detail/         # 活动详情页（已完成）
│
├── services/            # 数据访问层
│   ├── memory/         # 时光记录服务
│   ├── cloudbaseMock/  # Mock数据
│   └── _utils/         # 工具类
│
└── utils/              # 工具函数
    └── index.js       # 通用工具函数
```

---

## 数据库设计

### 简化后的数据结构

#### memory_records（时光记录集合）

```javascript
{
  _id: "auto_generated",        // 主键
  title: "周末去爬山",           // 活动名称
  description: "今天天气很好...", // 活动描述/备注
  date: "2024-01-22",           // 活动日期
  time: "14:30",                // 活动时间（可选）
  location: "杭州西湖",          // 地点（可选）
  images: [                     // 图片数组
    "cloud://xxx.jpg",
    "cloud://yyy.jpg"
  ],
  participants: [               // 参与人员数组
    "张三",
    "李四",
    "王五"
  ],
  creator: "张三",              // 创建人
  createdAt: "2024-01-22 10:00:00", // 创建时间
  updatedAt: "2024-01-22 10:00:00"  // 更新时间
}
```

#### comments（评论集合）

```javascript
{
  _id: "auto_generated",        // 主键
  memoryId: "record_id",        // 关联的时光记录ID
  content: "真好玩！",           // 评论内容
  author: "李四",               // 评论人
  createdAt: "2024-01-22 11:00:00", // 评论时间
  likes: 0                      // 点赞数（可选）
}
```

---

## 页面规划

### 1. 时光列表页 (pages/timeline/index)
**状态：已完成**

- 显示所有活动记录，按时间倒序排列
- 每条记录显示：缩略图、标题、日期、参与人员
- 点击跳转到详情页
- 右下角悬浮「新建」按钮跳转到新建页
- 支持下拉刷新

### 2. 新建活动页 (pages/create/index)
**状态：已完成**

**功能需求：**
- 活动名称（必填）
- 活动描述/备注（可选）
- 活动日期（必填，日期选择器）
- 活动时间（可选，时间选择器）
- 地点（可选）
- 图片上传（最多9张）
- 参与人员（可选，手动输入添加）

**组件使用：**
- TDesign：t-upload（图片上传）、t-tag（人员标签）、t-input、t-textarea、t-button

### 3. 活动详情页 (pages/detail/index)
**状态：已完成**

**功能需求：**
- 显示活动完整信息
- 图片轮播展示（支持预览）
- 时间、地点、参与人员展示
- 评论区（评论列表、发表评论）
- 支持下拉刷新

---

## 开发规范

### 命名规范
- 页面文件：小写，多个单词用连字符分隔（如 `time-line`）
- 组件文件：大驼峰（如 `NewsList`）
- 变量/函数：小驼峰（如 `getMemoryList`）
- 常量：全大写下划线分隔（如 `DATA_MODEL_KEY`）

### Git 提交规范
```
feat: 新建活动页面
fix: 修复图片上传问题
refactor: 重构数据访问层
style: 调整首页样式
docs: 更新文档
```

### 代码风格
- 使用 ES6+ 语法
- 统一使用 2 空格缩进
- 组件命名语义化
- 合理使用注释

---

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| 微信小程序原生 | - | 基础框架 |
| CloudBase | 1.2.1 | 云开发SDK |
| TDesign MiniProgram | 1.6.0 | UI组件库 |
| dayjs | 1.9.3 | 日期处理 |
| Skyline | - | 渲染模式 |

---

## 功能清单

### Phase 1: 基础功能
- [x] 新建活动页面（pages/create/index）
- [x] 活动详情页面（pages/detail/index）
- [x] 图片上传功能（云存储）
- [x] 数据库CRUD封装
- [x] 时光列表页更新

### Phase 2: 评论互动
- [x] 评论列表展示
- [x] 发表评论功能
- [x] 评论点赞功能（前端实现）

### Phase 3: 优化增强
- [ ] 用户登录/身份识别
- [ ] 图片懒加载
- [ ] 上拉加载更多
- [ ] 分享功能
- [ ] 删除活动/评论功能

---

## Mock数据开关

开发时可通过 `config/index.js` 中的 `useMock` 开关切换数据源：

```javascript
// config/index.js
export default {
  useMock: true  // true: 使用Mock数据, false: 使用真实云数据
}
```

---

## 云函数

### database（数据库初始化）
- 路径：`cloudfunctions/database/index.js`
- 功能：创建数据库集合（memory_records, comments）
- 部署命令：微信开发者工具 -> 云开发 -> 部署云函数

---

## 服务层API

### 时光记录相关 (services/memory/index.js)

| 函数 | 说明 |
|------|------|
| `getMemoryRecords()` | 获取时光记录列表（按时间倒序） |
| `getMemoryRecordDetail(id)` | 获取单个时光记录详情 |
| `addMemoryRecord(data)` | 添加新的时光记录 |
| `updateMemoryRecord(id, data)` | 更新时光记录 |
| `deleteMemoryRecord(id)` | 删除时光记录 |

### 评论相关 (services/memory/index.js)

| 函数 | 说明 |
|------|------|
| `getComments(memoryId)` | 获取某条记录的评论列表 |
| `addComment(data)` | 添加评论 |
| `likeComment(id)` | 点赞评论 |
| `deleteComment(id)` | 删除评论 |

---

## 常用命令

```bash
# 安装依赖
npm install

# 构建npm包
# 微信开发者工具 -> 工具 -> 构建npm
```

---

## 注意事项

1. **云开发环境配置**
   - 需在 `app.js` 中配置正确的环境ID
   - 首次使用需要初始化云数据库
   - 部署云函数 database 以创建数据库集合

2. **图片上传限制**
   - 单张图片大小不超过 2MB
   - 最多上传 9 张图片

3. **数据安全**
   - 云数据库需要配置合适的权限规则
   - 建议开启用户身份验证

4. **Mock数据模式**
   - 当前使用Mock数据模式（`useMock: true`）
   - 切换到真实数据需修改 `config/index.js`
   - 真实数据需要先部署云函数初始化数据库

---

## 更新日志

### 2024-01-22
- Phase 1 基础功能开发完成
- 新建活动页面完成
- 活动详情页面完成
- 时光列表页更新适配新数据结构
- 数据访问层重构完成
- 云函数更新完成
- 评论互动功能完成

### 2024-01-21
- 项目架构规划完成
- 简化数据结构，移除复杂的活动分类
- 规划后续开发路线
