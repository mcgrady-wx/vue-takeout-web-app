import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/Home/Home.vue'
import Search from '../pages/Search/Search.vue'
import Order from '../pages/Order/Order.vue'
import Profile from '../pages/Profile/Profile.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'/home'
    },
    {
      path:'/home',
      component:Home
    },
    {
      path:'/search',
      component:Search
    },
    {
      path:'/order',
      component:Order
    },
    {
      path:'/profile',
      component:Profile
    }
  ]
})
