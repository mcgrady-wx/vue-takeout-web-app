import {
    RECEIVE_ADDRESS,
    RECEIVE_CATEGORYS,
    RECEIVE_SHOPS,
    RECEIVE_USER_INFO,
    RECEIVE_GOODS,
    RECEIVE_RATINGS,
    RECEIVE_INFO
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
    }
}


export default mutations