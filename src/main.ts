import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import messages from '@intlify/vite-plugin-vue-i18n/messages'
import {
  ElContainer,
  ElHeader,
  ElMain,
  ElRow,
  ElCol,
  ElIcon,
  ElButton,
  ElInput,
  ElDrawer,
  ElTable,
  ElTableColumn,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem
} from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

const i18n = createI18n({
  locale: 'cn',
  messages
})

const app = createApp(App)

app.use(i18n).use(ElContainer).use(ElHeader).use(ElMain)
.use(ElRow).use(ElCol).use(ElIcon).use(ElButton)
.use(ElInput).use(ElDrawer).use(ElTable).use(ElTableColumn)
.use(ElDropdown).use(ElDropdownMenu).use(ElDropdownItem)

app.mount('#app')
