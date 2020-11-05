/*
使用mockjs提供mock数据接口
 */

import Mock from 'mockjs'
import data1 from './data1.json'
import data479 from './data479.json'

// 返回Shop的接口
Mock.mock('/api/shop/1?', {code:0, data: data1})
Mock.mock('/api/shop/479?', {code:0, data: data479})