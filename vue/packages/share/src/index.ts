export function isPlainObj(value: any): value is object {
  return typeof value === 'object' && value !== null;
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

export const isArray = Array.isArray;

export const isString = (val: unknown): val is string =>
  typeof val === 'string';

// *利用位运算来做VNode类型判断 组合方案
export const enum ShapeFlags {
  ELEMENT = 1,
  FUNCTIONAL_COMPONENT = 1 << 1,
  STATEFUL_COMPONENT = 1 << 2,
  TEXT_CHILDREN = 1 << 3,
  ARRAY_CHILDREN = 1 << 4,
  SLOTS_CHILDREN = 1 << 5,
  TELEPORT = 1 << 6,
  SUSPENSE = 1 << 7,
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT,
}
