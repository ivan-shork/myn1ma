/**
 * 用户授权和信息管理
 */

let userInfo = null;
let openid = null;
let userProfile = null;
let userAvatar = null;

/**
 * 初始化用户身份（静默登录）
 * 在小程序启动时自动调用
 */
export function initUserIdentity() {
  return new Promise((resolve) => {
    // 先尝试从缓存读取
    const cachedOpenid = wx.getStorageSync('userOpenid');
    const cachedProfile = wx.getStorageSync('userProfile');
    const cachedAvatar = wx.getStorageSync('userAvatar');

    if (cachedOpenid) {
      openid = cachedOpenid;
      console.log('使用缓存的 openid:', openid);
    }

    if (cachedProfile) {
      userProfile = cachedProfile;
      userInfo = cachedProfile;
    }

    if (cachedAvatar) {
      userAvatar = cachedAvatar;
    }

    // 静默登录获取 code
    wx.login({
      success: (res) => {
        if (res.code) {
          console.log('wx.login 成功，code:', res.code);
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

  const cached = wx.getStorageSync('userProfile');
  if (cached) {
    userProfile = cached;
    userInfo = cached;
    return cached;
  }

  const defaultInfo = {
    nickName: '用户' + getOpenid().slice(-4),
    avatarUrl: '',
    openid: getOpenid()
  };
  return defaultInfo;
}

/**
 * 获取用户头像
 */
export function getUserAvatarUrl() {
  if (userAvatar) {
    return userAvatar;
  }
  const cached = wx.getStorageSync('userAvatar');
  if (cached) {
    userAvatar = cached;
  }
  return cached || '';
}

/**
 * 设置用户头像（从头像昵称填写组件）
 */
export function setUserAvatarUrl(avatarUrl) {
  userAvatar = avatarUrl;
  wx.setStorageSync('userAvatar', avatarUrl);
}

/**
 * 设置用户昵称（从头像昵称填写组件）
 */
export function setUserNickname(nickName) {
  const profile = {
    nickName: nickName,
    avatarUrl: getUserAvatarUrl()
  };
  userProfile = profile;
  userInfo = profile;
  wx.setStorageSync('userProfile', profile);
}

/**
 * 获取用户昵称
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
    const cached = wx.getStorageSync('userProfile');
    if (cached && cached.nickName) {
      resolve(cached.nickName);
      return;
    }

    // 使用生成的昵称
    const nickname = getUserNickname();
    resolve(nickname);
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
