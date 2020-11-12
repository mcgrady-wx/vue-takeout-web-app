<template>
    <!-- 搜索页面 -->
    <section class="search">
      <HeaderTop title="搜索"/>
      <form class="search_form" @submit.prevent="search">
        <input type="search" placeholder="请输入商家名称" class="search_input" v-model="keyword">
        <input type="submit" class="search_submit">
      </form>
      <section class="list" v-if="!noSearchShops">
        <ul class="list_container">
          <li class="list_li" v-for="item in searchShops" :key="item.id" @click="goToInfo(item.id)">
            <section class="item_left">
              <img v-lazy="imgBaseUrl + item.image_path" class="restaurant_img">
            </section>
            <section class="item_right">
              <div class="item_right_text">
                <p>
                  <span>{{item.name}}</span>
                </p>
                <p>月售{{item.month_sales||item.recent_order_num}}单</p>
                <p>{{item.delivery_fee||item.float_minimum_order_amount}}元起送/ 距离{{item.distance}}</p>
              </div>
            </section>
          </li>
        </ul>
      </section>
      <div class="search_none" v-else>很抱歉！无搜索结果</div>
    </section>
</template>

<script>
import HeaderTop from '../../components/HeaderTop/HeaderTop'
import {mapState,mapActions} from 'vuex'
import BScroll from 'better-scroll'
export default {
    data() {
      return {
        keyword:'',
        imgBaseUrl: 'http://cangdu.org:8001/img/',
        noSearchShops:false //用于标识，显示搜索列表，还是显示搜索无结果，默认false显示搜索列表（即便刚开始没有数据）
      }
    },
    mounted() {
      //当搜索后，跳转到其他页面去，在跳转回来由于数据保存在vuex中没有发生变化所以滚动没有初始化也没有刷新，导致滚动失效
      //在钩子函数中，初始化或者刷新滚动，解决路由却换回来后不能滚动的BUG
      //或者监听路由，当路由不是本页面的路由的时候去调用对应的mutation把searchShops赋值成空数组，每当路由切换走的时候就把值置为空，下次进入搜索页面后重新搜索也就不存在滚动问题了
      if (!this.serachShopsScroll) {
          this.$nextTick(()=>{
            this.serachShopsScroll = new BScroll('.list', {
              click: true
            })
          })
      } else {
          this.$nextTick(()=>{
            this.serachShopsScroll.refresh()
          })   
      }
    },
    computed: {
      ...mapState(['searchShops'])
    },
    methods: {
      ...mapActions(['getSearchShops']),
      search(){//发起搜索
        this.getSearchShops(this.keyword)
      },
      goToInfo(id){//跳转到详情
        this.$router.push(`/shop/${id}`)
      }
    },
    watch: {
      searchShops(newValue){//监听搜索数据，当每次得到新的数据的时候判断新数据是否有，来判断noSearchShops的值
          if (newValue.length>0) {//新数组有值
            this.noSearchShops=false
          } else {//没有值
            this.noSearchShops=true
          }
          //同时通过数据的变化初始化滚动，如果存在就刷新滚动
          if (!this.serachShopsScroll) {
              this.$nextTick(()=>{
                this.serachShopsScroll = new BScroll('.list', {
                  click: true
                })
              })
          } else {
              this.$nextTick(()=>{
                this.serachShopsScroll.refresh()
              })   
          }
      }
    },
    components:{
      HeaderTop
    }
}
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .search
    width 100%
    height 100%
    overflow hidden
    .search_form
      clearFix()
      margin-top 45px
      background-color #fff
      padding 12px 8px
      position relative
      z-index 10
      input
        height 35px
        padding 0 4px
        border-radius 2px
        font-weight bold
        outline none
        &.search_input
          float left
          width 79%
          border 4px solid #f2f2f2
          font-size 14px
          color #333
          background-color #f2f2f2
        &.search_submit
          float right
          width 18%
          border 4px solid #02a774
          font-size 16px
          color #fff
          background-color #02a774

    .list
      height 500px
      .list_container
        background-color: #fff;
        .list_li
          display: flex;
          justify-content: center;
          padding: 10px
          border-bottom: 1px solid $bc;
          .item_left
            margin-right: 10px
            .restaurant_img
              width 50px
              height 50px
              display block
          .item_right
            font-size 12px
            flex 1
            .item_right_text
              p
                line-height 12px
                margin-bottom 6px
                &:last-child
                  margin-bottom 0
    .search_none
      margin: 0 auto
      color: #333
      background-color: #fff
      text-align: center
      margin-top: 0.125rem
</style>