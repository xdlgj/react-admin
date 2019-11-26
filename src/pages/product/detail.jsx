import React, {Component} from 'react'
import {Card, Icon, List} from 'antd'
import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory} from "../../api"
/*
Product的详情子路由组件
*/
const Item = List.Item
export default class ProductDetail extends Component {
	state = {
		cName1: '', //一级分类名字
		cName2: '', //二级分类名字
	}
	/*
	异步获取商品的分类名字
	*/
	getCategoryName = async () => {
		const {categoryId, pCategoryId} = this.props.location.state.product
		if (pCategoryId === '0'){
			//获取一级分类名字
			const result = await reqCategory(categoryId)
			const cName1 = result.data ? result.data.name : ''
			this.setState({cName1})
		}else{
			//获取一级分类和二级分类名字
			/*
			这样的方式效率不高，先发送第一个请求，这个请求获取响应会才会发送第二个请求，通过promise.all()优化
			const result1 = await reqCategory(pCategoryId)
			const result2 = await reqCategory(categoryId)
			const cName1 = result1.data ? result1.data.name : ''
			const cName2 = result2.data ? result2.data.name : ''
			*/
			const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
			const cName1 = results[0].data ? results[0].data.name : ''
			const cName2 = results[1].data ? results[1].data.name : ''
			this.setState({cName1, cName2})
		}
	} 
	componentDidMount () {
		this.getCategoryName()
	}
	render(){
		//读取携带过来state数据
		const {name, desc, price, detail, imgs} = this.props.location.state.product
		const {cName1, cName2} = this.state
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
						<span>{cName1}{cName2 ? "  -->  "+ cName2 : null}</span>
					</Item>
					<Item>
						<span className='left'>商品图片:</span>
						<span>
							{
								imgs.map(img => (
									<img 
										key={img}
										src={BASE_IMG_URL+img}
										className="product-img"
									/>
								))
							}
						</span>
					</Item>
					<Item>
						<span className='left'>商品详情:</span>
						<span dangerouslySetInnerHTML={{__html: detail}}></span>
					</Item>

				</List>
			</Card>
		)
	}
}