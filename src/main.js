// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload' //引入图片懒加载
import './filters'

//使用mint-ui
import { Button } from 'mint-ui';
Vue.component(Button.name, Button);

//使用mock模拟数据
import './mock/mockServer'

//配置使用图片懒加载
import loading from './common/images/timg.gif' //导入要懒加载的图片
Vue.use(VueLazyload, {
  loading //引用懒加载图片
})

//使用axiso的baseURL属性，设置baseURL的值，解决跨域请求数据
import axios from 'axios'
import  apiConfig from '../config/api.config'
axios.defaults.baseURL=apiConfig.baseURL

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
