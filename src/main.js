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
import user from './components/user.vue'
Vue.use(VueRouter)
Vue.use(VueCookies)

Vue.$cookies.config('7d')

Vue.mixin({
 data: function() {
   return {
     globalBackEndPath:'http://localhost:8081',
	 getLoggedInData: function(){
		 if (!!$cookies.get('JWTs')) {
			var roles = [];
			var token = $cookies.get('JWTs');
			//var base64Url = token.split('.')[1];
			//var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
			//var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
			//	return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			//}).join(''));
			
			//var jwt = JSON.parse(token);
			return token;
		}else{
			return {sub: 'anonymousUser', Role: []};
		}
	 }
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
      path: '/users/:id',
      component: user,
      props: true,
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


