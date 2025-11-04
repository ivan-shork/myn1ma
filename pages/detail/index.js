Page({
  data: {
    memory: {
      id: '',
      date: '',
      place: '',
      persons: [],
      rate: 0,
      comments: []
    }
  },

  onLoad: function (options) {
    const id = options.id || '1';
    this.fetchMemoryDetail(id);
  },

  fetchMemoryDetail: function (id) {
    // 模拟从云数据库获取详情数据
    const mockMemory = {
      id: id,
      date: '2023-05-01',
      place: '北京',
      persons: ['张三', '李四'],
      thumbnail: '/images/mock/beijing.jpg',
      rate: 4.5,
      comments: [
        {
          name: '张三',
          content: '这是一次很棒的旅行！',
          like: 5,
          unlike: 0
        },
        {
          name: '李四',
          content: '下次还想去这里。',
          like: 3,
          unlike: 0
        }
      ]
    };
    
    this.setData({
      'memory': mockMemory
    });
  },

  goToActivity: function (e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/activity/${type}/index?type=${type}`
    });
  }
})