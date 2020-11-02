<template>
    <!-- 登陆注册 -->
    <section class="loginContainer">
      <div class="loginInner">
        <div class="login_header">
          <h2 class="login_logo">硅谷外卖</h2>
          <div class="login_header_title">
            <a href="javascript:;" :class="loginWay?'on':''" @click="loginWay=true">短信登录</a>
            <a href="javascript:;" :class="loginWay?'':'on'" @click="loginWay=false">密码登录</a>
          </div>
        </div>
        <div class="login_content">
          <form @submit.prevent="login">
            <div :class="loginWay?'on':''">
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="手机号" v-model="phone">
                <button :disabled="!rightPhone" class="get_verification" :class="{right_phone: rightPhone}" @click.prevent="getCode">{{computeTime>0 ? `已发送(${computeTime}s)` : '获取验证码'}}</button>
              </section>
              <section class="login_verification">
                <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
              </section>
              <section class="login_hint">
                温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
                <a href="javascript:;">《用户服务协议》</a>
              </section>
            </div>
            <div :class="loginWay?'':'on'">
              <section>
                <section class="login_message">
                  <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
                </section>
                <section class="login_verification">
                  <input type="text" maxlength="8" placeholder="密码" v-if="showPwd" v-model="pwd">
                  <input type="password" maxlength="8" placeholder="密码" v-else v-model="pwd">
                  <div class="switch_button" :class="showPwd?'on':'off'" @click.prevent="showPwd=!showPwd">
                    <div class="switch_circle" :class="{right: showPwd}"></div>
                    <span class="switch_text">{{showPwd ? 'abc' : '...'}}</span>
                  </div>
                </section>
                <section class="login_message">
                  <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                  <img class="get_verification" src="http://localhost:4000/captcha" alt="captcha" @click="getCaptcha" ref="captcha">
                </section>
              </section>
            </div>
            <button class="login_submit">登录</button>
          </form>
          <a href="javascript:;" class="about_us">关于我们</a>
        </div>
        <span class="go_back" @click="gotoBack">
          <i class="iconfont icon-icon_arrow_left"></i>
        </span>
      </div>
      <AlertTip :alertText="alertText" v-show="alertShow" @closeTip="closeTip"/>
    </section>
</template>

<script>
import AlertTip from '../../components/AlertTip/AlertTip'
import {reqSendCode,reqPwdLogin,reqSmsLogin} from '../../api'
export default {
    data() {
      return {
        loginWay: false, // true代表短信登陆, false代表密码
        computeTime: 0, // 计时的时间
        showPwd: false, // 是否显示密码
        phone: '', // 手机号
        code:'', // 短信验证码
        name: '', // 用户名
        pwd: '', // 密码
        captcha: '', // 图形验证码
        alertText: '', // 提示文本
        alertShow: false, // 是否显示警告框
        intervalId:''//定时器ID
      }
    },
    computed: {
      rightPhone(){//判断手机号是否正确
        return /^1\d{10}$/.test(this.phone)
      }
    },
    methods: {
        gotoBack(){//返回
          this.$router.back()
        },
        async getCode(){//获取手机验证码
          if (this.intervalId) {//避免重复点击
            return 
          }
          this.computeTime=30
          //设置定时器倒计时
          this.intervalId=setInterval(() => {
            this.computeTime--
            if (this.computeTime<=0) {//如果时间变成0了，停止计时器，并且把计时器ID重置
              clearInterval(this.intervalId)
              this.intervalId=''
            }
          }, 1000);
          // 发送ajax请求(向指定手机号发送验证码短信)
          const result=await reqSendCode(this.phone)
          if (result.code===1) {//短信验证码发送失败
            //显示提示
            this.alertText="验证码发送失败"
            this.alertShow=true
            //停止计时器
            if (this.computeTime) {
              this.computeTime=0
              clearInterval(this.intervalId)
              this.intervalId=''
            }
          }

        },
        async login(){//登录
          let result //保存请求结果
          //首先进行表单验证，确定数据是否都已经填写，然后再收集信息，发起登录请求
          if (this.loginWay) {//短信登陆
            if (!this.rightPhone) {//判断手机号，取反表示手机号格式错误或者不存在
              this.alertText="手机号错误"
              this.alertShow=true
              return
            } else if (!/^\d{6}$/.test(this.code)) {//判断验证码，取反表示验证码没输入
              this.alertText="验证必须是6位数字"
              this.alertShow=true
              return
            }
            // 发送ajax请求短信登陆，同时停止计时器
            result =await reqSmsLogin(this.phone,this.code)
            if (this.computeTime) {
              this.computeTime=0
              clearInterval(this.intervalId)
              this.intervalId=''
            }

          } else {//账户密码登录
            if (!this.name) {//判断用户名，取反表示用户名为空
              this.alertText="用户名为空"
              this.alertShow=true
              return
            } else if (!this.pwd) {//判断密码，取反表示密码没输入
              this.alertText="密码为空"
              this.alertShow=true
              return
            } else if (!this.captcha) {//判断图形验证码，取反表示为空
              this.alertText="图形验证码为空"
              this.alertShow=true
              return
            }
            // 发送ajax请求账户密码登陆
            const {name, pwd, captcha} = this
            result =await reqPwdLogin({name, pwd, captcha})
          }
          //根据结果数据处理
          if (result.code===0) {//登录成功
            //将user保存到vuex的state

            // 去个人中心界面
            this.$router.replace('/profile')
          } else {//登录失败
            // 显示新的图片验证码
            this.getCaptcha()
            // 显示警告提示
            this.alertText=result.msg
            this.alertShow=true
          }
        },
        closeTip(){//关闭错误提示
          this.alertShow=false
          this.alertText=""
        },
        getCaptcha(){//切换验证码
          //通过点击，更改src属性实现src的变化重新发起请求，得到新的验证码
          this.$refs.captcha.src="http://localhost:4000/captcha?time="+Date.now()
        }
    },
    components:{
      AlertTip
    }
}
</script>

