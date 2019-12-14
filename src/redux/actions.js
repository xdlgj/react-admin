/*
包含n个创建action的工厂函数(action creator)
*/
import {INCREMENT, DECREMENT} from './action-types'
//增加的同步action

// export function increment (number) {
// 	return {type: 'INCREMENT', data: number}
// }
export const increment = number => ({type: INCREMENT, data: number})
//减少的action
export const decrement = number => ({type: DECREMENT, data: number})
//增加的异步action,返回的是函数
export const incrementAsync = number =>{
    return dispatch => {
        //执行异步代码，（定时器，ajax请求，promise）
        setTimeout(() => {
            //当前异步任务执行完成，分发一个同步的action
            dispatch(increment(number))
        },1000)
    }

}
