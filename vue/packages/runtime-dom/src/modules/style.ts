export function patchStyle(el, prevValue, nextValue = {}) {
  // 样式需要比对差异

  // 新的需要立即生效
  for (let prop in nextValue) {
    el['style'][prop] = nextValue[prop];
  }

  // 旧的存在 新的不存在
  if (prevValue) {
    for (let key in prevValue) {
      if (!nextValue[key]) {
        // 清空
        el['style'][key] = null;
      }
    }
  }
}
