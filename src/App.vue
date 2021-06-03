<template>
  <el-container class="container">
    <el-header class="header">
      <el-button @click="historyBtnEvent" icon="el-icon-time" circle></el-button>
      <el-button @click="starBtnEvent" icon="el-icon-star-off" circle></el-button>
      <el-button @click="settingBtnEvent" icon="el-icon-setting" circle></el-button>
    </el-header>
    <el-main>
      <el-row class="main" type="flex">
        <el-col :lg="10" :md="12" :sm="16" :xs="24">
          <el-input placeholder="请输入内容" v-model="uri">
            <template #append>
              <el-button icon="el-icon-video-play"></el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'App',
  setup () {
    const { t, locale } = useI18n()
    const uri = ref('')

    function historyBtnEvent () {}
    function starBtnEvent () {}
    function settingBtnEvent () {}

    return {
      t,
      locale,
      uri,
      historyBtnEvent,
      starBtnEvent,
      settingBtnEvent
    }
  }
})
</script>
<style lang="scss">
@import "./assets/scss/main.scss";
</style>
