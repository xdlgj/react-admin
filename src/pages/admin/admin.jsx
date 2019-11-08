import React, {Component} from 'react'
import memoryUtils from '../../utils/memoryUtils'
import {Redirect} from 'react-router-dom'
/*
后台管理的路由组件
*/
export default class Admin extends Component {
    render(){
        const username = memoryUtils.userName
        if (!username){
            return <Redirect to='/login' />
        }
        return(
            <div>Hello  {username}</div>
        )
    }
}