# Vue Easy Slider

## Intro

vue-easy-slider is a slider component of Vue 2.x with touch swipe support

## Demo

[Demo](https://shhdgit.github.com/vue-easy-slider/)

## Usage

Work on a Vue instance:

### npm

```JavaScript
import Vue from 'vue'
import Slider from 'vue-easy-slider'

Vue.use(Slider)
```

### browser

Just link the script and you are ready to go.

## HTML

```HTML
<slider :interval="1000" ><!-- specify options-->
  <!-- Compose your own slides with any content-->
  <div v-for="slide in slides" :key="slide.title">
    <span v-html="slide.title"></span>
    <img :title="slide.title" :src="slide.img"/>
  </div>
</slider>
```

## Options

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
      <td>Boolean</td>
      <td>true</td>
      <td>Show indicator buttons</td>
    </tr>
    <tr>
      <td>controls</td>
      <td>Boolean</td>
      <td>true</td>
      <td>Show control buttons</td>
    </tr>
    <tr>
      <td>animation</td>
      <td>String</td>
      <td>slide-right</td>
      <td>animation class, you can write your own custom animation following vuejs animation style guidelines.</td>
    </tr>
    <tr>
      <td>pauseOnHover</td>
      <td>Boolean</td>
      <td>true</td>
      <td>Pause the animation while mouse hover</td>
    </tr>
  </tbody>
</table>

## License

MIT
