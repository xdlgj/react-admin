import React, {Component} from 'react'
import {Card, Icon, Form, Button, Input} from 'antd'
import LinkButton from "../../components/link-button"
import {withRouter} from 'react-router-dom'
/*
Product的添加和更新子路由组件
*/
const {Item} = Form
const {TextArea} = Input
class ProductAddUpdate extends Component {
	/*
	校验产品价格
	*/
	validatePrice = (rule, value, callback) => {
		if(value*1>0){
			callback()//验证通过
		}else{
			callback("价格必须大于0")
		}

	}
	submit = () =>{
		//进行表单验证，如果通过了，才发送请求
		this.props.form.validateFields((error, values)=>{
			if(!error){
				alert("发送ajax请求")
			}
		})
	}
	render(){
		//指定Item布局的配置对象
		const formItemLayout = {
			labelCol: {span:2}, //左侧label的宽度
			wrapperCol: {span:6},//指定右侧包裹的宽度
		}
		const title = (
			<span>
				<LinkButton onClick={()=>this.props.history.goBack()}>
					<Icon type="arrow-left" />
				</LinkButton>
				<span>添加商品</span>
			</span>
		)
		const {getFieldDecorator} = this.props.form
		return(
			<Card title={title}>
				<Form {...formItemLayout}>
					<Item label="商品名称:">
						{
							getFieldDecorator('name', {
								initValue: '',
								rules:[
									{
										required: true,
										message: "必须输入商品名称",
									}
								]
							})(
								<Input placeholder='请输入商品名称' />
							)
						}
					</Item>
					<Item label="商品描述:">
						{
							getFieldDecorator('desc', {
								initValue: '',
								rules:[
									{
										required: true,
										message: "必须输入商品描述",
									}
								]
							})(
								<TextArea placeholder='请输入商品描述' autosize={{minRows:2, maxRow:6}}/>
							)
						}
						
					</Item>
					<Item label="商品价格:">
						{
							getFieldDecorator('price', {
								initValue: '',
								rules:[
									{
										required: true,
										message: "必须输入商品价格",
									},
									{
										validator: this.validatePrice
									}
								]
							})(
								<Input type='number' placeholder='请输入商品价格' addonAfter='元' />
							)
						}
						
					</Item>
					<Item label="商品分类:">
						<div>商品分类</div>
					</Item>
					<Item label="商品图片:">
						<div>商品图片</div>
					</Item>
					<Item label="商品详情:">
						<div>商品详情</div>
					</Item>
					<Item>
						<Button type='primary' onClick={this.submit}>提交</Button>
					</Item>
					
				</Form>
			</Card>
		)
	}
}
const form = Form.create()(ProductAddUpdate)
export default withRouter(form)