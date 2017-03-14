// Powered by https://github.com/akira-cn/animator.js
// Learning & Rewrite
// MIT License

function nowtime () {
  if (!performance && performance.now) return performance.now()
  return Date.now ? Date.now() : (new Date()).getTime()
}

if (typeof window.requestAnimationFrame === 'undefined') {
  window.requestAnimationFrame = function (callback) {
    return setTimeout(function () {
      callback(nowtime())
    }, 1000/60)
  }
  window.cancelAnimationFrame = function (requestId) {
    return clearTimeout(requestId)
  }
}

class Animator {
  constructor (duration, update, easing) {
    this.duration = duration
    this.update = update
    this.easing = easing
  }
  animate () {
    let startTime = 0
    const duration = this.duration
    const update = this.update
    const easing = this.easing
    const self = this

    return new Promise(function (resolve, reject) {
      let qId = 0
      function render (timestamp) {
        startTime = startTime || timestamp

        const percent = Math.min(1.0, (timestamp - startTime) / duration)
        update.call(self, easing ? easing(percent) : percent, percent)
        if (percent < 1.0) {
          qId = requestAnimationFrame(render)
        } else {
          resolve(self)
        }
      }
      self.cancel = function () {
        cancelAnimationFrame(qId)
        update.call(self, 0, 0)
        reject('User canceled!')
      }
      qId = requestAnimationFrame(render)
    })
  }
  ease (easing) {
    return new Animator(this.duration, this.update, easing)
  }
}

export default Animator
