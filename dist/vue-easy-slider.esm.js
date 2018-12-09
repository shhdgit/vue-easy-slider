function throttle(fn, delay, mustRunDelay) {
  var timer = null;
  var t_start;
  return function() {
    var context = this,
      args = arguments,
      t_curr = +new Date();
    clearTimeout(timer);
    if (!t_start) {
      t_start = t_curr;
    }
    if (t_curr - t_start >= mustRunDelay) {
      fn.apply(context, args);
      t_start = t_curr;
    } else {
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    }
  }
}

function debounce(fn, blockTime) {
  var debounce = false;

  return function() {
    if (debounce) { return }
    debounce = true;
    fn.apply(this, arguments);
    setTimeout(function () { return (debounce = false); }, blockTime);
  }
}

/* AlloyFinger v0.1.15
 * By dntzhang
 * Github: https://github.com/AlloyTeam/AlloyFinger
 */

function getLen(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y)
}

function dot(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y
}

function getAngle(v1, v2) {
  var mr = getLen(v1) * getLen(v2);
  if (mr === 0) { return 0 }
  var r = dot(v1, v2) / mr;
  if (r > 1) { r = 1; }
  return Math.acos(r)
}

function cross(v1, v2) {
  return v1.x * v2.y - v2.x * v1.y
}

function getRotateAngle(v1, v2) {
  var angle = getAngle(v1, v2);
  if (cross(v1, v2) > 0) {
    angle *= -1;
  }

  return (angle * 180) / Math.PI
}

var HandlerAdmin = function(el) {
  this.handlers = [];
  this.el = el;
};

HandlerAdmin.prototype.add = function(handler) {
  this.handlers.push(handler);
};

HandlerAdmin.prototype.del = function(handler) {
  if (!handler) { this.handlers = []; }

  for (var i = this.handlers.length; i >= 0; i--) {
    if (this.handlers[i] === handler) {
      this.handlers.splice(i, 1);
    }
  }
};

HandlerAdmin.prototype.dispatch = function() {
  var arguments$1 = arguments;

  for (var i = 0, len = this.handlers.length; i < len; i++) {
    var handler = this.handlers[i];
    if (typeof handler === 'function') { handler.apply(this.el, arguments$1); }
  }
};

function wrapFunc(el, handler) {
  var handlerAdmin = new HandlerAdmin(el);
  handlerAdmin.add(handler);

  return handlerAdmin
}

var AlloyFinger = function(el, option) {
  this.element = typeof el == 'string' ? document.querySelector(el) : el;

  this.start = this.start.bind(this);
  this.move = this.move.bind(this);
  this.end = this.end.bind(this);
  this.cancel = this.cancel.bind(this);
  this.element.addEventListener('touchstart', this.start, false);
  this.element.addEventListener('touchmove', this.move, false);
  this.element.addEventListener('touchend', this.end, false);
  this.element.addEventListener('touchcancel', this.cancel, false);

  this.preV = { x: null, y: null };
  this.pinchStartLen = null;
  this.zoom = 1;
  this.isDoubleTap = false;

  var noop = function() {};

  this.rotate = wrapFunc(this.element, option.rotate || noop);
  this.touchStart = wrapFunc(this.element, option.touchStart || noop);
  this.multipointStart = wrapFunc(this.element, option.multipointStart || noop);
  this.multipointEnd = wrapFunc(this.element, option.multipointEnd || noop);
  this.pinch = wrapFunc(this.element, option.pinch || noop);
  this.swipe = wrapFunc(this.element, option.swipe || noop);
  this.tap = wrapFunc(this.element, option.tap || noop);
  this.doubleTap = wrapFunc(this.element, option.doubleTap || noop);
  this.longTap = wrapFunc(this.element, option.longTap || noop);
  this.singleTap = wrapFunc(this.element, option.singleTap || noop);
  this.pressMove = wrapFunc(this.element, option.pressMove || noop);
  this.twoFingerPressMove = wrapFunc(
    this.element,
    option.twoFingerPressMove || noop
  );
  this.touchMove = wrapFunc(this.element, option.touchMove || noop);
  this.touchEnd = wrapFunc(this.element, option.touchEnd || noop);
  this.touchCancel = wrapFunc(this.element, option.touchCancel || noop);

  this._cancelAllHandler = this.cancelAll.bind(this);

  window.addEventListener('scroll', this._cancelAllHandler);

  this.delta = null;
  this.last = null;
  this.now = null;
  this.tapTimeout = null;
  this.singleTapTimeout = null;
  this.longTapTimeout = null;
  this.swipeTimeout = null;
  this.x1 = this.x2 = this.y1 = this.y2 = null;
  this.preTapPosition = { x: null, y: null };
};

