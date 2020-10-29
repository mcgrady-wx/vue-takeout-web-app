/*
ajax 请求函数模块
*/

import axios from 'axios'

export default function ajax(url='',data={},type="GET"){
    //使用new一个Promise对象，使返回值直接是promis.data的数据，方便处理

    return new Promise((resolve, reject)=>{
        let promise //接收promise数据
        if (type==="GET") {//发送的是get请求
            // 准备url query 参数数据
            let dataStr = '' //数据拼接字符串
            //使用Object.keys()方法获得一个由data对象中的所有key值所组成的数组，并便利这个数组完成数据拼接
            Object.keys(data).forEach((key)=>{
                dataStr=dataStr+(key+'='+data[key]+'&')
            })
            //拼接的数据中最后多了一个&符号，需要去掉
            if (dataStr !== '') {//说明存在数据，去掉符号
                dataStr=dataStr.substring(0,dataStr.lastIndexOf('&'))
            }
            //获得完整的请求路径
            url=url+'?'+dataStr
            //发起get请求
            promise=axios.get(url)
        } else {//发送post请求
            promise=axios.post(url,)
        }
        //使用.then方法处理请求成功得到的promise数据，.catch处理请求失败的数据
        promise.then((response)=>{
            resolve(response.data)
        }).catch((error)=>{
            reject(error)
        })
    })
    
}