/**
 * 使用传统微信云数据库方式
 * 无需创建数据模型，直接操作集合
 */

import dayjs from 'dayjs';

export function model() {
  return wx.cloud.database();
}

/**
 * 读取多条数据
 */
export async function getAll({ filter, select, name, pageNumber = 1, pageSize = 100 }) {
  const db = model();
  const collection = db.collection(name);

  try {
    console.log('开始获取数据，集合:', name);

    // 直接获取数据，不使用复杂的 filter
    const result = await collection
      .orderBy('updatedAt', 'desc')
      .limit(pageSize)
      .get();

    // 格式化时间
    const records = result.data

    console.log('最终返回的记录列表:', records);
    return records;
  } catch (error) {
    console.error('getAll 错误:', error);
    return [];
  }
}

/**
 * 读取单条数据
 */
export async function getOne({ name, _id, select }) {
  const db = model();
  const collection = db.collection(name);
  console.log('获取数据的详情id:', _id);
  console.log('集合名称:', name);

  try {
    // 使用 where 查询代替 doc，更可靠
    const result = await collection.where({
      _id: _id
    }).get();

    console.log('查询结果完整返回:', result);
    console.log('result.data:', result.data);

    const data = result.data && result.data.length > 0 ? result.data[0] : null;

    if (data) {
      // 确保必要字段存在
      if (!data.ratings) data.ratings = {};
      if (!data.participants) data.participants = [];
      if (!data.images) data.images = [];
    }

    console.log('getOne 最终结果:', data);
    return data;
  } catch (error) {
    console.error('getOne 错误:', error);
    console.error('错误详情:', JSON.stringify(error));
    return null;
  }
}

/**
 * 添加单条数据
 */
export async function add({ name, data }) {
  const db = model();
  const collection = db.collection(name);

  try {
    const result = await collection.add({
      data: data
    });
    return result;
  } catch (error) {
    console.error('add 错误:', error);
    throw error;
  }
}

/**
 * 更新单条数据
 */
export async function update({ name, _id, data }) {
  const db = model();
  const collection = db.collection(name);

  try {
    const result = await collection.doc(_id).update({
      data: data
    });
    return result;
  } catch (error) {
    console.error('update 错误:', error);
    throw error;
  }
}

/**
 * 删除单条数据
 */
export async function remove({ name, _id }) {
  const db = model();
  const collection = db.collection(name);

  try {
    const result = await collection.doc(_id).remove();
    return result;
  } catch (error) {
    console.error('remove 错误:', error);
    throw error;
  }
}
