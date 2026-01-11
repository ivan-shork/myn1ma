import { addMemoryRecord } from '../../services/memory/index';
import dayjs from 'dayjs';
import { requestUserNickname } from '../../utils/auth';

Page({
  data: {
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    images: [],
    participants: [],
    participantOptions: [
        { name: '直线', emoji: '🫧', selected: false },
        { name: '鱼', emoji: '🐟', selected: false },
        { name: '婷子', emoji: '🐰', selected: false },
      { name: '阿包', emoji: '🍔', selected: false },
      { name: '皮卡丘', emoji: '⚡', selected: false },
      { name: '菠萝', emoji: '🍍', selected: false },
      { name: '蜜蜂', emoji: '🐝', selected: false },
    ],
    submitting: false,
    statusBarHeight: 0,
    uploadGridConfig: { column: 3 }
  },

  onLoad() {
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight || 0;
    this.setData({ statusBarHeight });

    // 设置默认日期为今天
    this.setData({
      date: dayjs().format('YYYY-MM-DD')
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 标题输入
  onTitleChange(e) {
    this.setData({
      title: e.detail.value
    });
  },

  // 描述输入
  onDescriptionChange(e) {
    this.setData({
      description: e.detail.value
    });
  },

  // 日期选择
  onDateChange(e) {
    this.setData({
      date: e.detail.value
    });
  },

  // 时间选择
  onTimeChange(e) {
    this.setData({
      time: e.detail.value
    });
  },

  // 地点输入
  onLocationChange(e) {
    this.setData({
      location: e.detail.value
    });
  },

  // 切换参与人员
  onToggleParticipant(e) {
    const { name } = e.currentTarget.dataset;
    const { participantOptions } = this.data;

    const updatedOptions = participantOptions.map(option => {
      if (option.name === name) {
        return { ...option, selected: !option.selected };
      }
      return option;
    });

    const participants = updatedOptions
      .filter(option => option.selected)
      .map(option => option.name);

    this.setData({
      participantOptions: updatedOptions,
      participants
    });
  },

  // 图片添加
  onUploadAdd(e) {
    const { files } = e.detail;
    console.log('图片添加:', files);
    this.setData({
      images: [...this.data.images, ...files]
    });
  },

  // 图片删除
  onUploadRemove(e) {
    const { index } = e.detail;
    console.log('图片删除，索引:', index);
    const images = [...this.data.images];
    images.splice(index, 1);
    this.setData({
      images
    });
  },

  // 表单验证
  validateForm() {
    const { title, date, images } = this.data;

    console.log('表单验证 - images:', images);

    if (!title.trim()) {
      wx.showToast({
        title: '请输入活动名称',
        icon: 'none'
      });
      return false;
    }

    if (!date) {
      wx.showToast({
        title: '请选择活动日期',
        icon: 'none'
      });
      return false;
    }

    if (!images || images.length === 0) {
      wx.showToast({
        title: '请至少上传一张图片',
        icon: 'none'
      });
      return false;
    }

    return true;
  },

  // 提交表单
  async onSubmit() {
    console.log('=== 提交表单开始 ===');
    console.log('当前数据:', {
      title: this.data.title,
      date: this.data.date,
      images: this.data.images,
      participants: this.data.participants
    });

    if (!this.validateForm()) {
      console.log('表单验证失败');
      return;
    }

    if (this.data.submitting) {
      console.log('正在提交中，忽略');
      return;
    }

    this.setData({
      submitting: true
    });

    wx.showLoading({
      title: '发布中...'
    });

    try {
      // 获取用户昵称
      const userNickname = await requestUserNickname();
      console.log('用户昵称:', userNickname);

      // 获取图片云存储路径
      const imageUrls = this.data.images.map(img => img.url);
      console.log('图片URL列表:', imageUrls);

      const recordData = {
        title: this.data.title.trim(),
        description: this.data.description.trim(),
        date: this.data.date,
        time: this.data.time,
        location: this.data.location.trim(),
        images: imageUrls,
        participants: this.data.participants,
        creator: userNickname,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('准备保存的记录数据:', recordData);
      console.log('准备调用 addMemoryRecord...');
      console.log('addMemoryRecord 函数:', addMemoryRecord);

      const result = await addMemoryRecord(recordData);

      console.log('addMemoryRecord 返回结果:', result);

      wx.hideLoading();
      wx.showToast({
        title: '发布成功',
        icon: 'success'
      });

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);

    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '发布失败，请重试',
        icon: 'none'
      });
      console.error('提交失败:', error);
    } finally {
      this.setData({
        submitting: false
      });
    }
  }
});
