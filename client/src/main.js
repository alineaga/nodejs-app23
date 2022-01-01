import { createApp } from 'vue'
import mitt from 'mitt'
import App from './App.vue'
import router from './router'
import store from './store'

//const emitter = mitt()

createApp(App).use(store).use(router).mount('#app')
//app.config.globalProperties.emitter = emitter
//const app = createApp(App)
//app.mount('#app')