<template>
  <div id="app">
    <div class="header">
      <KPCButton icon circle @click="historyBtnEvent"><KPCIcon class="ion-ios-clock-outline" /></KPCButton>
      <KPCButton icon circle @click="starBtnEvent"><KPCIcon class="ion-ios-heart-outline" /></KPCButton>
      <KPCButton icon circle @click="settingBtnEvent"><KPCIcon class="ion-ios-gear" /></KPCButton>
    </div>
    <div class="body">
      <div class="input" v-show="!show.player">
        <KPCInput v-model="vUrl" placeholder="请输入 M3U8 格式的播放链接..." clearable @keydown.enter="enterEvent">
          <template slot="append">
            <KPCButton icon type="none" @click="enterEvent">
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
      <div class="history-header">
        <KPCButton type="warning" @click="historyClear()">清空播放记录</KPCButton>
      </div>
      <div class="history-body">
        <ul>
          <li v-for="(i, j) in list.history" :key="j" @click.stop="historyItemClick(i)">
            <span class="li-name">{{i.name}}</span>
            <a class="li-host" :href="i.host" target="_blank">{{i.host}}</a>
            <span class="li-date">{{i.date}}</span>
            <span class="li-delete" @click.stop="deleteHistory(i)">删除</span>
          </li>
        </ul>
      </div>
    </KPCDrawer>
    <KPCDrawer v-model="show.star" title="收藏夹" ref="star">
      <div class="star-header">
        <KPCButton type="warning" @click="starClear()">清空收藏夹</KPCButton>
      </div>
      <div class="star-body">
        <ul>
          <li v-for="(i, j) in list.star" :key="j" @click.stop="starItemClick(i)">
            <span class="li-name">{{i.name}}</span>
            <a class="li-host" :href="i.host" target="_blank">{{i.host}}</a>
            <span class="li-date">{{i.date}}</span>
            <span class="li-delete" @click.stop="deleteStar(i)">删除</span>
          </li>
        </ul>
      </div>
    </KPCDrawer>
    <KPCDrawer v-model="show.setting" title="设置" ref="setting">
      <div class="setting-body">
        <div class="logo">
          <img src="./assets/logo.png" alt="">
          <h2>ZY Player Web</h2>
          <p>
            <a href="https://github.com/Hunlongyu/ZY-Player-Web" target="_blank">Github</a>
            <a href="https://github.com/Hunlongyu/ZY-Player" target="_blank">电脑端</a>
            <a href="https://github.com/Hunlongyu/ZY-Player-APP" target="_blank">手机端</a>
            <a href="https://github.com/cuiocean/ZY-Player-TV" target="_blank">TV端</a>
          </p>
        </div>
        <div class="setting-item">
          <h3>设置: </h3>
          <p>记录播放历史：<KSwitch v-model="historySwitch" on="开启" off="关闭" width="70" @click="hsChange"/></p>
        </div>
        <div class="setting-item">
          <h3>使用教程: </h3>
          <p>📄 方法一： 直接粘贴 M3U8 格式的播放链接</p>
          <p>📑 方法二（推荐）：配合油猴脚本<a href="https://greasyfork.org/zh-CN/scripts/383642-%E5%B0%8F%E5%8A%A9%E6%89%8B-zy-player-%E8%B5%84%E6%BA%90%E5%8A%A9%E6%89%8B" target="_blank">『小助手』ZY Player 资源助手 </a>使用</p>
        </div>
        <div class="setting-item">
          <h3>声明: </h3>
          <p>所有资源来自网上, 该网站不参与任何制作, 上传, 下载等内容. 该软件仅供学习参考, 请于安装后24小时内删除.</p>
        </div>
      </div>
    </KPCDrawer>
  </div>
</template>

