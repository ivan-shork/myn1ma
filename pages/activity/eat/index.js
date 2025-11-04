Page({
  data: {
    restaurant: '',
    dishes: '',
    expense: '',
    rating: 0
  },

  onLoad: function (options) {
    // 页面加载时的逻辑
  },

  onRestaurantInput: function (e) {
    this.setData({
      restaurant: e.detail.value
    });
  },

  onDishesInput: function (e) {
    this.setData({
      dishes: e.detail.value
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
    const { restaurant, dishes, expense, rating } = this.data;
    
    if (!restaurant || !dishes) {
      wx.showToast({
        title: '请填写餐厅和菜品信息',
        icon: 'none'
      });
      return;
    }
    
    // 模拟提交数据到云数据库
    console.log('提交数据:', {
      restaurant,
      dishes,
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