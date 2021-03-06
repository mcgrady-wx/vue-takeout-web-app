<template>
    <!-- 食品列表 -->
    <div>
        <div class="goods">
            <div class="menu-wrapper" ref="menuWrapper">
                <ul>
                    <li class="menu-item" v-for="(good,index) in goods" :key="good.name" :class="currentIndex===index?'current':''" @click="clickMenuItem(index)">
                        <span class="text bottom-border-1px">
                            <img class="icon" v-lazy="good.icon" v-if="good.icon">
                            {{good.name}}
                        </span>
                    </li>
                </ul>
            </div>
            <div class="foods-wrapper" ref="foodsWrapper">
                <ul ref="foodsUl">
                    <li class="food-list-hook" v-for="(good,index) in goods" :key="index">
                        <h1 class="title">{{good.name}}</h1>
                        <ul>
                            <li class="food-item bottom-border-1px" v-for="(food,index) in good.foods" :key="index" @click="showFood(food)">
                                <div class="icon">
                                    <img width="57" height="57" v-lazy="food.icon">
                                </div>
                                <div class="content">
                                    <h2 class="name">{{food.name}}</h2>
                                    <p class="desc">{{food.description}}</p>
                                    <div class="extra">
                                        <span class="count">月售{{food.sellCount}}份</span>
                                        <span>好评率{{food.rating}}%</span>
                                    </div>
                                    <div class="price">
                                        <span class="now">￥{{food.price}}</span>
                                        <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                                    </div>
                                    <div class="cartcontrol-wrapper">
                                        <CartControl :food="food"/>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>    
                </ul>
            </div>
            <ShopCart />
        </div>
        <transition name="fade">
          <Food :food="food" v-if="isShow" @show="show"/>
        </transition>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import BScroll from 'better-scroll'
import CartControl from '../../../components/CartControl/CartControl'
import Food from '../../../components/Food/Food'
import ShopCart from '../../../components/ShopCart/ShopCart'
export default {
    data() {
      return {
        tops:[],//收集每一个类别距离顶部的距离
        scrollY:0,//获取在Y轴上的移动距离
        food:{},//选中的该food对象
        isShow:false //控制显示详情组件
      }
    },
    computed: {
        ...mapState(['goods']),
        currentIndex(){//通过收集到的tops和Y轴上的滚动距离scrollY,获得滚动到哪一个列表，返回该列表的下标，让该列表显示高亮
          let index=0 //初始化
          //使用findIndex方法，遍历tops，找到满足条件的项，并返回对应的下标
          const {tops,scrollY}=this
          index=tops.findIndex((top,index)=>{
            // scrollY>=当前top && scrollY<下一个top
            return scrollY>=top && scrollY<tops[index+1]
          })
          return index
        }
    },
    mounted() {
      //当DOM加载完成后初始化滚动。如果滚动存在就刷新滚动。nextTick方法是延迟执行，确保数据已经更新后再执行
      //在初始化时需要使用计时器来做延迟处理，不然当在该页面刷新的时候获取不到goods，导致BUG
      if (!this.foodsScroll) {
          setTimeout(()=>{
            this.$nextTick(()=>{
                this._initScroll() //初始化滚动
                this._initTops() //获得右侧滚动列表的Tops
            })
          },200)
      } else {
        this.$nextTick(()=>{
            this.leftScroll.refresh()
            this.foodsScroll.refresh()
        })
      }
    },
    methods: {
        _initScroll(){//初始化滚动
            //左侧分类
            this.leftScroll=new BScroll('.menu-wrapper',{
              click:true
            })
            //右侧列表
            this.foodsScroll=new BScroll('.foods-wrapper',{
              probeType: 2, //使用3，会一直监听，包括惯性滑动的距离，太消耗资源。可以使用scrollEnd方法得到最终停下来的scrollY的值
              click:true
            })
            // 给右侧列表绑定scroll监听
            this.foodsScroll.on('scroll', ({x,y})=>{
              //console.log(y)
              this.scrollY=Math.abs(y)
            })
            // 给右侧列表绑定scrollEnd监听
            this.foodsScroll.on('scrollEnd', ({x,y})=>{
              //console.log(y)
              this.scrollY=Math.abs(y)
            })
        },
        _initTops(){//初始化右侧滚动列表的Tops
            //初始化位置，第一个列表距离顶部的位置为0
            let top=0
            this.tops.push(top)
            //获得所有的li标签
            const li=this.$refs.foodsUl.getElementsByClassName('food-list-hook')
            //把li的伪数组转化成数组，在遍历，push到tops中
            Array.prototype.slice.call(li).forEach(element => {
              top=top+element.clientHeight
              this.tops.push(top)
            });
            //console.log(this.tops)
        },
        clickMenuItem(index){//点击左侧的分类，让右侧滚动到对应的位置
          //使用scrollTo方法
          //获得需要滚动的距离
          let y=this.tops[index]
          //先左侧列表显示高亮，再移动到相应位置
          this.scrollY=y
          //移动到相应位置
          this.foodsScroll.scrollTo(0,-y,300)
        },
        showFood(food){//显示商品详情
          this.food=food //赋值
          //显示详情组件
          this.isShow=!this.isShow
        },
        show(){//自定义方法，显示商品详情，让子组件调用
          this.isShow=!this.isShow
        }
    },
    components:{
      CartControl,
      Food,
      ShopCart
    } 
}
</script>

<style lang="stylus" scoped>
    @import "../../../common/stylus/mixins.styl"
  .goods
    display: flex
    position: absolute
    top: 195px
    bottom: 46px
    width: 100%
    background: #fff;
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          color: $green
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
  &.fade-enter-active, &.fade-leave-active
    transition all .5s
  &.fade-enter, &.fade-leave-to
    opacity 0

</style>