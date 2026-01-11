# Mock 数据目录

## 说明

此目录用于存储本地测试的 Mock 数据。

## 文件说明

- `index.js` - Mock 数据管理模块
- `memory-records.js` - 时光记录数据
- `comments.js` - 评论数据

## 使用方式

### 运行时操作
- 新建活动、发表评论等操作会修改内存中的数据
- 小程序重启后，数据会重置为 JS 文件中的内容

### 修改初始数据
直接编辑以下 JS 文件：
- `memory-records.js` - 时光记录初始数据
- `comments.js` - 评论初始数据

## 数据格式示例

**时光记录 (memory-records.js):**
```javascript
export default [
  {
    "_id": "1",
    "title": "活动标题",
    "description": "描述",
    "date": "2024-01-20",
    "time": "09:30",
    "location": "地点",
    "images": ["/images/xxx.jpg"],
    "participants": ["张三", "李四"],
    "creator": "我",
    "createdAt": "2024-01-20 10:00:00",
    "updatedAt": "2024-01-20 10:00:00"
  }
];
```

**评论 (comments.js):**
```javascript
export default [
  {
    "_id": "c1",
    "memoryId": "1",
    "content": "评论内容",
    "author": "作者",
    "likes": 0,
    "createdAt": "2024-01-20 12:00:00",
    "time": "2024-01-20 12:00:00"
  }
];
```

## 注意事项

⚠️ JS 数据文件已加入 `.gitignore`，不会被提交到 Git
- 可以随意修改 JS 文件进行本地测试
- 不会影响 Git 仓库
- 建议保留一份默认数据作为模板
