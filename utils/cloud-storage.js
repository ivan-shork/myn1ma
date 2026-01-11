/**
 * 小程序云存储工具函数
 */

/**
 * 上传图片到云存储
 * @param {string} filePath - 本地文件路径
 * @param {string} cloudPath - 云存储路径（可选，不传则自动生成）
 * @returns {Promise<string>} 返回云存储文件的 https URL
 */
export async function uploadImageToCloud(filePath, cloudPath) {
  return new Promise((resolve, reject) => {
    // 如果没有指定云路径，自动生成
    if (!cloudPath) {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      cloudPath = `memory-images/${timestamp}_${random}.jpg`;
    }

    console.log('开始上传到云存储:', { filePath, cloudPath });

    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: filePath,
      success: (res) => {
        console.log('云存储上传成功:', res);
        if (res.statusCode === 204) {
          // res.fileID 是云存储的文件 ID，格式: cloud://xxx
          // 需要转换为 https URL
          resolve(res.fileID);
        } else {
          reject(new Error(`上传失败，状态码: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        console.error('云存储上传失败:', err);
        reject(err);
      }
    });
  });
}

/**
 * 批量上传图片到云存储
 * @param {Array<string>} filePaths - 本地文件路径数组
 * @returns {Promise<Array<string>>} 返回云存储文件 URL 数组
 */
export async function uploadImagesToCloud(filePaths) {
  const uploadPromises = filePaths.map((filePath, index) => {
    // 为每个文件生成唯一的云路径
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const cloudPath = `memory-images/${timestamp}_${index}_${random}.jpg`;
    return uploadImageToCloud(filePath, cloudPath);
  });

  try {
    const urls = await Promise.all(uploadPromises);
    console.log('批量上传完成:', urls);
    return urls;
  } catch (error) {
    console.error('批量上传失败:', error);
    throw error;
  }
}

/**
 * 从云存储删除文件
 * @param {Array<string>} fileIDs - 云存储文件 ID 数组
 * @returns {Promise<void>}
 */
export async function deleteFilesFromCloud(fileIDs) {
  if (!fileIDs || fileIDs.length === 0) {
    return;
  }

  return new Promise((resolve, reject) => {
    wx.cloud.deleteFile({
      fileList: fileIDs,
      success: (res) => {
        console.log('云存储删除成功:', res);
        resolve();
      },
      fail: (err) => {
        console.error('云存储删除失败:', err);
        reject(err);
      }
    });
  });
}

/**
 * 获取云存储文件的临时链接
 * @param {Array<string>} fileIDs - 云存储文件 ID 数组
 * @returns {Promise<Array<string>>} 返回临时链接数组
 */
export async function getTempFileURLs(fileIDs) {
  if (!fileIDs || fileIDs.length === 0) {
    return [];
  }

  return new Promise((resolve, reject) => {
    wx.cloud.getTempFileURL({
      fileList: fileIDs.map(fileID => ({ fileID })),
      success: (res) => {
        const urls = res.fileList.map(item => item.tempFileURL);
        console.log('获取临时链接成功:', urls);
        resolve(urls);
      },
      fail: (err) => {
        console.error('获取临时链接失败:', err);
        reject(err);
      }
    });
  });
}
