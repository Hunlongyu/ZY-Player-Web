<template>
  <el-container class="container">
    <!-- 顶部操作按钮 -->
    <el-header class="header">
      <el-button v-show="show.player" @click="linkBtnEvent" icon="el-icon-link" circle :title="t('title.link')"></el-button>
      <el-button @click="historyBtnEvent" icon="el-icon-time" circle :title="t('title.history')"></el-button>
      <el-button @click="starBtnEvent" icon="el-icon-star-off" circle :title="t('title.star')"></el-button>
      <el-button @click="settingBtnEvent" icon="el-icon-setting" circle :title="t('title.setting')"></el-button>
    </el-header>
    <!-- 播放器 -->
    <el-main>
      <el-row class="input-box" type="flex" v-show="!show.player">
        <el-col :lg="10" :md="12" :sm="16" :xs="24">
          <el-input :placeholder="t('url.input')" v-model.trim="url.input" @keydown.enter="enterEvent" clearable>
            <template #append>
              <el-button @click="enterEvent" icon="el-icon-video-play" :title="t('title.play')"></el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <el-row class="player-box" type="flex" v-show="show.player">
        <el-col :lg="10" :md="12" :sm="16" :xs="24" class="box">
          <Player playsinline controls autoplay :currentTime="currentTime" @vmCurrentTimeChange="onTimeUpdate" ref="player">
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
    <!-- 抽屉：播放记录 -->
    <el-drawer :title="t('title.history')" :size="size" v-model="show.history" direction="rtl">
      <span>lala</span>
    </el-drawer>
    <!-- 抽屉：收藏夹 -->
    <el-drawer :title="t('title.star')" :size="size" v-model="show.star" direction="rtl">
      <span>lala</span>
    </el-drawer>
    <!-- 抽屉：设置 -->
    <el-drawer :title="t('title.setting')" :size="size" v-model="show.setting" direction="rtl">
      <span>lala</span>
    </el-drawer>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Player, Video, Hls } from '@vime/vue-next'
import '@vime/core/themes/default.css'
import { ElMessage } from 'element-plus'
import { historyDB, starDB, settingDB } from './database/dexie'
import { IHistory, IStar, ISetting } from './database/types'
import { throttle } from 'lodash'
import dayjs from 'dayjs'

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
      hls: 'https://zk2.cdt-md.com/2020/12/03/TDJL3BvExyg0muZr/playlist.m3u8',
      mp4: '',
      name: '',
      host: ''
    })
    const show = reactive({
      history: false,
      star: false,
      setting: false,
      player: true,
      hls: true,
      mp4: false
    })
    const setting = reactive({
      language: 'cn',
      history: false
    })
    const star = ref<IStar[]>([])
    const history = ref<IHistory[]>([])
    const size = ref('100%')

    const currentTime = ref(0)

    const mp4url = 'https://media.vimejs.com/720p.mp4'
    const m3u8Url = 'https://zk2.cdt-md.com/2020/12/03/TDJL3BvExyg0muZr/playlist.m3u8'

    const player = ref<HTMLVmPlayerElement | null>(null)

    // 获取链接的参数
    function getUrlParam (e: string) {
      const reg = new RegExp('(^|&)' + e + '=([^&]*)(&|$)', 'i')
      const r = window.location.search.substr(1).match(reg)
      if (r !== null) return decodeURI(r[2])
      return null
    }
    // 进入页面首先获取链接里的参数
    function getUrlInfo () {
      url.input = getUrlParam('url') || ''
      url.name = getUrlParam('name') || ''
      url.host = getUrlParam('host') || ''
      if (url.input !== '') {
        enterEvent()
      }
    }
    // 返回输入框
    function linkBtnEvent () {
      show.player = false
      show.hls = false
      show.mp4 = false
    }
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
    // 通过判断设置抽屉的宽度
    function getWinSize () {
      const w = window.screen.width
      if (w <= 768) {
        size.value = '100%'
      } else {
        size.value = '50%'
      }
    }
    // 历史记录按钮点击事件
    function historyBtnEvent () {
      show.history = true
      getHistory()
    }
    // 收藏记录按钮点击事件
    function starBtnEvent () {
      show.star = true
      getStar()
    }
    // 设置按钮点击事件
    function settingBtnEvent () {
      show.setting = true
      getSetting()
    }
    // 获取用户设置
    async function getSetting () {
      const res = await settingDB.find()
      if (res) {
        setting.language = res.language
        setting.history = res.history
      }
    }
    // 获取收藏夹
    async function getStar () {
      const res = await starDB.all()
      if (res) {
        star.value = res
      }
    }
    // 获取播放记录
    async function getHistory() {
      const res = await historyDB.all()
      if (res) {
        history.value = res
      }
    }
    // 播放进度更新事件
    function onTimeUpdate (time: any) {
      currentTime.value = time
      if (setting.history) {
        historyUpdate()
      }
    }
    // 播放时更新历史记录里数据
    const historyUpdate = throttle(async () => {
      const h = await historyDB.find(url.input)
      const doc = {
        name: 'name',
        url: url.input,
        host: url.host,
        date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        time: currentTime.value
      }
      if (h && h.id) {
        historyDB.update(h.id, doc)
      } else {
        historyDB.add(doc)
      }
    }, 5000)

    onMounted(() => {
      getUrlInfo()
      getSetting()
      window.onresize = () => {
        getWinSize()
      }
    })

    return {
      t,
      locale,
      url,
      show,
      player,
      size,
      currentTime,
      linkBtnEvent,
      historyBtnEvent,
      starBtnEvent,
      settingBtnEvent,
      enterEvent,
      onTimeUpdate
    }
  }
})
</script>
<style lang="scss">
@import "./assets/scss/main.scss";
</style>
