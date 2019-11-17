import React, { Component} from 'react'
import {Button, Icon, Table, Card} from 'antd'
import LinkButton from '../../components/link-button'
/*
商品分类
 */
export default class Category extends Component {
    render() {
    	//card的左侧
    	const title = '一级分类'
    	//card的右侧
    	const extra = (
    		<Button type='primary'>
    			<Icon type='plus' />
    			添加
    		</Button>
    	)
    	const dataSource = [
		  {
		    key: '1',
		    name: '图书',
		  },
		  {
		    key: '2',
		    name: '家电',
		  },
		];

		const columns = [
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
		    render: () => (//返回需要显示的界面标签
		    	<span>
		    		<LinkButton>修改分类</LinkButton><LinkButton>查看子分类</LinkButton>
		    	</span>
		    )
		  },
		];

        return(
            <Card title={title} extra={extra}>
      			<Table bordered dataSource={dataSource} columns={columns}></Table>
    		</Card>
        )
    }
}