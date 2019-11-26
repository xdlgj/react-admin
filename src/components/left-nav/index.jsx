import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import { Menu, Icon} from 'antd'
import menuList from '../../config/menuConfig'

import './index.less'
import logo from '../../assets/images/logo.png'
/*
左侧导航组件
*/
const { SubMenu } = Menu;
class LeftNav extends Component {
    /*
    根据menu的数据数据生成对应的标签数据
    使用map() + 递归调用
    */
    getMenuNodes_map =  (menuList) => {
        let path = this.props.location.pathname
        if (path.indexOf("/product")===0){
            path = '/product'
        }
        return menuList.map(item =>{
            if (!item.children){
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link> 
                    </Menu.Item>
                )
            }else{
                const cItem = item.children.find(cItem => cItem.key === path)
                if(cItem){
                    this.openKey = item.key
                }
                return (
                    <SubMenu
                    key={item.key}
                    title={
                    <span>
                        <Icon type={item.icon} />
                        <span>{item.title}</span>
                    </span>
                    }
                    >
                        {/*递归调用*/}
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
                
            }
        
        })

    }
    /*
    使用reduce() + 递归调用
    */
   getMenuNodes = (menuList) =>{
       let path = this.props.location.pathname
       if (path.indexOf("/product")===0){
        path = '/product'
        }
       return menuList.reduce((pre, item) =>{
           if(!item.children){
               pre.push((
                <Menu.Item key={item.key}>
                <Link to={item.key}>
                    <Icon type={item.icon} />
                    <span>{item.title}</span>
                </Link> 
                </Menu.Item>
               ))
           }else{
               //查找一个与当前请求路径匹配的子item
                const cItem = item.children.find(cItem => cItem.key === path)
                //如果存在，说明当前item的子列表需要打开
                if(cItem){
                    this.openKey = item.key
                }
               pre.push((
                <SubMenu
                key={item.key}
                title={
                <span>
                    <Icon type={item.icon} />
                    <span>{item.title}</span>
                </span>
                }
                >
                    {/*递归调用*/}
                    {this.getMenuNodes(item.children)}
                </SubMenu>
               ))
           }
           return pre
       },[])
   }
   componentWillMount(){
       /*
       在第一次render（）之前执行一次
       为第一个render（）准备数据（必须同步）
       */
       this.items =this.getMenuNodes(menuList)
   }
    render() {
        let path = this.props.location.pathname
        if (path.indexOf("/product")===0){
            path = '/product'
        }
        return (
            <div className='left-nav'>
                <Link to='/home' className='left-nav-header'>
                   <img src={logo} alt='' />
                    <h1>硅谷后台</h1> 
                </Link>
                <Menu mode="inline" theme="dark" selectedKeys={[path]} defaultOpenKeys={[this.openKey]}>
                    {this.items}
                </Menu>
          </div>
        )
    }
}
/*
withRouter高阶组件：
包装非路由组件，返回一个新的组件
新的组件向非路由组件传递3个属性：history/location/match
*/
export default withRouter(LeftNav)