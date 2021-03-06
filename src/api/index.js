/*
与后台交互模块
*/
import ajax from './ajax'


//根据经纬度获取位置详情
export const reqAddress = geohash => ajax('/position/' + geohash)

//获取食品分类列表
export const reqCategorys = () => ajax('/index_category')

//根据经纬度获取商铺列表
export const reqShops = ({latitude, longitude}) => ajax('/shops',{latitude, longitude})

//根据经纬度和关键字搜索商铺列表
export const reqSearchShop = (geohash, keyword) => ajax('/search_shops', {geohash, keyword})

//用户名密码登陆
export const reqPwdLogin = ({name, pwd, captcha}) => ajax('/login_pwd', {name, pwd, captcha}, 'POST')

//发送短信验证码
export const reqSendCode = (phone) => ajax('/sendcode', {phone})

//手机号验证码登陆
export const reqSmsLogin = (phone, code) => ajax('/login_sms', {phone, code}, 'POST')

// 根据会话获取用户信息
export const reqUserInfo = () => ajax('/userinfo')

// 用户登出
export const reqLogout = () => ajax('/logout')

/**
 * 获取商家信息
*/
export const reqShop = (id) => ajax(`/shop/${id}`)