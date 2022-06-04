import { createApp } from './min-vue-code.esm.js'
// min-vue-code.esm.js 来自 https://github.com/cll123456/mini-vue/blob/master/lib/mini-vue.esm.js 这个库给vue3源码做了详细的中文注释
import App from './App.js'

const app = createApp(App)
const containter = document.getElementById('app')
app.mount(containter)
