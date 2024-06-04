import { binding } from "./depend";
import { CustomRefImpl } from "./ref";

export class ReactiveEffect<T> {

  fn:       () => T
  computed: CustomRefImpl<T>
  active    = true;

  constructor(fn: () => T) {
    this.fn   = fn;
    let value = fn();
    this.computed = new CustomRefImpl((track, trigger) => ({
      get() {
        track();
        return value;
      },
      set: (val) => {
        value = val;
        trigger();
      }
    }));
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
