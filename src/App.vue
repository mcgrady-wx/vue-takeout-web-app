<template>
  <div id="app">
    <router-view/>
    <footer-nav v-show="$route.meta.showFooter"></footer-nav>
  </div>
</template>

<script>
import FooterNav from './components/FooterNav/FooterNav'
import {mapActions} from 'vuex'
export default {
  name: 'App',
  methods: {
    //定位当前位置获得当前位置的名称
    ...mapActions(['getAddress','getUserInfo'])
  },
  created() {
    //使用actions获得当前位置
    this.getAddress()
    //使用actions获得当前登录账号的信息，避免刷新需要重新登录
    this.getUserInfo()
  },
  components:{
    FooterNav
  } 
}
</script>

<style>
#app{
  width: 100%;
  height: 100%;
  background: #f5f5f5;
}

</style>
