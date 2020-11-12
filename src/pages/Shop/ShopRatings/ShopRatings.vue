<template>
    <!-- 评价页面 -->
    <div class="ratings" ref="ratings">
        <div class="ratings-content">
            <div class="overview">
                <div class="overview-left">
                    <h1 class="score">{{info.score}}</h1>
                    <div class="title">综合评分</div>
                    <div class="rank">高于周边商家99%</div>
                </div>
                <div class="overview-right">
                    <div class="score-wrapper">
                        <span class="title">服务态度</span>
                        <Star :score="info.serviceScore" :size="36" />
                        <span class="score">{{info.serviceScore}}</span>
                    </div>
                    <div class="score-wrapper">
                        <span class="title">商品评分</span>
                        <Star :score="info.foodScore" :size="36" />
                        <span class="score">{{info.foodScore}}</span>
                    </div>
                    <div class="delivery-wrapper">
                        <span class="title">送达时间</span>
                        <span class="delivery">{{info.deliveryTime}} 分钟</span>
                    </div>
                </div>
            </div>
            <div class="split"></div>
            <div class="ratingselect">
                <div class="rating-type border-1px">
                    <span class="block positive" :class="{active: selectType===2}" @click="selectType=2">
                        全部
                        <span class="count">{{ratings.length}}</span>
                    </span>
                    <span class="block positive" :class="{active: selectType===0}" @click="selectType=0">
                        满意
                        <span class="count">{{ratings.length-badCount}}</span>
                    </span>
                    <span class="block negative" :class="{active: selectType===1}" @click="selectType=1">
                        不满意
                        <span class="count">{{badCount}}</span>
                    </span>
                </div>
                <div class="switch" :class="{on:onlyShowText}" @click="onlyShowText=!onlyShowText">
                    <span class="iconfont icon-duigou"></span>
                    <span class="text">只看有内容的评价</span>
                </div>
            </div>
            <div class="rating-wrapper">
                <ul>
                    <li class="rating-item" v-for="(rating, index) in filterRatings" :key="index">
                        <div class="avatar">
                            <img width="28" height="28" v-lazy="rating.avatar">
                        </div>
                        <div class="content">
                            <h1 class="name">{{rating.username}}</h1>
                            <div class="star-wrapper">
                                <Star :score="rating.score" :size="24" />
                                <span class="delivery">{{rating.deliveryTime}}</span>
                            </div>
                            <p class="text">{{rating.text}}</p>
                            <div class="recommend">
                                <span class="iconfont" :class="rating.rateType===0 ? 'icon-tuijian' : 'icon-shoushi-tucao'"></span>
                                <span class="item" v-for="(item, index) in rating.recommend" :key="index">{{item}}</span>
                            </div>
                            <div class="time">{{rating.rateTime | time}}</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import Star from '../../../components/Star/Star'
import {mapGetters, mapState} from 'vuex'
import BScroll from 'better-scroll'
//import moment from 'moment' //由于moment.js太大，用date-fns代替。同时有可能多个地方会用到时间显示的过滤器，所以直接定义成一个全局的filter
export default {
    data() {
      return {
        onlyShowText: true, // 是否只显示有文本的
        selectType: 2 , // 选择的评价类型: 0满意, 1不满意, 2全部
      }
    },
    computed: {
      ...mapState(['info','ratings']),
      ...mapGetters(["badCount"]),
      filterRatings(){
        /**
         * 显示对应的评价，需要同时满足两个条件
         * 1、评价类型 每一个rating中rateType属性代表评价类型，0是好，1是不好。
         *    要么selectType=2全部显示，要么selectType=rating.rateType显示对应项
         * 2、是否显示有文本的 
         *    !onlyShowText就表示都显示 rating.text.length>0就表示只显示有文本的
         */
        // 获得需要的数据
        const {onlyShowText,selectType,ratings}=this
        //根据条件遍历ratings，得到新的数组
        let arr=[]
        // if (!onlyShowText && selectType===2) {//表示全部显示 
        //     arr=ratings
        // } else if(onlyShowText && selectType===2){//表示只显示有文本内容的
        //     arr=ratings.filter((rating)=>{
        //         return rating.text.length>0
        //     })
        // } else if (!onlyShowText && selectType===0) {//表示显示所有的好评
        //     arr=ratings.filter((rating)=>{
        //         return rating.rateType===0
        //     })
        // } else if (onlyShowText && selectType===0) {//表示只显示有文本的好评
        //     arr=ratings.filter((rating)=>{
        //         return rating.rateType===0 && rating.text.length>0
        //     })
        // } else if (!onlyShowText && selectType===1) {//表示显示所有的差评
        //     arr=ratings.filter((rating)=>{
        //         return rating.rateType===1
        //     })
        // } else if (onlyShowText && selectType===1) {//表示显示所有的差评
        //     arr=ratings.filter((rating)=>{
        //         return rating.rateType===1 && rating.text.length>0
        //     })
        // }
        //或者可以简写成
        arr=ratings.filter((rating)=>{
              return (selectType===2 || selectType===rating.rateType) && (!onlyShowText || rating.text.length>0)
            })
        return arr
      }
    },
    mounted() {//页面初始化完成后，初始化滚动
      if (!this.ratingsScroll) {
          this.ratingsScroll = new BScroll('.ratings', {
            click: true
          })
      } else {
          this.$nextTick(()=>{
            this.ratingsScroll.refresh()
          })   
      }
    },
    components:{
        Star
    },
    watch: {
      /*ratings(){//监听评价数据，当数据刷新后重新初始化滚动，解决在当前页面刷新后无法滚动的问题
        if (!this.ratingsScroll) {
          this.ratingsScroll = new BScroll('.ratings', {
            click: true
          })
        } else {
          this.$nextTick(()=>{
            this.ratingsScroll.refresh()
          })   
        }
      },*/
      filterRatings(){//监听数据，当数据发生变化后重新计算滚动（刷新滚动），解决当选择不同数据显示的时候滚动出现问题的BUG
        this.$nextTick(()=>{
          this.ratingsScroll.refresh()
        }) 
      }
    },
    // filters:{
    //   time(value){//解析时间的过滤器
    //     return moment(value).format('YYYY-MM-D HH:mm:ss')
    //   }
    // }
        
}
</script>

