<template>
  <div class="about pure-u-1-5" v-show="show">
    <article class="content">
      <div class="close" @click="close">+</div>
      <h3>使用方式：</h3>
      <p>第一种：直接在输入框内填写正确的 m3u8 视频链接，按回车键或者点击 Play ! 按钮，即可缓冲播放视频。</p>
      <p>第二种：配合 <a href="" target="_blank">m3u8资源助手</a> 脚本使用。需要安装 Tampermonkey 浏览器扩展插件。推荐这种！</p>
      <h3>资源网站：</h3>
      <p><a href="http://zuidazy.net/" target="_blank">最大资源网：http://zuidazy.net/</a></p>
      <p><a href="http://www.okzyw.com/" target="_blank">OK资源网：http://www.okzyw.com/</a></p>
      <p><a href="http://www.172zy.net/" target="_blank">172资源网：http://www.172zy.net/</a></p>
      <p><a href="http://www.1977zy.com/" target="_blank">1977资源网：http://www.1977zy.com/</a></p>
      <h3>免责声明：</h3>
      <p>该网站只提供播放功能，用于学习交流。</p>
    </article>
  </div>
</template>
<script>
export default {
  data () {
    return {
      show: false
    }
  },
  methods: {
    close () {
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
.about{
  position: absolute;
  top: 0;
  right: 0;
  background-color: #fff;
  .content{
    padding: 20px;
  }
  .close{
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
