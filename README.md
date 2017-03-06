## Intro

vue-easy-slider is a slider component of Vue 2.x（[go 1.x](https://github.com/shhdgit/vue-easy-slider/tree/master)）.

## Demo

[simple](https://jsfiddle.net/su9zv0w9/1/)
[dynamic](https://jsfiddle.net/4nwvy4en/1/)

## Install

```bash
$ npm install --save vue-easy-slider@next
```

## Usage

Work on a Vue instance:

```JavaScript
import { Slider, SliderItem } from 'vue-easy-slider'

new Vue( {
  el: 'body',
  components: {
    Slider,
    SliderItem
  }
} )
```

```HTML
<slider width="800px"
        animation="fade"
        :interval="1000"
        :speed="1000">
  <slider-item :style="{ backgroundColor: '#3f51b5' }"></slider-item>
  <slider-item :style="{ backgroundColor: '#eee' }"></slider-item>
  <slider-item :style="{ backgroundColor: '#f44336' }"></slider-item>
</slider>
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