<style lang="stylus" scoped>
  @import "../../../common/stylus/mixins.styl"

  .ratings
    position: absolute
    top: 195px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    background: #fff
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0 0 137px
        padding: 6px 0
        width: 137px
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        text-align: center
        @media only screen and (max-width: 320px)
          flex: 0 0 120px
          width: 120px
        .score
          margin-bottom: 6px
          line-height: 28px
          font-size: 24px
          color: rgb(255, 153, 0)
        .title
          margin-bottom: 8px
          line-height: 12px
          font-size: 12px
          color: rgb(7, 17, 27)
        .rank
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
      .overview-right
        flex: 1
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left: 6px
        .score-wrapper
          margin-bottom: 8px
          font-size: 0
          .title
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(7, 17, 27)
          .star
            display: inline-block
            margin: 0 12px
            vertical-align: top
          .score
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(255, 153, 0)
        .delivery-wrapper
          font-size: 0
          .title
            line-height: 18px
            font-size: 12px
            color: rgb(7, 17, 27)
          .delivery
            margin-left: 12px
            font-size: 12px
            color: rgb(147, 153, 159)
    .split
      width: 100%
      height: 16px
      border-top: 1px solid rgba(7, 17, 27, 0.1)
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      background: #f3f5f7
    .ratingselect
      .rating-type
        padding: 18px 0
        margin: 0 18px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 0
        .block
          display: inline-block
          padding: 8px 12px
          margin-right: 8px
          line-height: 16px
          border-radius: 1px
          font-size: 12px
          color: rgb(77, 85, 93)
          background: rgba(77, 85, 93, 0.2)
          &.active
            background: $green
            color: #fff
          .count
            margin-left: 2px
            font-size: 8px
      .switch
        padding: 12px 18px
        line-height: 24px
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        color: rgb(147, 153, 159)
        font-size: 0
        &.on
          .icon-duigou
            color: $green
        .icon-duigou
          display: inline-block
          vertical-align: top
          margin-right: 4px
          font-size: 24px
        .text
          display: inline-block
          vertical-align: top
          font-size: 12px
    .rating-wrapper
      padding: 0 18px
      .rating-item
        display: flex
        padding: 18px 0
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          flex: 0 0 28px
          width: 28px
          margin-right: 12px
          img
            border-radius: 50%
        .content
          position: relative
          flex: 1
          .name
            margin-bottom: 4px
            line-height: 12px
            font-size: 10px
            color: rgb(7, 17, 27)
          .star-wrapper
            margin-bottom: 6px
            font-size: 0
            .star
              display: inline-block
              margin-right: 6px
              vertical-align: top
            .delivery
              display: inline-block
              vertical-align: top
              line-height: 12px
              font-size: 10px
              color: rgb(147, 153, 159)
          .text
            margin-bottom: 8px
            line-height: 18px
            color: rgb(7, 17, 27)
            font-size: 12px
          .recommend
            line-height: 16px
            font-size: 0
            .icon-tuijian, .icon-shoushi-tucao, .item
              display: inline-block
              margin: 0 8px 4px 0
              font-size: 9px
            .icon-tuijian
              color: $yellow
            .icon-shoushi-tucao
              color: rgb(147, 153, 159)

            .item
              padding: 0 6px
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 1px
              color: rgb(147, 153, 159)
              background: #fff
          .time
            position: absolute
            top: 0
            right: 0
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
</style>