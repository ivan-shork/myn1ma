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
    
    // 创建吃饭活动集合
    await db.createCollection('eat_activities');
    
    // 创建玩乐活动集合
    await db.createCollection('play_activities');
    
    // 创建景点活动集合
    await db.createCollection('sight_activities');
    
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