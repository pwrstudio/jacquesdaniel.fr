import Vue from 'vue'
import 'babel-polyfill'
import VueRouter from 'vue-router'
import ga from 'vue-ga'
import App from './App'
import store from './store'
import index from './components/index'
import txt from './components/txt'
import collection from './components/collection'
import single from './components/single'
import home from './components/home'
import search from './components/search'
import VueWaypoint from 'vue-waypoint'

Vue.use(VueRouter)
Vue.use(VueWaypoint)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/item/:id/:slug',
      name: 'single',
      component: single
    },
    {
      path: '/collection/:id/:slug',
      name: 'collection',
      component: collection
    },
    {
      path: '/search/:term',
      name: 'search',
      component: search
    },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/text/:id',
      name: 'text',
      component: txt
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

ga(router, 'UA-101010427-1')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
