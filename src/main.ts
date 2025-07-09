import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
  pt: {
    button: {
      label: { class: '!text-black' },
      root: {
        class:
          '!bg-teal-200/80 !border-none !text-white hover:!bg-teal-100/80 active:!bg-teal-300/80 !text-black',
      },
    },
  },
})

app.mount('#app')
