/*
入口js
*/

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'

//读取local中的username 保存到内存中
const username = storageUtils.getUserName()
memoryUtils.userName = username


// 将A组件标签渲染到index页面的div上
ReactDOM.render(<App />, document.getElementById("root"))