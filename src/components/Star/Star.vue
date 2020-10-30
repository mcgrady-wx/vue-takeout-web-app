<template>
    <div class="star" :class="'star-'+size">
        <span class="star-item on" v-for="(sc, index) in starClasses" :class="sc" :key="index"></span>
    </div>
</template>

<script>
// 类名常量
const CLASS_ON = 'on'
const CLASS_HALF = 'half'
const CLASS_OFF = 'off'
export default {
    props:{
        score: Number,
        size: Number
    },
    computed: {
        starClasses(){
            const scs = [] //接收类名的数组
            //通过传递过来的评分，获得去到个整数确定CLASS_ON的数量
            // 向scs中添加n个CLASS_ON
            const scoreInteger = Math.floor(this.score) //获取到整数
            for (let index = 0; index < scoreInteger; index++) {
                scs.push(CLASS_ON)                
            }
            // 向scs中添加0/1个CLASS_HALF，当小数大于0.5的时候添加一个，小于不添加，因为小数加减存在点点误差，*10变成整数的加减
            if (this.score*10-scoreInteger*10>=5) {
                scs.push(CLASS_HALF) 
            }
            // 向scs中添加n个CLASS_OFF
            while (scs.length<5) {//当数组的数量小于5的时候就一直循环添加，因最大长度就是5
                scs.push(CLASS_OFF) 
            }
            return scs
        }
    },
}
</script>

<style lang="stylus" scoped>
    @import '../../common/stylus/mixins.styl'
    .star //2x图 3x图
        float left
        font-size 0
        .star-item
            display inline-block
            background-repeat no-repeat
        &.star-48
            .star-item
                width 20px
                height 20px
                margin-right 22px
                background-size 20px 20px
                &:last-child
                    margin-right: 0
                &.on
                    bg-image('./images/stars/star48_on')
                &.half
                    bg-image('./images/stars/star48_half')
                &.off
                    bg-image('./images/stars/star48_off')
        &.star-36
            .star-item
                width 15px
                height 15px
                margin-right 6px
                background-size 15px 15px
                &:last-child
                    margin-right 0
                &.on
                    bg-image('./images/stars/star36_on')
                &.half
                    bg-image('./images/stars/star36_half')
                &.off
                    bg-image('./images/stars/star36_off')
        &.star-24
            .star-item
                width 10px
                height 10px
                margin-right 3px
                background-size 10px 10px
                &:last-child
                    margin-right 0
                &.on
                    bg-image('./images/stars/star24_on')
                &.half
                    bg-image('./images/stars/star24_half')
                &.off
                    bg-image('./images/stars/star24_off')
</style>