<template>
    <!-- 首页 -->
    <section class="msite">
        <!--首页头部-->
        <HeaderTop :title="address.name">
          <span class="header_search" slot="left">
            <i class="iconfont icon-sousuo"></i>
          </span>
          <span class="header_login" slot="right">
            <span class="header_login_text">登录|注册</span>
          </span>
        </HeaderTop>
        <!--首页导航-->
        <nav class="msite_nav">
          <swiper class="swiper-container" :options="swiperOptions">
            <swiper-slide class="swiper-slide" v-for="(categorys,index) in categorysArr" :key="index">
              <a href="javascript:" class="link_to_food" v-for="(category,index) in categorys" :key="index">
                <div class="food_container">
                  <img :src="baseImageUrl+category.image_url">
                </div>
                <span>{{category.title}}</span>
              </a>
            </swiper-slide>
            <!-- Add Pagination -->
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </nav>
        <!--首页附近商家-->
        <div class="msite_shop_list">
          <div class="shop_header">
            <i class="iconfont icon-xuanxiang"></i>
            <span class="shop_header_title">附近商家</span>
          </div>
          <ShopList></ShopList>
        </div>
    </section>
</template>

<script>
// 局部使用swiper轮播插件
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'

import HeaderTop from '../../components/HeaderTop/HeaderTop'
import ShopList from '../../components/ShopList/ShopList'

import {mapState,mapActions} from 'vuex'

export default {
    data() {
      return {
        swiperOptions: {
          pagination: {//小圆点
            el:'.swiper-pagination',
            clickable:true,
          },
          loop: true,// 无缝轮播
          // Some Swiper option/callback...
        },
        baseImageUrl: 'https://fuss10.elemecdn.com'
      }
    },
    mounted() {
      this.getCategorys()//获取轮播分类列表
      this.getShops()//获取商家列表
    },
    computed: {
      ...mapState(['address','categorys',]),
      //得到的categorys是一个一维数组，我们需要的是一个二维数组，每个元素也是数组，数组的lenght为8个
      categorysArr(){
        let arr=[]//新的二维数组
        //每个小数组的length为8，那么用一维数组除以8，再向上取整得到一共需要几个数组
        let num=Math.ceil(this.categorys.length/8)
        //循环num次，把原来的一维数组使用splice方法每8个分割出来，再添加到arr中，splice方法要改变元素组，所有需要定一个变量保存原一维数组
        let _categorys=this.categorys
        for (let index = 0; index < num; index++) {
          let minarr=_categorys.splice(0,8)
          arr.push(minarr)
        }
        //console.log(arr)
        return arr
      }
    },
    methods: {
      ...mapActions(['getCategorys','getShops'])
    },
    components:{
      HeaderTop,
      ShopList,
      Swiper,
      SwiperSlide
    }  
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../common/stylus/mixins.styl'
    .msite  //首页
          width 100%
          .msite_nav
            bottom-border-1px(#e4e4e4)
            margin-top 45px
            height 200px
            background #fff
            .swiper-container
              width 100%
              height 100%
              .swiper-wrapper
                width 100%
                height 100%
                .swiper-slide
                  display flex
                  justify-content center
                  align-items flex-start
                  flex-wrap wrap
                  .link_to_food
                    width 25%
                    .food_container
                      display block
                      width 100%
                      text-align center
                      padding-bottom 10px
                      font-size 0
                      img
                        display inline-block
                        width 50px
                        height 50px
                    span
                      display block
                      width 100%
                      text-align center
                      font-size 13px
                      color #666
              .swiper-pagination
                >span.swiper-pagination-bullet-active
                  background #02a774
          .msite_shop_list
            top-border-1px(#e4e4e4)
            margin-top 10px
            background #fff
            .shop_header
              padding 10px 10px 0
              .shop_icon
                margin-left 5px
                color #999
              .shop_header_title
                color #999
                font-size 14px
                line-height 20px
            
</style>