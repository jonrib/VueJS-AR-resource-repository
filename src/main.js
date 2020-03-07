import Vue from 'vue'
import App from './App.vue'
import TopBar from './TopBar.vue'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'

Vue.config.productionTip = false

import welcome from './components/welcome.vue'
import registration from './components/registration.vue'
Vue.use(VueRouter)
Vue.use(VueCookies)

Vue.$cookies.config('7d')

import vuetify from './plugins/vuetify' // path to vuetify export

let router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: welcome,
    },
	{
      path: '/welcome',
      component: welcome,
    },
	{
      path: '/registration',
      component: registration,
    }
  ]
})

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
  vuetify
})