AlloyFinger.prototype = {
  start: function(evt) {
    if (!evt.touches) { return }
    this.now = Date.now();
    this.x1 = evt.touches[0].pageX;
    this.y1 = evt.touches[0].pageY;
    this.delta = this.now - (this.last || this.now);
    this.touchStart.dispatch(evt, this.element);
    if (this.preTapPosition.x !== null) {
      this.isDoubleTap =
        this.delta > 0 &&
        this.delta <= 250 &&
        Math.abs(this.preTapPosition.x - this.x1) < 30 &&
        Math.abs(this.preTapPosition.y - this.y1) < 30;
      if (this.isDoubleTap) { clearTimeout(this.singleTapTimeout); }
    }
    this.preTapPosition.x = this.x1;
    this.preTapPosition.y = this.y1;
    this.last = this.now;
    var preV = this.preV,
      len = evt.touches.length;
    if (len > 1) {
      this._cancelLongTap();
      this._cancelSingleTap();
      var v = {
        x: evt.touches[1].pageX - this.x1,
        y: evt.touches[1].pageY - this.y1,
      };
      preV.x = v.x;
      preV.y = v.y;
      this.pinchStartLen = getLen(preV);
      this.multipointStart.dispatch(evt, this.element);
    }
    this._preventTap = false;
    this.longTapTimeout = setTimeout(
      function() {
        this.longTap.dispatch(evt, this.element);
        this._preventTap = true;
      }.bind(this),
      750
    );
  },
  move: function(evt) {
    if (!evt.touches) { return }
    var preV = this.preV,
      len = evt.touches.length,
      currentX = evt.touches[0].pageX,
      currentY = evt.touches[0].pageY;
    this.isDoubleTap = false;
    if (len > 1) {
      var sCurrentX = evt.touches[1].pageX,
        sCurrentY = evt.touches[1].pageY;
      var v = {
        x: evt.touches[1].pageX - currentX,
        y: evt.touches[1].pageY - currentY,
      };

      if (preV.x !== null) {
        if (this.pinchStartLen > 0) {
          evt.zoom = getLen(v) / this.pinchStartLen;
          this.pinch.dispatch(evt, this.element);
        }

        evt.angle = getRotateAngle(v, preV);
        this.rotate.dispatch(evt, this.element);
      }
      preV.x = v.x;
      preV.y = v.y;

      if (this.x2 !== null && this.sx2 !== null) {
        evt.deltaX = (currentX - this.x2 + sCurrentX - this.sx2) / 2;
        evt.deltaY = (currentY - this.y2 + sCurrentY - this.sy2) / 2;
      } else {
        evt.deltaX = 0;
        evt.deltaY = 0;
      }
      this.twoFingerPressMove.dispatch(evt, this.element);

      this.sx2 = sCurrentX;
      this.sy2 = sCurrentY;
    } else {
      if (this.x2 !== null) {
        evt.deltaX = currentX - this.x2;
        evt.deltaY = currentY - this.y2;

        //move事件中添加对当前触摸点到初始触摸点的判断，
        //如果曾经大于过某个距离(比如10),就认为是移动到某个地方又移回来，应该不再触发tap事件才对。
        var movedX = Math.abs(this.x1 - this.x2),
          movedY = Math.abs(this.y1 - this.y2);

        if (movedX > 10 || movedY > 10) {
          this._preventTap = true;
        }
      } else {
        evt.deltaX = 0;
        evt.deltaY = 0;
      }

      this.pressMove.dispatch(evt, this.element);
    }

    this.touchMove.dispatch(evt, this.element);

    this._cancelLongTap();
    this.x2 = currentX;
    this.y2 = currentY;

    if (len > 1) {
      evt.preventDefault();
    }
  },
  end: function(evt) {
    if (!evt.changedTouches) { return }
    this._cancelLongTap();
    var self = this;
    if (evt.touches.length < 2) {
      this.multipointEnd.dispatch(evt, this.element);
      this.sx2 = this.sy2 = null;
    }

    //swipe
    if (
      (this.x2 && Math.abs(this.x1 - this.x2) > 30) ||
      (this.y2 && Math.abs(this.y1 - this.y2) > 30)
    ) {
      evt.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2);
      this.swipeTimeout = setTimeout(function() {
        self.swipe.dispatch(evt, self.element);
      }, 0);
    } else {
      this.tapTimeout = setTimeout(function() {
        if (!self._preventTap) {
          self.tap.dispatch(evt, self.element);
        }
        // trigger double tap immediately
        if (self.isDoubleTap) {
          self.doubleTap.dispatch(evt, self.element);
          self.isDoubleTap = false;
        }
      }, 0);

      if (!self.isDoubleTap) {
        self.singleTapTimeout = setTimeout(function() {
          self.singleTap.dispatch(evt, self.element);
        }, 250);
      }
    }

    this.touchEnd.dispatch(evt, this.element);

    this.preV.x = 0;
    this.preV.y = 0;
    this.zoom = 1;
    this.pinchStartLen = null;
    this.x1 = this.x2 = this.y1 = this.y2 = null;
  },
  cancelAll: function() {
    this._preventTap = true;
    clearTimeout(this.singleTapTimeout);
    clearTimeout(this.tapTimeout);
    clearTimeout(this.longTapTimeout);
    clearTimeout(this.swipeTimeout);
  },
  cancel: function(evt) {
    this.cancelAll();
    this.touchCancel.dispatch(evt, this.element);
  },
  _cancelLongTap: function() {
    clearTimeout(this.longTapTimeout);
  },
  _cancelSingleTap: function() {
    clearTimeout(this.singleTapTimeout);
  },
  _swipeDirection: function(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >= Math.abs(y1 - y2)
      ? x1 - x2 > 0
        ? 'Left'
        : 'Right'
      : y1 - y2 > 0
      ? 'Up'
      : 'Down'
  },

  on: function(evt, handler) {
    if (this[evt]) {
      this[evt].add(handler);
    }
  },

  off: function(evt, handler) {
    if (this[evt]) {
      this[evt].del(handler);
    }
  },

  destroy: function() {
    if (this.singleTapTimeout) { clearTimeout(this.singleTapTimeout); }
    if (this.tapTimeout) { clearTimeout(this.tapTimeout); }
    if (this.longTapTimeout) { clearTimeout(this.longTapTimeout); }
    if (this.swipeTimeout) { clearTimeout(this.swipeTimeout); }

    this.element.removeEventListener('touchstart', this.start);
    this.element.removeEventListener('touchmove', this.move);
    this.element.removeEventListener('touchend', this.end);
    this.element.removeEventListener('touchcancel', this.cancel);

    this.rotate.del();
    this.touchStart.del();
    this.multipointStart.del();
    this.multipointEnd.del();
    this.pinch.del();
    this.swipe.del();
    this.tap.del();
    this.doubleTap.del();
    this.longTap.del();
    this.singleTap.del();
    this.pressMove.del();
    this.twoFingerPressMove.del();
    this.touchMove.del();
    this.touchEnd.del();
    this.touchCancel.del();

    this.preV = this.pinchStartLen = this.zoom = this.isDoubleTap = this.delta = this.last = this.now = this.tapTimeout = this.singleTapTimeout = this.longTapTimeout = this.swipeTimeout = this.x1 = this.x2 = this.y1 = this.y2 = this.preTapPosition = this.rotate = this.touchStart = this.multipointStart = this.multipointEnd = this.pinch = this.swipe = this.tap = this.doubleTap = this.longTap = this.singleTap = this.pressMove = this.touchMove = this.touchEnd = this.touchCancel = this.twoFingerPressMove = null;

    window.removeEventListener('scroll', this._cancelAllHandler);
    return null
  },
};

