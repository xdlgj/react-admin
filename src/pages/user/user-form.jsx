import React, {Component} from 'react'
import {Form, Input, Select} from 'antd'
import {PropTypes} from 'prop-types'
const Item = Form.Item
const { Option } = Select

class UserForm extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        roles: PropTypes.array.isRequired,
        setForm: PropTypes.func.isRequired
    }
    initOptions = (roles) => {
        return roles.map((role) => <Option value={role._id}>{role.name}</Option>)
    }
    componentWillMount () {
        this.props.setForm(this.props.form)
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: {span: 4}, 
            wrapperCol: {span: 16}
        }
        const {user, roles} = this.props
        const {username, password, phone, email, role_id} = user
        return (
            <Form  {...formItemLayout}>
                <Item label='用户名'>
                {getFieldDecorator('username', {
                    rules: [
                        { required: true, message: 'Please input your username!' },
                        {min: 4, message: '用户名至少4位'},
                        {max: 12, message: '用户名最多12位'},
                        {pattern: /^[a-zA-Z0-9_]+$/, message:'用户名必须是英文、数字或下划线组成'}
                    ],
                    initialValue: username
                })(
                    <Input type="text" placeholder="请输入用户名"/>
                )}
                </Item>
                {
                    user._id ? null :
                    <Item label='密码'>
                    {getFieldDecorator('password', {
                        rules: [
                            { required: true, message: 'Please input your Password!' },
                            {min: 4, message: '密码至少4位'},
                            {max: 12, message: '密码最多12位'},
                            {pattern: /^[a-zA-Z0-9_]+$/, message:'密码必须是英文、数字或下划线组成'}
                        ],
                        initialValue: password
                    })(
                        <Input type="password" placeholder="请输入密码"/>
                    )}
                    </Item>
                }
                <Item label='手机号'>
                {getFieldDecorator('phone', {
                    initialValue: phone
                })(
                    <Input type="text" placeholder="请输入手机号"/>
                )}
                </Item>
                <Item label='邮箱'>
                {getFieldDecorator('email', {
                    initialValue: email
                })(
                    <Input type="text" placeholder="请输入邮箱"/>
                )}
                </Item>
                <Item label='角色'>
                {getFieldDecorator('role_id', {
                    initialValue: role_id
                })(
                    <Select
                        placeholder='请选择角色'
                    >
                        {
                            this.initOptions(roles)
                        }
                    </Select>
                )}
                </Item>
            </Form>
        )
    }
}
export default Form.create()(UserForm)