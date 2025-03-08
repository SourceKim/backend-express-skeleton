/**
 * 生成订单号
 * 格式：年月日时分秒+6位随机数
 * 例如：20230101120000123456
 */
export const generateOrderNo = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  
  // 生成6位随机数
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  
  return `${year}${month}${day}${hour}${minute}${second}${random}`;
}; 