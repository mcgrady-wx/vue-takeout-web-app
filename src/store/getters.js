const getters={
    totalCount(state){//购物车所有商品的数量
        /*
        *使用reduce方法遍历，reduce 为数组中的每一个元素依次执行回调函数
        *接受四个参数：初始值（或者上一次回调函数的返回值），当前元素值，当前索引，调用 reduce 的数组
        *可以设置默认初始值，不设置第一个参数的值就是第一个元素的返回值，第二个参数就是第二个元素，第三个参数索引为1，遍历次数是length-1次
        *设置了初始值，第一个参数就是初始值，第二个参数是第一个元素，第三个参数索引为0，遍历次数是length次
        */
        return state.cartFoods.reduce((total,food)=>{return total+food.count},0)
    },
    totalPrice(state){//购物车所有商品的总价
        return state.cartFoods.reduce((total,food)=>{return total+food.count*food.price},0)
    }
}


export default getters