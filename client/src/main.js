import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import globalMixin from './globalMixin'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueClickAway from "vue3-click-away";

import '@fortawesome/fontawesome-free/css/all.css'

import './css/style.scss'
import $bus from './eventbus';

if (process.env.NODE_ENV === 'production') {
    window.host_url = '/';
} else {
    window.host_url = window.location.protocol + "//" + 'localhost:3000/';
}
// dev
window.api_url = window.host_url + "api/";

// prod
// window.host_url = window.location.protocol + "//" + window.location.host;
// window.api_url = window.host_url + "/api"

const app = createApp(App);
app.config.globalProperties.$bus = $bus;
app.use(router)
app.use(VueAxios, axios)
app.use(VueClickAway)
app.mixin(globalMixin)
app.mount('#app')
