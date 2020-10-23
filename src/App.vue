<template>
  <div id="app">
    <router-view/>
    <footer-nav></footer-nav>
  </div>
</template>

<script>
import FooterNav from './components/FooterNav/FooterNav'
export default {
  name: 'App',
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
