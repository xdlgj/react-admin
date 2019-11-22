import React, {Component} from 'react'
import {Card, Button, Icon, Select, Input, Table} from 'antd'
import LinkButton from '../../components/link-button'
import {PAGE_SIZE} from '../../utils/constants'
import {reqProductList} from '../../api'
/*
Product的主页路由组件
*/
const { Option } = Select
export default class ProductHome extends Component {
	state = {
		loading: false,
		total : 0 , // 总共的商品数
		products : [],
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
		    dataIndex: 'status',
		    render: (status) => {
		    	return(
		    		<span>
		    			<Button type='primary'>下架</Button>
		    			<span>在售</span>
		    		</span>
		    	)
		    }
		    
		  },
		  {
		  	width:100,
		    title: '操作',
		    render: (product) => (
		    	<span>
	    			<LinkButton>详情</LinkButton>
	    			<LinkButton>修改</LinkButton>
		    	</span>
		    )
		  },
		];
	}
	getProducts = async (pageName) => {
		this.setState({loading: true})
		const result = await reqProductList(pageName, PAGE_SIZE)
		this.setState({loading: false})
		if (result.status===0){
			const {total,list} = result.data
			this.setState({
				total,
				products: list
			})
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
		const {total, products,loading} = this.state
		const title = (
			<span>
				<Select defaultValue="1" style={{width:150}}>
					<Option value='1'>按名字搜索</Option>
					<Option value='2'>按描述搜索</Option>
				</Select>
				<Input placeholder='关键字' style={{width:150,margin:'0 15px'}} />
				<Button type='primary'>搜索</Button>
			</span>
		)
		const extra = (
			<Button type='primary'>
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