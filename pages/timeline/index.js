import { getMemoryRecords } from '../../services/memory/index';
import config from '../../config/index';

Page({
  data: {
    memories: [],
    loading: true,
    statusBarHeight: 0
  },

  onLoad() {
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight || 0;

    // 设置CSS变量
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    if (currentPage && currentPage.setData) {
      currentPage.setData({
        statusBarHeight,
        '--status-bar-height': `${statusBarHeight}px`
      });
    }

    this.setData({
      statusBarHeight
    });

    this.fetchMemories();
  },

  onShow() {
    // 页面显示时刷新数据
    this.fetchMemories();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.fetchMemories().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 获取时光记录
  async fetchMemories() {
    this.setData({ loading: true });

    try {
      let memories = [];

      if (config.useMock) {
        // 使用Mock数据
        memories = this.getMockData();
      } else {
        // 从云数据库获取
        memories = await getMemoryRecords();
      }

      this.setData({
        memories,
        loading: false
      });
    } catch (error) {
      console.error('获取时光记录失败:', error);
      this.setData({
        loading: false
      });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  // Mock数据
  getMockData() {
    return [
      {
        _id: '1',
        title: '周末去爬山',
        description: '今天天气很好，和朋友们一起去爬山，风景非常美丽。',
        date: '2024-01-20',
        time: '09:30',
        location: '杭州西湖',
        images: ['/images/mock/girl.jpg'],
        participants: ['张三', '李四', '王五']
      },
      {
        _id: '2',
        title: '火锅聚餐',
        description: '好久没聚了，一起吃了顿火锅，聊得很开心。',
        date: '2024-01-15',
        time: '18:00',
        location: '海底捞',
        images: ['/images/mock/littlegirl.jpg'],
        participants: ['小明', '小红', '小刚']
      },
      {
        _id: '3',
        title: '看电影',
        description: '新上映的电影非常精彩，推荐！',
        date: '2024-01-10',
        time: '14:00',
        location: '万达影城',
        images: ['/images/mock/girl.jpg'],
        participants: ['小李', '小王']
      }
    ];
  },

  // 跳转到新建页面
  goToAdd() {
    wx.navigateTo({
      url: '/pages/create/index'
    });
  },

  // 跳转到详情页
  goToDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/index?id=${id}`
    });
  },

  // 格式化日期显示
  formatDate(dateStr) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  }
});
