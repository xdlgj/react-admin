import React, { Component} from 'react'
import {Button, Icon, Table, Card, message, Modal} from 'antd'
import LinkButton from '../../components/link-button'
import {reqCategorys, reqUpdateCategory} from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'
/*
商品分类路由
 */
export default class Category extends Component {
	state = {
		loading: false, //是否正在获取数据中
		categorys: [], //一级分类列表
		subCategorys: [], //二级分类列表
		parentId: '0', //当前需要显示的分类列表的父分类Id
		parentName: '', //当前需要显示的分类列表的父分类Name
		showStatus: 0, //是否显示对话框，0：都不显示， 1：显示添加， 2：显示更新
	}
	/*
	初始化Table所有列的数据
	*/
	initColumns = () => {
		this.columns = [
		  {
		    title: '分类名称',
		    dataIndex: 'name',
		    key: 'name',
		  },
		  {
		    title: '操作',
		    dataIndex: '',
		    key: 'age',
		    width: '300px',
		    render: (category) => (//返回需要显示的界面标签
		    	<span>
		    		<LinkButton onClick={()=>this.showUpdate(category)}>修改分类</LinkButton>
		    		{/*如何向事件回调函数传递参数：先定义一个箭头函数，在函数中调用处理的函数并传入参数*/}
		    		{this.state.partenId==='0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}
		    	</span>
		    )
		  },
		];
	}
	/*
	异步获取一级或二级分类列表显示
	*/
	getCategorys = async () => {
		//在发请求前，显示loading
		this.setState({loading: true})
		const {parentId} = this.state
		//发异步ajax请求获取请求数据
		const result = await reqCategorys('0')
		// 在发请求后，隐藏loading
		this.setState({loading: false})
		if (result.status===0){
			//取出分类数组（可能是一级的也可能是二级的）
			const categorys = result.data
			if (parentId === '0'){
				//更新状态一级分类状态
				this.setState({
					categorys
				})
			}else{
				//更新二级分类状态
				this.setState({
					subCategorys: categorys
				})
			}
		}else{
			message.error("获取分类列表失败")
		}
	}
	/*
	显示指定一级分类对象的二级子列表
	*/
	showSubCategorys = (category) => {
		//先更新状态
		this.setState({
			parentId: category._id,
			parentName: category._name,
		}, () => {//在状态更新且重新render()后执行
			//获取二级分类列表
			this.getCategorys()
		})
		//在setState（）不能立即获取最新的状态，因为是异步更新状态的
		//console.log('parentId:', this.state.parentId) // 0
	}
	/*
	显示一级分类列表
	*/
	showCategorys = () => {
		//更新为显示一级分类列表的状态
		this.setState({
			parentId:'0',
			parentName:'',
			subCategory: [],
		})
	}
	/*
	显示添加对话框
	*/
	showAdd = () => {
		this.setState({showStatus: 1})
	}
	/*
	显示修改分类对话框
	*/
	showUpdate = (category) => {
		//保存category对象
		this.category = category
		//更新状态
		this.setState({showStatus: 2})
	}
	/*
	点击取消按钮隐藏对话框
	*/
	onClickCancle = () =>{
		//清除输入框的数据
		this.form.resetFields()
		this.setState({showStatus:0})
	}
	/*
	提交修改分类请求
	*/
	updateCategory = async () => {
		//1.关闭对话框
		this.setState({showStatus: 0})
		//准备请求参数
		const categoryId = this.category._id
		const oldCategoryName = this.category.name
		const categoryName = this.form.getFieldValue('categoryName')
		//清除输入框的数据
		this.form.resetFields()
		//2.发送ajax请求更新数据, 如果categoryName没有改变就不用发送请求
		if (oldCategoryName != categoryName){
			const result = await reqUpdateCategory({categoryId, categoryName})
			if (result.status===0){
				//3.再次显示列表
				message.success("修改成功")
				this.getCategorys()
			}
		}
	}
	/*
	为第一次render（）准备数据
	*/
	componentWillMount() {
		this.initColumns()
	}
	// 发异步ajax请求
	componentDidMount() {
		//获取一级分类
		this.getCategorys()
	}
    render() {
    	//读取状态数据
		const {categorys, loading, subCategorys, parentId, parentName, showStatus} = this.state
		//获取分类对象，如果不存在设置为空

		const category = this.category || {}

		
    	//card的左侧
    	const title = parentId==='0' ? '一级分类' : (
    		<span>
    			<LinkButton onClick={this.showCategorys}>一级分类</LinkButton>
    			<Icon type='arrow-right' style={{marginRight: 5}} />
    			<span>{parentName}</span>
    		</span>
    	)
    	//card的右侧
    	const extra = (
    		<Button type='primary' onClick={this.showAdd}>
    			<Icon type='plus' />
    			添加
    		</Button>
    	)

        return(
            <Card title={title} extra={extra}>
      			<Table 
      			bordered
      			rowKey='_id'
      			loading={loading}
      			dataSource={parentId==='0' ? categorys: subCategorys} 
      			columns={this.columns} 
      			pagination={{defaultPageSize: 5, showQuickJumper: true}}
      			/>
				<Modal
					title="添加分类"
					visible={showStatus===1}
					onOk={this.handleOk}
					onCancel={this.onClickCancle}
				>
					<AddForm />
				</Modal>
				
				<Modal
					title="修改分类"
					visible={showStatus===2}
					onOk={this.updateCategory}
					onCancel={this.onClickCancle}
				>
					<UpdateForm
					 categoryName={category.name}
					 //父组件category向子组件UpdateForm传递一个名为setForm的函数属性，为了让子组件的form传递给父组件
					 setForm={(form)=>{this.form=form}}
					 />
				</Modal>
    		</Card>
        )
    }
}