<script>
import KPCButton from 'kpc-vue/components/button'
import KPCDrawer from 'kpc-vue/components/drawer'
import KPCIcon from 'kpc-vue/components/icon'
import KPCInput from 'kpc-vue/components/input'
import Message from 'kpc-vue/components/message'
import { Switch as KSwitch } from 'kpc-vue/components/switch'
import Player from 'xgplayer'
import Hls from 'xgplayer-hls.js'
import { historyDB, starDB, settingDB } from './utils/database/dexie'
export default {
  name: 'App',
  data () {
    return {
      vUrl: '',
      vName: '',
      vHost: '',
      show: {
        history: false,
        star: false,
        setting: false,
        player: false
      },
      list: {
        history: [],
        star: []
      },
      setting: {},
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
        keyShortcut: 'on',
        crossOrigin: true,
        defaultPlaybackRate: 1,
        playbackRate: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4, 5],
        airplay: false
      },
      timer: null,
      historySwitch: false
    }
  },
  components: {
    KPCButton, KPCIcon, KPCDrawer, KPCInput, KSwitch
  },
  methods: {
    getParam (e) {
      const reg = new RegExp('(^|&)' + e + '=([^&]*)(&|$)', 'i')
      const r = window.location.search.substr(1).match(reg)
      if (r !== null) return decodeURI(r[2])
      return null
    },
    getInfo () {
      this.vUrl = this.getParam('url')
      this.vName = this.getParam('name')
      this.vHost = this.getParam('host')
      if (this.vUrl) {
        this.playUrl(this.vUrl)
      }
    },
    playUrl () {
      if (this.vUrl.indexOf('m3u8') !== -1) {
        this.config.url = this.vUrl
        this.show.player = true
        this.xg = new Hls(this.config)
        this.addStarBtn()
        this.videoPlaying()
        return false
      } else {
        Message.warning('输入的链接格式有问题， 请确认后重试。')
      }
    },
    async videoPlaying () {
      this.checkStar()
      const h = await settingDB.find()
      if (!h.history) return false
      const res = await historyDB.find({ url: this.vUrl })
      const doc = {
        name: this.vName,
        url: this.vUrl,
        host: this.vHost,
        date: new Date().toLocaleString(),
        time: 0
      }
      if (res) {
        this.xg.currentTime = res.time
        historyDB.update(res.id, doc)
      } else {
        historyDB.add(doc)
      }
      this.timerEvent()
    },
    timerEvent () {
      this.timer = setInterval(async () => {
        const res = await historyDB.find({ url: this.vUrl })
        if (res) {
          const doc = { ...res }
          doc.time = this.xg.currentTime
          doc.date = new Date().toLocaleString()
          delete doc.id
          await historyDB.update(res.id, doc)
        }
      }, 5000)
    },
    historyBtnEvent () {
      this.show.history = !this.show.history
      this.getHistory()
    },
    starBtnEvent () {
      this.show.star = !this.show.star
      this.getStar()
    },
    settingBtnEvent () {
      this.show.setting = !this.show.setting
      this.getSetting()
    },
    async getSetting () {
      const res = await settingDB.find()
      this.setting = res
      this.historySwitch = res.history
    },
    async getStar () {
      const res = await starDB.all()
      this.list.star = res.reverse()
    },
    async getHistory () {
      const res = await historyDB.all()
      this.list.history = res.reverse()
    },
    async checkStar () {
      const res = await starDB.find({ url: this.vUrl })
      const starDom = document.querySelector('.xgplayer-star')
      if (res) {
        const flag = starDom.classList.contains('active')
        if (!flag) {
          starDom.classList.add('active')
        }
      } else {
        const flag = starDom.classList.contains('active')
        if (flag) {
          starDom.classList.remove('active')
        }
      }
    },
    async starEvent () {
      const res = await starDB.find({ url: this.vUrl })
      if (res) {
        await starDB.remove(res.id)
        Message.success('移除收藏成功。')
      } else {
        await starDB.add({ name: this.vName, url: this.vUrl, host: this.vHost, date: new Date().toLocaleString() })
        Message.success('添加收藏成功。')
      }
      const starDom = document.querySelector('.xgplayer-star')
      starDom.classList.toggle('active')
    },
    addStarBtn () {
      this.xg.on('ready', () => {
        const doms = document.querySelector('.xgplayer-controls').childNodes
        for (const i of doms) {
          const flag = i.classList.contains('xgplayer-star')
          if (flag) return false
        }
        const controlDom = this.xg.controls
        const util = Player.util
        const svg = '<svg t="1606442580426" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3119" width="21" height="21"><path d="M755.2 64c-107.616 0-200.256 87.552-243.168 179.008C469.088 151.552 376.448 64 268.8 64 120.416 64 0 184.448 0 332.832c0 301.856 304.512 380.992 512.032 679.424C708.192 715.68 1024 625.056 1024 332.832 1024 184.448 903.584 64 755.2 64z" p-id="3120" fill="#ffffff"></path></svg>'
        const btn = util.createDom('xg-star', svg, { title: '收藏' }, 'xgplayer-star')
        controlDom.appendChild(btn)
        btn.addEventListener('click', (e) => {
          e.preventDefault()
          e.stopPropagation()
          this.starEvent()
        })
        this.checkStar()
      })
    },
    async starClear () {
      await starDB.clear()
      Message.success('清空收藏夹成功。')
      this.getStar()
    },
    starItemClick (item) {
      this.vUrl = item.url
      this.vName = item.name
      if (this.xg && this.xg.hasStart) {
        this.xg.src = item.url
      } else {
        this.xg.start(item.url)
      }
      document.title = item.name
      this.show.star = false
      this.videoPlaying()
    },
    async historyClear () {
      await historyDB.clear()
      Message.success('清空收藏夹成功。')
      this.getHistory()
    },
    historyItemClick (item) {
      this.vUrl = item.url
      this.vName = item.name
      if (this.xg && this.xg.hasStart) {
        this.xg.src = item.url
      } else {
        this.xg.start(item.url)
      }
      document.title = item.name
      this.show.history = false
      this.videoPlaying()
    },
    async hsChange () {
      const res = await settingDB.find()
      const doc = { ...res }
      doc.history = this.historySwitch
      settingDB.update(doc)
    },
    enterEvent () {
      if (this.vUrl) {
        this.vName = '未知资源' + new Date().getTime()
        this.playUrl()
      } else {
        Message.warning('请输入 M3U8 格式的播放链接。')
      }
    },
    async deleteHistory (item) {
      await historyDB.remove(item.id)
      this.getHistory()
    },
    async deleteStar (item) {
      await starDB.remove(item.id)
      this.getStar()
    }
  },
  mounted () {
    this.getSetting()
    this.getInfo()
  }
}
</script>

<style lang="scss">
@import "./assets/main.scss";
@import "./assets/mobile.scss";
</style>
