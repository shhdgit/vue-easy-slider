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
  },
  mounted: function mounted() {
    this.init();
  },
  // init when keep-alive
  activated: function activated() {
    this.init();
  },
  beforeDestroy: function beforeDestroy() {
    this.timer && clearInterval(this.timer);
  },
  deactivated: function deactivated() {
    this.timer && clearInterval(this.timer);
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
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"slider",style:({ width: _vm.width, height: _vm.height })},[(!_vm.sliderItems.length)?_vm._t("loading",[_vm._m(0)]):_vm._e(),_vm._v(" "),_c('div',{staticClass:"slider-items"},[_vm._t("default")],2),_vm._v(" "),(_vm.indicators)?_c('div',{class:("slider-indicators slider-indicators-" + _vm.indicators),on:{"click":function($event){$event.stopPropagation();}}},_vm._l((_vm.sliderItems.length),function(i){return _c('span',{key:i,staticClass:"slider-indicator-icon",class:{ 'slider-indicator-active': _vm.currentIndex === i - 1 },on:{"click":function($event){_vm.handleIndicator(i - _vm.currentIndex - 1);}}})})):_vm._e(),_vm._v(" "),(_vm.controlBtn)?[_c('button',{staticClass:"slider-btn slider-btn-left",on:{"click":function($event){$event.stopPropagation();return _vm.prev($event)}}},[_c('i',{staticClass:"slider-icon slider-icon-left"})]),_vm._v(" "),_c('button',{staticClass:"slider-btn slider-btn-right",on:{"click":function($event){$event.stopPropagation();return _vm.next($event)}}},[_c('i',{staticClass:"slider-icon slider-icon-right"})])]:_vm._e()],2)};
var __vue_staticRenderFns__ = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"slider-loading"},[_c('div',{staticClass:"ball-pulse"},[_c('div'),_vm._v(" "),_c('div'),_vm._v(" "),_c('div')])])}];

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-7a3b01b2_0", { source: "\n.slider[data-v-7a3b01b2]{position:relative;overflow:hidden\n}\n.slider-items[data-v-7a3b01b2]{width:100%;height:100%\n}\n.slider-btn[data-v-7a3b01b2]{position:absolute;top:0;z-index:999;height:100%;width:50px;border:none;background:rgba(0,0,0,.1);outline:0;transition:background .3s;cursor:pointer\n}\n.slider-btn:hover .slider-icon[data-v-7a3b01b2]{border-color:#fff\n}\n.slider-btn-left[data-v-7a3b01b2]{left:0;background:linear-gradient(90deg,rgba(0,0,0,.1),rgba(0,0,0,0))\n}\n.slider-btn-right[data-v-7a3b01b2]{right:0;background:linear-gradient(-90deg,rgba(0,0,0,.1),rgba(0,0,0,0))\n}\n.slider-icon[data-v-7a3b01b2]{display:inline-block;width:15px;height:15px;border-left:2px solid rgba(255,255,255,.6);border-bottom:2px solid rgba(255,255,255,.6);transition:border .2s\n}\n.slider-icon-left[data-v-7a3b01b2]{transform:rotate(45deg)\n}\n.slider-icon-right[data-v-7a3b01b2]{transform:rotate(-135deg)\n}\n.slider-indicators[data-v-7a3b01b2]{position:absolute;bottom:20px;z-index:999\n}\n.slider-indicators-center[data-v-7a3b01b2]{left:50%;transform:translateX(-50%)\n}\n.slider-indicators-left[data-v-7a3b01b2]{left:6%\n}\n.slider-indicators-right[data-v-7a3b01b2]{right:6%\n}\n.slider-indicator-icon[data-v-7a3b01b2]{display:inline-block;width:10px;height:10px;margin:0 .1rem;cursor:pointer;border-radius:50%;background-color:rgba(0,0,0,.2)\n}\n.slider-indicator-active[data-v-7a3b01b2]{background-color:rgba(255,255,255,.2)\n}\n.slider-loading[data-v-7a3b01b2]{position:absolute;top:0;left:0;z-index:99;width:100%;height:100%;background:rgba(0,0,0,.1);display:flex;justify-content:center;align-items:center\n}\n.ball-pulse>div[data-v-7a3b01b2]:nth-child(1){animation:scale-data-v-7a3b01b2 .75s -.24s infinite cubic-bezier(.2,.68,.18,1.08)\n}\n.ball-pulse>div[data-v-7a3b01b2]:nth-child(2){animation:scale-data-v-7a3b01b2 .75s -.12s infinite cubic-bezier(.2,.68,.18,1.08)\n}\n.ball-pulse>div[data-v-7a3b01b2]:nth-child(3){animation:scale-data-v-7a3b01b2 .75s 0s infinite cubic-bezier(.2,.68,.18,1.08)\n}\n.ball-pulse>div[data-v-7a3b01b2]{background-color:#fff;width:15px;height:15px;border-radius:100%;margin:2px;animation-fill-mode:both;display:inline-block\n}\n@-moz-keyframes scale-data-v-7a3b01b2{\n0%{transform:scale(1);opacity:1\n}\n45%{transform:scale(.1);opacity:.7\n}\n80%{transform:scale(1);opacity:1\n}\n}\n@-webkit-keyframes scale-data-v-7a3b01b2{\n0%{transform:scale(1);opacity:1\n}\n45%{transform:scale(.1);opacity:.7\n}\n80%{transform:scale(1);opacity:1\n}\n}\n@-o-keyframes scale-data-v-7a3b01b2{\n0%{transform:scale(1);opacity:1\n}\n45%{transform:scale(.1);opacity:.7\n}\n80%{transform:scale(1);opacity:1\n}\n}\n@keyframes scale-data-v-7a3b01b2{\n0%{transform:scale(1);opacity:1\n}\n45%{transform:scale(.1);opacity:.7\n}\n80%{transform:scale(1);opacity:1\n}\n}", map: undefined, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = "data-v-7a3b01b2";
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
    this.$parent.init();
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
    inject("data-v-53d496e1_0", { source: "\n.slider-item[data-v-53d496e1]{position:absolute;top:0;left:0;width:100%;height:100%\n}\n.normal-left-leave-to[data-v-53d496e1],.normal-right-enter[data-v-53d496e1]{transform:translateX(-100%)\n}\n.normal-left-enter[data-v-53d496e1],.normal-right-leave-to[data-v-53d496e1]{transform:translateX(100%)\n}\n.fade-left-enter[data-v-53d496e1],.fade-left-leave-to[data-v-53d496e1],.fade-right-enter[data-v-53d496e1],.fade-right-leave-to[data-v-53d496e1]{opacity:0\n}\n.fade-left-leave-to[data-v-53d496e1],.fade-right-enter[data-v-53d496e1]{transform:translateX(-10px)\n}\n.fade-left-enter[data-v-53d496e1],.fade-right-leave-to[data-v-53d496e1]{transform:translateX(10px)\n}", map: undefined, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__$1 = "data-v-53d496e1";
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

var VueEasySlider = {
  install: function install(Vue) {
    Vue.component(Slider.name, Slider);
    Vue.component(SliderItem.name, SliderItem);
  },
};

export default VueEasySlider;
export { Slider, SliderItem };
