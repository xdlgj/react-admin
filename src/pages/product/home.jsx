import React, {Component} from 'react'
import {Card, Button, Icon, Select, Input, Table, message} from 'antd'
import LinkButton from '../../components/link-button'
import {PAGE_SIZE} from '../../utils/constants'
import {reqProductList, reqSearchProduts, reqUpdateStatus} from '../../api'
/*
Product的主页路由组件
*/
const { Option } = Select
export default class ProductHome extends Component {
	state = {
		loading: false,
		total : 0 , // 总共的商品数
		products : [],
		searchType : 'productName',
		searchName: '',
	}
	/*
	初始化表格的表头
	*/
	initColums = () => {
		this.columns = [
		  {
		    title: '商品名称',
		    dataIndex: 'name',
		  },
		  {
		    title: '商品描述',
		    dataIndex: 'desc',
		  },
		  {
		    title: '价格',
		    dataIndex: 'price',
		    render: (price) => '￥' + price //当前指定了对应的属性，传入的是对应的属性值
		  },
		  {
		  	width:100,
		    title: '状态',
		    dataIndex: '',
		    render: (product) => {
				const {_id, status} = product
				const newStatus = status === 1 ? 2 :1 
		    	return(
		    		<span>
						<Button type='primary' onClick={()=>this.updateStatus(_id, newStatus)}>
							{status===1 ? "在售": "下架"}
						</Button>
						<span>{status===1 ? "下架":"在售"}</span>
		    		</span>
		    	)
		    }
		    
		  },
		  {
		  	width:100,
		    title: '操作',
		    render: (product) => (
		    	<span>
		    		{/*将product对象使用state传递给目标路由组件*/}
	    			<LinkButton onClick={()=>this.props.history.push("/product/detail", {product})}>详情</LinkButton>
	    			<LinkButton onClick={()=>this.props.history.push("/product/add-update", product)}>修改</LinkButton>
		    	</span>
		    )
		  },
		];
	}
	getProducts = async (pageNum) => {
		this.pageNum = pageNum //保存当前页码，让其他函数可以看到
		this.setState({loading: true})
		const {searchType, searchName} = this.state
		let result
		if (searchName){//搜索分页
			result = await reqSearchProduts({pageNum, pageSize:PAGE_SIZE, searchType, searchName})
		}else {//一般分页
			result = await reqProductList(pageNum, PAGE_SIZE)
		}
		this.setState({loading: false})
		if (result.status===0){
			const {total,list} = result.data
			this.setState({
				total,
				products: list
			})
		}
	}
	/*
	更新商品状态
	*/
	updateStatus = async (productId, status) => {
		const result = await reqUpdateStatus(productId, status)
		if(result.status===0){
			message.success("更新商品成功")
			this.getProducts(this.pageNum)
		}
	}
	componentWillMount(){
		this.initColums()
	}
	/*
	发送请求获取数据
	*/
	componentDidMount () {
		this.getProducts(1)
	}
	render(){
		const {total, products, loading, searchType, searchName} = this.state
		const title = (
			<span>
				<Select defaultValue={searchType} style={{width:150}} onSelect={(value)=>this.setState({searchType:value})}>
					<Option value='productName'>按名字搜索</Option>
					<Option value='productDesc'>按描述搜索</Option>
				</Select>
				<Input placeholder='关键字' style={{width:150,margin:'0 15px'}} onChange={(event)=>this.setState({searchName:event.target.value})} />
				<Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
			</span>
		)
		const extra = (
			<Button type='primary' onClick={()=>this.props.history.push("/product/add-update")}>
				<Icon type='plus' />
				添加
			</Button>
		)
		return(
			<Card title={title} extra={extra}>
				<Table
					loading={loading}
					bordered
					columns={this.columns}
					dataSource={products} 
					pagination={{
						total,
						defaultPageSize:PAGE_SIZE, 
						showQuickJumper: true,
						onChange: this.getProducts,
					}}

				/>
			</Card>
		)
	}
}