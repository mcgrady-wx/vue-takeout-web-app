import {
    RECEIVE_ADDRESS,
    RECEIVE_CATEGORYS,
    RECEIVE_SHOPS
} from './mutation-types'

import {
    reqAddress, 
    reqCategorys, 
    reqShops
} from '../api'

const actions={
    async getAddress({commit,state}){// 异步获取地址
        let geohash=state.latitude + ',' + state.longitude
        let address = await reqAddress(geohash)
        commit(RECEIVE_ADDRESS,address.data)
    },
    async getCategorys({commit}){// 异步获取分类列表
        let categorys = await reqCategorys()
        commit(RECEIVE_CATEGORYS,categorys.data)
    },
    async getShops({commit,state}){// 异步获取商家列表
        const {latitude,longitude}=state
        let shops = await reqShops({latitude,longitude})
        commit(RECEIVE_SHOPS,shops.data)
    }
}

export default actions