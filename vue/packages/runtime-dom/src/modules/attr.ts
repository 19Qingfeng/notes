export function patchAttr(el: HTMLElement, key, value) {
  if (value) {
    el.setAttribute(key, value);
  } else {
    el.removeAttribute(key);
  }
}
