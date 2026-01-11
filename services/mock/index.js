/**
 * Mock 数据管理模块
 *
 * 说明：
 * - Mock 数据从 JS 文件加载
 * - 支持运行时增删改查操作
 * - 数据仅在内存中，小程序重启后重置
 */

// 使用 import 加载 JS 数据文件
import initialMemoryRecords from './memory-records.js';
import initialComments from './comments.js';

// 内存中的 Mock 数据存储
let memoryRecords = [...initialMemoryRecords];
let comments = [...initialComments];

/**
 * 获取所有时光记录
 */
export function getAllMemoryRecords() {
  return memoryRecords;
}

/**
 * 根据 ID 获取单条时光记录
 */
export function getMemoryRecordById(id) {
  return memoryRecords.find(r => r._id === id) || null;
}

/**
 * 添加时光记录
 */
export function addMemoryRecord(record) {
  console.log('Mock: 添加时光记录，传入数据:', record);
  const newRecord = {
    ...record,
    _id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  memoryRecords.unshift(newRecord);
  console.log('Mock: 添加后的记录列表:', memoryRecords);
  return newRecord;
}

/**
 * 更新时光记录
 */
export function updateMemoryRecord(id, data) {
  const index = memoryRecords.findIndex(r => r._id === id);
  if (index !== -1) {
    memoryRecords[index] = {
      ...memoryRecords[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return memoryRecords[index];
  }
  return null;
}

/**
 * 删除时光记录
 */
export function deleteMemoryRecord(id) {
  const index = memoryRecords.findIndex(r => r._id === id);
  if (index !== -1) {
    memoryRecords.splice(index, 1);
    return true;
  }
  return false;
}

// ==================== 评论相关 ====================

/**
 * 获取所有评论
 */
export function getAllComments() {
  return comments;
}

/**
 * 根据时光记录ID获取评论列表
 */
export function getCommentsByMemoryId(memoryId) {
  return comments.filter(c => c.memoryId === memoryId);
}

/**
 * 添加评论
 */
export function addComment(commentData) {
  const newComment = {
    ...commentData,
    _id: 'c' + Date.now(),
    likes: 0,
    createdAt: new Date().toISOString(),
    time: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  comments.push(newComment);
  return newComment;
}

/**
 * 点赞评论
 */
export function likeComment(id) {
  const comment = comments.find(c => c._id === id);
  if (comment) {
    comment.likes = (comment.likes || 0) + 1;
    return comment;
  }
  return null;
}

/**
 * 删除评论
 */
export function deleteComment(id) {
  const index = comments.findIndex(c => c._id === id);
  if (index !== -1) {
    comments.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * 重置所有 Mock 数据到初始状态
 */
export function resetMockData() {
  memoryRecords = [...initialMemoryRecords];
  comments = [...initialComments];
}

// ==================== 评分相关 ====================

/**
 * 更新评分
 * @param {string} id - 记录ID
 * @param {object} ratings - 评分数据 { "鱼": 5, "阿包": 4 }
 */
export function updateRating(id, ratings) {
  console.log('Mock: 更新评分，记录ID:', id, '评分数据:', ratings);
  const index = memoryRecords.findIndex(r => r._id === id);
  if (index !== -1) {
    memoryRecords[index] = {
      ...memoryRecords[index],
      ratings: ratings,
      updatedAt: new Date().toISOString()
    };
    console.log('Mock: 评分更新成功:', memoryRecords[index]);
    return memoryRecords[index];
  }
  console.log('Mock: 未找到记录，ID:', id);
  return null;
}
