import { init } from '@cloudbase/wx-cloud-client-sdk';
import updateManager from './common/updateManager';
import { initUserIdentity } from './utils/auth';

wx.cloud.init({
  env: 'cloudbase-6gpmel8o027c1a61', // 旅行玩乐时光记录小程序云开发环境 ID
});
const client = init(wx.cloud);
const models = client.models;
// 接下来就可以调用 models 上的数据模型增删改查等方法了
globalThis.dataModel = models;

App({
  onLaunch: async function () {
    // 初始化用户身份（静默登录）
    await initUserIdentity();
  },
  onShow: function () {
    // 管理小程序的更新。主要功能包括：检查更新，下载新版本，提示用户更新
    updateManager();
  },
});
