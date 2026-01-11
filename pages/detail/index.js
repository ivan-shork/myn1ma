import { getMemoryRecordDetail, getComments, addComment } from '../../services/memory/index';
import dayjs from 'dayjs';

Page({
  data: {
    id: '',
    record: null,
    comments: [],
    commentInput: '',
    submitting: false,
    currentImageIndex: 0,
    statusBarHeight: 0
  },

  onLoad(options) {
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight || 0;
    this.setData({ statusBarHeight });

    if (options.id) {
      this.setData({ id: options.id });
      this.fetchDetail();
    }
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  onShow() {
    // 页面显示时刷新数据
    if (this.data.id) {
      this.fetchDetail();
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.fetchDetail().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 获取详情数据
  async fetchDetail() {
    wx.showLoading({ title: '加载中...' });

    try {
      const [record, comments] = await Promise.all([
        getMemoryRecordDetail(this.data.id),
        getComments(this.data.id)
      ]);

      this.setData({
        record,
        comments
      });
    } catch (error) {
      console.error('获取详情失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 图片轮播改变
  onImageChange(e) {
    this.setData({
      currentImageIndex: e.detail.current
    });
  },

  // 预览图片
  onPreviewImage() {
    const { record, currentImageIndex } = this.data;
    wx.previewImage({
      urls: record.images,
      current: record.images[currentImageIndex]
    });
  },

  // 评论输入
  onCommentInput(e) {
    this.setData({
      commentInput: e.detail.value
    });
  },

  // 提交评论
  async onSubmitComment() {
    const { commentInput, id } = this.data;

    if (!commentInput.trim()) {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none'
      });
      return;
    }

    if (this.data.submitting) {
      return;
    }

    this.setData({
      submitting: true
    });

    try {
      await addComment({
        memoryId: id,
        content: commentInput.trim(),
        author: '我', // 后续可接入用户信息
        likes: 0,
        createdAt: new Date().toISOString()
      });

      this.setData({
        commentInput: ''
      });

      wx.showToast({
        title: '评论成功',
        icon: 'success'
      });

      // 刷新评论列表
      this.fetchComments();

    } catch (error) {
      console.error('评论失败:', error);
      wx.showToast({
        title: '评论失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({
        submitting: false
      });
    }
  },

  // 刷新评论列表
  async fetchComments() {
    try {
      const comments = await getComments(this.data.id);
      this.setData({ comments });
    } catch (error) {
      console.error('获取评论失败:', error);
    }
  },

  // 点赞评论
  onLikeComment(e) {
    const { index } = e.currentTarget.dataset;
    const comments = [...this.data.comments];
    comments[index].likes = (comments[index].likes || 0) + 1;
    this.setData({ comments });
  },

  // 格式化日期
  formatDate(dateStr) {
    return dayjs(dateStr).format('YYYY年MM月DD日');
  },

  // 格式化时间
  formatTime(timeStr) {
    if (!timeStr) return '';
    return dayjs(`2000-01-01 ${timeStr}`).format('HH:mm');
  }
});
