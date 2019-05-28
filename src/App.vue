<template>
  <div id="app" class="pure-g">
    <div class="pure-u-1-5"></div>
    <div class="pure-u-3-5">
      <div class="search pure-form">
        <input type="text" class="search-box" placeholder="Please input link ..." v-model="url" @keydown.enter="switchUrl">
        <button class="pure-button search-btn" @click="switchUrl">Play !</button>
      </div>
      <div class="player" ref="player">
        <div id="xg"></div>
      </div>
    </div>
    <div class="pure-u-1-5">
      <div class="about">About</div>
    </div>
    <about />
  </div>
</template>
<script>
import 'xgplayer'
import Hls from 'xgplayer-hls.js'
import about from './components/about'
import { setTimeout } from 'timers';
export default {
  name: 'app',
  data () {
    return {
      xg: null,
      url: null,
      config: {
        id: 'xg',
        url: null,
        fluid: true,
        autoplay: true,
        keyShortcut: 'on',
        defaultPlaybackRate: 1,
        playbackRate: [0.5, 0.75, 1, 1.5, 2]
      }
    }
  },
  components: {
    about
  },
  methods: {
    switchUrl () {
      if (this.xg) {
        this.xg.destroy()
      }
      let timerOne = setTimeout(() => {
        this.xg =null
        this.config.url = this.url
        let div = document.createElement('div')
        div.id = 'xg'
        this.$refs.player.appendChild(div)
        this.xg = new Hls(this.config)
        this.url = null
      }, 0)
    }
  },
  mounted () {
    this.config.url = 'https://bili.meijuzuida.com/20190131/1249_b02f356f/index.m3u8'
    this.config.url = 'https://iqiyi.qq-zuidazy.com/20190102/4121_f38c099c/index.m3u8'
    this.xg = new Hls(this.config)
  }
}
</script>

<style lang="scss">
#app{
  .search{
    margin-top: 20px;
    text-align: center;
    display: flex;
    justify-content: space-around;
    .search-box{
      flex: 1;
    }
  }
  .player{
    margin-top: 20px;
  }
}
</style>
