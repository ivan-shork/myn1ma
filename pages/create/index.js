import { addMemoryRecord } from '../../services/memory/index';
import dayjs from 'dayjs';

Page({
  data: {
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    images: [],
    participants: [],
    participantInput: '',
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

  // 参与人员输入
  onParticipantInput(e) {
    this.setData({
      participantInput: e.detail.value
    });
  },

  // 添加参与人员
  onAddParticipant() {
    const { participantInput, participants } = this.data;
    if (!participantInput.trim()) {
      wx.showToast({
        title: '请输入人员姓名',
        icon: 'none'
      });
      return;
    }
    if (participants.includes(participantInput.trim())) {
      wx.showToast({
        title: '该人员已添加',
        icon: 'none'
      });
      return;
    }
    this.setData({
      participants: [...participants, participantInput.trim()],
      participantInput: ''
    });
  },

  // 删除参与人员
  onRemoveParticipant(e) {
    const { index } = e.currentTarget.dataset;
    const { participants } = this.data;
    participants.splice(index, 1);
    this.setData({
      participants
    });
  },

  // 图片上传
  onUploadChange(e) {
    const { fileList } = e.detail;
    this.setData({
      images: fileList
    });
  },

  // 表单验证
  validateForm() {
    const { title, date, images } = this.data;

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

    if (images.length === 0) {
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
    if (!this.validateForm()) {
      return;
    }

    if (this.data.submitting) {
      return;
    }

    this.setData({
      submitting: true
    });

    wx.showLoading({
      title: '发布中...'
    });

    try {
      // 获取图片云存储路径
      const imageUrls = this.data.images.map(img => img.url);

      const recordData = {
        title: this.data.title.trim(),
        description: this.data.description.trim(),
        date: this.data.date,
        time: this.data.time,
        location: this.data.location.trim(),
        images: imageUrls,
        participants: this.data.participants,
        creator: '我', // 后续可接入用户信息
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addMemoryRecord(recordData);

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
