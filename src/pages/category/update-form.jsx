import React, {Component} from 'react'
import {Form, Select, Input} from 'antd'

const {Item} = Form
const {Option} = Select
/*
更新分类的form组件
*/
class UpdateForm extends Component {
	render(){
		const {getFieldDecorator} = this.props.form
		return(
			<Form>
				<Item>
					{
						getFieldDecorator('categoryName')(
							<Input placeholder='请输入分类名称'/>
						)
					}
				</Item>
			</Form>
		)
	}
}
export default Form.create()(UpdateForm)

