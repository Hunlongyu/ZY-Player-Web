<template>
  <el-container class="container">
    <!-- 顶部操作按钮 -->
    <el-header class="header">
      <el-dropdown class="language" @command="handleCommand">
        <span class="el-dropdown-link">
          {{t('lang.select')}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="cn">{{t('lang.cn')}}</el-dropdown-item>
            <el-dropdown-item command="en">{{t('lang.en')}}</el-dropdown-item>
            <el-dropdown-item command="zh-tw">{{t('lang.zh-tw')}}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
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
          <!-- autoplay -->
          <Player playsinline controls :currentTime="currentTime" @vmCurrentTimeChange="onTimeUpdate" ref="player">
            <Video v-if="show.mp4">
              <source :data-src="url.mp4" type="video/mp4" />
            </Video>
            <Hls v-if="show.hls" :disableRemotePlayback="true" version="latest">
              <source :data-src="url.hls" type="application/x-mpegURL" />
            </Hls>
          </Player>
          <span @click="addStar">
            <svg t="1606442580426" :title="t('title.star')" class="icon-star" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3119" width="21" height="21"><path d="M755.2 64c-107.616 0-200.256 87.552-243.168 179.008C469.088 151.552 376.448 64 268.8 64 120.416 64 0 184.448 0 332.832c0 301.856 304.512 380.992 512.032 679.424C708.192 715.68 1024 625.056 1024 332.832 1024 184.448 903.584 64 755.2 64z" p-id="3120" fill="#ffffff"></path></svg>
          </span>
        </el-col>
      </el-row>
    </el-main>
    <!-- 抽屉：播放记录 -->
    <el-drawer :title="t('title.history')" :size="size" v-model="show.history" direction="rtl">
      <el-table :data="db.history" stripe height="100%" fit>
        <el-table-column prop="name" :label="t('title.name')" show-overflow-tooltip></el-table-column>
        <el-table-column prop="date" :label="t('title.date')" show-overflow-tooltip></el-table-column>
        <el-table-column :label="t('title.operate')">
          <template #default="scope">
            <el-button size="mini" @click="historyHandlePlay(scope.row)" icon="el-icon-video-play" circle></el-button>
            <el-button size="mini" @click="hostHandleOpen(scope.row)" icon="el-icon-position" circle></el-button>
            <el-button size="mini" @click="historyHandleDelete(scope.row)" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
    <!-- 抽屉：收藏夹 -->
    <el-drawer :title="t('title.star')" :size="size" v-model="show.star" direction="rtl">
      <el-table :data="db.star" stripe height="100%" fit>
        <el-table-column prop="name" :label="t('title.name')" show-overflow-tooltip></el-table-column>
        <el-table-column prop="date" :label="t('title.date')" show-overflow-tooltip></el-table-column>
        <el-table-column :label="t('title.operate')">
          <template #default="scope">
            <el-button size="mini" @click="starHandlePlay(scope.row)" icon="el-icon-video-play" circle></el-button>
            <el-button size="mini" @click="hostHandleOpen(scope.row)" icon="el-icon-position" circle></el-button>
            <el-button size="mini" @click="starHandleDelete(scope.row)" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
    <!-- 抽屉：设置 -->
    <el-drawer :title="t('title.setting')" :size="size" v-model="show.setting" direction="rtl">
      <div class="setting-body">
        <div class="logo">
          <img src="./assets/img/logo.png" alt="">
          <h2>ZY Player Web</h2>
          <p>
            <a href="https://github.com/Hunlongyu/ZY-Player-Web" target="_blank">Github</a>
            <a href="https://github.com/Hunlongyu/ZY-Player-Web/issues" target="_blank">{{t('setting.issues')}}</a>
            <a href="https://github.com/Hunlongyu/ZY-Player" target="_blank">{{t('setting.pc')}}</a>
            <a href="https://github.com/Hunlongyu/ZY-Player-APP" target="_blank">{{t('setting.mobile')}}</a>
          </p>
        </div>
        <div class="setting-item">
          <el-button size="small" @click="clearHistory">{{t('setting.clear-history')}}</el-button>
          <el-button size="small" @click="clearStar">{{t('setting.clear-star')}}</el-button>
        </div>
      </div>
    </el-drawer>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Player, Video, Hls } from '@vime/vue-next'
