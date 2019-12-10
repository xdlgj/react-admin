import React, { Component} from 'react'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {formatDate} from '../../utils/dateUtils'
import menuList from '../../config/menuConfig'
import {reqWeather} from '../../api'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'
import LinkButton from '../../components/link-button'
import './index.less'
/*
头部组件
*/
class Header extends Component {
    state = {
        currentTime : formatDate(Date.now()), //获取当前时间
        dayPictureUrl : '', //获取天气图片的url
        weather : '' , //获取天气情况

    }
    getCurrentTime = () => {
        this.intervalId = setInterval(() =>{
            let currentTime = formatDate(Date.now())
            this.setState({currentTime})
        },1000)
    }

    getWeather = async () => {
        const {dayPictureUrl, weather} = await reqWeather('成都')
        this.setState({dayPictureUrl, weather})
    }

    getTitle = (path) => {
        let title
        menuList.map((item) => {
            if (!item.children){
                if (item.key === path){
                    title = item.title
                }
            }else{
                item.children.map((cItem) => {
                    if (path.indexOf(cItem.key)===0) {
                        title = cItem.title
                    }
                })
            }
        })
        return title
    } 
    logout = () => {
        const { confirm } = Modal
        confirm({
            content: '确定要退出吗？',
            onOk : () => {
              // 清除内存中的用户信息
              memoryUtils.user = {}
              storageUtils.removeUser()
              this.props.history.replace('/login')
            },
        });
    }
    /*
    第一次render（）之后执行一次
    一般在此执行异步操作：发ajax请求/启动定时器
    */
    componentDidMount(){
        this.getCurrentTime()
        this.getWeather()
    }
    componentWillUnmount () {
        //清除定时器
        clearInterval(this.intervalId)
    }
    render() {
        const user = memoryUtils.user
        const {currentTime, dayPictureUrl, weather} = this.state
        const path = this.props.location.pathname
        //根据请求路径获取标题
        const title = this.getTitle(path)
        return (
            <div className='header'>
               <div className='header-top'>
                    <span>欢迎 {user.username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
               </div>
               <div className='header-bottom'>
                    <div className='header-bottom-left'>
                        {title}
                    </div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt=''/>
                        <span>{weather}</span>
                    </div>
               </div>
            </div>
        )
    }
}
export default withRouter(Header)