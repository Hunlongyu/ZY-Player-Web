<template>
  <div id="app" class="pure-g">
    <div class="pure-u-1-5"></div>
    <div class="pure-u-3-5">
      <div class="search pure-form">
        <input type="text" class="search-box" placeholder="Please input link ..." v-model="url" @keydown.enter="switchUrl">
        <button class="pure-button search-btn" @click="switchUrl">Play !</button>
      </div>
      <div class="player" ref="player">
        <div class="title" v-show="title !== null">{{title}}</div>
        <div id="xg"></div>
      </div>
    </div>
    <div class="pure-u-1-5">
      <div class="aboutBtn" @click="openAbout">=</div>
    </div>
    <about ref="about" />
  </div>
</template>
<script>
import Player from 'xgplayer'
import Hls from 'xgplayer-hls.js'
import about from './components/about'
export default {
  name: 'app',
  data () {
    return {
      xg: null,
      url: null,
      title: null,
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
    getParam (name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      let r = window.location.search.substr(1).match(reg)
      if (r !== null) return decodeURI(r[2])
      return null
    },
    getUrl () {
      this.url = this.getParam('url')
      this.title = this.getParam('title')
      if (this.url) {
        this.playUrl(this.url)
        this.url = null
      }
    },
    switchUrl () {
      if (this.url && this.xg) {
        this.xg.destroy()
        let timer = setTimeout(() => {
          this.xg = null
          let div = document.createElement('div')
          div.id = 'xg'
          this.$refs.player.appendChild(div)
          this.playUrl(this.url)
          this.url = null
          this.title = null
          clearTimeout(timer)
        }, 0)
      } else {
        this.playUrl(this.url)
        this.url = null
      }
    },
    playUrl (url) {
      this.config.url = url
      if (url.indexOf('mp4') !== -1) {
        this.xg = new Player(this.config)
      }
      if (url.indexOf('m3u8') !== -1) {
        this.xg = new Hls(this.config)
      }
      _hmt.push(['_trackEvent', 'video', 'play', this.title, url])
    },
    openAbout () {
      this.$refs.about.show = true
    }
  },
  mounted () {
    this.getUrl()
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
    #xg{
      margin-top: 6px;
    }
  }
  .aboutBtn{
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 0.6em 1em;
    cursor: pointer;
    border-radius: 2px;
    background-color: #eee;
    user-select: none;
    &:hover{
      background-color: #e6e6e6;
    }
  }
}
</style>
