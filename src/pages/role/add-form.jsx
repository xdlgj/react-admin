import React, {Component} from 'react'
import {Form, Input} from 'antd'
import PropsTypes from 'prop-types'
const Item = Form.Item



class AddForm extends Component {
    static propsTypes = {
        setForm: PropsTypes.func.isRequired,
    }
    componentWillMount () {
        this.props.setForm(this.props.form)
    }
    render () {
        const formItemLayout = {
			labelCol: {span:4}, //左侧label的宽度
			wrapperCol: {span:15},//指定右侧包裹的宽度
        }
        const {getFieldDecorator} = this.props.form
        return (
            <Form {...formItemLayout}>
                <Item label='角色名称:'>
                    {
                        getFieldDecorator('roleName', {
                            rules: [
                                {required: true, message:'角色名称必须输入'}
                            ]
                        })(
                            <Input  type="text" placeholder='请输入角色名称' />
                        )
                    }
                </Item>
            </Form>
        )
    }
}
export default AddForm = Form.create()(AddForm)