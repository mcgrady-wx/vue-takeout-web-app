//跨域请求的配置

//判断是否是生产环境
var isPro = process.env.NODE_ENV === 'production' //process.env.NODE_ENV用于区分是生产环境还是开发环境

//根据环境不同导出不同的baseURL，如果是生产环境那么baseURL设置成实际的后台服务器地址，这里假设实际的服务器请求地址是http://sbsb.com:8888/
module.exports = {
    baseURL : isPro ? 'http://sbsb.com:8888/' : '/api'
}