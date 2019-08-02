import Vue from 'vue'
import App from './App.vue'
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css'
import 'material-icons/iconfont/material-icons.css'

Vue.use(Vuesax)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
