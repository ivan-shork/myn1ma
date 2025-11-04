// 格式化日期
export function formatDate(date) {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// 格式化时间
export function formatTime(date) {
  if (!date) return '';
  
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
}

// 格式化日期时间
export function formatDateTime(date) {
  if (!date) return '';
  
  return `${formatDate(date)} ${formatTime(date)}`;
}

// 生成随机ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// 验证表单数据
export function validateForm(data, rules) {
  const errors = {};
  
  for (const field in rules) {
    const rule = rules[field];
    const value = data[field];
    
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = rule.message || `${field}是必填项`;
      continue;
    }
    
    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = rule.message || `${field}长度不能少于${rule.minLength}个字符`;
      continue;
    }
    
    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = rule.message || `${field}长度不能超过${rule.maxLength}个字符`;
      continue;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// 计算两个日期之间的天数差
export function daysBetween(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000; // 小时*分钟*秒*毫秒
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  
  return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
}

// 获取日期是星期几
export function getWeekday(date) {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const d = new Date(date);
  return weekdays[d.getDay()];
}