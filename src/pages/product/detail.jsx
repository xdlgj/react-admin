import React, {Component} from 'react'
import {Card, Icon, List} from 'antd'
import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constants'
/*
Product的详情子路由组件
*/
const Item = List.Item
export default class ProductDetail extends Component {
	render(){
		//读取携带过来state数据
		const {name, desc, price, detail, imgs} = this.props.location.state.product
		const title = (
			<span>
				<LinkButton onClick={()=>this.props.history.goBack()}>
					<Icon type='arrow-left' />
				</LinkButton>
				<span>商品详情</span>
			</span>
		)
		return(
			<Card title={title} className="product-detail">
				<List>
					<Item>
						<span className='left'>商品名称:</span>
						<span>{name}</span>
					</Item>
					<Item>
						<span className='left'>商品描述:</span>
						<span>{desc}</span>
					</Item>
					<Item>
						<span className='left'>商品价格:</span>
						<span>{price}元</span>
					</Item>
					<Item>
						<span className='left'>所属分类:</span>
						<span>联想</span>
					</Item>
					<Item>
						<span className='left'>商品图片:</span>
						<span>
							{
								imgs.map(img => (
									<img 
										key={img}
										src={img}
										className="product-name"
									/>
								))
							}
						</span>
					</Item>
					<Item>
						<span className='left'>商品详情:</span>
						<span dangerouslySetInnerHTML={{__html:'<h1 style="color:red">xxx</h1>'}}></span>
					</Item>

				</List>
			</Card>
		)
	}
}