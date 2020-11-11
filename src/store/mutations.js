import Vue from 'vue'
import {
    RECEIVE_ADDRESS,
    RECEIVE_CATEGORYS,
    RECEIVE_SHOPS,
    RECEIVE_USER_INFO,
    RECEIVE_GOODS,
    RECEIVE_RATINGS,
    RECEIVE_INFO,
    INCREMENT_FOOD_COUNT,
    DECREMENT_FOOD_COUNT,
    CLEAR_CART
} from './mutation-types'

const mutations={
    [RECEIVE_ADDRESS](state,address){//获取到当前地址
        state.address = address
    },
    [RECEIVE_CATEGORYS](state,categorys){//获取轮播分类数组
        state.categorys = categorys
    },
    [RECEIVE_SHOPS](state,shops){//获取到商家数组
        state.shops = shops
    },
    [RECEIVE_USER_INFO](state,userInfo){//获取用户信息
        state.userInfo=userInfo
    },
    [RECEIVE_GOODS](state,goods){//获取商铺商品列表
        state.goods=goods
    },
    [RECEIVE_RATINGS](state,ratings){//获取商家评价数组
        state.ratings=ratings
    },
    [RECEIVE_INFO](state,info){//获取商家信息
        state.info=info
    },
    [INCREMENT_FOOD_COUNT](state,food){//增加每个商品的count值，如果没有count值新增count值并赋值为1
        if (!food.count) {//没有food.count属性，第一次增加
            // food.count = 1  // 新增属性(没有数据绑定)
            /*
            对象
            属性名
            属性值
            */
            Vue.set(food, 'count', 1) // 让新增的属性也有数据绑定
            //添加到购物车数据中
            state.cartFoods.push(food)
        } else {//存在就++
            food.count++
        }
    },
    [DECREMENT_FOOD_COUNT](state,food){//减少商品的count值
        if (food.count) {//有值才减少
            food.count--
            if (food.count===0) {//移除购物车中该商品
                state.cartFoods.splice(state.cartFoods.indexOf(food),1)
            }
        }
    },
    [CLEAR_CART](state){//清空购物车
        //1、需要把cartFoods中的所有food对象中的count的值置为0
        state.cartFoods.forEach(element => {
            element.count=0
        });
        //2、把cartFoods置为空对象
        state.cartFoods=[]
    }
}


export default mutations