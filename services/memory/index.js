import { model, getAll, getOne } from '../_utils/model';
import { DATA_MODEL_KEY } from '../../config/model';
import config from '../../config/index';
import * as mockData from '../mock/index';

/**
 * 获取时光记录列表（按时间倒序）
 */
export async function getMemoryRecords() {
  // Mock 模式
  if (config.useMock) {
    const records = mockData.getAllMemoryRecords();
    return records.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  try {
    const records = await getAll({ name: DATA_MODEL_KEY.MEMORY_RECORDS });
    // 按日期倒序排序
    return records.sort((a, b) => new Date(b.date) - new Date(a.date));
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
    const result = await model(DATA_MODEL_KEY.MEMORY_RECORDS).add(data);
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
    const result = await model(DATA_MODEL_KEY.MEMORY_RECORDS).update(id, data);
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
    const result = await model(DATA_MODEL_KEY.MEMORY_RECORDS).delete(id);
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
    const comments = await getAll({
      name: DATA_MODEL_KEY.COMMENTS,
      filter: {
        where: {
          $and: [
            { memoryId: { $eq: memoryId } }
          ]
        }
      }
    });
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
    const result = await model(DATA_MODEL_KEY.COMMENTS).add(data);
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
    const result = await model(DATA_MODEL_KEY.COMMENTS).update(id, {
      $inc: { likes: 1 }
    });
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
    const result = await model(DATA_MODEL_KEY.COMMENTS).delete(id);
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
    const result = await model(DATA_MODEL_KEY.MEMORY_RECORDS).update(id, {
      ratings: ratings,
      updatedAt: new Date().toISOString()
    });
    return result;
  } catch (error) {
    console.error('更新评分失败:', error);
    return null;
  }
}