//

var script = {
  name: 'Slider',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Number,
      default: 0,
    },
    width: {
      type: String,
      default: 'auto',
    },
    height: {
      type: String,
      default: '300px',
    },
    touch: {
      type: Boolean,
      default: true,
    },
    animation: {
      type: String,
      default: 'normal',
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    interval: {
      type: Number,
      default: 3000,
    },
    speed: {
      type: Number,
      default: 500,
    },
    indicators: {
      type: String,
      default: 'center',
    },
    controlBtn: {
      type: Boolean,
      default: true,
    },
    beforePrevious: {
      type: Function,
      default: function () { return true; },
    },
    beforeNext: {
      type: Function,
      default: function () { return true; },
    },
  },
  data: function data() {
    return {
      sliderItems: [],
      currentIndex: 0,
      timer: 0,
      af: null,
    }
  },

  watch: {
    // FIXME: debounce
    value: function value(current) {
      var step = current - this.currentIndex;

      if (!step || current < 0 || current > this.sliderItems.length - 1) { return }

      this.handleIndicator(step);
    },
  },

  created: function created() {
    this.init = throttle(this.init, 100);
    this.move = debounce(this.move, this.speed - 200);
    this.$on('slider:init', this.init);
  },
  mounted: function mounted() {
    this.init();
    this.initTouchArea();
  },
  // init when keep-alive
  activated: function activated() {
    this.init();
    this.initTouchArea();
  },
  beforeDestroy: function beforeDestroy() {
    this.timer && clearInterval(this.timer);
    this.af && this.af.destroy();
  },
  deactivated: function deactivated() {
    this.timer && clearInterval(this.timer);
    this.af && this.af.destroy();
  },

  methods: {
    init: function init() {
      this.sliderItems = this.$children.filter(function (child) {
        return child.$options.name === 'SliderItem'
      });

      if (this.sliderItems[this.value]) {
        this.currentIndex = this.value;
      }

      var currentItem = this.sliderItems[this.currentIndex];

      if (!currentItem) { return }

      currentItem.init();
      this.auto();
    },
    initTouchArea: function initTouchArea() {
      var this$1 = this;

      if (this.af || !this.touch) { return }

      var touchArea = this.$refs.touchArea;

      this.af = new AlloyFinger(touchArea, {
        swipe: function (e) {
          e.direction === 'Left' ? this$1.next() : this$1.prev();
        },
      });
    },
    auto: function auto() {
      var this$1 = this;

      if (!this.autoplay || this.sliderItems.length < 2) { return }

      if (this.timer) { clearInterval(this.timer); }
      this.timer = setInterval(function () {
        this$1.move(1);
      }, this.interval);
    },
    move: function move(step) {
      if (!step) { return }

      // direction: left: true, right: false
      var direction = step > 0;
      var nextIndex = this.getNextIndex(step);
      var currentItem = this.sliderItems[this.currentIndex];
      var nextItem = this.sliderItems[nextIndex];

      currentItem.hide(direction);
      nextItem.show(direction);
      this.currentIndex = nextIndex;
      this.$emit('change', nextIndex);
    },
    prev: function prev() {
      if (!this.beforePrevious()) { return }

      this.handleControlBtn('previous');
    },
    next: function next() {
      if (!this.beforePrevious()) { return }

      this.handleControlBtn('next');
    },
    handleIndicator: function handleIndicator(step) {
      if (this.sliderItems.length < 2 || !step) { return }

      this.move(step);
      this.auto();
    },
    /**
     * @param direction 'previous' | 'next'
     */
    handleControlBtn: function handleControlBtn(direction) {
      if (this.sliderItems.length < 2) { return }

      var step = direction === 'next' ? 1 : -1;
      var nextIndex = this.getNextIndex(step);

      this.$emit(direction, {
        original: this.currentIndex,
        next: nextIndex,
      });
      this.move(step);
      this.auto();
    },
    getNextIndex: function getNextIndex(step) {
      var slidersLen = this.sliderItems.length;
      return (this.currentIndex + step + slidersLen) % slidersLen
    },
  },
};

