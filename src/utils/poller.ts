type StartAction = {
  (timer: NodeJS.Timer | null): void;
};
/**
 * 轮询器
 */
export default class Poller {
  private interval = 300;
  private timer: NodeJS.Timer | null = null;
  constructor(interval: number) {
    this.interval = interval;
  }
  /**
   * 开始轮询
   * @param cb 轮询回调
   */
  start(cb: StartAction) {
    this.timer = setInterval(async () => {
      cb(this.timer);
    }, this.interval);
  }
  /**
   * 停止轮询
   */
  stop() {
    if (this.timer !== null) {
      clearInterval(this.timer);
    }
  }
}
