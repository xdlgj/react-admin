import React, { Component} from 'react'
import {Card, Button, Table, Modal, message} from 'antd'
import {formatDate} from '../../utils/dateUtils'
import {reqRoleList, reqAddRole, reqUpdateRole} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'
import AddForm from './add-form'
import UpdateForm from './update-form'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
/*
角色路由
 */
export default class Role extends Component {
    state = {
        roles: [],
        role: {},
        isShowAdd: false,
        isShowUpdate: false,
    }
    constructor(props){
        super(props)
        this.auth = React.createRef()
    }
    initColumn = () => { 
        this.columns = [ 
            { 
                title: '角色名称', 
                dataIndex: 'name' 
            }, 
            { 
                title: '创建时间', 
                dataIndex: 'create_time', 
                render: (create_time) => formatDate(create_time) 
            }, 
            { 
                title: '授权时间', 
                dataIndex: 'auth_time', 
                render: formatDate 
            }, 
            { 
                title: '授权人', 
                dataIndex: 'auth_name' 
            }, 
        ] 
    }
    /*
    获取角色列表
    */
    getRoles = async () => {
        const result = await reqRoleList()
        if (result.status===0){
            const roles = result.data
            this.setState(
                {
                    roles
                }
            )
        }
    } 
    /*
    点击一行触发事件
    */
    onRow = (role) => {
        return {
            onClick: event => { // 点击行
                this.setState({
                    role
                })
            }
        }   
    } 
    /*
    添加角色
    */
    addRole = () => {
       //进行表单验证只有通过才向下处理
       this.form.validateFields(async (error, values) => {
           if(!error){
                //关闭添加角色窗口
                this.setState({
                    isShowAdd: false
                })
                //1、收集数据
                const {roleName} = values
                //清除输入框的数据
                this.form.resetFields()
                //2、发送请求添加角色
                const result = await reqAddRole(roleName)
                //3、根据结果提示
                if(result.status===0){
                    message.success('添加角色成功')
                    //重新获取角色列表
                    //this.getRoles()
                    const role = result.data //获取新添加的角色
                    /*const roles = this.state.roles //react不建议会直接操作state [...this.state.roles]
                    roles.push(role)
                    this.setState({
                        roles
                    })*/
                    //更新roles状态：基于原本状态数据更新
                    this.setState(state => ({
                        roles: [...state.roles, role]
                    }))

                }else{
                    message.error('添加角色失败')
                }
           }   
       })
    }
    /*
    更新角色
    */
    updateRole = async () => {
        this.setState({
            isShowUpdate: false
        })
        const role = this.state.role
        //得到最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username

        //请求更新
        const result = await reqUpdateRole(role)
        if (result.status===0){
            if (memoryUtils.user.role_id === role._id){
                memoryUtils.user = {}
                storageUtils.removeUser()
                message.info("当前用户的权限更新了，请重新登录")
                this.props.history.replace('/login')
            }else{
                message.success("更新角色权限成功")
                this.setState({
                    roles: [...this.state.roles]
                })
            }
            
        }

    }
    componentWillMount () {
        this.initColumn()
    }
    componentDidMount () {
        this.getRoles()
    }
    render() {
        const {roles, role, isShowAdd, isShowUpdate} = this.state
        const title=(
            <span>
                <Button type='primary' onClick={()=>this.setState({isShowAdd: true})}>创建角色</Button>&nbsp;&nbsp;
                <Button type='primary' disabled={!role._id} onClick={()=>this.setState({isShowUpdate: true})}>设置角色权限</Button>
            </span>
        )        
        return(
            <Card title={title}>
                <Table 
                    bordered 
                    rowKey='_id'
                    dataSource={roles} 
                    columns={this.columns} 
                    rowSelection={{
                        type: 'radio', 
                        selectedRowKeys: [role._id],
                        onSelect: (role) => { //点击单选框触发的事件
                            this.setState({role})   
                        }
                    }}
                    onRow={this.onRow}
                    pagination={{defaultPageSize: PAGE_SIZE}}
                />
                <Modal
                    title="创建角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={()=> {
                        this.setState({isShowAdd: false})
                        this.form.resetFields()
                        }
                    }
                >
                    <AddForm setForm={(form)=>{this.form = form}}/>
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowUpdate}
                    onOk={this.updateRole}
                    onCancel={()=> {
                        this.setState({isShowUpdate: false})
                        }
                    }
                >
                    <UpdateForm ref={this.auth} role={role}/>
                </Modal>
            </Card>
        )
    }
}