/* script */
            var __vue_script__ = script;
            
/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"slider",style:({ width: _vm.width, height: _vm.height })},[(!_vm.sliderItems.length)?_vm._t("loading",[_vm._m(0)]):_vm._e(),_vm._v(" "),_c('div',{ref:"touchArea",staticClass:"slider-items"},[_vm._t("default")],2),_vm._v(" "),(_vm.indicators)?_c('div',{class:("slider-indicators slider-indicators-" + _vm.indicators),on:{"click":function($event){$event.stopPropagation();}}},_vm._l((_vm.sliderItems.length),function(i){return _c('span',{key:i,staticClass:"slider-indicator-icon",class:{ 'slider-indicator-active': _vm.currentIndex === i - 1 },on:{"click":function($event){_vm.handleIndicator(i - _vm.currentIndex - 1);}}})})):_vm._e(),_vm._v(" "),(_vm.controlBtn)?[_c('button',{staticClass:"slider-btn slider-btn-left",on:{"click":function($event){$event.stopPropagation();return _vm.prev($event)}}},[_c('i',{staticClass:"slider-icon slider-icon-left"})]),_vm._v(" "),_c('button',{staticClass:"slider-btn slider-btn-right",on:{"click":function($event){$event.stopPropagation();return _vm.next($event)}}},[_c('i',{staticClass:"slider-icon slider-icon-right"})])]:_vm._e()],2)};
var __vue_staticRenderFns__ = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"slider-loading"},[_c('div',{staticClass:"ball-pulse"},[_c('div'),_vm._v(" "),_c('div'),_vm._v(" "),_c('div')])])}];

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-d5c2db1a_0", { source: "\n.slider[data-v-d5c2db1a]{position:relative;overflow:hidden\n}\n.slider-items[data-v-d5c2db1a]{width:100%;height:100%\n}\n.slider-btn[data-v-d5c2db1a]{position:absolute;top:0;z-index:999;height:100%;width:50px;border:none;background:rgba(0,0,0,.1);outline:0;transition:background .3s;cursor:pointer\n}\n.slider-btn:hover .slider-icon[data-v-d5c2db1a]{border-color:#fff\n}\n.slider-btn-left[data-v-d5c2db1a]{left:0;background:linear-gradient(90deg,rgba(0,0,0,.1),rgba(0,0,0,0))\n}\n.slider-btn-right[data-v-d5c2db1a]{right:0;background:linear-gradient(-90deg,rgba(0,0,0,.1),rgba(0,0,0,0))\n}\n.slider-icon[data-v-d5c2db1a]{display:inline-block;width:15px;height:15px;border-left:2px solid rgba(255,255,255,.6);border-bottom:2px solid rgba(255,255,255,.6);transition:border .2s\n}\n.slider-icon-left[data-v-d5c2db1a]{transform:rotate(45deg)\n}\n.slider-icon-right[data-v-d5c2db1a]{transform:rotate(-135deg)\n}\n.slider-indicators[data-v-d5c2db1a]{position:absolute;bottom:20px;z-index:999\n}\n.slider-indicators-center[data-v-d5c2db1a]{left:50%;transform:translateX(-50%)\n}\n.slider-indicators-left[data-v-d5c2db1a]{left:6%\n}\n.slider-indicators-right[data-v-d5c2db1a]{right:6%\n}\n.slider-indicator-icon[data-v-d5c2db1a]{display:inline-block;width:10px;height:10px;margin:0 .1rem;cursor:pointer;border-radius:50%;background-color:rgba(0,0,0,.2)\n}\n.slider-indicator-active[data-v-d5c2db1a]{background-color:rgba(255,255,255,.2)\n}\n.slider-loading[data-v-d5c2db1a]{position:absolute;top:0;left:0;z-index:99;width:100%;height:100%;background:rgba(0,0,0,.1);display:flex;justify-content:center;align-items:center\n}\n.ball-pulse>div[data-v-d5c2db1a]:nth-child(1){animation:scale-data-v-d5c2db1a .75s -.24s infinite cubic-bezier(.2,.68,.18,1.08)\n}\n.ball-pulse>div[data-v-d5c2db1a]:nth-child(2){animation:scale-data-v-d5c2db1a .75s -.12s infinite cubic-bezier(.2,.68,.18,1.08)\n}\n.ball-pulse>div[data-v-d5c2db1a]:nth-child(3){animation:scale-data-v-d5c2db1a .75s 0s infinite cubic-bezier(.2,.68,.18,1.08)\n}\n.ball-pulse>div[data-v-d5c2db1a]{background-color:#fff;width:15px;height:15px;border-radius:100%;margin:2px;animation-fill-mode:both;display:inline-block\n}\n@-moz-keyframes scale-data-v-d5c2db1a{\n0%{transform:scale(1);opacity:1\n}\n45%{transform:scale(.1);opacity:.7\n}\n80%{transform:scale(1);opacity:1\n}\n}\n@-webkit-keyframes scale-data-v-d5c2db1a{\n0%{transform:scale(1);opacity:1\n}\n45%{transform:scale(.1);opacity:.7\n}\n80%{transform:scale(1);opacity:1\n}\n}\n@-o-keyframes scale-data-v-d5c2db1a{\n0%{transform:scale(1);opacity:1\n}\n45%{transform:scale(.1);opacity:.7\n}\n80%{transform:scale(1);opacity:1\n}\n}\n@keyframes scale-data-v-d5c2db1a{\n0%{transform:scale(1);opacity:1\n}\n45%{transform:scale(.1);opacity:.7\n}\n80%{transform:scale(1);opacity:1\n}\n}", map: undefined, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = "data-v-d5c2db1a";
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* component normalizer */
  function __vue_normalize__(
    template, style, script$$1,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    var component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "slider.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) { component.functional = true; }
    }

    component._scopeId = scope;

    {
      var hook;
      if (style) {
        hook = function(context) {
          style.call(this, createInjector(context));
        };
      }

      if (hook !== undefined) {
        if (component.functional) {
          // register for functional component in vue file
          var originalRender = component.render;
          component.render = function renderWithStyleInjection(h, context) {
            hook.call(context);
            return originalRender(h, context)
          };
        } else {
          // inject component registration as beforeCreate hook
          var existing = component.beforeCreate;
          component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
      }
    }

    return component
  }
  /* style inject */
  function __vue_create_injector__() {
    var head = document.head || document.getElementsByTagName('head')[0];
    var styles = __vue_create_injector__.styles || (__vue_create_injector__.styles = {});
    var isOldIE =
      typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

    return function addStyle(id, css) {
      if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

      var group = isOldIE ? css.media || 'default' : id;
      var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

      if (!style.ids.includes(id)) {
        var code = css.source;
        var index = style.ids.length;

        style.ids.push(id);

        if (css.map) {
          // https://developer.chrome.com/devtools/docs/javascript-debugging
          // this makes source maps inside style tags work properly in Chrome
          code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
          // http://stackoverflow.com/a/26603875
          code +=
            '\n/*# sourceMappingURL=data:application/json;base64,' +
            btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
            ' */';
        }

        if (isOldIE) {
          style.element = style.element || document.querySelector('style[data-group=' + group + ']');
        }

        if (!style.element) {
          var el = style.element = document.createElement('style');
          el.type = 'text/css';

          if (css.media) { el.setAttribute('media', css.media); }
          if (isOldIE) {
            el.setAttribute('data-group', group);
            el.setAttribute('data-next-index', '0');
          }

          head.appendChild(el);
        }

        if (isOldIE) {
          index = parseInt(style.element.getAttribute('data-next-index'));
          style.element.setAttribute('data-next-index', index + 1);
        }

        if (style.element.styleSheet) {
          style.parts.push(code);
          style.element.styleSheet.cssText = style.parts
            .filter(Boolean)
            .join('\n');
        } else {
          var textNode = document.createTextNode(code);
          var nodes = style.element.childNodes;
          if (nodes[index]) { style.element.removeChild(nodes[index]); }
          if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
          else { style.element.appendChild(textNode); }
        }
      }
    }
  }
  /* style inject SSR */
  

  
  var Slider = __vue_normalize__(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    __vue_create_injector__,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//
//
//
//

var script$1 = {
  name: 'SliderItem',
  data: function data() {
    return {
      display: false,
      isInit: false,
      direction: false,
      animation: 'normal',
      speed: 500,
      zIndex: 99,
    }
  },

  created: function created() {
    this.$parent.$emit('slider:init');
    this.speed = this.$parent.speed;
    this.animation = this.$parent.animation;
  },

  methods: {
    init: function init() {
      var this$1 = this;

      this.isInit = true;
      this.display = true;
      this.$nextTick(function () { return (this$1.isInit = false); });
    },
    // direction: left: true, right: false
    show: function show(direction) {
      var this$1 = this;

      this.zIndex = 99;
      this.direction = direction;
      this.$nextTick(function () { return (this$1.display = true); });
    },
    hide: function hide(direction) {
      var this$1 = this;

      this.zIndex = 98;
      this.direction = direction;
      this.$nextTick(function () { return (this$1.display = false); });
    },
  },
};

/* script */
            var __vue_script__$1 = script$1;
            
/* template */
var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":_vm.isInit ? '' : (_vm.animation + "-" + (_vm.direction ? 'left' : 'right'))}},[(_vm.display)?_c('div',_vm._g(_vm._b({staticClass:"slider-item",style:({ zIndex: _vm.zIndex, transition: ("all " + (_vm.speed / 1000) + "s") })},'div',_vm.$attrs,false),_vm.$listeners),[_vm._t("default")],2):_vm._e()])};
var __vue_staticRenderFns__$1 = [];

  /* style */
  var __vue_inject_styles__$1 = function (inject) {
    if (!inject) { return }
    inject("data-v-4393fdb9_0", { source: "\n.slider-item[data-v-4393fdb9]{position:absolute;top:0;left:0;width:100%;height:100%\n}\n.normal-left-leave-to[data-v-4393fdb9],.normal-right-enter[data-v-4393fdb9]{transform:translateX(-100%)\n}\n.normal-left-enter[data-v-4393fdb9],.normal-right-leave-to[data-v-4393fdb9]{transform:translateX(100%)\n}\n.fade-left-enter[data-v-4393fdb9],.fade-left-leave-to[data-v-4393fdb9],.fade-right-enter[data-v-4393fdb9],.fade-right-leave-to[data-v-4393fdb9]{opacity:0\n}\n.fade-left-leave-to[data-v-4393fdb9],.fade-right-enter[data-v-4393fdb9]{transform:translateX(-10px)\n}\n.fade-left-enter[data-v-4393fdb9],.fade-right-leave-to[data-v-4393fdb9]{transform:translateX(10px)\n}", map: undefined, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__$1 = "data-v-4393fdb9";
  /* module identifier */
  var __vue_module_identifier__$1 = undefined;
  /* functional template */
  var __vue_is_functional_template__$1 = false;
  /* component normalizer */
  function __vue_normalize__$1(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    var component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "slider-item.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) { component.functional = true; }
    }

    component._scopeId = scope;

    {
      var hook;
      if (style) {
        hook = function(context) {
          style.call(this, createInjector(context));
        };
      }

      if (hook !== undefined) {
        if (component.functional) {
          // register for functional component in vue file
          var originalRender = component.render;
          component.render = function renderWithStyleInjection(h, context) {
            hook.call(context);
            return originalRender(h, context)
          };
        } else {
          // inject component registration as beforeCreate hook
          var existing = component.beforeCreate;
          component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
      }
    }

    return component
  }
  /* style inject */
  function __vue_create_injector__$1() {
    var head = document.head || document.getElementsByTagName('head')[0];
    var styles = __vue_create_injector__$1.styles || (__vue_create_injector__$1.styles = {});
    var isOldIE =
      typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

    return function addStyle(id, css) {
      if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

      var group = isOldIE ? css.media || 'default' : id;
      var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

      if (!style.ids.includes(id)) {
        var code = css.source;
        var index = style.ids.length;

        style.ids.push(id);

        if (css.map) {
          // https://developer.chrome.com/devtools/docs/javascript-debugging
          // this makes source maps inside style tags work properly in Chrome
          code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
          // http://stackoverflow.com/a/26603875
          code +=
            '\n/*# sourceMappingURL=data:application/json;base64,' +
            btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
            ' */';
        }

        if (isOldIE) {
          style.element = style.element || document.querySelector('style[data-group=' + group + ']');
        }

        if (!style.element) {
          var el = style.element = document.createElement('style');
          el.type = 'text/css';

          if (css.media) { el.setAttribute('media', css.media); }
          if (isOldIE) {
            el.setAttribute('data-group', group);
            el.setAttribute('data-next-index', '0');
          }

          head.appendChild(el);
        }

        if (isOldIE) {
          index = parseInt(style.element.getAttribute('data-next-index'));
          style.element.setAttribute('data-next-index', index + 1);
        }

        if (style.element.styleSheet) {
          style.parts.push(code);
          style.element.styleSheet.cssText = style.parts
            .filter(Boolean)
            .join('\n');
        } else {
          var textNode = document.createTextNode(code);
          var nodes = style.element.childNodes;
          if (nodes[index]) { style.element.removeChild(nodes[index]); }
          if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
          else { style.element.appendChild(textNode); }
        }
      }
    }
  }
  /* style inject SSR */
  

  
  var SliderItem = __vue_normalize__$1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    __vue_create_injector__$1,
    undefined
  );

var plugin = {
  // eslint-disable-next-line no-undef
  version: "5.2.7",
  install: function install(Vue) {
    Vue.component(Slider.name, Slider);
    Vue.component(SliderItem.name, SliderItem);
  },
};

var GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

export default plugin;
export { Slider, SliderItem };
