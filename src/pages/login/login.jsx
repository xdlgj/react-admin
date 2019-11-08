import React, {Component} from 'react'
import {Form, Icon, Input, Button, message} from 'antd'
import {reqLogin} from '../../api'
import './login.less'
import logo from './images/logo.png'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {Redirect} from 'react-router-dom'
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
        form.validateFields( async (err, values) => {
            if(!err){
                //console.log("提交登录的ajax请求", values)
                const {username, password} = values
                const result = await reqLogin(username, password)
                if (result.status === 200){
                    message.success('登录成功')
                    //将username保存到内存中
                    memoryUtils.userName = username
                    //将username保存到store中
                    storageUtils.saveUserName(username)
                    //跳转到管理界面(不需要再回退到登录界面所以用replace方法)
                    this.props.history.replace('/')
                }else{
                    message.error(result.message)
                }   
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
        //如果用户已经登录，自动跳转到管理界面
        const username = memoryUtils.userName
        if(username){
            return <Redirect to='/'/>
        }
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

/*
async和await
1、作用
    简化promise对象的使用：不用再使用then()来指定成功、失败的回调函数
    以同步编码（没有回调函数了）方式实现异步流程
2、哪里写async
    await所在函数（最近的）定义的左侧写async
3、哪里写await
    在返回promise的表达式左侧写await：不想要promise,想要promise异步执行的成功的value数据
*/