import {
    RECEIVE_ADDRESS,
    RECEIVE_CATEGORYS,
    RECEIVE_SHOPS
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
    }
}


export default mutations