import '@vime/core/themes/default.css'
import { ElMessage } from 'element-plus'
import { historyDB, starDB, settingDB } from './database/dexie'
import { IHistory, IStar } from './database/types'
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
      hls: '',
      mp4: '',
      name: '',
      host: ''
    })
    const show = reactive({
      history: false,
      star: false,
      setting: false,
      player: false,
      hls: false,
      mp4: false
    })
    const setting = reactive({
      language: 'cn',
      history: false
    })
    const db = reactive({
      star: [] as IStar[],
      history: [] as IHistory[]
    })
    const size = ref('100%')

    const currentTime = ref(0)

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
        checkHistory(url.input)
      } else if (url.input.indexOf('.mp4') !== -1) {
        show.hls = false
        url.mp4 = url.input
        show.player = true
        show.mp4 = true
        checkHistory(url.input)
      } else {
        ElMessage.warning(t('url.incorrect'))
      }
    }
    // 播放前检查是否有历史记录，跳转到历史的时间节点上
    async function checkHistory (url: string) {
      const h = await historyDB.find(url)
      if (h) {
        currentTime.value = h.time
      } else {
        currentTime.value = 0
      }
      await nextTick()
      if (player && player.value) {
        player.value.play()
      }
      checkStar()
    }
    // 通过判断设置抽屉的宽度
    function getWinSize () {
      const w = document.body.offsetWidth
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
        locale.value = res.language
      }
    }
    // 获取收藏夹
    async function getStar () {
      const res = await starDB.all()
      if (res) {
        db.star = res
      }
    }
    // 获取播放记录
    async function getHistory() {
      const res = await historyDB.all()
      if (res) {
        db.history = res
      }
    }
    // 播放进度更新事件
    function onTimeUpdate (time: any) {
      currentTime.value = time
      if (setting.history) {
        historyUpdate(time)
      }
    }
    // 播放时更新历史记录里数据
    const historyUpdate = throttle(async (time) => {
      const h = await historyDB.find(url.input)
      const doc = {
        name: '',
        url: url.input,
        host: url.host,
        date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        time: time
      }
      if (h && h.id) {
        doc.name = h.name
        historyDB.update(h.id, doc)
      } else {
        doc.name = url.name || '- -'
        historyDB.add(doc)
      }
    }, 5000)
    // 播放记录删除
    async function historyHandleDelete (h: IHistory) {
      if (h.id) {
        await historyDB.remove(h.id)
        await getHistory()
        ElMessage.success(t('msg.delete-success'))
      }
    }
    // 点击播放记录播放视频
    async function historyHandlePlay (h: IHistory) {
      if (h.url) {
        url.input = h.url
        enterEvent()
      }
      show.history = false
    }
    // 新窗口打开来源的网址
    function hostHandleOpen (e: IHistory | IStar) {
      if (e.host) {
        window.open(e.host)
      }
    }
    // 点击收藏夹播放视频
    function starHandlePlay (s: IStar) {
      if (s.url) {
        url.input = s.url
        enterEvent()
      }
      show.star = false
    }
    // 收藏夹删除
    async function starHandleDelete (s: IStar) {
      if (s.id) {
        await starDB.remove(s.id)
        await getStar()
        ElMessage.success(t('msg.delete-success'))
      }
    }
    // 检查是否已收藏过
    async function checkStar () {
      const res = await starDB.find(url.input)
      if (res) {
        const dom = document.querySelector('.icon-star')
        dom?.classList.add('active')
      } else {
        const dom = document.querySelector('.icon-star')
        dom?.classList.remove('active')
      }
    }
    // 添加到收藏夹
    async function addStar () {
      const res = await starDB.find(url.input)
      if (res && res.id) {
        starDB.remove(res.id)
      } else {
        const doc = {
          name: url.name || '- -',
          url: url.input,
          host: url.host,
          date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          time: currentTime.value
        }
        starDB.add(doc)
        ElMessage.success(t('msg.star-add'))
      }
      checkStar()
    }
    // 切换语言
    function handleCommand (c: string) {
      locale.value = c
      settingDB.update({ language: c, history: true })
    }
    async function clearHistory () {
      await historyDB.clear()
      ElMessage.success(t('msg.clear-success'))
    }
    async function clearStar () {
      await starDB.clear()
      ElMessage.success(t('msg.clear-success'))
    }

    onMounted(() => {
      getUrlInfo()
      getSetting()
      getWinSize()
      window.onresize = () => {
        getWinSize()
      }
    })

    return {
      db,
      t,
      locale,
      url,
      show,
      size,
      currentTime,
      player,
      linkBtnEvent,
      historyBtnEvent,
      starBtnEvent,
      settingBtnEvent,
      enterEvent,
      onTimeUpdate,
      historyHandlePlay,
      hostHandleOpen,
      historyHandleDelete,
      starHandlePlay,
      starHandleDelete,
      addStar,
      handleCommand,
      clearHistory,
      clearStar
    }
  }
})
</script>
<style lang="scss">
@import "./assets/scss/main.scss";
</style>
