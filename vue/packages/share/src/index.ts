export function isPlainObj(value: any): value is object {
  return typeof value === 'object' && value !== null;
}
