import { addMemoryRecord } from '../../services/memory/index';
import dayjs from 'dayjs';
import { requestUserNickname } from '../../utils/auth';
import { uploadImageToCloud } from '../../utils/cloud-storage';
import config from '../../config/index';

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
    uploadGridConfig: { column: 3 },
    // 日期时间弹窗相关
    showDatePickerPopup: false,
    showTimePickerPopup: false,
    // 日期选择器数据
    years: [],
    months: [],
    days: [],
    datePickerValue: [0, 0, 0],
    tempSelectedDate: '',
    // 时间选择器数据
    hours: [],
    minutes: [],
    timePickerValue: [0, 0],
    tempSelectedTime: ''
  },

  onLoad() {
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight || 0;
    this.setData({ statusBarHeight });

    // 设置默认日期为今天
    const today = dayjs();
    const dateStr = today.format('YYYY-MM-DD');
    this.setData({ date: dateStr });

    // 生成年份选项 - 前后10年
    const currentYear = today.year();
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    this.setData({ years });

    // 生成月份选项
    const months = [];
    for (let i = 1; i <= 12; i++) {
      months.push(i);
    }
    this.setData({ months });

    // 生成日期选项（默认31天，会根据年月动态调整）
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    this.setData({ days });

    // 设置日期选择器的初始值（今天）
    const initialYearIndex = 10; // 当前年份在数组中的索引
    const initialMonthIndex = today.month(); // 0-11
    const initialDayIndex = today.date() - 1; // 1-31，转为0-30
    this.setData({
      datePickerValue: [initialYearIndex, initialMonthIndex, initialDayIndex],
      tempSelectedDate: dateStr
    });

    // 生成小时选项
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i.toString().padStart(2, '0'));
    }
    this.setData({ hours });

    // 生成分钟选项（每15分钟一个选项）
    const minutes = [];
    for (let i = 0; i < 60; i += 15) {
      minutes.push(i.toString().padStart(2, '0'));
    }
    this.setData({ minutes });
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

  // 显示日期选择弹窗
  onShowDatePicker() {
    // 如果已有选择的日期，设置选择器位置
    if (this.data.date) {
      const date = dayjs(this.data.date);
      const years = this.data.years;
      const yearIndex = years.indexOf(date.year());

      if (yearIndex !== -1) {
        this.setData({
          datePickerValue: [yearIndex, date.month(), date.date() - 1],
          tempSelectedDate: this.data.date,
          showDatePickerPopup: true
        });
        return;
      }
    }

    this.setData({
      showDatePickerPopup: true
    });
  },

  // 关闭日期选择弹窗
  onCloseDatePicker() {
    this.setData({
      showDatePickerPopup: false
    });
  },

  // 日期弹窗可见性变化
  onDatePickerVisibleChange(e) {
    if (!e.detail.visible) {
      this.setData({
        showDatePickerPopup: false
      });
    }
  },

  // 日期选择器滚动变化
  onDatePickerChange(e) {
    const value = e.detail.value;
    const years = this.data.years;
    const months = this.data.months;

    const year = years[value[0]];
    const month = months[value[1]];
    const day = value[2] + 1;

    // 根据选择的年月更新天数
    const daysInMonth = dayjs(`${year}-${month}`, 'YYYY-M').daysInMonth();
    const newDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      newDays.push(i);
    }

    // 如果当前选择的日期超出了新月份的天数，调整日期
    let adjustedDay = day;
    if (day > daysInMonth) {
      adjustedDay = daysInMonth;
      value[2] = daysInMonth - 1;
    }

    this.setData({
      days: newDays,
      datePickerValue: value,
      tempSelectedDate: `${year}-${month.toString().padStart(2, '0')}-${adjustedDay.toString().padStart(2, '0')}`
    });
  },

  // 确认日期选择
  onConfirmDate() {
    this.setData({
      date: this.data.tempSelectedDate,
      showDatePickerPopup: false
    });
  },

  // 显示时间选择弹窗
  onShowTimePicker() {
    // 如果已有选择的时间，设置选择器位置
    if (this.data.time) {
      const [hourStr, minuteStr] = this.data.time.split(':');
      const hours = this.data.hours;
      const minutes = this.data.minutes;

      const hourIndex = hours.indexOf(hourStr);
      const minuteIndex = minutes.indexOf(minuteStr);

      if (hourIndex !== -1 && minuteIndex !== -1) {
        this.setData({
          timePickerValue: [hourIndex, minuteIndex],
          tempSelectedTime: this.data.time,
          showTimePickerPopup: true
        });
        return;
      }
    }

    // 默认选择 00:00
    this.setData({
      timePickerValue: [0, 0],
      tempSelectedTime: '00:00',
      showTimePickerPopup: true
    });
  },

  // 关闭时间选择弹窗
  onCloseTimePicker() {
    this.setData({
      showTimePickerPopup: false
    });
  },

  // 时间弹窗可见性变化
  onTimePickerVisibleChange(e) {
    if (!e.detail.visible) {
      this.setData({
        showTimePickerPopup: false
      });
    }
  },

  // 时间选择器滚动变化
  onTimePickerChange(e) {
    const value = e.detail.value;
    const hours = this.data.hours;
    const minutes = this.data.minutes;

    const hour = hours[value[0]];
    const minute = minutes[value[1]];

    this.setData({
      timePickerValue: value,
      tempSelectedTime: `${hour}:${minute}`
    });
  },

  // 确认时间选择
  onConfirmTime() {
    this.setData({
      time: this.data.tempSelectedTime,
      showTimePickerPopup: false
    });
  },

  // 图片添加
  async onUploadAdd(e) {
    const { files } = e.detail;
    console.log('图片添加:', files);

    if (!files || files.length === 0) {
      return;
    }

    // 开发环境使用本地上传，生产环境使用云存储
    if (config.useMock) {
      // 本地开发环境：直接使用临时路径
      this.setData({
        images: [...this.data.images, ...files]
      });
      console.log('本地开发模式，使用本地图片路径');
      return;
    }

    // 生产环境：上传到云存储
    wx.showLoading({
      title: '上传中...',
      mask: true
    });

    try {
      // 上传每张图片到云存储
      const uploadPromises = files.map(async (file) => {
        const cloudUrl = await uploadImageToCloud(file.url);
        return {
          url: cloudUrl,
          name: file.name || 'image'
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      wx.hideLoading();
      wx.showToast({
        title: '上传成功',
        icon: 'success',
        duration: 1000
      });

      this.setData({
        images: [...this.data.images, ...uploadedFiles]
      });

      console.log('图片上传完成，当前图片列表:', this.data.images);

    } catch (error) {
      wx.hideLoading();
      console.error('图片上传失败:', error);
      wx.showToast({
        title: '上传失败，请重试',
        icon: 'none'
      });
    }
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

      // 计算发生时间的时间戳
      let happenTimestamp = Date.now();
      if (this.data.date) {
        const dateTimeStr = this.data.time
          ? `${this.data.date} ${this.data.time}`
          : `${this.data.date} 00:00`;
        happenTimestamp = dayjs(dateTimeStr).valueOf();
      }

      const recordData = {
        title: this.data.title.trim(),
        description: this.data.description.trim(),
        date: this.data.date,
        time: this.data.time,
        happenTimestamp: happenTimestamp,
        location: this.data.location.trim(),
        images: imageUrls,
        participants: this.data.participants,
        creator: userNickname,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      console.log('准备保存的记录数据:', recordData);
      console.log('准备调用 addMemoryRecord...');

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
