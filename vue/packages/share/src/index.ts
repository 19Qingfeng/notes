export function isPlainObj(value: any): value is object {
  return typeof value === 'object' && value !== null;
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

export const isArray = Array.isArray;
