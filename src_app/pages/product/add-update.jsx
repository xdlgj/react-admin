import React, {Component} from 'react'
import {Card, Icon, Form, Button, Input, message} from 'antd'
import LinkButton from "../../components/link-button"
import {withRouter} from 'react-router-dom'
import { Cascader } from 'antd';
import { reqCategorys, reqAddOrUpdateProduct} from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
/*
Product的添加和更新子路由组件
*/
const {Item} = Form
const {TextArea} = Input
class ProductAddUpdate extends Component {
	state = {
		options : [],
		loading : false, 
	}
	constructor(props){
		super(props)
		//创建用来保存ref标识的标签对象的容器
		this.pw = React.createRef()
		this.editor = React.createRef()
	}
	/*
	商品分类下拉选项
	*/
	loadData = async (selectedOptions) => {
		//获取被选中的对象
	    const targetOption = selectedOptions[selectedOptions.length - 1];
	    //显示loading
	    targetOption.loading = true;

	    //根据选中的分类，请求获取二级分类列表
	    const subCategorys = await this.getCategorys(targetOption.value)
	    targetOption.loading = false;
	    if (subCategorys && subCategorys.length>0){
	    	//生成一个二级列表的options
	    	const childOptions = subCategorys.map(subCategory =>({
	    		value: subCategory._id,
	    		label: subCategory.name,
	    		isLeaf: true
	    	}))
	    	//关联到当前option上
	    	targetOption.children = childOptions
	    }else{// 当前选中的分类没有二级分类
	    	targetOption.isLeaf = true
	    }
	   
        this.setState({
        	options: [...this.state.options],
        });

	};
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
	/*
	提交表单
	*/
	submit = () =>{
		//进行表单验证，如果通过了，才发送请求
		this.props.form.validateFields(async (error, values)=>{
			if(!error){
				//1、收集数据
				const {name, desc, price, categoryIds} = values
				let pCategoryId, categoryId
				if (categoryIds.length===1){
					pCategoryId = '0'
					categoryId = categoryIds[0]
				}else{
					pCategoryId = categoryIds[0]
					categoryId = categoryIds[1]
				}
				const imgs = this.pw.current.getImgs()
				const detail = this.editor.current.getDetail()
				const product = {name, desc, price, pCategoryId, categoryId, imgs, detail}
				//	如果是更新， 需要添加-id
				if(this.isUpdate){
					product._id = this.product._id
				}
				//2、调用接口请求函数去添加/更新
				const resut = await reqAddOrUpdateProduct(product)
				//3、根据结果提示
				if(resut.status ===0){
					message.success(`${this.isUpdate ? '更新': '添加'}商品成功`)
					this.props.history.goBack()
				}else{
					message.error(`${this.isUpdate ? '更新': '添加'}商品失败`)
				}
			}
		})
	}
	/*
	初始化商品分类下拉选项
	*/
	initOptions = async (categorys) => {
		//根据categorys生成options数组
		const options = categorys.map((category)=>({
			value: category._id,
		    label: category.name,
		    isLeaf: false
		}))
		//如果当前是更新， 且商品是一个二级分类
		const {isUpdate, product} = this
		const {pCategoryId} = product
		if (isUpdate && pCategoryId !=='0'){
			//异步获取二级分类列表
			const subCategorys = await this.getCategorys(pCategoryId)
			//生成二级下拉列表的options
			const childOptions = subCategorys.map(subCategory =>({
				value: subCategory._id,
	    		label: subCategory.name,
	    		isLeaf: true
			}))
			//获取一级分类
			const targetOption = options.find(option => option.value===pCategoryId)
			//关联到对应的一级分类
			if(targetOption) targetOption.children = childOptions
		}
		//更新状态
		this.setState({options})
	}
	/*
	异步获取一级或二级分类列表，并显示
	async函数的返回值是一个promise对象，promise的结果和值由async的结果来决定
	*/
	getCategorys = async (parentId) => {
		const result = await reqCategorys(parentId)
		if (result.status===0){
			const categorys = result.data
			if (parentId==='0'){//一级列表
				this.initOptions(categorys)
			}else{
				return categorys
			}
		}
	}
	componentWillMount (){
		// 获取携带的state
		const product = this.props.location.state
		// 保存是否更新的标识,转换为boolean类型
		this.isUpdate = !!product
		// 保存商品对象如果没有保存空对象
		this.product = product || {}
	}
	componentDidMount () {
		this.getCategorys('0')
	}
	render(){
		const {isUpdate, product, } = this
		const {pCategoryId, categoryId, imgs, detail} = product
		//准备级联列表显示的数组
		const categoryIds = []
		if (isUpdate) {//如果是更新商品
			if(pCategoryId==='0'){//一级分类
				categoryIds.push(categoryId)
			}else{//二级分类
				categoryIds.push(pCategoryId)
				categoryIds.push(categoryId)
			}
		}
		const uploadButton = (
			<div>
			  <Icon type={this.state.loading ? 'loading' : 'plus'} />
			  <div className="ant-upload-text">Upload</div>
			</div>
		);
		const { imageUrl } = this.state;
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
				<span>{isUpdate ? "更新商品" : "添加商品"}</span>
			</span>
		)
		const {getFieldDecorator} = this.props.form
		return(
			<Card title={title}>
				<Form {...formItemLayout}>
					<Item label="商品名称:">
						{
							getFieldDecorator('name', {
								initialValue: product.name,
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
								initialValue: product.desc,
								rules:[
									{
										required: true,
										message: "必须输入商品描述",
									}
								]
							})(
								<TextArea placeholder='请输入商品描述' autoSize={{minRows:2, maxRow:6}}/>
							)
						}	
					</Item>
					<Item label="商品价格:">
						{
							getFieldDecorator('price', {
								initialValue: product.price,
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
						{
							getFieldDecorator('categoryIds', {
								initialValue: categoryIds,
								rules:[
									{
										required: true,
										message: "必须输入商品分类",
									},
								]
							})(
								<Cascader
									placeholder='请输入商品分类'
									options={this.state.options}
									loadData={this.loadData}
								/>
							)
						}	
						 
					</Item>
					<Item label="商品图片:">
						<PicturesWall ref={this.pw} imgs={imgs}/>
					</Item>
					<Item label="商品详情:" wrapperCol={{span:20}}>
						<RichTextEditor ref={this.editor} detail={detail}/>
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

/*
1.子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
2.父组件调用子组件的方法：在父组件中通过ref得到子组件标签对象（也就是组件对象），调用其方法
	1、在构造组件时，组件容器
	2、在子组件中通过ref属性赋值
*/