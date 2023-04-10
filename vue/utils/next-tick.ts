
/**
 * 异步执行一个函数
 * @param func 
 */
export function nextTick(func: Function) {
  if (typeof Promise !== void 0) {
    Promise.resolve().then(func as any);
  } else if (typeof MutationObserver !== void 0) {
    const ob = new MutationObserver(func as MutationCallback);
    const textNode = document.createTextNode('0');
    ob.observe(textNode, { characterData: true });
    textNode.data = '1';
  } else if (typeof process !== void 0) {
    process.nextTick(func);
  } else {
    setTimeout(func, 0);
  }
}
