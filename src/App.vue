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
          <el-input :placeholder="t('url.input')" v-model.trim="url.input" @keydown.enter="enterEvent">
            <template #append>
              <el-button @click="enterEvent" icon="el-icon-video-play"></el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <el-row class="player-box" type="flex" v-show="show.player">
        <el-col :lg="10" :md="12" :sm="16" :xs="24" class="box">
          <player playsinline controls autoplay ref="player">
            <Video v-if="show.mp4">
              <source :data-src="url.mp4" type="video/mp4" />
            </Video>
            <Hls v-if="show.hls" :disableRemotePlayback="true" version="latest">
              <source :data-src="url.hls" type="application/x-mpegURL" />
            </Hls>
          </Player>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Player, Video, Hls } from '@vime/vue-next'
import '@vime/core/themes/default.css'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'App',
  components: {
    Player,
    Video,
    Hls
  },
  setup () {
    const { t, locale } = useI18n()
    const url = reactive({
      input: '',
      hls: '',
      mp4: ''
    })
    const show = reactive({
      history: false,
      star: false,
      setting: false,
      player: false,
      hls: false,
      mp4: false
    })

    const mp4url = 'https://media.vimejs.com/720p.mp4'
    const m3u8Url = 'https://zk2.cdt-md.com/2020/12/03/TDJL3BvExyg0muZr/playlist.m3u8'

    const player = ref<HTMLVmPlayerElement | null>(null)
    
    // 历史记录按钮点击事件
    function historyBtnEvent () {}
    // 收藏记录按钮点击事件
    function starBtnEvent () {}
    // 设置按钮点击事件
    function settingBtnEvent () {}
    // 播放事件
    function enterEvent () {
      if (url.input === '') {
        ElMessage.warning(t('url.empty'))
        return false
      }
      if (url.input.indexOf('.m3u8') !== -1) {
        show.mp4 = false
        url.hls = url.input
        show.player = true
        show.hls = true
      } else if (url.input.indexOf('.mp4') !== -1) {
        show.hls = false
        url.mp4 = url.input
        show.player = true
        show.mp4 = true
      } else {
        ElMessage.warning(t('url.incorrect'))
      }
    }

    onMounted(() => {
      console.log(player)
    })

    return {
      t,
      locale,
      url,
      show,
      player,
      historyBtnEvent,
      starBtnEvent,
      settingBtnEvent,
      enterEvent
    }
  }
})
</script>
<style lang="scss">
@import "./assets/scss/main.scss";
</style>
