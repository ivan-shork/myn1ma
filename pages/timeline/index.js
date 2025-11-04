Page({
  data: {
    memories: []
  },

  onLoad: function () {
    this.fetchMemories();
  },

  fetchMemories: function () {
    // 模拟从云数据库获取时光记录数据
    const mockMemories = [
      {
        id: '1',
        date: '2023-05-01',
        place: '北京',
        persons: ['张三', '李四'],
        thumbnail: '/images/mock/beijing.jpg',
        rate: 4.5
      },
      {
        id: '2',
        date: '2023-04-15',
        place: '上海',
        persons: ['王五', '赵六'],
        thumbnail: '/images/mock/shanghai.jpg',
        rate: 4.8
      }
    ];
    
    this.setData({
      memories: mockMemories
    });
  },

  goToAdd: function () {
    wx.navigateTo({
      url: '/pages/record/index'
    });
  },

  goToDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/index?id=${id}`
    });
  }
});