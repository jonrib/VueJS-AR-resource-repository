import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'

Vue.config.productionTip = false

import welcome from './components/welcome.vue'
import registration from './components/registration.vue'
import login from './components/login.vue'
import resources from './components/resources.vue'
import resourceEntry from './components/resourceEntry.vue'
Vue.use(VueRouter)
Vue.use(VueCookies)

Vue.$cookies.config('7d')

Vue.mixin({
 data: function() {
   return {
     globalBackEndPath:'http://localhost:8081'
   }
 }
})

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
    },
	{
      path: '/login',
      component: login,
    },
	{
      path: '/resources',
      component: resources,
    },
	{
      path: '/resourceEntry/:id',
      component: resourceEntry,
	  props: true,
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


