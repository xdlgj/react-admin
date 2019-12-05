import React, { Component} from 'react'
import {Card, Button, Table, Modal} from 'antd'
import {formatDate} from '../../utils/dateUtils'
import {reqRoleList} from '../../api'
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
                render: (auth_time) => formatDate(auth_time) 
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
    handleOk = e => {
        console.log(e);
        this.setState({
          visible: false,
        });
      };
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
                    rowSelection={{type: 'radio', selectedRowKeys: [role._id]}}
                    onRow={this.onRow}
                />
                <Modal
                    title="创建角色"
                    visible={isShowAdd}
                    onOk={this.handleOk}
                    onCancel={()=> {
                        this.setState({isShowAdd: false})
                        }
                    }
                >
                    
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowUpdate}
                    onOk={this.handleOk}
                    onCancel={()=> {
                        this.setState({isShowUpdate: false})
                        }
                    }
                />
            </Card>
        )
    }
}