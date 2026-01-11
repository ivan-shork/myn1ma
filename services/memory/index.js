import { model, getAll, getOne, add, update, remove } from '../_utils/model';
import { DATA_MODEL_KEY } from '../../config/model';
import config from '../../config/index';
import * as mockData from '../mock/index';

/**
 * 获取时光记录列表
 * @param {number} pageNumber - 页码
 * @param {number} pageSize - 每页条数
 * @param {string} sortBy - 排序方式: 'happenTime' | 'createTime'
 */
export async function getMemoryRecords(pageNumber = 1, pageSize = 20, sortBy = 'happenTime') {
  // Mock 模式
  if (config.useMock) {
    const records = mockData.getAllMemoryRecords();
    console.log(records, 'ress....');
    if (sortBy === 'happenTime') {
      return records.sort((a, b) => (b.happenTimestamp || 0) - (a.happenTimestamp || 0));
    } else {
      return records.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    }
  }

  try {
    // 根据排序方式确定排序字段
    const orderBy = sortBy === 'happenTime' ? 'happenTimestamp' : 'updatedAt';

    const result = await getAll({
      name: DATA_MODEL_KEY.MEMORY_RECORDS,
      pageNumber,
      pageSize,
      orderBy: orderBy,
      order: 'desc'
    });

    // 兼容处理：如果是对象结构（云数据库），返回 data；如果是数组（旧逻辑），直接返回
    const records = result.data || result;
    return records;
  } catch (error) {
    console.error('获取时光记录列表失败:', error);
    return [];
  }
}

/**
 * 获取单个时光记录详情
 * @param {string} id - 记录ID
 */
export async function getMemoryRecordDetail(id) {
    console.log(id, 'id....');
  // Mock 模式
  if (config.useMock) {
    return mockData.getMemoryRecordById(id);
  }

  try {
    const record = await getOne({ name: DATA_MODEL_KEY.MEMORY_RECORDS, _id: id });
    return record;
  } catch (error) {
    console.error('获取时光记录详情失败:', error);
    return null;
  }
}

/**
 * 添加新的时光记录
 * @param {object} data - 记录数据
 */
export async function addMemoryRecord(data) {
  // Mock 模式
  if (config.useMock) {
      console.log('add', data);
    return mockData.addMemoryRecord(data);
  }

  try {
    const result = await add({ name: DATA_MODEL_KEY.MEMORY_RECORDS, data });
    return result;
  } catch (error) {
    console.error('添加时光记录失败:', error);
    return null;
  }
}

/**
 * 更新时光记录
 * @param {string} id - 记录ID
 * @param {object} data - 更新数据
 */
export async function updateMemoryRecord(id, data) {
  // Mock 模式
  if (config.useMock) {
    return mockData.updateMemoryRecord(id, data);
  }

  try {
    const result = await update({ name: DATA_MODEL_KEY.MEMORY_RECORDS, _id: id, data });
    return result;
  } catch (error) {
    console.error('更新时光记录失败:', error);
    return null;
  }
}

/**
 * 删除时光记录
 * @param {string} id - 记录ID
 */
export async function deleteMemoryRecord(id) {
  // Mock 模式
  if (config.useMock) {
    return mockData.deleteMemoryRecord(id);
  }

  try {
    const result = await remove({ name: DATA_MODEL_KEY.MEMORY_RECORDS, _id: id });
    return result;
  } catch (error) {
    console.error('删除时光记录失败:', error);
    return null;
  }
}

// ==================== 评论相关 ====================

/**
 * 获取某条记录的评论列表
 * @param {string} memoryId - 时光记录ID
 */
export async function getComments(memoryId) {
  // Mock 模式
  if (config.useMock) {
    return mockData.getCommentsByMemoryId(memoryId);
  }

  try {
    const result = await getAll({
      name: DATA_MODEL_KEY.COMMENTS,
      filter: {
        where: {
          $and: [
            { memoryId: { $eq: memoryId } }
          ]
        }
      }
    });
    // 兼容处理：如果是对象结构（云数据库），返回 data
    const comments = result.data || result;
    // 按时间正序排序
    return comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } catch (error) {
    console.error('获取评论列表失败:', error);
    return [];
  }
}

/**
 * 添加评论
 * @param {object} data - 评论数据 { memoryId, content, author }
 */
export async function addComment(data) {
  // Mock 模式
  if (config.useMock) {
    return mockData.addComment(data);
  }

  try {
    const result = await add({ name: DATA_MODEL_KEY.COMMENTS, data });
    return result;
  } catch (error) {
    console.error('添加评论失败:', error);
    return null;
  }
}

/**
 * 点赞评论
 * @param {string} id - 评论ID
 */
export async function likeComment(id) {
  // Mock 模式
  if (config.useMock) {
    return mockData.likeComment(id);
  }

  try {
    const result = await update({ name: DATA_MODEL_KEY.COMMENTS, _id: id, data: { likes: (await getOne({ name: DATA_MODEL_KEY.COMMENTS, _id: id }))?.likes || 0 + 1 }});
    return result;
  } catch (error) {
    console.error('点赞评论失败:', error);
    return null;
  }
}

/**
 * 删除评论
 * @param {string} id - 评论ID
 */
export async function deleteComment(id) {
  // Mock 模式
  if (config.useMock) {
    return mockData.deleteComment(id);
  }

  try {
    const result = await remove({ name: DATA_MODEL_KEY.COMMENTS, _id: id });
    return result;
  } catch (error) {
    console.error('删除评论失败:', error);
    return null;
  }
}

// ==================== 评分相关 ====================

/**
 * 更新评分
 * @param {string} id - 记录ID
 * @param {object} ratings - 评分数据 { "鱼": 5, "阿包": 4 }
 */
export async function updateRating(id, ratings) {
  // Mock 模式
  if (config.useMock) {
    return mockData.updateRating(id, ratings);
  }

  try {
    const result = await update({
      name: DATA_MODEL_KEY.MEMORY_RECORDS,
      _id: id,
      data: {
        ratings: ratings,
        updatedAt: Date.now()
      }
    });
    return result;
  } catch (error) {
    console.error('更新评分失败:', error);
    return null;
  }
}
