import React, {PureComponent} from 'react'
import {Card, Button, Table, Modal, message} from 'antd'
import { formatDate } from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import {reqUsers, reqDeleteUser, reqAddUser, reqAddOrUpdateUser} from '../../api'
import UserForm from './user-form'
import {PAGE_SIZE} from '../../utils/constants'

/*
用户路由
 */
export default class User extends PureComponent {
    state = {
        users: [], //所有用户的列表
        roles: [], //所有角色的列表
        loading: false,
        isShow: false, //是够显示添加或修改用户
    }
    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formatDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                //render: (role_id) => (this.state.roles.find((role)=>role._id===role_id).name) // 此方法每个用户都要find一次，效率不高，可以用一下方法优化
                render: role_id => this.roleNames[role_id] // 获取角色列表，然后构成一个键为role_id值为role_name的对象
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.clickUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.clickDelete(user)}>删除</LinkButton>
                    </span>
                )
            },
            
        ]
    } 
    /* 
    根据角色的数组生成一个包含所有角色名的对象容器
     */
    initRoleNames = (roles) => {
        this.roleNames = roles.reduce((pre, role)=>{
                                pre[role._id] = role.name
                                return pre
                            },{})
    }
    getUsers = async () => {
        this.setState({loading: true})
        const result = await reqUsers()
        this.setState({loading: false})
        if (result.status===0){
            const {users, roles} = result.data
            //初始化生成一个包含所有角色名的对象容器{_id1: name1, _id2: nam2}
            this.initRoleNames(roles) 
            this.setState({
                users,
                roles
            })
        }
    }
    /*
    响应添加用户
    */
    clickAddUser = () => {
        this.user = null
        this.setState({isShow: true})
    }
    /*
    响应点击修改用户
    */
    clickUpdate = (user) => {
        //保存用户信息
        this.user = user
        this.setState({isShow: true})   
    }
    /*
    响应点击删除用户
    */
    clickDelete = (user) => {
        Modal.confirm({
            content: `确定删除${user.username}吗？`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if(result.status===0){
                    this.getUsers()
                }
            }
        })
        this.setState({isShow: true})
    }
    /*
    添加或修改用户
    */
    addOrUpdateUser = async() => {
        //先进行表单验证
        this.form.validateFields(async (error, values) => {
            if(!error){
                this.setState({isShow: false})
                //获取数据
                const user = values
                this.form.resetFields()
                // 如果是更新， 需要给user指定_id属性
                if(this.user){
                    user._id = this.user._id
                }
                //发送请求
                const result = await reqAddOrUpdateUser(user)
                //根据结果给出响应的提示
                if (result.status===0){
                    message.success(`${this.user ? '修改' : '添加'}用户成功`)
                    //重新获取用户
                    this.getUsers()
                }
            }   
        })

    }
    componentWillMount () {
       this.initColumns()
    }
    componentDidMount () {
        this.getUsers()

    }
    render() {
        const {users, loading, isShow, roles} = this.state
        const title = <Button type='primary' onClick={this.clickAddUser}>创建用户</Button>
        const user = this.user || {}
        return(
            <Card title={title}>
                <Table
                    bordered
                    loading={loading}
                    columns={this.columns}
                    dataSource={users}
                    pagination={{defaultPageSize: PAGE_SIZE}}
                />
                <Modal
                    title={user._id ? "修改用户" : "添加用户"}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.form.resetFields()
                        this.setState({isShow: false})
                    }}
                >
                    <UserForm
                        user={user}
                        roles={roles}
                        setForm={form => {this.form = form}}
                    />
                </Modal>
            </Card>
        )
    }
}