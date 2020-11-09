import {
    RECEIVE_ADDRESS,
    RECEIVE_CATEGORYS,
    RECEIVE_SHOPS,
    RECEIVE_USER_INFO,
    RECEIVE_GOODS,
    RECEIVE_RATINGS,
    RECEIVE_INFO,
    INCREMENT_FOOD_COUNT,
    DECREMENT_FOOD_COUNT
} from './mutation-types'

import {
    reqAddress, 
    reqCategorys, 
    reqShops,
    reqUserInfo,
    reqLogout,
    reqShop
} from '../api'

const actions={
    async getAddress({commit,state}){// 异步获取地址
        let geohash=state.latitude + ',' + state.longitude
        let address = await reqAddress(geohash)
        if (address.code===0) {//成功
            commit(RECEIVE_ADDRESS,address.data)
        }   
    },
    async getCategorys({commit}){// 异步获取分类列表
        let categorys = await reqCategorys()
        if (categorys.code===0) {//成功
            commit(RECEIVE_CATEGORYS,categorys.data)
        }   
    },
    async getShops({commit,state}){// 异步获取商家列表
        const {latitude,longitude}=state
        let shops = await reqShops({latitude,longitude})
        if (shops.code===0) {//成功
            commit(RECEIVE_SHOPS,shops.data)
        }    
    },
    recordUser({commit},userinfo){//同步获得用户信息
        commit(RECEIVE_USER_INFO,userinfo)
    },
    async getUserInfo({commit}){// 异步获取用户信息。服务器会保存登录信息1天，通过异步请求获得用户信息避免网页刷新需要重新登录
        let userInfo = await reqUserInfo()
        if (userInfo.code===0) {//请求成功
            commit(RECEIVE_USER_INFO,userInfo.data)
        }  
    },
    async logout({commit}){// 异步退出登录
        let result = await reqLogout()
        if (result.code===0) {//请求成功，置为空
            commit(RECEIVE_USER_INFO,{})
        }  
    },
    async getShop({commit},id){// 异步获取商品所有信息
        let result = await reqShop(id)
        if (result.code===0) {//请求成功，分别保存商铺信息，商家评价数组和商铺商品列表
            commit(RECEIVE_GOODS,result.data.goods)
            commit(RECEIVE_RATINGS,result.data.ratings)
            commit(RECEIVE_INFO,result.data.info)
        }  
    },
    updateFoodCount({commit},{isAdd,food}){// 同步更新food中的count值
        if (isAdd) {//增加
            commit(INCREMENT_FOOD_COUNT,food)
        } else { //减少
            commit(DECREMENT_FOOD_COUNT,food)
        }
    }
}

export default actions