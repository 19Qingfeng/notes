/**
 *
 * 利用{Record<K, V>}构造对象类型替代object
 * 同时callback中的参数可以使用对应的 K，V
 * 同时函数声明时额外声明R范行参数，为callback的返回值R
 * 整个函数最终返回  {Record<K, R>}
 * @template K
 * @template V
 * @template R
 * @param {Record<K, V>} obj1
 * @param {(key: K, value: V) => R} callback
 * @returns {Record<K, R>}
 */
function mapping<K extends keyof any, V, R>(
  obj1: Record<K, V>,
  callback: (key: K, value: V) => R
): Record<K, R> {
  const result = {} as Record<K, R>;
  for (let i in obj1) {
    result[i] = callback(i, obj1[i]);
  }
  return result;
}

mapping({ name: 3 }, (key, value) => {
  return value * 3;
});
