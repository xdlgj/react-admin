/*
reducer函数模块：根据当前state和指定的action返回一个新的state
*/
import {INCREMENT, DECREMENT} from './action-types'
import {combineReducers} from 'redux'
/*
管理count状态数据的reducer
*/
function count(state=1, action) {
	switch (action.type) {
		case INCREMENT:
			return state + action.data
		case DECREMENT:
			return state - action.data
		default:
			return state
	}
}
/*
管理user状态数据的reducer
*/
function user(state={}, action){
	switch(action.type){
		default:
			return state
	}
}

/*
接收包含所有reducer函数的对象，返回一个新的reducer函数（总reducer）
总的reducer函数管理的state的结构
{
	count,
	user,
}
*/
export default combineReducers({
	count,
	user,
})