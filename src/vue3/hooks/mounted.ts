
const collect = [];

/**
 * 创建一个 mounted 钩子
 * @param fn 
 */
export function onMounted(fn: Function) {
  collect.push(fn);
}

/**
 * 执行所有 mounted 钩子
 */
export function mounted() {
  collect.forEach(fn => {
    fn();
  })
}
