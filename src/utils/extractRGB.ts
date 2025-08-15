/**
 * 解析rgb值
 * @param rgbString rgb(数字,数字,数字)
 * @returns 
 */
export function extractRGB(rgbString) {
  // 正则表达式用于匹配形如 rgb(数字,数字,数字) 的格式
  const regex = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;

  // 执行正则匹配
  const match = rgbString.match(regex);

  if (match) {
    // 返回提取的 RGB 值
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
    };
  } else {
    // 如果格式不符合，返回 null
    return null;
  }
} 