<style lang="stylus" scoped>
    @import '../../common/stylus/mixins.styl'
    .loginContainer
      width 100%
      height 100%
      background #fff
      .loginInner
        padding-top 60px
        width 80%
        margin 0 auto
        .login_header
          .login_logo
            font-size 40px
            font-weight bold
            color #02a774
            text-align center
          .login_header_title
            padding-top 40px
            text-align center
            >a
              color #333
              font-size 14px
              padding-bottom 4px
              &:first-child
                margin-right 40px
              &.on
                color #02a774
                font-weight 700
                border-bottom 2px solid #02a774
        .login_content
          >form
            >div
              display none
              &.on
                display block
              input
                width 100%
                height 100%
                padding-left 10px
                box-sizing border-box
                border 1px solid #ddd
                border-radius 4px
                outline 0
                font 400 14px Arial
                &:focus
                  border 1px solid #02a774
              .login_message
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .get_verification
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  border 0
                  color #ccc
                  font-size 14px
                  background transparent
                  touch-action none
                  &.right_phone
                    color black
              .login_verification
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .switch_button
                  font-size 12px
                  border 1px solid #ddd
                  border-radius 8px
                  transition background-color .3s,border-color .3s
                  padding 0 6px
                  width 30px
                  height 16px
                  line-height 16px
                  color #fff
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  &.off
                    background #fff
                    .switch_text
                      float right
                      color #ddd
                  &.on
                    background #02a774
                  >.switch_circle
                    position absolute
                    top -1px
                    left -1px
                    width 16px
                    height 16px
                    border 1px solid #ddd
                    border-radius 50%
                    background #fff
                    box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                    transition transform .3s
                    &.right
                      transform translateX(27px)
              .login_hint
                margin-top 12px
                color #999
                font-size 14px
                line-height 20px
                >a
                  color #02a774
            .login_submit
              display block
              width 100%
              height 42px
              margin-top 30px
              border-radius 4px
              background #4cd96f
              color #fff
              text-align center
              font-size 16px
              line-height 42px
              border 0
          .about_us
            display block
            font-size 12px
            margin-top 20px
            text-align center
            color #999
        .go_back
          position absolute
          top 5px
          left 5px
          width 30px
          height 30px
          >.iconfont
            font-size 20px
            color #999
</style>