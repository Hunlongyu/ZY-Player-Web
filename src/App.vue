<template>
  <vs-row id="app" vs-w="12">
    <vs-col vs-type="flex" vs-justify="center" vs-lg="1" vs-sm="1" vs-xs="1" >
      <span class="menu" @click="sideActive=!sideActive">
        <vs-icon icon="menu"></vs-icon>
      </span>
    </vs-col>
    <vs-sidebar parent="body" default-index="1" color="primary" class="sidebarx" spacer v-model="sideActive">
      <h3>资源播放器</h3>
      <p>一个极简的资源播放器，支持 m3u8、mp4 两种格式的视频资源。操作简单，无广告，自适应移动端。</p>
      <h4>资源网站：</h4>
      <p class="alink"><a href="http://zuidazy.net/">最大资源网</a></p>
      <p class="alink"><a href="http://www.okzyw.com/">OK资源网</a></p>
      <p class="alink"><a href="http://www.172zy.net/">172资源网</a></p>
      <p class="alink"><a href="http://www.1977zy.com/">1977资源网</a></p>
      <h4>使用说明：</h4>
      <p>方式一：直接在输入框内，粘贴正确的视频资源链接，敲击回车键，即可自动缓冲播放。</p>
      <p>方式二：配合 <a href="https://greasyfork.org/zh-CN/scripts/383642-%E5%B0%8F%E5%8A%A9%E6%89%8B-%E8%B5%84%E6%BA%90%E6%92%AD%E6%94%BE">『小助手』 资源播放</a> 脚本使用。该方法需要安装 <a href="https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo"> Tampermonkey </a>浏览器插件（插件和脚本安装方法自行百度）。推荐使用这种方式！</p>
      <h4>免责声明：</h4>
      <p>该网站只提供播放功能，仅用于技术交流学习。</p>
    </vs-sidebar>
    <vs-col id="search" vs-type="flex" vs-justify="center" vs-align="center" vs-lg="10" vs-sm="10" vs-xs="10">
      <vs-row>
        <vs-col vs-w="12" :class="playing === true ? 'ani-top' : 'ani-center'">
          <vs-input size="large" :label-placeholder="Nombre" v-model="url" @keydown.enter="enterEvent"/>
        </vs-col>
        <vs-col vs-w="12" :class="playing === true ? 'ani-in' : 'ani-out'" ref="playBox">
          <p class="title" v-show="title !== null && playing === true">{{ title }}</p>
          <div id="xg" v-show="playing"></div>
        </vs-col>
      </vs-row>
    </vs-col>
    <vs-col vs-type="flex" vs-justify="center" vs-lg="1" vs-sm="1" vs-xs="1">
      <span class="inclusive" @click="switchEvent" v-show="playing">
        <vs-icon icon="all_inclusive"></vs-icon>
      </span>
    </vs-col>
  </vs-row>
</template>
<script>
import Player from 'xgplayer'
import Hls from 'xgplayer-hls.js'
export default {
  name: 'app',
  data () {
    return {
      sideActive: false,
      Nombre: '粘贴资源链接后，按回车键播放！',
      xg: null,
      url: null,
      title: null,
      playing: false,
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
  methods: {
    getParam (e) {
      let reg = new RegExp('(^|&)' + e + '=([^&]*)(&|$)', 'i')
      let r = window.location.search.substr(1).match(reg)
      if (r !== null) return decodeURI(r[2])
      return null
    },
    getInfo () {
      this.url = this.getParam('url')
      this.title = this.getParam('title')
      if (this.url) {
        this.playUrl(this.url)
      }
    },
    enterEvent () {
      if (this.url === null) {
        this.$vs.notify({
          time: 6000,
          title: '请输入资源链接',
          text: '请注意资源格式，目前该网站支持 m3u8 和 mp4 格式的视频资源。',
          color: 'warning'
        })
        return false
      }
      if (this.url.indexOf('.m3u8') !== -1 || this.url.indexOf('.mp4') !== -1) {
        this.playUrl(this.url)
        this.url = null
        this.$vs.notify({
          time: 6000,
          title: '读取资源成功',
          text: '请耐心等待资源加载，缓冲成功后自动播放。若无法自动播放，请手动点击播放。如果播放失败，可能是资源失效了，换个资源试试。',
          color: 'success'
        })
      } else {
        this.$vs.notify({
          time: 6000,
          title: '链接错误',
          text: '请检查资源格式是否正确，目前该网站支持 m3u8 和 mp4 格式的视频资源。',
          color: 'danger'
        })
      }
    },
    playUrl (url) {
      this.config.url = this.url
      this.playing = true
      if (url.indexOf('mp4') !== -1) {
        this.xg = new Player(this.config)
      }
      if (url.indexOf('m3u8') !== -1) {
        this.xg = new Hls(this.config)
      }
      _hmt.push(['_trackEvent', 'video', 'play', this.title, url])
    },
    switchEvent () {
      if (this.xg) {
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
        }, 10)
      }
      this.playing = !this.playing
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>

<style lang="scss">
html,body,#app{
  height: 100%;
  font-family: 'Microsoft YaHei','SF Pro Display',Roboto,Noto,Arial,'PingFang SC',sans-serif;
  .menu, .inclusive{
    margin-top: 20px;
    cursor: pointer;
  }
  .sidebarx{
    h3, h4, p{
      margin-left: 8px;
      margin-right: 8px;
      color: #666;
    }
    h4 {
      margin-top: 10px;
    }
    p{
      font-size: 14px;
      text-indent: 28px;
    }
    .alink{
      text-indent: 0px;
      font-size: 14px;
      margin-top: 6px;
    }
  }
  .ani-top {
    animation: fade-out-top 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }
  @keyframes fade-out-top {
    0% {
      -webkit-transform: translateY(0);
              transform: translateY(0);
      opacity: 1;
    }
    100% {
      -webkit-transform: translateY(-100px);
              transform: translateY(-100px);
      opacity: 0;
    }
  }
  .ani-center {
    animation: fade-in-top 0.7s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  }
  @keyframes fade-in-top {
    0% {
      -webkit-transform: translateY(-100px);
              transform: translateY(-100px);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateY(0);
              transform: translateY(0);
      opacity: 1;
    }
  }
  .ani-in {
    animation: slide-in-fwd-center 1.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }
  @keyframes slide-in-fwd-center {
    0% {
      -webkit-transform: translateZ(-1400px);
              transform: translateZ(-1400px);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateZ(0);
              transform: translateZ(0);
      opacity: 1;
    }
  }
  .ani-out {
    animation: slide-out-bck-center 1.4s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
  }
  @keyframes slide-out-bck-center {
    0% {
      -webkit-transform: translateZ(0);
              transform: translateZ(0);
      opacity: 1;
    }
    100% {
      -webkit-transform: translateZ(-1400px);
              transform: translateZ(-1400px);
      opacity: 0;
    }
  }
  .vs-input{
    width: 100%;
  }
  .title{
    color: #666;
  }
  #xg{
    margin-top: 4px;
  }
}
</style>
