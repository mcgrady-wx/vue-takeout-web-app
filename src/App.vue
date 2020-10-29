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
    ...mapActions(['getAddress'])
  },
  created() {
    //使用actions获得当前位置
    this.getAddress()
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
