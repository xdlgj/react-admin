/*
能发送异步ajax请求的函数模块
封装axiso库
函数的返回值是promise对象
1、优化1：统一处理请求异常?
    在外层包一个自己创建的Promise对象
    在请求出错时，不reject(error)，而是显示错误提示
2、优化2：异步得到的不是response，而是reponse.data
    在请求成功resolve时：resolve(response.data)
*/
import axios from 'axios'
import {message} from 'antd'
export default function ajax(url, data={}, type='GET'){
    return new Promise((reslove) =>{
        let promise
        //1、执行异步ajax请求
        if(type === 'GET'){
            promise = axios.get(url, {
                params: data
            })
        }else {
            promise =  axios.post(url, data)
        }
        //2、如果成功了，调用reslove(value)
        promise.then( (response) => {
                reslove(response.data)
            }
        ).catch(//3、如果失败了，不调用reject（value），而是提示异常信息
            error =>{
                message.error("请求出错了："+error.message)
            }
        ) 
    })
}
