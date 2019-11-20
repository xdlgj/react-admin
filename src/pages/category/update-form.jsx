import React, {Component} from 'react'
import {Form, Select, Input} from 'antd'
import PropTypes from 'prop-types'

const {Item} = Form
const {Option} = Select
/*
更新分类的form组件
*/
class UpdateForm extends Component {
	static propsTypes = {
		categoryName: PropTypes.string.isRequired,
		setForm: PropTypes.func.isRequired
	}
	componentWillMount () {
		//调用父组件传递过来的setForm函数，向父组件传递form表单对象
		this.props.setForm(this.props.form)
	}
	render(){
		const {getFieldDecorator} = this.props.form
		const {categoryName} = this.props
		return(
			<Form>
				<Item>
					{
						getFieldDecorator('categoryName', {
							initialValue: categoryName,
							rules: [
								{required: true, message:'分类名称必须输入'}
							]
						})(
							<Input placeholder='请输入分类名称'/>
						)
					}
				</Item>
			</Form>
		)
	}
}
export default Form.create()(UpdateForm)

