Page({
  data: {
    sight: '',
    description: '',
    expense: '',
    rating: 0
  },

  onLoad: function (options) {
    // 页面加载时的逻辑
  },

  onSightInput: function (e) {
    this.setData({
      sight: e.detail.value
    });
  },

  onDescriptionInput: function (e) {
    this.setData({
      description: e.detail.value
    });
  },

  onExpenseInput: function (e) {
    this.setData({
      expense: e.detail.value
    });
  },

  onRatingChange: function (e) {
    this.setData({
      rating: e.detail.value
    });
  },

  onSubmit: function () {
    const { sight, description, expense, rating } = this.data;
    
    if (!sight) {
      wx.showToast({
        title: '请填写景点名称',
        icon: 'none'
      });
      return;
    }
    
    // 模拟提交数据到云数据库
    console.log('提交数据:', {
      sight,
      description,
      expense,
      rating
    });
    
    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });
    
    // 返回上一页
    wx.navigateBack();
  }
});