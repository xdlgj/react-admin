/*
用来根据旧的state和指定的action生成并返回新的state的函数
*/
import {combineReducers} from 'redux'
import storageUtils from '../utils/storageUtils'
import {SET_HEAD_TITLE} from './action-types'

//用来管理头部标题的reducer函数
const initHeaderTitle = ''
function headTitle (state=initHeaderTitle, action) {
	switch(action.type){
		case SET_HEAD_TITLE:
			return action.data
		default:
			return state
	}
}

//用来管理当前登录用户reducer函数
const initUser = storageUtils.getUser()
function user (state=initUser, action) {
	switch(action.type){
		default:
			return state
	}
}


export default combineReducers({
	headTitle,
	user
})