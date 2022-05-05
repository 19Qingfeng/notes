/**
 * @description Vue批量更新 Vue源码中利用了一系列兼容考虑，这里简单直接使用Promise
 */

const queue = [];
const nextTick = Promise.resolve();

let isFlushing = false;

export function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job);
  }
  if (!isFlushing) {
    // 重制状态为true表示当前本次loop中已经存在等待执行的批量queue了
    isFlushing = true;
    nextTick.then(() => {
      isFlushing = false;
      const copyQueue = queue.slice(0);
      for (let i = 0; i < copyQueue.length; i++) {
        const job = copyQueue[i];
        job();
      }
      copyQueue.length = 0;
      queue.length = 0;
    });
  }
}
