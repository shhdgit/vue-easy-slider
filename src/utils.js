export function throttle(fn, delay, mustRunDelay) {
  var timer = null
  var t_start
  return function() {
    var context = this,
      args = arguments,
      t_curr = +new Date()
    clearTimeout(timer)
    if (!t_start) {
      t_start = t_curr
    }
    if (t_curr - t_start >= mustRunDelay) {
      fn.apply(context, args)
      t_start = t_curr
    } else {
      timer = setTimeout(() => {
        fn.apply(context, args)
      }, delay)
    }
  }
}

export function debounce(fn, blockTime) {
  let debounce = false

  return function() {
    if (debounce) return
    debounce = true
    fn.apply(this, arguments)
    setTimeout(() => (debounce = false), blockTime)
  }
}
