import React, {Component} from 'react'
import memoryUtils from '../../utils/memoryUtils'
import {Redirect} from 'react-router-dom'
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav' 
import Header from '../../components/header'
const {Footer, Sider, Content } = Layout;
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
            <Layout style={{height:'100%'}}> 
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header />
                    <Content style={{backgroundColor:'red'}}>Content</Content>
                    <Footer style={{textAlign:'center',color:'cccccc'}}>推荐使用谷歌浏览器</Footer>
                </Layout>
            </Layout>
        )
    }
}