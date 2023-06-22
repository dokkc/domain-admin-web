// 枚举值，用于逻辑判断
export const NotifyTypeEnum = {
  // 未知
  Unknown: 0,
  // 邮件
  Email: 1,
  // webkook
  Webhook: 2,
  // 企业微信
  WorkWeixin: 3,
}

export const NotifyTypeOptions = [
  {
    value: NotifyTypeEnum.Email,
    label: '邮件',
  },
  {
    value: NotifyTypeEnum.Webhook,
    label: 'Webhook',
  },
  {
    value: NotifyTypeEnum.WorkWeixin,
    label: '企业微信',
  },
]

export function notifyTypeFilter(value) {
  const item = NotifyTypeOptions.find((item) => item.value == value)
  if (item) {
    return item.label
  }
  return
}
