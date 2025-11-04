Page({
  data: {
    date: '',
    place: '',
    persons: '',
    rate: 0
  },

  onLoad: function () {
    // 设置默认日期为今天
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.setData({
      date: `${yyyy}-${mm}-${dd}`
    });
  },

  onDateChange: function (e) {
    this.setData({
      date: e.detail.value
    });
  },

  onPlaceInput: function (e) {
    this.setData({
      place: e.detail.value
    });
  },

  onPersonsInput: function (e) {
    this.setData({
      persons: e.detail.value
    });
  },

  onRateChange: function (e) {
    this.setData({
      rate: e.detail.value
    });
  },

  onSubmit: function () {
    const { date, place, persons, rate } = this.data;
    
    if (!date || !place || !persons) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }
    
    // 模拟提交数据到云数据库
    console.log('提交数据:', {
      date,
      place,
      persons: persons.split(','),
      rate
    });
    
    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });
    
    // 返回上一页
    wx.navigateBack();
  }
});