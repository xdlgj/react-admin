import React, {Component} from 'react'
import {Button} from 'antd'
import {withRouter} from 'react-router-dom'
import './not-found.less'



class NotFound extends Component {
    goHome = () => {
        this.props.history.replace('/home')
    } 
    render(){
        return(
            <div className='not-found'> 
                <div className='left'></div> 
                <div className='right'> 
                    <h1>404</h1> 
                    <h2>抱歉，你访问的页面不存在</h2> 
                    <div> 
                        <Button type='primary' onClick={this.goHome}> 
                            回到首页 
                        </Button> 
                    </div> 
                </div> 
            </div>

        )
    }
}

export default withRouter(NotFound)