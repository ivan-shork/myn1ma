import { getMemoryRecordDetail, getComments, addComment, updateRating } from '../../services/memory/index';
import dayjs from 'dayjs';
import { requestUserNickname } from '../../utils/auth';

// 评分配置
const RATING_CONFIG = {
  labels: {
    5: '夯',
    4: '顶级',
    3: '人上人',
    2: 'npc',
    1: '拉',
    0: '拉完了'
  },
  options: ['夯', '顶级', '人上人', 'npc', '拉', '拉完了']
};

// 人员 emoji 映射
const PARTICIPANT_EMOJIS = {
  '鱼': '🐟',
  '阿包': '🍔',
  '直线': '🫧',
  '婷子': '🐰',
  '蜜蜂': '🐝',
  '菠萝': '🍍',
  '皮卡丘': '⚡'
};

Page({
  data: {
    id: '',
    record: null,
    comments: [],
    commentInput: '',
    submitting: false,
    currentImageIndex: 0,
    statusBarHeight: 0,
    ratingOptions: RATING_CONFIG.options,
    ratingLabels: RATING_CONFIG.labels,
    averageRatingLabel: ''
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

      // 确保有评分对象
      if (!record.ratings) {
        record.ratings = {};
      }

      // 计算平均分标签
      const averageRatingLabel = this.calculateAverageRating(record.ratings, record.participants);

      this.setData({
        record,
        comments,
        averageRatingLabel
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

  // 计算平均分标签
  calculateAverageRating(ratings, participants) {
    if (!ratings || Object.keys(ratings).length === 0) {
      return '';
    }

    // 只计算已评分的人员
    const ratedValues = Object.values(ratings);
    if (ratedValues.length === 0) {
      return '';
    }

    // 计算平均分并向下取值
    const sum = ratedValues.reduce((a, b) => a + b, 0);
    const average = Math.floor(sum / ratedValues.length);

    return RATING_CONFIG.labels[average] || '';
  },

  // 获取人员 emoji
  getEmoji(person) {
    return PARTICIPANT_EMOJIS[person] || '👤';
  },

  // 获取评分在选项中的索引
  getRatingIndex(person) {
    const { record } = this.data;
    if (!record || !record.ratings || record.ratings[person] === undefined) {
      return -1; // -1 表示未选中
    }
    const ratingValue = record.ratings[person];
    // 将数值转换为选项索引
    const valueToIndex = { 5: 0, 4: 1, 3: 2, 2: 3, 1: 4, 0: 5 };
    return valueToIndex[ratingValue] ?? -1;
  },

  // 评分改变
  async onRatingChange(e) {
    const { person } = e.currentTarget.dataset;
    const index = e.detail.value;
    const { record } = this.data;

    // 获取选中的评分值
    const indexToValue = { 0: 5, 1: 4, 2: 3, 3: 2, 4: 1, 5: 0 };
    const ratingValue = indexToValue[index];

    // 更新本地数据
    const newRatings = {
      ...record.ratings,
      [person]: ratingValue
    };

    const newRecord = {
      ...record,
      ratings: newRatings
    };

    // 计算新的平均分
    const averageRatingLabel = this.calculateAverageRating(newRatings, record.participants);

    this.setData({
      record: newRecord,
      averageRatingLabel
    });

    // 保存到后端
    try {
      const result = await updateRating(record._id, newRatings);
      console.log('评分保存结果:', result);
      wx.showToast({
        title: '评分成功',
        icon: 'success',
        duration: 1000
      });
    } catch (error) {
      console.error('保存评分失败:', error);
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
      // 回滚本地数据
      this.setData({ record });
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
      // 获取用户昵称
      const userNickname = await requestUserNickname();
      console.log('评论用户昵称:', userNickname);

      await addComment({
        memoryId: id,
        content: commentInput.trim(),
        author: userNickname,
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
