/*
进行local数据存储管理的工具模块
*/
import store from 'store'
const USER_KEY = 'userName'
export default {
    /*
    保存user
    */
   saveUserName(username){
       //localStorage.setItem(USER_KEY, JSON.stringify(user))
       store.set(USER_KEY, username)
   },
   /*
   读取user
   */
  getUserName(){
     //return JSON.parse(localStorage.getItem(USER_KEY) || '{}') 
     return store.get(USER_KEY)
  },
   /*
   删除user
   */
  removeUserNme(){
      //localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
  }

}