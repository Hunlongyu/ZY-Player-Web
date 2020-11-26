<template>
  <div id="app">
    <div class="header">
      <KPCButton icon circle @click="historyBtnEvent"><KPCIcon class="ion-ios-clock-outline" /></KPCButton>
      <KPCButton icon circle @click="starBtnEvent"><KPCIcon class="ion-ios-heart-outline" /></KPCButton>
      <KPCButton icon circle @click="settingBtnEvent"><KPCIcon class="ion-ios-gear" /></KPCButton>
    </div>
    <div class="body">
      <div class="input" v-show="!show.player">
        <KPCInput v-model="url" placeholder="请输入播放链接..." clearable>
          <template slot="append">
            <KPCButton icon type="none">
              <KPCIcon class="ion-play" />
            </KPCButton>
          </template>
        </KPCInput>
      </div>
      <div class="box" v-show="show.player">
        <div class="xgplayer" id="xgplayer"></div>
      </div>
    </div>
    <KPCDrawer v-model="show.history" title="播放记录" ref="history">
      播放记录
    </KPCDrawer>
    <KPCDrawer v-model="show.star" title="收藏夹" ref="star">
      收藏夹
    </KPCDrawer>
    <KPCDrawer v-model="show.setting" title="设置" ref="setting">
      设置
    </KPCDrawer>
  </div>
</template>

<script>
import KPCButton from 'kpc-vue/components/button'
import KPCDrawer from 'kpc-vue/components/drawer'
import KPCIcon from 'kpc-vue/components/icon'
import KPCInput from 'kpc-vue/components/input'
import 'xgplayer'
import Hls from 'xgplayer-hls.js'
export default {
  name: 'App',
  data () {
    return {
      show: {
        history: false,
        star: false,
        setting: false,
        player: true
      },
      url: '',
      xg: null,
      config: {
        id: 'xgplayer',
        url: '',
        lang: 'zh-cn',
        width: '100%',
        height: '100%',
        autoplay: false,
        videoInit: true,
        screenShot: true,
        keyShortcut: 'off',
        crossOrigin: true,
        cssFullscreen: true,
        defaultPlaybackRate: 1,
        playbackRate: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4, 5],
        playPrev: true,
        playNextOne: true,
        videoStop: true,
        showList: true,
        showHistory: true,
        quitMiniMode: true,
        videoTitle: true,
        airplay: true,
        closeVideoTouch: true,
        ignores: ['cssFullscreen']
      }
    }
  },
  components: {
    KPCButton, KPCIcon, KPCDrawer, KPCInput
  },
  methods: {
    historyBtnEvent () {
      this.show.history = !this.show.history
    },
    starBtnEvent () {
      this.show.star = !this.show.star
    },
    settingBtnEvent () {
      this.show.setting = !this.show.setting
    }
  },
  mounted () {
    this.xg = new Hls(this.config)
  }
}
</script>

<style lang="scss">
@import "./assets/main.scss";
@import "./assets/mobile.scss";
</style>
