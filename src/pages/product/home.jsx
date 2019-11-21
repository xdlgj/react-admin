import React, {Component} from 'react'
import {Card, Button, Icon, Select, Input, Table} from 'antd'
import LinkButton from '../../components/link-button'
/*
Product的主页路由组件
*/
const { Option } = Select
export default class ProductHome extends Component {
	state = {
		products : [
			{
				"status":1,
				"images":[
					"xx.jpg",
					"ss.jpg"
				],
				"_id":"123",
				"name":"三星",
				"desc":"xxxxxx",
				"price":3000,
				"pCategoryId": "1234",
				"categoryId": "12312",
				"detail": 'xxxxxxx',
				"__v":0
			}
		],
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
	componentWillMount(){
		this.initColums()
	}
	render(){
		const {products} = this.state
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
					bordered
					columns={this.columns}
					dataSource={products} 
				/>
			</Card>
		)
	}
}