
const queue = []
let isFlushPending = false
const p = Promise.resolve()

export function queueJob(job) {
  if (isFlushPending) {
    return
  }

  isFlushPending = true
  if (!queue.includes(job)) {
    queue.push(job)
  }

  // 在微队列进行执行
  nextTick(flushCbs)
}

function flushCbs() {
  isFlushPending = false
  let job;
  while (job = queue.shift()) {
    job && job()
  }
}




/**
 * nextTick 函数
 * @param cb 
 * @returns 
 */
export function nextTick(cb) {
  return cb ? p.then(cb) : p
}
