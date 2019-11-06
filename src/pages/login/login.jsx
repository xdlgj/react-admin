import React, {Component} from 'react'
import {Form, Icon, Input, Button} from 'antd'
import './login.less'
import logo from './images/logo.png'
/*
登录的路由组件
*/
class Login extends Component {

    handleSubmit = (event) => {
        //阻止事件的默认行为
        event.preventDefault()
        //得到form对象
        const {form} = this.props
        //对所有表单进行字段校验
        form.validateFields((err, values) => {
            if(!err){
                console.log("提交登录的ajax请求", values)
            }else{
                console.log("校验失败")
            }
        });
        //获取表单项的输入数据
        // const values = form.getFieldsValue()
        // console.log("handleSubmit", values)
    }
    /*
    对密码进行自定义验证
    */
    validatorPwd = (rule, value, callback) => {
        if(!value){
            callback("密码必须输入")
        }else if (value.length<4){
            callback("密码长度不能小于4位")
        }else if (value.length>12){
            callback("密码长度不能大于12位")
        }else if (!/^[a-zA-Z0-9_]+$/.test(value)){
            callback("密码必须是英文、数字或下划线组成")
        }else{
            callback()
        }
    }
    render(){
        //得到具有强大功能form对象
        const {form} = this.props
        const {getFieldDecorator} = form
        return(
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt='logo'></img>
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h2>用户登陆</h2>
                    <Form className='login-form' onSubmit={this.handleSubmit}>
                        <Form.Item>
                            {getFieldDecorator('username', {//配置对象：属性名是特定的一些名称
                                //声明试验证：直接使用别人定义好的验证规则进行验证
                                rules: [
                                    {required: true, whitespace: true, message: "用户名必须输入"},
                                    {min: 4, message: '用户名至少4位'},
                                    {max: 12, message: '用户名最多12位'},
                                    {pattern: /^[a-zA-Z0-9_]+$/, message:'用户名必须是英文、数字或下划线组成'}
                                ]
                            })(
                                <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="用户名"
                                />
                            )} 
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        validator: this.validatorPwd
                                    }
                                ]
                            })(
                                <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                                />
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType='submit' className='login-form-button'>
                                登陆
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}
/*
1.高级函数
    1).一类特别的函数（满足a b 任意一个条件）
        a.接受函数类型的参数
        b.返回值是函数
    2).创建的高阶函数
        a.定时器：setTimeout()/setInterval()
        b.Promise:Promise(() =>{}) then(value => {}, reason => {})
        c.数组遍历相关的方法：forEach()/filter()/map()/reduce()/find()/findIndex()
        d.函数对象的bind()
        e.Form.creat() / getFieldDecorator()()
    3).高阶函数更新状态，更具有扩展性
2.高阶组件
    1).本质就是一个函数
    2).接收一个组件（被包装组件），返回一个新的组件（包装组件），包装组件会向被包装组件传入特定属性
    3).作用：扩展组件的功能
    4).高阶组件也是高阶函数：接收一个组件函数，返回一个新的组件函数（类组件的本质也是函数）
*/
/*
包装Form组件生成一个新的组件：Form(Login)
新组件会向Form组件传递一个强大的对象属性：form
*/
const WrapLogin = Form.create()(Login)
export default WrapLogin