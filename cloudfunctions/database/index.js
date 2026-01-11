const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  try {
    // 创建时光记录集合
    await db.createCollection('memory_records');

    // 创建评论集合
    await db.createCollection('comments');

    return {
      success: true,
      message: '数据库集合创建成功'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
