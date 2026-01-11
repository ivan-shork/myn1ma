/**
 * 用户授权和信息管理
 */

let userInfo = null;
let openid = null;
let userProfile = null;

/**
 * 初始化用户身份（静默登录）
 * 在小程序启动时自动调用
 */
export function initUserIdentity() {
  return new Promise((resolve) => {
    // 先尝试从缓存读取
    const cachedOpenid = wx.getStorageSync('userOpenid');
    const cachedProfile = wx.getStorageSync('userProfile');

    if (cachedOpenid) {
      openid = cachedOpenid;
      console.log('使用缓存的 openid:', openid);
    }

    if (cachedProfile) {
      userProfile = cachedProfile;
      userInfo = cachedProfile;
    }

    // 静默登录获取 code
    wx.login({
      success: (res) => {
        if (res.code) {
          console.log('wx.login 成功，code:', res.code);
          // 在真实云开发环境中，这里会把 code 发给云函数换取 openid
          // Mock 模式下，使用 code 作为用户标识
          const mockOpenid = 'user_' + res.code.substring(0, 8);
          openid = mockOpenid;
          wx.setStorageSync('userOpenid', mockOpenid);
          console.log('用户 openid:', mockOpenid);
        }
        resolve(getUserInfo());
      },
      fail: () => {
        console.log('wx.login 失败');
        resolve(getUserInfo());
      }
    });
  });
}

/**
 * 获取用户 openid
 */
export function getOpenid() {
  if (!openid) {
    const cached = wx.getStorageSync('userOpenid');
    if (cached) {
      openid = cached;
    }
  }
  return openid || 'unknown_user';
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  if (userInfo) {
    return userInfo;
  }

  // 尝试从缓存读取
  const cached = wx.getStorageSync('userProfile');
  if (cached) {
    userProfile = cached;
    userInfo = cached;
    return cached;
  }

  // 如果没有用户信息，返回基于 openid 的默认信息
  const defaultInfo = {
    nickName: '用户' + getOpenid().slice(-4),
    openid: getOpenid()
  };
  return defaultInfo;
}

/**
 * 获取用户昵称（优先使用缓存的昵称，否则生成默认昵称）
 */
export function getUserNickname() {
  const info = getUserInfo();
  return info.nickName || '用户' + getOpenid().slice(-4);
}

/**
 * 请求用户授权获取昵称
 * 首次会弹出授权框，用户同意后缓存结果
 */
export function requestUserNickname() {
  return new Promise((resolve) => {
    // 先检查是否已有缓存的用户信息
    const cached = wx.getStorageSync('userProfile');
    if (cached && cached.nickName) {
      resolve(cached.nickName);
      return;
    }

    // 请求用户授权
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        console.log('获取用户信息成功:', res);
        userProfile = res.userInfo;
        userInfo = res.userInfo;
        // 缓存用户信息
        wx.setStorageSync('userProfile', res.userInfo);
        resolve(res.userInfo.nickName);
      },
      fail: (err) => {
        console.error('获取用户信息失败:', err);
        // 用户拒绝授权，使用生成的昵称
        const nickname = getUserNickname();
        resolve(nickname);
      }
    });
  });
}

/**
 * 设置用户信息（用于测试或其他场景）
 */
export function setUserInfo(info) {
  userProfile = info;
  userInfo = info;
  if (info) {
    wx.setStorageSync('userProfile', info);
  } else {
    wx.removeStorageSync('userProfile');
  }
}
