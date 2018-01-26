## Intro

vue-easy-slider is a slider component of Vue 2.x

## Demo

[demo](https://jsfiddle.net/su9zv0w9/69/)

## Install

```bash
npm i -S vue-easy-slider
```

## Usage

Work on a Vue instance:

```HTML
<slider animation="fade">
  <slider-item v-for="(i, index) in list" :key="index">
    <div :style="i">
      <p style="line-height: 280px; font-size: 5rem; text-align: center;">Page{{ index + 1 }}</p>
    </div>
  </slider-item>
</slider>
```

```JavaScript
import { Slider, SliderItem } from 'vue-easy-slider'

new Vue( {
  el: 'body',
  data () {
    return {
      list: [
        { backgroundColor: '#3f51b5', width: '100%', height: '100%' },
        { backgroundColor: '#eee', width: '100%', height: '100%' },
        { backgroundColor: '#f44336', width: '100%', height: '100%' },
      ],
    }
  },
  components: {
    Slider,
    SliderItem
  }
} )
```

## Props

Slider：

|name|type|default|description|
|----|----|-------|-----------|
|width|String|auto|The width of the slider|
|height|String|300px|The height of the slider|
|interval|Number|3000|Delay of auto slider( auto option should be true )|
|speed|Number|300|Speed(ms) of animation|
|auto|Boolean|true|Autoplay|
|indicators|'center', 'left', 'right', false|'center'|Show indicators on option position or hidden|
|control-btn|Boolean|true|Show control button|
|animation|'normal', 'fade'|'normal'|Change animation|
|init-index|Number|0|Index of the initially active slide|
|current-number|Number|-1 (disabled)|Index of current active slide|
|before-next|Function|() => true|Before next guard, sliding to next item when this function return true|
|before-previous|Function|() => true|Before previous guard|

## Events

Slider：

|name|description|$event|
|----|-----------|------|
|changeSlide|Fires when the slide change|$event.index|
|next|Fires when the button for the next slide was pressed|$event.original, $event.next|
|previous|Fires when the button for the previous slide was pressed|$event.original, $event.next|

SliderItem:

|name|description|$event|
|----|-----------|------|
|onClick|Click event||

## Slots

SliderItem：

|name|description|
|----|-----------|
|default|Item content|

usage:

```HTML
<slider>
  <slider-item>
    <div>
      <img src="">
      <p></p>
      <button></button>
    </div>
  </slider-item>
</slider>
```

# License

MIT
