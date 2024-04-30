import { binding } from "./depend";
import { RefImpl, ref } from "./ref";

export class ReactiveEffect<T> {

  fn:       () => T
  computed: RefImpl<T>
  active    = true;

  constructor(fn: () => T) {
    this.fn       = fn;
    this.computed = ref(fn());
    this.scheduler();
  }

  /**
   * 任务调度
   */
  scheduler() {
    binding(() => {
      if (!this.active) return true;
      this.computed.value = this.run();
    })
  }

  /**
   * 执行任务
   * @returns 
   */
  run() {
    return this.fn();
  }

  /**
   * 停止任务调度
   */
  stop() {
    this.active = false;
  }

}
