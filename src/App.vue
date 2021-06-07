<template>
  <el-container class="container">
    <el-header class="header">
      <el-button @click="historyBtnEvent" icon="el-icon-time" circle></el-button>
      <el-button @click="starBtnEvent" icon="el-icon-star-off" circle></el-button>
      <el-button @click="settingBtnEvent" icon="el-icon-setting" circle></el-button>
    </el-header>
    <el-main>
      <el-row class="input-box" type="flex" v-show="!show.player">
        <el-col :lg="10" :md="12" :sm="16" :xs="24">
          <el-input placeholder="请输入内容" v-model.trim="uri" @keydown.enter="enterEvent">
            <template #append>
              <el-button @click="enterEvent" icon="el-icon-video-play"></el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <el-row class="player-box" type="flex" v-show="show.player">
        <el-col :lg="10" :md="12" :sm="16" :xs="24" class="box">
          <Player playsinline controls autoplay ref="player" @vPlaybackReady="onPlaybackReady">
            <Video>
              <source data-src="https://media.vimejs.com/720p.mp4" type="video/mp4" />
            </Video>
          </Player>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Player, Video } from '@vime/vue-next'
import '@vime/core/themes/default.css'

export default defineComponent({
  name: 'App',
  components: {
    Player,
    Video
  },
  setup () {
    const { t, locale } = useI18n()
    const uri = ref('') // 用户输入的播放链接
    const show = reactive({
      history: false,
      star: false,
      setting: false,
      player: true
    })

    const player = ref<HTMLVmPlayerElement | null>(null)
    const src = 'https://zk2.cdt-md.com/2020/12/03/TDJL3BvExyg0muZr/playlist.m3u8'
    
    // 历史记录按钮点击事件
    function historyBtnEvent () {}
    // 收藏记录按钮点击事件
    function starBtnEvent () {}
    // 设置按钮点击事件
    function settingBtnEvent () {}
    // 播放事件
    function enterEvent () {}

    function onPlaybackReady () {
      console.log('onPlaybackReady')
    }

    onMounted(() => {})

    return {
      t,
      locale,
      uri,
      player,
      show,
      historyBtnEvent,
      starBtnEvent,
      settingBtnEvent,
      enterEvent,
      onPlaybackReady
    }
  }
})
</script>
<style lang="scss">
@import "./assets/scss/main.scss";
</style>
