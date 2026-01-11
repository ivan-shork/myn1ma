/**
 * 使用传统微信云数据库方式
 * 无需创建数据模型，直接操作集合
 */

import dayjs from 'dayjs';

export function model() {
  return wx.cloud.database();
}

/**
 * 读取多条数据（带分页）
 */
export async function getAll({ filter, select, name, pageNumber = 1, pageSize = 100, orderBy = 'updatedAt', order = 'desc' }) {
  const db = model();
  const collection = db.collection(name);

  try {
    console.log('开始获取数据，集合:', name, '页码:', pageNumber, '每页条数:', pageSize, '排序字段:', orderBy, '排序方向:', order);

    // 计算跳过的记录数
    const skip = (pageNumber - 1) * pageSize;

    // 先获取总数
    const countResult = await collection.count();
    const total = countResult.total;

    // 构建查询
    let query = collection.orderBy(orderBy, order);

    // 获取当前页数据
    const result = await query
      .skip(skip)
      .limit(pageSize)
      .get();

    const records = result.data;

    console.log('获取记录列表成功，总数:', total, '当前页条数:', records.length);
    console.log('最终返回的记录列表:', records);

    // 返回数据和分页信息
    return {
      data: records,
      total: total,
      pageNumber: pageNumber,
      pageSize: pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  } catch (error) {
    console.error('getAll 错误:', error);
    return {
      data: [],
      total: 0,
      pageNumber: pageNumber,
      pageSize: pageSize,
      totalPages: 0
    };
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
