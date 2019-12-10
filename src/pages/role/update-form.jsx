import React, {Component} from 'react'
import {Form, Input, Tree, message} from 'antd'
import PropsTypes from 'prop-types'
import menuList from '../../config/menuConfig'
const Item = Form.Item
const { TreeNode } = Tree



export default class UpdateForm extends Component {
    static propsTypes = {
        role: PropsTypes.object.isRequired
    }
    constructor (props) {
        super(props)
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }
    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
                pre.push(
                    <TreeNode title={item.title} key={item.key}>
                        {
                            item.children ? this.getTreeNodes(item.children) : null
                        }
                    </TreeNode>
                )
                return pre
        },[])

    }
    onCheck = (checkedKeys) => {
        this.setState({
            checkedKeys
        })
    }
    /*
    为父组件提供最新menus数据的方法
    */
    getMenus = () => this.state.checkedKeys
    componentWillMount () {
        this.treeNodes = this.getTreeNodes(menuList)
    }
    //根据新传入的role来更新checkKeys状态
    /*
    当组件接收新的属性时自动调用
    */
    componentWillReceiveProps(nextProps) {
        const menus = nextProps.role.menus
        this.setState({//此处的setState不会重新渲染组件，可以使用this.state.checkedKeys= menus
            checkedKeys: menus
        })
        //this.state.checkedKeys= menus
    }
    render () {
        const {role} = this.props
        const {checkedKeys} = this.state
        return (
            <div>
                <Item label='角色名称:' labelCol={{span:4}} wrapperCol={{span:15}}>
                    <Input  type="text" disabled value={role.name} />
                </Item>
                <Tree
                    checkable //显示选择框
                    defaultExpandAll={true}//默认全部展开
                    checkedKeys={checkedKeys}//选中的节点
                    onCheck={this.onCheck}//点击复选框触发
                >
                    <TreeNode title='平台权限' key='all'>
                        {
                            this.treeNodes
                        }
                    </TreeNode>
                    
                </Tree>
            </div>
        )
    }
}
