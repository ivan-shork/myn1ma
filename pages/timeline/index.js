import { getMemoryRecords } from '../../services/memory/index';
import config from '../../config/index';

// 评分配置
const RATING_CONFIG = {
  labels: {
    5: '夯',
    4: '顶级',
    3: '人上人',
    2: 'npc',
    1: '拉',
    0: '拉完了'
  }
};

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
      // 直接从服务层获取数据（Mock模式或云数据库）
      const memories = await getMemoryRecords();

      console.log('获取到的时光记录:', memories);

      // 为每条记录计算平均分
      const memoriesWithRating = memories.map(memory => {
        const avgLabel = this.calculateAverageRating(memory.ratings);
        console.log(`记录 ${memory._id} 的评分:`, memory.ratings, '平均分:', avgLabel);
        return {
          ...memory,
          averageRatingLabel: avgLabel
        };
      });

      this.setData({
        memories: memoriesWithRating,
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

  // 计算平均分标签
  calculateAverageRating(ratings) {
    if (!ratings || Object.keys(ratings).length === 0) {
      return '';
    }

    const ratedValues = Object.values(ratings);
    if (ratedValues.length === 0) {
      return '';
    }

    const sum = ratedValues.reduce((a, b) => a + b, 0);
    const average = Math.floor(sum / ratedValues.length);

    return RATING_CONFIG.labels[average] || '';
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
