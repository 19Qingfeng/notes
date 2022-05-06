function createInvoker(fn) {
  const invoker = (e) => invoker.value(e);
  invoker.value = fn;
  return invoker;
}

/**
 * 绑定事件发生改变时，进行改动
 * 这里利用了一层对象来处理事件的更换从而代替了每次变化重新remove-add
 * *这个思想有点意思
 * @param el
 * @param eventName
 * @param nextValue
 */
export function patchEvent(el, eventName, nextValue) {
  const invokers = el._vei ? el._vei : (el._vei = {});

  const exits = invokers[eventName];

  if (exits) {
    exits.value = nextValue;
  } else {
    const name = eventName.slice(2).toLowerCase();
    // 不存在
    if (nextValue) {
      const invoker = (invokers[eventName] = createInvoker(nextValue));
      el.addEventListener(name, invoker);
    } else if (exits) {
      el.removeEventListener(name, exits);
      invokers[eventName] = undefined;
    }
  }
}
