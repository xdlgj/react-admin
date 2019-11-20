import React, {Component} from 'react'
import {Form, Select, Input} from 'antd'
import PropTypes from 'prop-types'
const {Item} = Form
const {Option} = Select
/*
添加分类的form组件
*/
class AddForm extends Component {
	static propTypes = {
		categorys: PropTypes.array.isRequired, 
		parentId: PropTypes.string.isRequired, //下拉框默认显示哪个分类
		setForm: PropTypes.func.isRequired
	}
	componentWillMount () {
		this.props.setForm(this.props.form)
	}
	render(){
		const {getFieldDecorator} = this.props.form
		const {categorys, parentId} = this.props
		return(
			<Form>
				<Item>
					{
						getFieldDecorator('parentId',{
							initialValue : parentId
						})(
							<Select>
								<Option value='0'>一级分类</Option>
								{
									categorys.map(category=>
										<Option value={category._id}>{category.name}</Option>
									)
								}
							</Select>
						)
					}
				</Item>
				<Item>
					{
						getFieldDecorator('categoryName',{
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
export default Form.create()(AddForm)

