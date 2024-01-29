
/**
 * 当上锁时，所有的钩子都将无法注册
 */
export let hookLock = false;

/**
 * 设置锁开关
 * @param bool 
 */
export function setLock(bool: boolean) {
  hookLock = bool;
}
