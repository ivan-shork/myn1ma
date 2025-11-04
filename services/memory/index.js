import { model } from '../_utils/model';
import { DATA_MODEL_KEY } from '../../config/model';

// 获取时光记录列表
export async function getMemoryRecords() {
  try {
    const records = await model(DATA_MODEL_KEY.MEMORY_RECORDS).getAll();
    return records;
  } catch (error) {
    console.error('获取时光记录列表失败:', error);
    return [];
  }
}

// 获取单个时光记录详情
export async function getMemoryRecordDetail(id) {
  try {
    const record = await model(DATA_MODEL_KEY.MEMORY_RECORDS).getOne(id);
    return record;
  } catch (error) {
    console.error('获取时光记录详情失败:', error);
    return null;
  }
}

// 添加新的时光记录
export async function addMemoryRecord(data) {
  try {
    const result = await model(DATA_MODEL_KEY.MEMORY_RECORDS).add(data);
    return result;
  } catch (error) {
    console.error('添加时光记录失败:', error);
    return null;
  }
}

// 添加评论
export async function addComment(data) {
  try {
    const result = await model(DATA_MODEL_KEY.COMMENTS).add(data);
    return result;
  } catch (error) {
    console.error('添加评论失败:', error);
    return null;
  }
}

// 获取吃饭活动
export async function getEatActivities() {
  try {
    const activities = await model(DATA_MODEL_KEY.EAT_ACTIVITIES).getAll();
    return activities;
  } catch (error) {
    console.error('获取吃饭活动失败:', error);
    return [];
  }
}

// 添加吃饭活动
export async function addEatActivity(data) {
  try {
    const result = await model(DATA_MODEL_KEY.EAT_ACTIVITIES).add(data);
    return result;
  } catch (error) {
    console.error('添加吃饭活动失败:', error);
    return null;
  }
}

// 获取玩乐活动
export async function getPlayActivities() {
  try {
    const activities = await model(DATA_MODEL_KEY.PLAY_ACTIVITIES).getAll();
    return activities;
  } catch (error) {
    console.error('获取玩乐活动失败:', error);
    return [];
  }
}

// 添加玩乐活动
export async function addPlayActivity(data) {
  try {
    const result = await model(DATA_MODEL_KEY.PLAY_ACTIVITIES).add(data);
    return result;
  } catch (error) {
    console.error('添加玩乐活动失败:', error);
    return null;
  }
}

// 获取景点活动
export async function getSightActivities() {
  try {
    const activities = await model(DATA_MODEL_KEY.SIGHT_ACTIVITIES).getAll();
    return activities;
  } catch (error) {
    console.error('获取景点活动失败:', error);
    return [];
  }
}

// 添加景点活动
export async function addSightActivity(data) {
  try {
    const result = await model(DATA_MODEL_KEY.SIGHT_ACTIVITIES).add(data);
    return result;
  } catch (error) {
    console.error('添加景点活动失败:', error);
    return null;
  }
}