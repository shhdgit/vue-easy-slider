## Intro

vue-easy-slider is a slider component of Vue 2.x

## Demo

[demo](https://jsfiddle.net/su9zv0w9/69/)

## Install

```bash
$ npm i -S vue-easy-slider
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

<table>
  <thead>
  <tr>
    <th>name</th>
    <th>type</th>
    <th>default</th>
    <th>description</th>
  </tr>
  </thead>
  <tbody>
    <tr>
      <td>width</td>
      <td>String</td>
      <td>auto</td>
      <td>The width of the slider</td>
    </tr>
    <tr>
      <td>height</td>
      <td>String</td>
      <td>300px</td>
      <td>The height of the slider</td>
    </tr>
    <tr>
      <td>interval</td>
      <td>Number</td>
      <td>3000</td>
      <td>Delay of auto slider( auto option should be true )</td>
    </tr>
    <tr>
      <td>speed</td>
      <td>Number</td>
      <td>300</td>
      <td>Speed of animation</td>
    </tr>
    <tr>
      <td>auto</td>
      <td>Boolean</td>
      <td>true</td>
      <td>Autoplay</td>
    </tr>
    <tr>
      <td>indicators</td>
      <td>'center', 'left', 'right', false</td>
      <td>'center'</td>
      <td>Show indicators on option position or hidden</td>
    </tr>
    <tr>
      <td>control-btn</td>
      <td>Boolean</td>
      <td>true</td>
      <td>Show control button</td>
    </tr>
    <tr>
      <td>animation</td>
      <td>String - { normal, fade }</td>
      <td>normal</td>
      <td>Change animation</td>
    </tr>
    <tr>
      <td>init-index</td>
      <td>Number</td>
      <td>0</td>
      <td>Index of the initially active slide</td>
    </tr>
  </tbody>
</table>

## Events

Slider：

<table>
  <thead>
  <tr>
    <th>name</th>
    <th>description</th>
    <th>$event</th>
  </tr>
  </thead>
  <tbody>
    <tr>
      <td>changeSlide</td>
      <td>Fires when the slide change</td>
      <td>$event.index</td>
    </tr>
    <tr>
      <td>next</td>
      <td>Fires when the button for the next slide was pressed</td>
      <td>$event.original, $event.next</td>
    </tr>
    <tr>
      <td>previous</td>
      <td>Fires when the button for the previous slide was pressed</td>
      <td>$event.original, $event.next</td>
    </tr>
  </tbody>
</table>

SliderItem:

<table>
  <thead>
  <tr>
    <th>name</th>
    <th>description</th>
    <th>$event</th>
  </tr>
  </thead>
  <tbody>
    <tr>
      <td>onClick</td>
      <td>Click event</td>
      <td></td>
    </tr>
  </tbody>
</table>

## Slots

SliderItem：

<table>
  <thead>
  <tr>
    <th>name</th>
    <th>description</th>
  </tr>
  </thead>
  <tbody>
    <tr>
      <td>default</td>
      <td>Item's content</td>
    </tr>
  </tbody>
</table>

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
