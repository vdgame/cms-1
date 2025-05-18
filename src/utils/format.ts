/**
 * 格式化日期，显示为相对时间（如：3天前）或具体日期
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) {
    return '刚刚';
  } else if (diffMins < 60) {
    return `${diffMins}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else if (diffDays < 30) {
    return `${diffDays}天前`;
  } else if (diffMonths < 12) {
    return `${diffMonths}个月前`;
  } else {
    return `${diffYears}年前`;
  }
}

/**
 * 格式化数字，如果大于1000则显示为k
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  } else {
    return num.toString();
  }
}

/**
 * 获取用户头像或默认占位图
 */
export function getUserAvatar(avatar?: string, name?: string): string {
  if (avatar) {
    return avatar;
  }

  // 如果没有头像，使用用户名首字母作为占位
  const initial = name ? name.charAt(0).toUpperCase() : 'U';
  // 使用DiceBear API生成默认头像
  return `https://api.dicebear.com/7.x/initials/svg?seed=${initial}`;
}

/**
 * 截断文本，超过指定长度显示省略号
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

/**
 * 从HTML中提取纯文本（用于生成摘要）
 */
export function extractTextFromHtml(html: string): string {
  // 简单去除HTML标签
  return html.replace(/<\/?[^>]+(>|$)/g, '');
}

/**
 * 根据不同情况生成问题状态标签
 */
export function getQuestionStatusLabel(status: string, isSolved: boolean): { text: string; color: string } {
  if (isSolved) {
    return { text: '已解决', color: 'text-green-600 bg-green-50' };
  }

  switch (status) {
    case 'unanswered':
      return { text: '待解决', color: 'text-orange-500 bg-orange-50' };
    case 'answered':
      return { text: '已回答', color: 'text-blue-500 bg-blue-50' };
    case 'closed':
      return { text: '已关闭', color: 'text-neutral-500 bg-neutral-100' };
    default:
      return { text: '进行中', color: 'text-primary-500 bg-primary-50' };
  }
}
