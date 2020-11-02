/**
 * 本地存储封装模块
 */

export const getItem = name => {
  const data = window.localStorage.getItem(name)
  // data可能不是JSON格式字符串 所以用try catch包裹
  // 如果不是原样返回
  try {
    return JSON.parse(data)
  } catch (error) {
    return data
  }
}

export const setItem = (name, value) => {
  if (typeof value === 'object' || typeof value === 'array') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}

export const removeItem = name => {
  window.localStorage.removeItem(name)
}
